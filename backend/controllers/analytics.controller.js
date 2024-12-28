import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async (req, res) => {
  //total users, total products, total revenue, total sales
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    };
    res.json({
      users: totalUsers,
      products: totalProducts,
      totalSales,
      totalRevenue,
    });
  } catch (error) {
    console.log("Error in getAnalyticsData controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
    const dateRangeArray = getDatesInRange(startDate, endDate);
    return dateRangeArray.map((date) => {
      const data = dailySalesData.find((d) => d._id === date);
      return {
        date,
        sales: data?.sales || 0,
        revenue: data?.revenue || 0,
      };
    });
  } catch (error) {
    console.log("Error in getDailySalesData controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// helper function
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
