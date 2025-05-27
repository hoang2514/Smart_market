import { useState } from "react";
import axios from "axios";

import apiConfig from "../../../config/apiConfig";

const AddEmployee = () => {
    const [newEmployee, setNewEmployee] = useState({
        username: "",
        name: "",
        role: "",
        email: "",
        phone: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        username: false,
        name: false,
        role: false,
        email: false,
        phone: false,
        password: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({ ...prev, [name]: value }));

        // Xóa lỗi khi người dùng nhập dữ liệu
        if (value.trim() !== "") {
            setErrors((prev) => ({ ...prev, [name]: false }));
        }

        // Kiểm tra độ dài mật khẩu
        if (name === "password" && value.length >= 6) {
            setErrors((prev) => ({ ...prev, password: false }));
        }
    };

    const validateInputs = () => {
        const newErrors = {};
        for (const key in newEmployee) {
            if (newEmployee[key].trim() === "") {
                newErrors[key] = true;
            }
        }
        if (newEmployee.password.length < 6) {
            newErrors.password = true;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            alert(
                "Vui lòng điền đầy đủ thông tin và đảm bảo mật khẩu có ít nhất 6 ký tự."
            );
            return;
        }

        try {
            const token = JSON.parse(localStorage.getItem("user"));
            await axios.post(
                `${apiConfig.serverURL}/v1/auth/register`,
                newEmployee,
                {
                    headers: {
                        token: `Bearer ${token.accessToken}`,
                    },
                }
            );
            alert("Thêm nhân viên thành công!");
            window.location.href = "/employee_management";
        } catch (error) {
            alert("Không thể thêm nhân viên.");
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">
                Thêm nhân viên mới
            </h2>
            <form onSubmit={handleSubmit}>
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
                        value={newEmployee.username}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                            Tài khoản không được để trống.
                        </p>
                    )}
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
                        value={newEmployee.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            Tên nhân viên không được để trống.
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Chức vụ
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={newEmployee.role}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Chọn chức vụ</option>
                        <option value="admin">Admin</option>
                        <option value="nv_ban_hang">Nhân viên bán hàng</option>
                        <option value="ql_kho">Quản lý kho</option>
                        <option value="khac">Khác</option>
                    </select>
                    {errors.role && (
                        <p className="text-red-500 text-sm mt-1">
                            Vui lòng chọn chức vụ.
                        </p>
                    )}
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
                        value={newEmployee.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            Email không được để trống.
                        </p>
                    )}
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
                        value={newEmployee.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                            Số điện thoại không được để trống.
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={newEmployee.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            Mật khẩu phải có ít nhất 6 ký tự.
                        </p>
                    )}
                </div>
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md shadow hover:bg-gray-600"
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow hover:bg-blue-600"
                    >
                        Thêm nhân viên
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEmployee;
