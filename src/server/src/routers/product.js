const express = require("express");
const router = express.Router();

const productController = require("../app/controllers/ProductController");
const middlewareControllers = require("../app/controllers/middlewareController");

//Lấy thông tin toàn bộ kho
router.get(
    "/",
    middlewareControllers.verifyToken,
    productController.getAllProducts
);

// Lấy thông tin cỉa 1 sản phẩm
router.get(
    "/info/:id",
    middlewareControllers.verifyToken,
    productController.getProductsByID
);

router.post(
    "/info",
    middlewareControllers.verifyToken,
    productController.getProductsByIDs
);

//Thêm hàng vào kho
router.post(
    "/add_product",
    middlewareControllers.verifyTokenAndQL_Admin,
    productController.addProduct
);

// Tìm kiếm hàng hoá
router.post(
    "/search_product",
    middlewareControllers.verifyToken,
    productController.searchProductByNameOrID
);

//Xoá mặt hàng
router.delete(
    "/:id",
    middlewareControllers.verifyTokenAndQL_Admin,
    productController.deleteProduct
);

// Cập nhật lại thông tin mặt hàng
router.put(
    "/:id",
    middlewareControllers.verifyTokenAndQL_Admin,
    productController.updateProduct
);

// Sell
router.post(
    "/sell",
    middlewareControllers.verifyToken,
    productController.sellProduct
);

module.exports = router;
