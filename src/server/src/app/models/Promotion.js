const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const promotionSchema = new mongoose.Schema(
    {
        // Mã khuyến mãi (dạng KM_XXXXXXXX)
        promotionID: {
            type: String,
            unique: true,
        },

        // Tác giả
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        // Tiêu đề
        title: {
            type: String,
            required: true,
        },

        // Mô tả
        description: {
            type: String,
            required: false,
        },

        // Giảm giá
        discount: {
            type: String,
            required: true,
        },

        // Danh sách sản phẩm áp dụng
        appliedProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        // Thời gian bắt đầu
        startTime: {
            type: Date,
            required: true,
        },

        // Thời gian kết thúc
        endTime: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

promotionSchema.pre("save", function (next) {
    if (!this.promotionID) {
        this.promotionID = `KM_${uuidv4().slice(0, 8).toUpperCase()}`;
    }
    next();
});

module.exports = mongoose.model("Promotion", promotionSchema);
