import React from "react";
import { dateToString } from "./utils";

const ProductForm = ({ product, isEditing, handleInputChange }) => {
    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            {/* Phần chỉnh sửa sản phẩm */}
            <div className="border-b border-gray-300 pb-6 mb-6">
                {isEditing ? (
                    <>
                        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                            Tên sản phẩm
                        </h1>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleInputChange}
                            className="text-2xl mb-4 w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </>
                ) : (
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                        {product.name}
                    </h1>
                )}
            </div>

            <div className="space-y-4">
                {isEditing ? (
                    <>
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                                Mã sản phẩm:
                            </label>
                            <input
                                type="text"
                                name="productID"
                                value={product.productID}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                                Giá bán:
                            </label>
                            <input
                                type="text"
                                name="price"
                                value={product.prices.price}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                                Mô tả:
                            </label>
                            <textarea
                                // type="textarea"
                                name="description"
                                value={product.productInfo.description}
                                onChange={handleInputChange}
                                rows="4"
                                style={{ maxHeight: "200px" }}
                                className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                                Số lượng còn lại trong kho:
                            </label>
                            <input
                                type="text"
                                name="stock"
                                value={product.stock}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                                Mã vạch trên sản phẩm:
                            </label>
                            <input
                                type="text"
                                name="barcode"
                                value={product.productInfo.barcode}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                                Ngày sản xuất:
                            </label>
                            <input
                                type="date"
                                name="mfg"
                                value={product.productInfo.mfg
                                    .toISOString()
                                    .slice(0, 10)}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                                Hạn sử dụng:
                            </label>
                            <input
                                type="date"
                                name="exp"
                                value={product.productInfo.exp
                                    .toISOString()
                                    .slice(0, 10)}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </>
                ) : (
                    <div className="space-y-4">
                        <p>
                            <strong>Mã sản phẩm:</strong> {product.productID}
                        </p>
                        <p>
                            <strong>Giá bán:</strong> {product.prices.price}
                        </p>
                        <p>
                            <strong>Giá bán sau khuyễn mãi :</strong>{" "}
                            {product.discountedPrice}
                        </p>
                        <p>
                            <strong>Giá nhập:</strong>{" "}
                            {product.prices.purchasePrice}
                        </p>
                        <p>
                            <strong>Mô tả:</strong>{" "}
                            {product.productInfo.description}
                        </p>
                        <p>
                            <strong>Số lượng còn lại trong kho:</strong>{" "}
                            {product.stock}
                        </p>
                        <p>
                            <strong>Mã vạch trên SP:</strong>{" "}
                            {product.productInfo.barcode}
                        </p>
                        <p>
                            <strong>Ngày sản xuất:</strong>{" "}
                            {dateToString(product.productInfo.mfg)}
                        </p>
                        <p>
                            <strong>Hạn sử dụng:</strong>{" "}
                            {dateToString(product.productInfo.exp)}
                        </p>
                        <p>
                            <strong>Ngày nhập hàng:</strong>{" "}
                            {product.purchaseDate}
                        </p>
                        <p>
                            <strong>Số cảnh báo hết hàng:</strong>{" "}
                            {product.warningLevel}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ProductForm;
