import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getReccomendedProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getReccomendedProducts);

router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

export default router;
