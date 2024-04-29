import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.methods.checkPassword = async function (enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error(error);
  }
};

UserSchema.pre("save", async function (next, enteredPassword) {
  try {
    if (!this.isModified("password")) {
      next();
    }
    const hashedPassword = await bcrypt.hash(enteredPassword, 10);
    this.password = hashedPassword;
  } catch (error) {
    throw new Error(error);
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
