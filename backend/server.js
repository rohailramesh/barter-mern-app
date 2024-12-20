import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
dotenv.config();
const PORT = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cookieParser());
//auth routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
