import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { UserModel } from "../models/Users.js";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const router = express.Router();

/*-------------------------Register User----------------------------------*/
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ isSuccess: false, message: "User already exist!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();

  res.json({ isSuccess: true, message: "User registered successfully" });
});

/*-------------------------Login User----------------------------------*/
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (!user)
    return res.json({ isSuccess: false, message: "User doesn't exist!" });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ isSuccess: false, message: "Password is incorrect!" });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY);
  res.json({
    isSuccess: true,
    token,
    userID: user._id,
    username: user.username,
    watchList: user.watchList,
    message: "Login Successfull!",
  });
});

export { router as userRouter };
