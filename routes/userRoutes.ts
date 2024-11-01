import express from "express";
import { info, login, refresh, signup } from "@/controllers/userControllers";
import checkUserController from "@/controllers/checkUserController";

const userRoutes = express.Router();

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/refresh", refresh);
userRoutes.get("/info", checkUserController, info);

export default userRoutes;
