const express = require("express");
const router = express.Router();

const authController = require("../app/controllers/AuthController");
const middlewareControllers = require("../app/controllers/middlewareController");

// Đăng ký
router.post(
    "/register",
    middlewareControllers.verifyTokenAndAdmin,
    authController.registerUser
);

// Đăng nhập
router.post("/login", authController.loginUser);

// Trigger
router.get("/trigger", authController.trigger);

module.exports = router;
