import express from "express";
import { createTodo } from "@/controllers/todoControllers";

const todoRoutes = express.Router();

todoRoutes.post("/create", createTodo);

export default todoRoutes;
