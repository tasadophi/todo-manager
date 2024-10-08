import { NextFunction, Request, Response } from "express";

const errorController = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(400).json({ message: err.message });
};

export default errorController;
