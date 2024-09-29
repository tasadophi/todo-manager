import express from "express";
import { helloWorld } from "@/controllers/helloController";

const helloRoutes = express.Router();

helloRoutes.get("/", helloWorld);

export default helloRoutes;
