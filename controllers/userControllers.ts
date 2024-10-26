import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "@/models/userModel";
import catchAsync from "@/utils/catchAsync";

const calculateCookieAge = (day: number) => 24 * 60 * 60 * 1000 * day;

export const signup = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "email is required !" });
  if (!password)
    return res.status(400).json({ message: "password is required !" });

  // Check if the email already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "email already exists !" });
  }

  // Create a new user
  const newUser = new UserModel({
    email,
    password,
  });
  await newUser.save();
  const accessToken = jwt.sign(
    {
      email,
    },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = jwt.sign(
    {
      email,
    },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );

  // Assigning refresh token in http-only cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: calculateCookieAge(7),
  });

  return res.json({ accessToken, message: "user signed up successfully !" });
});
