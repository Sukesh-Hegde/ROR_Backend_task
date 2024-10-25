const express = require("express");
const {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getCategoriesForPieChart,
} = require("../controllers/productController");

const router = express.Router();

router.get("/initialize", initializeDatabase);
router.get("/transactions", listTransactions);
router.get("/statistics", getStatistics);
router.get("/piechart", getCategoriesForPieChart);

module.exports = router;
