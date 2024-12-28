import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import couponRoutes from "./routes/coupon.route.js";
import cartRoutes from "./routes/cart.route.js";
dotenv.config();
const PORT = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cookieParser());
//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
