import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import apiConfig from "../../../config/apiConfig";

const DetailEmployee = () => {
    const { id } = useParams();

    // State để lưu trữ thông tin nhân viên
    const [employee, setEmployee] = useState({
        username: "",
        name: "",
        role: "",
        email: "",
        phone: "",
    });

    // Hàm lấy thông tin nhân viên
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("user"));
                const response = await axios.get(
                    `${apiConfig.serverURL}/v1/user/${id}`,
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                setEmployee({
                    username: response.data.username,
                    name: response.data.name,
                    role: response.data.role,
                    email: response.data.email,
                    phone: response.data.phone,
                });
            } catch (error) {
                alert("Không thể tải thông tin nhân viên.");
            }
        };
        fetchEmployee();
    }, [id]);

    // Hàm chuyển đổi giá trị role thành tên dễ hiểu
    const getRoleName = (role) => {
        switch (role) {
            case "admin":
                return "Admin";
            case "nv_ban_hang":
                return "Nhân viên bán hàng";
            case "ql_kho":
                return "Nhân viên quản lý kho";
            case "khac":
                return "Chức vụ khác";
            default:
                return "Chưa xác định";
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">
                Thông tin nhân viên
            </h2>
            <div className="mb-4">
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                >
                    Tài khoản
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={employee.username}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Tên nhân viên
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={employee.name}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                >
                    Chức vụ
                </label>
                <input
                    type="text"
                    id="role"
                    name="role"
                    value={getRoleName(employee.role)} // Dùng hàm để chuyển đổi role
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={employee.email}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                >
                    Số điện thoại
                </label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={employee.phone}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled
                />
            </div>
            <div className="flex justify-between">
                <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={() => window.history.back()}
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default DetailEmployee;
