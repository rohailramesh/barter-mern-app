import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

//load stripe promise from env variable STRIPE_PROMISE_KEY
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PROMISE_KEY);
console.log(import.meta.env.VITE_STRIPE_KEY);
console.log(import.meta.env.MODE);

const OrderSummary = () => {
  return <div>Order Summary</div>;
};

export default OrderSummary;
