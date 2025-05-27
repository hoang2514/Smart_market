const express = require("express");
const router = express.Router();

const paymentController = require("../app/controllers/PaymentController");
const middlewareControllers = require("../app/controllers/middlewareController");

//Lấy thông tin toàn bộ nhân viên
router.post(
    "/create-payment-link",
    middlewareControllers.verifyToken,
    paymentController.createPaymentLink
);

router.post(
    "/check-order",
    middlewareControllers.verifyToken,
    paymentController.checkOrder
);

router.post(
    "/cancel-order",
    middlewareControllers.verifyToken,
    paymentController.cancelOrder
);
module.exports = router;
