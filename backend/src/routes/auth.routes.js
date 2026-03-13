import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  getMe,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/verify-email
 * @desc verify user's email adress
 * @access Public
 * @query { token}
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @route GET /api/auth/getme
 * @desc Get cuuren logged in user's details
 * @access Public
 */
authRouter.get("/getme", authUser, getMe);

export default authRouter;
