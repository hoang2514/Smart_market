const express = require("express");
const router = express.Router();

const dashboardController = require("../app/controllers/DashboardController");
const middlewareControllers = require("../app/controllers/middlewareController");

// Lây thông tin trang dashboard
router.get(
    "/",
    middlewareControllers.verifyToken,
    dashboardController.getDashboard
); //, middlewareControllers.verifyToken

module.exports = router;
