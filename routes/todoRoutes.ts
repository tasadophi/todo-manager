import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
} from "@/controllers/todoControllers";

const todoRoutes = express.Router();

todoRoutes.get("/", getTodos);
todoRoutes.post("/create", createTodo);
todoRoutes.put("/update/:id", updateTodo);

export default todoRoutes;
