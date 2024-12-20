import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });

    res.status(200).json({ user, message: "User created successfully" });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {};

export const logout = async (req, res) => {};

export const refreshToken = async (req, res) => {};
