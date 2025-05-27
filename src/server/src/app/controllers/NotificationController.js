const Notification = require("../models/Notification");
const User = require("../models/User");

class NotificationController {
    //GET AllNotification
    getAllNotification = async (req, res) => {
        try {
            const notifications = await Notification.find();

            // Kiểm tra xem user đã đọc thông báo nào
            const notificationsWithReadStatus = notifications.map(
                (notification) => {
                    const isRead = notification.seenBy.includes(req.user.id);

                    return {
                        ...notification.toObject(),
                        read: isRead, // Thêm trường `read` vào mỗi thông báo
                    };
                }
            );

            res.status(200).json(notificationsWithReadStatus);
        } catch (error) {
            console.error("Lỗi khi lấy thông báo:", error);
            res.status(500).json({ message: "Lỗi máy chủ khi lấy thông báo" });
        }
    };
    //GET AllNotification
    getMyNotification = async (req, res) => {
        try {
            // Tìm thông báo có sendTo là "all" hoặc chứa id của người dùng
            const notifications = await Notification.find({
                $or: [
                    { sendTo: "all" }, // Thông báo gửi đến tất cả
                    { sendTo: req.user.id },
                    { sendTo: req.user.role }, // Thông báo gửi đến người dùng hiện tại
                ],
            });

            // Kiểm tra xem user đã đọc thông báo nào
            const notificationsWithReadStatus = notifications.map(
                (notification) => {
                    const isRead = notification.seenBy.includes(req.user.id);

                    return {
                        ...notification.toObject(),
                        read: isRead, // Thêm trường `read` vào mỗi thông báo
                    };
                }
            );

            res.status(200).json(notificationsWithReadStatus);
        } catch (error) {
            console.error("Lỗi khi lấy thông báo:", error);
            res.status(500).json({ message: "Lỗi máy chủ khi lấy thông báo" });
        }
    };

    //POST makeNotification
    createNotificationForAll = async (req, res) => {
        try {
            //Create new Notification
            const newNotification = await new Notification({
                author: req.user.id,
                title: req.body.title,
                body: req.body.body,
                type: req.body.type,
            });

            //Save Database
            const noti = await newNotification.save();
            res.status(200).json(noti);
        } catch (error) {
            res.status(500).json(error);
        }
    };

    //POST seen notification
    seenNotification = async (req, res) => {
        try {
            const notificationId = req.params.id;
            const userId = req.user.id; // Lấy userId từ middleware

            // Tìm thông báo theo notificationId
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return res
                    .status(404)
                    .json({ message: "Notification not found !!!" });
            }

            // Kiểm tra xem userId đã tồn tại trong seenBy chưa
            if (!notification.seenBy.includes(userId)) {
                notification.seenBy.push(userId);
                await notification.save(); // Lưu thông báo đã cập nhật
            }

            res.status(200).json({
                message: "Seen notification",
                notification,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    };

    // Make noti co riêng ai đó
    createNotificationForSomeone = async (req, res) => {
        try {
            // kiểm tra có người dùng nayd không
            const recipient = await User.findById(req.params.id);
            if (!recipient) {
                return res
                    .status(404)
                    .json({ message: "Người nhận không tồn tại" });
            }

            //Create new Notification
            const newNotification = await new Notification({
                author: req.user.id,
                title: req.body.title,
                body: req.body.body,
                type: req.body.type,
                sendTo: [req.params.id],
            });

            //Save Database
            const noti = await newNotification.save();
            res.status(200).json(noti);
        } catch (error) {
            res.status(500).json(error);
        }
    };

    //Make noti for admin
    createNotificationForAdmin = async (req, res) => {
        try {
            //Create new Notification
            const newNotification = await new Notification({
                author: req.user.id,
                title: req.body.title,
                body: req.body.body,
                type: req.body.type,
                sendTo: ["admin"],
            });

            //Save Database
            const noti = await newNotification.save();
            res.status(200).json(noti);
        } catch (error) {
            res.status(500).json(error);
        }
    };
}
module.exports = new NotificationController();
