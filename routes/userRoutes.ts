import express from "express";
import { signup } from "@/controllers/userControllers";

const userRoutes = express.Router();

userRoutes.post("/signup", signup);

export default userRoutes;
