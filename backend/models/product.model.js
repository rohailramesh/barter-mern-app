import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is a required field"],
    },
    description: {
      type: String,
      required: [true, "Description is a required field"],
    },
    price: {
      type: Number,
      required: [true, "Price is a required field"],
    },
    image: {
      type: String,
      required: [true, "Image is a required field"],
    },
    category: {
      type: String,
      required: [true, "Category is a required field"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
