import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Code is a required field"],
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, "DiscountPercentage is a required field"],
      min: [0, "DiscountPercentage cannot be less than 0"],
      max: [100, "DiscountPercentage cannot be greater than 100"],
    },
    expiryDate: {
      type: Date,
      required: [true, "ExpiryDate is a required field"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is a required field"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
