import { Request, Response } from "express";
import TodoModel from "@/models/todoModel";
import catchAsync from "@/utils/catchAsync";
import apiFeatures from "@/utils/apiFeatures";

export const getTodos = catchAsync(async (req: Request, res: Response) => {
  const { search } = req.query;
  const { items, ...paginationData } = await apiFeatures(TodoModel, req.query)
    .searchOnStrFields({
      name: search,
      description: search,
    })
    .sort()
    .paginate();

  res.status(200).json({
    data: { todos: items, ...paginationData },
    message: "todos retrieved successfully !",
  });
});

export const getTodo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await TodoModel.findById({ _id: id });
  if (!todo) res.status(404).json({ message: `todo ${id} not found !` });
  res
    .status(200)
    .json({ data: todo, message: "todo retrieved successfully !" });
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
    { runValidators: true, new: true }
  );
  if (!todo) res.status(404).json({ message: `todo ${id} not found !` });
  res.status(200).json({ data: todo, message: "todo updated successfully !" });
});

export const deleteTodo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await TodoModel.findByIdAndDelete({ _id: id });
  if (!todo) res.status(404).json({ message: `todo ${id} not found !` });
  res.status(204).json({ message: "todo deleted successfully !" });
});
