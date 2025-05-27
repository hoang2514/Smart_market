import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import apiConfig from "../../../config/apiConfig";

const UserList = () => {
    //State lưu nhân viên từ API
    const [employees, setEmployees] = useState([]);
    const [local, setLocal] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("user"));
                setLocal(token);
                const response = await axios.get(
                    `${apiConfig.serverURL}/v1/user`,
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );
                setEmployees(response.data);
            } catch (error) {
                console.error("Có lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchEmployees();
    }, []);

    const handleDelete = async (id, employeeName) => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa nhân viên ${employeeName}?`,
            text: `Bạn sẽ không thể phục hồi lại nhân viên!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa!",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                const token = JSON.parse(localStorage.getItem("user"));
                const response = await axios.delete(
                    `${apiConfig.serverURL}/v1/user/${id}`,
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                if (response.status !== 200) {
                    throw new Error("Lỗi khi xóa nhân viên");
                }

                setEmployees(
                    employees.filter((employee) => employee._id !== id)
                );
                Swal.fire(
                    "Đã xóa!",
                    `Nhân viên ${employeeName} đã được xóa.`,
                    "success"
                );
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
                Swal.fire(
                    "Lỗi",
                    "Không thể xóa nhân viên. Vui lòng thử lại sau.",
                    "error"
                );
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/employee_management/edit/${id}`);
    };
    const handleDetail = (id) => {
        navigate(`/employee_management/detail/${id}`);
    };

    return (
        <div className="container mx-auto mt-8 px-4">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
                Danh sách nhân viên
            </h2>
            <div className="flex justify-end mb-4">
                {local && local.user_datas.role === "admin" && (
                    <button
                        type="button"
                        className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => {
                            navigate("/employee_management/add");
                        }}
                    >
                        Thêm nhân viên
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-4 px-6 text-left border-b w-1/6">
                                ID
                            </th>
                            <th className="py-4 px-6 text-left border-b w-1/3">
                                Tên
                            </th>
                            <th className="py-4 px-6 text-left border-b w-1/3">
                                Chức vụ
                            </th>
                            <th className="py-4 px-6 text-center border-b w-1/6">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr
                                key={employee._id}
                                className={`${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-gray-100 transition-colors`}
                            >
                                <td className="py-4 px-6 text-gray-600 font-medium">
                                    {employee.username}
                                </td>
                                <td className="py-4 px-6 text-gray-600 font-medium">
                                    {employee.name}
                                </td>
                                <td className="py-4 px-6 text-gray-600 font-medium">
                                    {employee.role === "nv_ban_hang"
                                        ? "Nhân viên bán hàng"
                                        : employee.role === "ql_kho"
                                        ? "Nhân viên quản lý kho"
                                        : employee.role === "admin"
                                        ? "Admin"
                                        : "Chức vụ khác"}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex justify-center gap-x-2">
                                        <button
                                            className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-600 transition-colors whitespace-nowrap min-w-[100px]"
                                            onClick={() =>
                                                handleDetail(employee._id)
                                            }
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap min-w-[100px]"
                                            onClick={() =>
                                                handleEdit(employee._id)
                                            }
                                        >
                                            Chỉnh sửa
                                        </button>
                                        <button
                                            className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-600 transition-colors whitespace-nowrap min-w-[100px]"
                                            onClick={() =>
                                                handleDelete(
                                                    employee._id,
                                                    employee.name
                                                )
                                            }
                                        >
                                            Xóa NV
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
