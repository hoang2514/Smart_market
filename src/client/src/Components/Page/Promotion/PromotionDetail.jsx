import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import ShowPopup from "./ShowPopup";
import Swal from "sweetalert2";

import apiConfig from "../../../config/apiConfig";

const PromotionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [promotion, setPromotion] = useState(null);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const openPopup = () => setShowPopup(true);
    const closePopup = () => setShowPopup(false);

    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("user"));
                const response = await axios.get(
                    `${apiConfig.serverURL}/v1/app/promotion/${id}`,
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );
                setPromotion(response.data);
                setError(null);

                if (response.data.appliedProducts.length > 0) {
                    const productResponse = await axios.post(
                        `${apiConfig.serverURL}/v1/app/products/info`,
                        { ids: response.data.appliedProducts },
                        {
                            headers: {
                                token: `Bearer ${token.accessToken}`,
                            },
                        }
                    );
                    setProducts(productResponse.data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Không thể tải chi tiết khuyến mãi.");
            }
        };

        fetchPromotion();
    }, [id]);

    const getPromotionStatus = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return "Đã lên kế hoạch";
        if (now > end) return "Đã kết thúc";
        return "Đang chạy";
    };

    const handleDeletePromotion = async () => {
        const confirmDelete = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa khuyến mãi này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (confirmDelete.isConfirmed) {
            try {
                const token = JSON.parse(localStorage.getItem("user"));
                await axios.delete(
                    `${apiConfig.serverURL}/v1/app/promotion/${id}`,
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                Swal.fire({
                    title: "Đã xóa!",
                    text: "Khuyến mãi đã được xóa thành công.",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                navigate("/promotion");
            } catch (err) {
                console.error("Error deleting promotion:", err);

                Swal.fire({
                    title: "Lỗi",
                    text: "Không thể xóa khuyến mãi. Vui lòng thử lại.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
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

    if (!promotion) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
            </div>
        );
    }

    const status = getPromotionStatus(promotion.startTime, promotion.endTime);

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
            >
                Đóng
            </button>
            <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">{promotion.title}</h1>
                <p className="text-gray-700 mb-4">{promotion.description}</p>
                <p className="text-green-500 font-bold mb-2">
                    Giảm giá: {promotion.discount}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                    Hiệu lực:{" "}
                    {new Date(promotion.startTime).toLocaleDateString()} -{" "}
                    {new Date(promotion.endTime).toLocaleDateString()}
                </p>
                <p className="font-bold mb-2">
                    Trạng thái:{" "}
                    <span
                        className={`${
                            status === "Đang chạy"
                                ? "text-green-500"
                                : status === "Đã kết thúc"
                                ? "text-gray-500"
                                : "text-blue-500"
                        }`}
                    >
                        {status}
                    </span>
                </p>
                <p className="text-gray-600 mb-4">
                    Người tạo: {promotion.author}
                </p>
                <p className="text-gray-500 mb-2">
                    Ngày tạo: {new Date(promotion.createdAt).toLocaleString()}
                </p>
                <p className="text-gray-500 mb-4">
                    Cập nhật lần cuối:{" "}
                    {new Date(promotion.updatedAt).toLocaleString()}
                </p>

                <div>
                    <h2 className="text-lg font-semibold mb-2">
                        Sản phẩm áp dụng:
                    </h2>
                    {products.length > 0 ? (
                        <div>
                            <table className="min-w-full table-auto border-collapse">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border-b">
                                            STT
                                        </th>
                                        <th className="px-4 py-2 border-b">
                                            Product ID
                                        </th>
                                        <th className="px-4 py-2 border-b">
                                            Tên sản phẩm
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products
                                        .slice(0, 5)
                                        .map((product, index) => (
                                            <tr
                                                key={product._id}
                                                className="border-b"
                                            >
                                                <td className="px-4 py-2">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Link
                                                        to={`/product/${product._id}`}
                                                    >
                                                        {product.productID}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {product.name}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {products.length > 5 && (
                                <button
                                    onClick={openPopup}
                                    className="text-blue-500 mt-4"
                                >
                                    Xem tất cả sản phẩm
                                </button>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Không có sản phẩm áp dụng.
                        </p>
                    )}
                </div>

                {/* Modal */}
                {showPopup && (
                    <ShowPopup products={products} closePopup={closePopup} />
                )}
            </div>

            {/* Button */}
            <div className="mt-6 flex justify-between">
                <button
                    onClick={handleDeletePromotion}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Xóa
                </button>
            </div>
        </div>
    );
};

export default PromotionDetail;
