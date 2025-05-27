const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 20,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 50,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            minlength: 9,
            maxlength: 12,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["nv_ban_hang", "ql_kho", "admin"], // Các giá trị hợp lệ cho role
            default: "nv_ban_hang", // Giá trị mặc định
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
