// user model will have the following fields:
/*
name, email, password which will be hased, cartItem with a default quantity of 1 and products which will reference to the product model, role with default value of "user" and enum type of "customer" and "admin"
*/

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is a required field"],
    },
    email: {
      type: String,
      required: [true, "Email is a required field"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      //need a pre-save hook to hash the password
      type: String,
      required: [true, "Password is a required field"],
      minLength: [6, "Password must be at least 6 characters long"],
    },
    cartItem: [
      // cartItem will be an array of products and quantity of default value of 1
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

// pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // if the password is not modified, move to next middleware
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// function to copmare hashed value and password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
