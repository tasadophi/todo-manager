import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  getTodo,
} from "@/controllers/todoControllers";

const todoRoutes = express.Router();

todoRoutes.get("/", getTodos);
todoRoutes.get("/:id", getTodo);
todoRoutes.post("/create", createTodo);
todoRoutes.put("/update/:id", updateTodo);

export default todoRoutes;
