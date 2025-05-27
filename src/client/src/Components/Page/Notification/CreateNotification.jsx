import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import apiConfig from "../../../config/apiConfig";

function CreateNotification() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [type, setType] = useState("info");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const token = JSON.parse(localStorage.getItem("user"));

        const notificationData = {
            title: title || "Thông báo mới",
            body: body || "",
            type: type || "info",
        };

        try {
            const response = await axios.post(
                `${apiConfig.serverURL}/v1/app/notification/post`,
                notificationData,
                {
                    headers: {
                        token: `Bearer ${token.accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("Đã thêm thông báo thành công !");
                navigate("/notification");
            }
        } catch (err) {
            setError(err.message || "Lỗi khi tạo thông báo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Tạo Thông Báo</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <button
                className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => navigate("/notification")}
            >
                Quay lại
            </button>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Tiêu đề
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        placeholder="Nhập tiêu đề thông báo"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="body"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Nội dung
                    </label>
                    <textarea
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        placeholder="Nhập nội dung thông báo"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Loại thông báo
                    </label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    >
                        <option value="info">Thông tin</option>
                        <option value="success">Thành công</option>
                        <option value="warning">Cảnh báo</option>
                        <option value="error">Lỗi</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md text-white ${
                        loading
                            ? "bg-gray-400"
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={loading}
                >
                    {loading ? "Đang tạo..." : "Tạo thông báo"}
                </button>
            </form>
        </div>
    );
}

export default CreateNotification;
