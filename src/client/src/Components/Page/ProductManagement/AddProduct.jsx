import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import apiConfig from "../../../config/apiConfig";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    productID: "",
    name: "",
    prices: {
      price: "",
      purchasePrice: "",
    },
    productInfo: {
      mfg: "",
      exp: "",
      description: "",
      barcode: "",
    },
    stock: "",
    warningLevel: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const field = name.split(".");

    if (field.length === 2) {
      setProductData((prevData) => ({
        ...prevData,
        [field[0]]: {
          ...prevData[field[0]],
          [field[1]]: value,
        },
      }));
    } else {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("user"));
    if (!token || !token.accessToken) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Bạn cần đăng nhập trước !",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${apiConfig.serverURL}/v1/app/products/add_product`,
        productData,
        {
          headers: {
            token: `Bearer ${token.accessToken}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Thêm sản phẩm thành công!",
        text: "Sản phẩm đã được thêm thành công.",
      });

      setProductData({
        productID: "",
        name: "",
        prices: { price: "", purchasePrice: "" },
        productInfo: { mfg: "", exp: "", description: "", barcode: "" },
        stock: "",
        warningLevel: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Thêm sản phẩm thất bại!",
        text: "Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại sau.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/product_management");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Tạo Sản Phẩm Mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="productID"
            value={productData.productID}
            onChange={handleChange}
            placeholder="Mã sản phẩm"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Tên sản phẩm"
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="prices.price"
            value={productData.prices.price}
            onChange={handleChange}
            placeholder="Giá"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="prices.purchasePrice"
            value={productData.prices.purchasePrice}
            onChange={handleChange}
            placeholder="Giá nhập <nếu có>"
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="date"
            name="productInfo.mfg"
            value={productData.productInfo.mfg}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            name="productInfo.exp"
            value={productData.productInfo.exp}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <textarea
            name="productInfo.description"
            value={productData.productInfo.description}
            onChange={handleChange}
            placeholder="Mô tả <nếu có>"
            className="p-2 border border-gray-300 rounded-md w-full"
          />
          <input
            type="text"
            name="productInfo.barcode"
            value={productData.productInfo.barcode}
            onChange={handleChange}
            placeholder="Barcode <nếu có>"
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            placeholder="Tồn kho"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="warningLevel"
            value={productData.warningLevel}
            onChange={handleChange}
            placeholder="Mức cảnh báo"
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Tạo
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
