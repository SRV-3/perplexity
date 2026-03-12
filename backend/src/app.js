import cookieParser from "cookie-parser";
import express from "express";
import authRouter from "./routes/auth.routes.js";

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/auth", authRouter);

export default app;
