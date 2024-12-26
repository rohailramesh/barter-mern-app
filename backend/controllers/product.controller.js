import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

//List of controllers to use for products
/*
getAllProducts
getFeaturedProducts
createProduct
deleteProduct
getReccomendedProducts
getProductsByCategory
toggleFeaturedProduct
updateFeaturedProductsCache
*/

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
}; //find the products and return the response as json

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const imageId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${imageId}`);
        res.json({ message: "Product deleted successfully" });
      } catch (error) {
        console.log("Error in deleting product image", error.message);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
}; //get the product id from the params and delete the product as well as the image in cloudinary

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
}; //create a new product with all the fields and add the image to cloudinary

export const getFeaturedProducts = async (req, res) => {};

export const getReccomendedProducts = async (req, res) => {};

export const getProductsByCategory = async (req, res) => {};

export const toggleFeaturedProduct = async (req, res) => {};

export const updateFeaturedProductsCache = async (req, res) => {};
