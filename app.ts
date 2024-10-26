import "dotenv/config";
import express, { Express } from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import todoRoutes from "@/routes/todoRoutes";
import errorController from "@/controllers/errorController";
import userRoutes from "@/routes/userRoutes";

class Application {
  #app: Express = express();
  #PORT = process.env.PORT || 8000;
  #DB_URL = process.env.DB_URL as string;

  constructor() {
    this.createServer();
    this.connectToDB();
    this.configServer();
    this.configRoutes();
  }
  createServer() {
    this.#app.listen(this.#PORT, () => {
      console.log(
        `[server]: Server is running at http://localhost:${this.#PORT}`
      );
    });
  }
  connectToDB() {
    mongoose
      .connect(this.#DB_URL)
      .then((res) => console.log("MongoDB connected!!"))
      .catch((err) => console.log("Failed to connect to MongoDB", err));
  }
  configServer() {
    this.#app.use(cors({ credentials: true, origin: "*" }));
    this.#app.use(express.json());
    this.#app.use(cookieParser());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..")));
  }
  configRoutes() {
    this.#app.use("/api/todos", todoRoutes);
    this.#app.use("/api/user", userRoutes);
    this.#app.use(errorController);
  }
}

export default Application;
