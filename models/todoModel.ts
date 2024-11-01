import mongoose from "mongoose";

interface ITodo {
  title: string;
  description: string;
  isDone: boolean;
  isFavorite: boolean;
}

const todoSchema = new mongoose.Schema<ITodo>(
  {
    title: { type: String, required: [true, "title is required !"] },
    description: {
      type: String,
      required: [true, "description is required !"],
    },
    isDone: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

todoSchema.index({ title: "text", description: "text" });

const TodoModel = mongoose.model("Todo", todoSchema);

export default TodoModel;
