import mongoose from "mongoose";

interface ITodo {
  title: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
}

const todoSchema = new mongoose.Schema<ITodo>({
  title: { type: String, required: [true, "title is required !"] },
  description: { type: String, required: [true, "description is required !"] },
  isDone: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const TodoModel = mongoose.model("Todo", todoSchema);

export default TodoModel;
