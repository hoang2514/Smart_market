import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import apiConfig from "../../../config/apiConfig";

function ShowNotification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [local, setLocal] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const token = JSON.parse(localStorage.getItem("user"));
                setLocal(token);
                const response = await axios.get(
                    `${apiConfig.serverURL}/v1/app/notification/get_my_notification`,
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );
                setNotifications(response.data.reverse());
            } catch (err) {
                setError(err.message || "Lỗi khi tạo thông báo");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) {
        return <div className="text-center text-blue-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    // Chọn màu nền của thanh phía trước thông báo dựa trên type
    const getNotificationColor = (type) => {
        switch (type) {
            case "info":
                return "bg-blue-500";
            case "success":
                return "bg-green-500";
            case "warning":
                return "bg-yellow-500";
            case "error":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <>
            <div className="relative p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
                {/* Kiểm tra xem role có phải "admin" hay không */}
                {local && local.user_datas.role === "admin" && (
                    <button
                        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => navigate("/notification/create")}
                    >
                        Tạo thông báo
                    </button>
                )}
                <h1 className="text-2xl font-bold mb-4">Thông báo</h1>
                {notifications.length > 0 ? (
                    <ul className="space-y-2">
                        {notifications.map((notification) => (
                            <li
                                key={notification.notificationID}
                                className="p-4 rounded shadow hover:bg-gray-200 cursor-pointer flex items-center"
                                onClick={() =>
                                    navigate(
                                        `/notification/seen/${notification._id}`
                                    )
                                }
                            >
                                <div
                                    className={`h-12 w-2 mr-4 ${getNotificationColor(
                                        notification.type
                                    )} rounded-md`}
                                ></div>
                                <div className="flex-1">
                                    <p
                                        className={`text-lg ${
                                            notification.read
                                                ? "font-normal"
                                                : "font-bold"
                                        }`}
                                    >
                                        {notification.title}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Không có thông báo nào khả dụng.</p>
                )}
            </div>
        </>
    );
}

export default ShowNotification;
