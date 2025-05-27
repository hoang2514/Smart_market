
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import apiConfig from "../../../config/apiConfig";

const PromotionList = () => {
    const [promotions, setPromotions] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [filter, setFilter] = useState("Tất cả");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("user"));
                const response = await axios.get(
                    `${apiConfig.serverURL}/v1/app/promotion/`,
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );
                setPromotions(response.data);
                setFilteredPromotions(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching promotions:", err);
                setError("Không thể tải danh sách khuyến mãi.");
            }
        };

        fetchPromotions();
    }, []);

    const getPromotionStatus = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return "Đã lên kế hoạch";
        if (now > end) return "Đã kết thúc";
        return "Đang chạy";
    };

    const handleFilterChange = (status) => {
        setFilter(status);
        if (status === "Tất cả") {
            setFilteredPromotions(promotions);
        } else {
            setFilteredPromotions(
                promotions.filter(
                    (promotion) =>
                        getPromotionStatus(
                            promotion.startTime,
                            promotion.endTime
                        ) === status
                )
            );
        }
    };

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-red-500">
                    {error}
                </h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách khuyến mãi</h1>

            {/* Nút Tạo khuyến mãi */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <button
                        onClick={() => handleFilterChange("Tất cả")}
                        className={`px-4 py-2 mr-2 rounded ${
                            filter === "Tất cả"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => handleFilterChange("Đang chạy")}
                        className={`px-4 py-2 mr-2 rounded ${
                            filter === "Đang chạy"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Đang chạy
                    </button>
                    <button
                        onClick={() => handleFilterChange("Đã kết thúc")}
                        className={`px-4 py-2 mr-2 rounded ${
                            filter === "Đã kết thúc"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Đã kết thúc
                    </button>
                    <button
                        onClick={() => handleFilterChange("Đã lên kế hoạch")}
                        className={`px-4 py-2 rounded ${
                            filter === "Đã lên kế hoạch"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Đã lên kế hoạch
                    </button>
                </div>
                <button
                    onClick={() => navigate("/promotion/add")}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                >
                    Tạo khuyến mãi
                </button>
            </div>

            {/* Danh sách khuyến mãi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPromotions.map((promotion) => {
                    const status = getPromotionStatus(
                        promotion.startTime,
                        promotion.endTime
                    );
                    const color =
                        status === "Đang chạy"
                            ? "text-green-500"
                            : status === "Đã kết thúc"
                            ? "text-gray-500"
                            : "text-blue-500";

                    return (
                        <div
                            key={promotion._id}
                            className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition duration-200 cursor-pointer"
                            onClick={() =>
                                navigate(`/promotion/${promotion._id}`)
                            }
                        >
                            <h2 className="text-xl font-semibold">
                                {promotion.title}
                            </h2>
                            <p className="text-gray-600">
                                {promotion.description}
                            </p>
                            <p className="text-green-500 font-bold">
                                Giảm giá: {promotion.discount}
                            </p>
                            <p className={`font-bold ${color}`}>
                                Trạng thái: {status}
                            </p>
                            <p className="text-sm text-gray-500">
                                Hiệu lực:{" "}
                                {new Date(
                                    promotion.startTime
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                    promotion.endTime
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PromotionList;
