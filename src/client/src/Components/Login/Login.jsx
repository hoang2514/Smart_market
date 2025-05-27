import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import apiConfig from "../../config/apiConfig";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State để hiển thị lỗi khi đăng nhập
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post(
        `${apiConfig.serverURL}/v1/auth/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setErrorMessage("Tên đăng nhập hoặc mật khẩu sai !!!");
        } else {
          setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại !!!");
        }
      } else {
        setErrorMessage("Không thể kết nối đến máy chủ !!!");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Phần bên trái hiển thị tên phần mềm */}
      <div className="flex flex-1 bg-blue-500 justify-center items-center">
        <h1 className="text-5xl font-bold">
          <span className="text-purple-300 text-7xl">3D2H</span>{" "}
          <span className="text-white text-4xl">SuperMarket</span>
        </h1>
      </div>

      {/* Phần bên phải là form đăng nhập */}
      <div className="flex flex-1 justify-center items-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-lg w-96"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your username (admin0)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your password (123456@)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <h3>
              Vui lòng chờ khoảng 30s để đăng nhập vì server free nên cần thời
              gian wake up !!
            </h3>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
          <div className="flex py-2 px-6 ">
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
