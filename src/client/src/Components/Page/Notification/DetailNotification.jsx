import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import apiConfig from "../../../config/apiConfig";

function DetailNotification() {
    const { id } = useParams();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const token = JSON.parse(localStorage.getItem("user"));
                const response = await axios.post(
                    `${apiConfig.serverURL}/v1/app/notification/seen/${id}`,
                    {},
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );
                setNotification(response.data.notification);
            } catch (err) {
                setError(err.message || "Lỗi khi tạo thông báo");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [id]);

    if (loading) {
        return <div className="text-center text-blue-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    if (!notification) {
        return (
            <div className="text-center text-gray-500">
                Không tìm thấy thông báo !!
            </div>
        );
    }

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md space-y-4">
            <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => window.history.back()}
            >
                Quay lại
            </button>
            <header className="border-b pb-4">
                <h1 className="text-2xl font-bold">{notification.title}</h1>
            </header>
            <section>
                <h2>Nội dung:</h2>
                <p className="text-gray-700">
                    {notification.body.split("\n").map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                            <br />
                        </span>
                    ))}
                </p>
            </section>

            <footer className="text-sm text-gray-500 border-t pt-4">
                <p className="text-gray-700">
                    <span className="font-semibold">ID thông báo:</span>{" "}
                    {notification.notificationID}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Loại thông báo:</span>{" "}
                    {notification.type}
                </p>
                <p>
                    <span className="font-semibold">Ngày tạo:</span>{" "}
                    {notification.createdAt}
                </p>
            </footer>
        </div>
    );
}

export default DetailNotification;
