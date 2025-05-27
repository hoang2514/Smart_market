import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SetedProductPopup from "./SetedProductPopup";
import axios from "axios";
import Swal from "sweetalert2";
import makeNotificationToAll from "../../../Utils/makeNotificationToAll";

import apiConfig from "../../../config/apiConfig";

const AddPromotion = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        discount: "",
        startTime: "",
        endTime: "",
        appliedProducts: [],
    });

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("user"));
                const response = await axios.get(
                    `${apiConfig.serverURL}/v1/app/products/`,
                    {
                        headers: {
                            token: `Bearer ${token?.accessToken || ""}`,
                        },
                    }
                );

                if (Array.isArray(response.data)) {
                    setAllProducts(response.data);
                } else {
                    console.error("Error:", response.data);
                }
            } catch (error) {
                console.error("Error", error);
            }
        };

        fetchProducts();
    }, []);

    const togglePopup = () => {
        setIsPopupOpen((prev) => !prev);
    };

    const handleCheckboxChange = (updatedProducts) => {
        setFormData((prev) => ({
            ...prev,
            appliedProducts: updatedProducts,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Tiêu đề không được bổ trống.",
            });
            return;
        }

        if (
            !formData.discount ||
            isNaN(formData.discount) ||
            formData.discount <= 0 ||
            formData.discount > 100
        ) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Giảm giá phải nằm trong khoẳng từ 0 đến 100",
            });
            return;
        }

        if (new Date(formData.startTime) >= new Date(formData.endTime)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Time",
                text: "Thời gian bắt đầu phải bé hơn thời gian kết thúc",
            });
            return;
        }

        // Hiển thị thông báo xác nhận
        const confirmation = await Swal.fire({
            title: "Bạn có chắc?",
            text: `Bạn có muốn thêm khuyến mãi "${formData.title}" ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Thêm !",
        });

        if (confirmation.isConfirmed) {
            try {
                const token = JSON.parse(localStorage.getItem("user"));
                const response = await axios.post(
                    `${apiConfig.serverURL}/v1/app/promotion/add-promition/`,
                    {
                        title: formData.title,
                        description: formData.description,
                        discount: `${parseFloat(formData.discount)}%`,
                        startTime: formData.startTime,
                        endTime: formData.endTime,
                        appliedProducts: formData.appliedProducts,
                    },
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Đã thêm khuyễn mãi thành công!",
                });
                const promotionId = String(response.data.promotion._id);

                makeNotificationToAll(
                    `Đã tạo 1 khuyến mãi mới ${formData.title}.`,
                    `Giảm ${parseFloat(formData.discount)}% cho ${formData.appliedProducts.length
                    } sản phẩm: Bắt đầu từ ${formData.startTime} đến ${formData.endTime
                    }.`,
                    "success"
                );

                setFormData({
                    title: "",
                    description: "",
                    discount: "",
                    startTime: "",
                    endTime: "",
                    appliedProducts: [],
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Có lỗi khi thêm khuyễn mãi.",
                });
            }
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
            >
                Đóng
            </button>
            <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Thêm khuyến mãi</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Giảm giá
                        </label>
                        <input
                            type="number"
                            value={formData.discount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    discount: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Thời gian bắt đầu
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    startTime: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Thời gian kết thúc
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.endTime}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    endTime: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={togglePopup}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Chọn sản phẩm
                        </button>
                    </div>

                    <div className="mt-4">
                        <p className="text-lg font-medium mb-2">Sản phẩm đã được chọn</p>
                        {formData.appliedProducts.length > 0 ? (
                            <div className="overflow-y-auto max-h-60 border border-gray-300 rounded-lg">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 sticky top-0">
                                            <th className="border border-gray-300 px-4 py-2">STT</th>
                                            <th className="border border-gray-300 px-4 py-2">ID</th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Tên sản phẩm
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.appliedProducts.map((id, index) => {
                                            const product = allProducts.find((p) => p._id === id);
                                            return (
                                                <tr key={id}>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {product?.productID || "N/A"}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {product?.name || "N/A"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500">Chưa có sản phẩm nào được chọn.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                        Tạo khuyến mãi
                    </button>
                </form>

                <SetedProductPopup
                    isOpen={isPopupOpen}
                    onClose={togglePopup}
                    allProducts={allProducts}
                    selectedProducts={formData.appliedProducts}
                    onSelect={handleCheckboxChange}
                />
            </div>
        </div>
    );
};

export default AddPromotion;
