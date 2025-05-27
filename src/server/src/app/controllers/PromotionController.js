const Product = require("../models/Product");
const Promotion = require("../models/Promotion");

class PromotionController {
    getAllPromotions = async (req, res) => {
        try {
            const promotions = await Promotion.find();
            res.status(200).json(promotions);
        } catch (error) {
            res.status(500).json({ message: "Error", error });
        }
    };

    getPromotionByID = async (req, res) => {
        try {
            const { id } = req.params;
            const promotion = await Promotion.findById(id);
            if (!promotion) {
                return res
                    .status(404)
                    .json({ message: "Promotion not found!" });
            }
            res.status(200).json(promotion);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error", error });
        }
    };

    // Thêm khuyến mãi mới
    addPromotion = async (req, res) => {
        try {
            // Lấy thông tin
            const {
                title,
                description,
                discount,
                startTime,
                endTime,
                appliedProducts,
            } = req.body;

            const newPromotion = new Promotion({
                author: req.user.id,
                title,
                description,
                discount,
                appliedProducts,
                startTime,
                endTime,
            });

            // Lưu khuyến mãi vào cơ sở dữ liệu
            const savedPromotion = await newPromotion.save();

            // Cập nhật danh sách sản phẩm với khuyến mãi mới
            if (appliedProducts && appliedProducts.length > 0) {
                await Product.updateMany(
                    { _id: { $in: appliedProducts } }, // Lọc các sản phẩm có productID trong danh sách
                    { $addToSet: { promotions: savedPromotion._id } } // Thêm _id của Promotion vào danh sách promotions
                );
            }

            // Trả về phản hồi thành công
            res.status(200).json({
                message: "Promotion created !",
                promotion: savedPromotion,
            });
        } catch (error) {
            res.status(500).json({ message: "Error", error });
        }
    };

    // Xoá khuyến mãi
    deletePromotion = async (req, res) => {
        try {
            // Tìm và xóa khuyến mãi
            const promotionID = req.params.id;
            const deletedPromotion = await Promotion.findByIdAndDelete(
                promotionID
            );

            if (!deletedPromotion) {
                return res
                    .status(404)
                    .json({ message: "Promotion not found !!" });
            }

            // Loại bỏ khuyến mãi khỏi các sản phẩm liên quan
            await Product.updateMany(
                { promotions: promotionID },
                { $pull: { promotions: promotionID } }
            );

            res.status(200).json({
                message: "Promotion deleted!",
                promotion: deletedPromotion,
            });
        } catch (error) {
            res.status(500).json({ message: "Error", error });
        }
    };

    // Chỉnh sửa khuyến mãi
    editPromotion = async (req, res) => {
        try {
            const promotionID = req.params.id;
            const {
                title,
                description,
                discount,
                startTime,
                endTime,
                appliedProducts,
            } = req.body;

            // Tìm khuyến mãi cần cập nhật
            const updatedPromotion = await Promotion.findByIdAndUpdate(
                promotionID,
                {
                    title,
                    description,
                    discount,
                    startTime,
                    endTime,
                    appliedProducts,
                },
                { new: true } // Trả về dữ liệu đã cập nhật
            );

            if (!updatedPromotion) {
                return res.status(404).json({ message: "Promotion not found" });
            }

            // Cập nhật danh sách sản phẩm liên quan
            if (appliedProducts && appliedProducts.length > 0) {
                // Loại bỏ khuyến mãi khỏi các sản phẩm cũ
                await Product.updateMany(
                    { promotions: promotionID },
                    { $pull: { promotions: promotionID } }
                );

                // Thêm khuyến mãi vào danh sách sản phẩm mới
                await Product.updateMany(
                    { _id: { $in: appliedProducts } },
                    { $addToSet: { promotions: promotionID } }
                );
            }

            res.status(200).json({
                message: "Promotion updated successfully!",
                promotion: updatedPromotion,
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    };
}

module.exports = new PromotionController();
