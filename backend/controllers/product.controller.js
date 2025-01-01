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

// export const getFeaturedProducts = async (req, res) => {
//   try {
//     let featuredProducts = await redis.get("featured_products");
//     if (featuredProducts) {
//       return res.json(JSON.parse(featuredProducts));
//     } else {
//       featuredProducts = (await Product.find({ isFeatured: true })).length(); // gets js object instead of mongodb doc which is good for performance;
//       if (!featuredProducts) {
//         return res.status(404).json({ message: "No featured products found" });
//       }
//       await redis.set("featured_products", JSON.stringify(featuredProducts));
//       return res.json(featuredProducts);
//     }
//   } catch (error) {
//     console.log("Error in getFeaturedProducts controller", error.message);
//     res.status(500).json({ message: error.message });
//   }
// }; //first check if featured products are in redis, if not then get the products from the database and then add them to redis
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // if not in redis, fetch from mongodb
    // .lean() is gonna return a plain javascript object instead of a mongodb document
    // which is good for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getReccomendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1, name: 1, price: 1, image: 1, description: 1 } },
    ]);
    res.json(products);
  } catch (error) {
    console.log("Error in getReccomendedProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const productsByCategory = await Product.find({ category });
    res.json(productsByCategory);
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    // The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}
