import "dotenv/config";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import { cookie } from "express-validator";

/**
 *
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body {username, email, password}
 */
export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User with this email and username already exist",
      success: false,
      err: "user already exists",
    });
  }

  const user = await userModel.create({ username, email, password });
  const emailVerifivationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerifivationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `,
  });

  res.status(201).json({
    message: "registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 *
 * @desc Login a user
 * @route POST /api/auth/login
 * @access Public
 * @body {username, email, password}
 */
export async function login(req, res) {
  const { email, username, password } = req.body;

  const user = await userModel
    .findOne({
      $or: [{ username }, { email }],
    })
    .select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invaild Credentials",
      success: false,
      err: "User not found",
    });
  }

  const isPasswordMatched = await user.matchPassword(password);

  if (!isPasswordMatched) {
    return res.status(400).json({
      message: "Invaild Credentials",
      success: false,
      err: "Incorrect Password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "User's email not Verified",
      success: false,
      err: "Email not verified",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 *
 * @desc Verify user's email address
 * @route POST /api/auth/verify-email
 * @access Public
 * @query {token}
 */
export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        err: "user not found",
      });
    }

    user.verified = true;

    await user.save();

    const html = `
    <h1>Email Verified Successfully</h1>
    <p>Your email has been verified. you can now log in to your account</p>
    `;
    res.send(html);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: err.message,
    });
  }
}

/**
 *
 * @desc get logged in user's details
 * @route POST /api/auth/getme
 * @access Public
 */
export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  res.status(200).json({
    message: "User details fetched succesfully",
    success: true,
    user,
  });
}
