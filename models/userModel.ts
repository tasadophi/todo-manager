import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validations from "@/utils/validations";

export interface IUser {
  email: string;
  name: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "email is required !"],
    },
    name: { type: String, default: "Dear User !" },
    password: {
      type: String,
      required: [true, "password is required !"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!validations.isEmail(this.email)) {
    next(new Error("email is invalid !"));
  }
  if (!validations.isPassword(this.password)) {
    next(
      new Error(
        "password must be contains at least 8 chars, small and capital letters and can not be persian !"
      )
    );
  }
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
