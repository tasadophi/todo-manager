import { Request, Response } from "express";
import TodoModel from "@/models/todoModel";
import catchAsync from "@/utils/catchAsync";
import apiFeatures from "@/utils/apiFeatures";

export const getTodos = catchAsync(async (req: Request, res: Response) => {
  const { items, ...paginationData } = await apiFeatures(
    TodoModel.find({ user: req.user?._id }),
    req.query
  )
    .searchByFields()
    .filterByDate()
    .sort()
    .paginate();

  return res.status(200).json({
    data: { todos: items, ...paginationData },
    message: "todos retrieved successfully !",
  });
});

export const getTodo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await TodoModel.findOne({ _id: id, user: req.user?._id });
  if (!todo) return res.status(404).json({ message: `todo ${id} not found !` });
  return res
    .status(200)
    .json({ data: todo, message: "todo retrieved successfully !" });
});

export const createTodo = catchAsync(async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) return res.status(422).json({ message: "title is required!" });
  if (!description)
    return res.status(422).json({ message: "description is required!" });
  const todo = await TodoModel.create({
    title,
    description,
    user: req.user?._id,
  });
  return res
    .status(201)
    .json({ data: todo, message: "todo created successfully !" });
});

export const updateTodo = catchAsync(async (req: Request, res: Response) => {
  const { title, description, isDone, isFavorite } = req.body;
  const { id } = req.params;
  const todo = await TodoModel.findOneAndUpdate(
    { _id: id, user: req.user?._id },
    { title, description, isDone, isFavorite },
    { runValidators: true, new: true }
  );
  if (!todo) return res.status(404).json({ message: `todo ${id} not found !` });
  return res
    .status(200)
    .json({ data: todo, message: "todo updated successfully !" });
});

export const deleteTodo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await TodoModel.findOneAndDelete({
    _id: id,
    user: req.user?._id,
  });
  if (!todo) return res.status(404).json({ message: `todo ${id} not found !` });
  return res.status(204).json({ message: "todo deleted successfully !" });
});
