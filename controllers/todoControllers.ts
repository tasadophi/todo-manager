import { Request, Response } from "express";
import TodoModel from "@/models/todoModel";
import catchAsync from "@/utils/catchAsync";

export const getTodos = catchAsync(async (req: Request, res: Response) => {
  const todos = await TodoModel.find({});
  res
    .status(200)
    .json({ data: todos, message: "todos retrieved successfully !" });
});

export const createTodo = catchAsync(async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) res.status(422).json({ message: "title is required!" });
  if (!description)
    res.status(422).json({ message: "description is required!" });
  const todo = await TodoModel.create({ title, description });
  res.status(201).json({ data: todo, message: "todo created successfully !" });
});

export const updateTodo = catchAsync(async (req: Request, res: Response) => {
  const { title, description, isDone } = req.body;
  const { id } = req.params;
  const todo = await TodoModel.findByIdAndUpdate(
    { _id: id },
    { title, description, isDone },
    { runValidators: true }
  );
  if (!todo) res.status(404).json({ message: `todo ${id} not found !` });
  res.status(200).json({ data: todo, message: "todo updated successfully !" });
});
