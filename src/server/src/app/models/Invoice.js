const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    invoiceID: {
        type: String,
        required: true,
        unique: true, // Đảm bảo mã hóa đơn là duy nhất
    },
    items: [
        {
            productID: { type: String, required: true }, // ID sản phẩm
            product: { type: String, required: true }, // Tên sản phẩm
            quantity: { type: Number, required: true }, // Số lượng sản phẩm
            price: { type: Number, required: true }, // Giá mỗi sản phẩm
            total: { type: Number, required: true }, // Tổng giá của sản phẩm (price * quantity)
        },
    ],
    totalAmount: {
        type: Number,
        required: true, // Tổng tiền hóa đơn
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "bank"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Ngày tạo hóa đơn
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
