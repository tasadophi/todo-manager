import { Request, Response } from "express";

export const helloWorld = (req: Request, res: Response) => {
  res.json({ message: "Hello World !" });
};
