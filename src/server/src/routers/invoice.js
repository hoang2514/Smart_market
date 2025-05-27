const express = require("express");
const router = express.Router();

const invoiceController = require("../app/controllers/InvoiceController");
const middlewareControllers = require("../app/controllers/middlewareController");

// Lưu háo đơn
router.post(
    "/save_invoice",
    middlewareControllers.verifyToken,
    invoiceController.saveInvoice
);

// Lấy toàn bộ hoá đơn
router.get(
    "/",
    middlewareControllers.verifyTokenAndAdmin,
    invoiceController.getAllInvoices
);

// Lấy toàn bộ hoá đơn của chính mình
router.get(
    "/me",
    middlewareControllers.verifyToken,
    invoiceController.getAllYourOwnInvoice
);

// Lấy toàn bộ hoá đơn của 1 nhân viên
router.get(
    "/employee/:id",
    middlewareControllers.verifyTokenAndAdmin,
    invoiceController.getAllEmloyeeInvoices
);

// Lấy thông tin hoá đơn
router.get(
    "/search/:id",
    middlewareControllers.verifyTokenAndAdmin,
    invoiceController.getInvoiceByInvoiceID
);

module.exports = router;
