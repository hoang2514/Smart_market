const express = require("express");
const router = express.Router();

const notificationController = require("../app/controllers/NotificationController");
const middlewareControllers = require("../app/controllers/middlewareController");

// Lấy thông báo
router.get(
    "/get_all",
    middlewareControllers.verifyTokenAndAdmin,
    notificationController.getAllNotification
);

// Lấy thông báo
router.get(
    "/get_my_notification",
    middlewareControllers.verifyToken,
    notificationController.getMyNotification
);

// Tạo thông báo
router.post(
    "/post",
    middlewareControllers.verifyTokenAndQL_Admin,
    notificationController.createNotificationForAll
);

// Hàm thêm seen thông báo
router.post(
    "/seen/:id",
    middlewareControllers.verifyToken,
    notificationController.seenNotification
);

// Post for someone
router.post(
    "/post_for_someone/:id",
    middlewareControllers.verifyTokenAndAdmin,
    notificationController.createNotificationForSomeone
);

// Post for admin
router.post(
    "/post_for_admin",
    middlewareControllers.verifyToken,
    notificationController.createNotificationForAdmin
);

module.exports = router;
