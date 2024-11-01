import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import UserModel, { IUser } from "@/models/userModel";

const checkUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET as string,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        if (typeof decoded !== "string") {
          // Check if the user exists
          const user = await UserModel.findOne({ _id: decoded?.id });
          if (!user)
            return res.status(404).json({ message: "User not found !" });
          req.user = user;
          next();
        } else return res.status(401).json({ message: "Unauthorized" });
      }
    }
  );
};

export default checkUserController;
