import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  getTodo,
  deleteTodo,
} from "@/controllers/todoControllers";
import checkUserController from "@/controllers/checkUserController";

const todoRoutes = express.Router();

todoRoutes.use(checkUserController);

todoRoutes.get("/", getTodos);
todoRoutes.get("/:id", getTodo);
todoRoutes.post("/create", createTodo);
todoRoutes.put("/update/:id", updateTodo);
todoRoutes.delete("/delete/:id", deleteTodo);

export default todoRoutes;
