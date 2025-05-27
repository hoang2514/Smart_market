import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import makeNotificationToSomeone from "../../../Utils/makeNotificationToSomeone";
import apiConfig from "../../../config/apiConfig";

const EditEmployee = () => {
  const { id } = useParams();

  // State để lưu trữ thông tin nhân viên
  const [employee, setEmployee] = useState({
    username: "",
    name: "",
    role: "",
    email: "",
    phone: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState(false);

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
          password: "",
        });
      } catch (error) {
        alert("Không thể tải thông tin nhân viên.");
      }
    };
    fetchEmployee();
  }, [id]);

  // Hàm xử lý thay đổi giá trị form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Kiểm tra mật khẩu có đủ 6 ký tự hay không
    if (name === "password") {
      if (value.length < 6) {
        setPasswordError(true);
      } else {
        setPasswordError(false);
      }
    }
  };

  // Hàm xử lý lưu thông tin
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedEmployee = { ...employee };
    if (!updatedEmployee.password) {
      delete updatedEmployee.password;
    }

    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        `${apiConfig.serverURL}/v1/user/${id}`,
        updatedEmployee,
        {
          headers: {
            token: `Bearer ${token.accessToken}`,
          },
        }
      );
      if (response) {
        makeNotificationToSomeone(
          "Chỉnh sửa thông tin",
          "Đã chỉnh sửa thông tin của bạn thành công",
          "success",
          id
        );
        alert("Cập nhật nhân viên thành công!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật nhân viên.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        Chỉnh sửa nhân viên
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
            value={employee.username}
            onChange={handleChange}
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
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
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
            value={employee.role}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="nv_ban_hang">Nhân viên bán hàng</option>
            <option value="ql_kho">Nhân viên quản lý kho</option>
            <option value="admin">Admin</option>
            <option value="khac">Chức vụ khác</option>
          </select>
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
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Mật khẩu (nếu thay đổi)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={employee.password}
            onChange={handleChange}
            className={`mt-1 block w-full px-4 py-2 border ${
              passwordError ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">
              Mật khẩu phải có ít nhất 6 ký tự
            </p>
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => window.history.back()}
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={passwordError}
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
