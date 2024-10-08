import express from "express";
import { createTodo, updateTodo } from "@/controllers/todoControllers";

const todoRoutes = express.Router();

todoRoutes.post("/create", createTodo);
todoRoutes.put("/update/:id", updateTodo);

export default todoRoutes;
