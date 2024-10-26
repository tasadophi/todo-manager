import { Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel, { IUser } from "@/models/userModel";
import catchAsync from "@/utils/catchAsync";

type TReceivedUser = IUser & {
  _id: Types.ObjectId;
};

const calculateCookieAge = (day: number) => 24 * 60 * 60 * 1000 * day;

const generateTokens = (user: TReceivedUser) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

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
  // generate tokens
  const { accessToken, refreshToken } = generateTokens(newUser);

  // Assigning refresh token in http-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: calculateCookieAge(7),
  });

  return res.json({ accessToken, message: "user signed up successfully !" });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "email is required !" });
  if (!password)
    return res.status(400).json({ message: "password is required !" });

  // Check if the email exists
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ message: "email or password is incorrect !" });
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    return res
      .status(401)
      .json({ message: "email or password is incorrect !" });
  }

  // generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Assigning refresh token in http-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: calculateCookieAge(7),
  });

  return res.json({ accessToken, message: "user logged in successfully !" });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  if (!req.cookies.refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Destructuring refreshToken from cookie
  const refreshToken = req.cookies.refreshToken;

  // Verifying refresh token
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string,
    async (err, decoded) => {
      if (err) {
        // Wrong Refresh Token
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        // Check if the email exists
        const user = await UserModel.findOne({ _id: decoded.id });
        if (!user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        // generate tokens
        const { accessToken } = generateTokens(user);
        return res.json({ accessToken });
      }
    }
  );
});
