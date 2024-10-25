const axios = require("axios");
const Product = require("../models/Product");

// Initialize the database with seed data
const initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = response.data;

    await Product.deleteMany(); // Clear existing data
    await Product.insertMany(data); // Seed database

    res.status(200).json({ message: "Database initialized successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error initializing database", error });
  }
};

// List transactions with search and pagination
const listTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { price: { $regex: search, $options: "i" } },
    ];
  }

  if (month) {
    query.dateOfSale = {
      $regex: new RegExp(`-${month.padStart(2, "0")}-`, "i"),
    };
  }

  try {
    const products = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

// Get statistics for a specific month
const getStatistics = async (req, res) => {
  const { month } = req.query;
  const monthRegex = new RegExp(`-${month.padStart(2, "0")}-`, "i");

  try {
    const totalSaleAmount = await Product.aggregate([
      { $match: { dateOfSale: monthRegex, isSold: true } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const soldItemsCount = await Product.countDocuments({
      dateOfSale: monthRegex,
      isSold: true,
    });
    const notSoldItemsCount = await Product.countDocuments({
      dateOfSale: monthRegex,
      isSold: false,
    });

    res.json({
      totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
      soldItemsCount,
      notSoldItemsCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics", error });
  }
};

// Get unique categories and item counts for pie chart
const getCategoriesForPieChart = async (req, res) => {
  const { month } = req.query;
  const monthRegex = new RegExp(`-${month.padStart(2, "0")}-`, "i");

  try {
    const categoryData = await Product.aggregate([
      { $match: { dateOfSale: monthRegex } },
      { $group: { _id: "$category", itemCount: { $sum: 1 } } },
      { $project: { category: "$_id", itemCount: 1, _id: 0 } },
    ]);

    res.json(categoryData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pie chart data", error });
  }
};

module.exports = {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getCategoriesForPieChart,
};