const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
    {
        price: {
            type: Number,
            required: true,
        },
        purchasePrice: {
            type: Number,
            required: false,
        },
    },
    { _id: false }
);

const productInfoSchema = new mongoose.Schema(
    {
        // Ngày sản xuất
        mfg: {
            type: Date,
            required: false,
        },

        // Hạn sử dụng
        exp: {
            type: Date,
            required: false,
        },

        // Mô tả
        description: {
            type: String,
            required: false,
        },

        // Mã vạch trên sản phẩm
        barcode: {
            type: String,
            unique: true,
            default: function () {
                return "undefined" + this.parent().productID; // Tạo mã mặc định
            },
        },
    },
    { _id: false } // Không thêm _id
);

const productSchema = new mongoose.Schema(
    {
        // Mã sản phẩm
        productID: {
            type: String,
            required: true,
            unique: true,
        },

        // Tên sản phẩm
        name: {
            type: String,
            required: true,
            unique: true,
        },

        // Giá
        prices: priceSchema,

        // Thông tin sản phẩm
        productInfo: productInfoSchema,

        // Số lượng còn lại trong kho
        stock: {
            type: Number,
            default: 0,
        },

        // Ngày nhập
        purchaseDate: {
            type: Date,
            default: Date.now,
        },

        // Mức cảnh báo hết hàng
        warningLevel: {
            type: Number,
            default: 10,
        },

        // Danh sách chương trình khuyến mãi áp dụng
        promotions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Promotion",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
