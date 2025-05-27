const bcrypt = require("bcrypt");
const User = require("../models/User");
const mongoose = require('mongoose'); 

class UserController {
    //GET get ALL USERs
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    //GET user by id
    async getUser(req, res) {
        try {
            const user = await User.findById(req.params.id).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async updateUser(req, res) {
        try {
            // Kiểm tra nếu ID không hợp lệ
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid user ID" });
            }

            // Tạo một đối tượng lưu trữ dữ liệu mới
            const { password, name, username, email, role, phone } = req.body;
            const newData = {
                name,
                username,
                email,
                role,
                phone,
            };

            // Nếu có mật khẩu mới, mã hóa mật khẩu trước khi cập nhật
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(password, salt);
                newData.password = hashed; // Thêm mật khẩu đã mã hóa vào newData
            }

            // Cập nhật người dùng
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                newData,
                { new: true, runValidators: true } // Trả về tài liệu đã được cập nhật và áp dụng validation
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            // Trả về đối tượng người dùng đã cập nhật
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    //DELETE user
    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("DELETE successfully !");
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = new UserController();
