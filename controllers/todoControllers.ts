import TodoModel from "@/models/todoModel";
import { Request, Response } from "express";

export const createTodo = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) res.status(422).json({ message: "title is required!" });
  if (!description)
    res.status(422).json({ message: "description is required!" });
  const todo = await TodoModel.create({ title, description });
  res.status(201).json({ data: todo, message: "todo created successfully !" });
};
