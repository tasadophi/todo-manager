import express from "express";
import { login, refresh, signup } from "@/controllers/userControllers";

const userRoutes = express.Router();

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/refresh", refresh);

export default userRoutes;
