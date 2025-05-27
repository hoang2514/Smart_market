import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import apiConfig from "../../../config/apiConfig";

//hàm xoá dấu tiếng việt
const removeDiacritics = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
};

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [query, setQuery] = useState("");

    // Các trạng thái sắp xếp
    const [sortOrder, setSortOrder] = useState(null);
    const [priceSortOrder, setPriceSortOrder] = useState(null);
    const [stockSortOrder, setStockSortOrder] = useState(null);
    const [discountSortOrder, setDiscountSortOrder] = useState(null);
    const [discountedPriceSortOrder, setDiscountedPriceSortOrder] =
        useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("user"));
                const response = await axios.get(
                    `${apiConfig.serverURL}/v1/app/products/`,
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                setProducts(response.data);
                setInitialData(response.data);
            } catch (error) {
                console.error("Có lỗi khi lấy dữ liệu:", error);
            }
        };
        fetchProduct();
    }, []);

    useEffect(() => {
        const filterProducts = () => {
            if (query.length >= 3) {
                const normalizedKeyword = removeDiacritics(query);
                const filteredProducts = initialData.filter((product) => {
                    const normalizedProductID = removeDiacritics(
                        product.productID
                    );
                    const normalizedProductName = removeDiacritics(
                        product.name
                    );

                    return (
                        normalizedProductID.includes(normalizedKeyword) ||
                        normalizedProductName.includes(normalizedKeyword)
                    );
                });
                setProducts(filteredProducts);
            } else {
                setProducts(initialData);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            filterProducts();
        }, 200);

        return () => clearTimeout(delayDebounceFn);
    }, [query, initialData]);

    // Hàm sắp xếp sản phẩm theo tên
    const sortProducts = () => {
        const sortedProducts = [...products].sort((a, b) => {
            const nameA = removeDiacritics(a.name).toLowerCase();
            const nameB = removeDiacritics(b.name).toLowerCase();

            if (sortOrder === "asc") {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });

        setProducts(sortedProducts);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    // Hàm sắp xếp sản phẩm theo giá bán
    const sortByPrice = () => {
        const sortedProducts = [...products].sort((a, b) => {
            if (priceSortOrder === "asc") {
                return a.prices.price - b.prices.price;
            } else {
                return b.prices.price - a.prices.price;
            }
        });

        setProducts(sortedProducts);
        setPriceSortOrder(priceSortOrder === "asc" ? "desc" : "asc");
    };

    // Hàm sắp xếp sản phẩm theo số lượng còn lại
    const sortByStock = () => {
        const sortedProducts = [...products].sort((a, b) => {
            if (stockSortOrder === "asc") {
                return a.stock - b.stock;
            } else {
                return b.stock - a.stock;
            }
        });

        setProducts(sortedProducts);
        setStockSortOrder(stockSortOrder === "asc" ? "desc" : "asc");
    };
    // Hàm sắp xếp sản phẩm theo chiết khấu
    const sortByDiscount = () => {
        const sortedProducts = [...products].sort((a, b) => {
            const discountA = parseFloat(a.discountRate.replace("%", ""));
            const discountB = parseFloat(b.discountRate.replace("%", ""));

            if (discountSortOrder === "asc") {
                return discountA - discountB;
            } else {
                return discountB - discountA;
            }
        });

        setProducts(sortedProducts);
        setDiscountSortOrder(discountSortOrder === "asc" ? "desc" : "asc");
    };

    // Hàm sắp xếp sản phẩm theo giá sau khuyến mãi
    const sortByDiscountedPrice = () => {
        const sortedProducts = [...products].sort((a, b) => {
            const priceA = parseFloat(a.discountedPrice);
            const priceB = parseFloat(b.discountedPrice);

            if (discountedPriceSortOrder === "asc") {
                return priceA - priceB;
            } else {
                return priceB - priceA;
            }
        });

        setProducts(sortedProducts);
        setDiscountedPriceSortOrder(
            discountedPriceSortOrder === "asc" ? "desc" : "asc"
        );
    };

    return (
        <div className="p-4">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate("/product_management/add_product")}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                    Thêm sản phẩm
                </button>
            </div>
            <div className="flex items-center p-4 bg-gray-200">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    onChange={(e) => setQuery(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full text-sm"
                />
            </div>

            <table className="w-full text-left mt-4 border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        {[
                            "Số thứ tự",
                            "Mã sản phẩm",
                            "Tên sản phẩm",
                            "Giá",
                            "Mô tả",
                            "Số lượng còn lại",
                            "Chiết khấu",
                            "Giá sau chiết khấu",
                        ].map((header) => (
                            <th
                                key={header}
                                className="p-2 border-b border-gray-300 text-sm"
                            >
                                {header === "Tên sản phẩm" ? (
                                    <span
                                        className="cursor-pointer"
                                        onClick={sortProducts}
                                    >
                                        Tên sản phẩm{" "}
                                        {sortOrder === "asc"
                                            ? "↑"
                                            : sortOrder === "desc"
                                            ? "↓"
                                            : ""}
                                    </span>
                                ) : header === "Giá" ? (
                                    <span
                                        className="cursor-pointer"
                                        onClick={sortByPrice}
                                    >
                                        Giá{" "}
                                        {priceSortOrder === "asc"
                                            ? "↑"
                                            : priceSortOrder === "desc"
                                            ? "↓"
                                            : ""}
                                    </span>
                                ) : header === "Giá sau chiết khấu" ? (
                                    <span
                                        className="cursor-pointer"
                                        onClick={sortByDiscountedPrice}
                                    >
                                        Giá sau chiết khấu{" "}
                                        {discountedPriceSortOrder === "asc"
                                            ? "↑"
                                            : discountedPriceSortOrder ===
                                              "desc"
                                            ? "↓"
                                            : ""}
                                    </span>
                                ) : header === "Chiết khấu" ? (
                                    <span
                                        className="cursor-pointer"
                                        onClick={sortByDiscount}
                                    >
                                        Chiết khấu{" "}
                                        {discountSortOrder === "asc"
                                            ? "↑"
                                            : discountSortOrder === "desc"
                                            ? "↓"
                                            : ""}
                                    </span>
                                ) : header === "Số lượng còn lại" ? (
                                    <span
                                        className="cursor-pointer"
                                        onClick={sortByStock}
                                    >
                                        Số lượng còn lại{" "}
                                        {stockSortOrder === "asc"
                                            ? "↑"
                                            : stockSortOrder === "desc"
                                            ? "↓"
                                            : ""}
                                    </span>
                                ) : (
                                    header
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {products.map((product, index) => (
                        <tr
                            key={product._id}
                            onClick={() => navigate(`/product/${product._id}`)}
                            className={
                                product.stock < product.warningLevel
                                    ? "bg-yellow-300"
                                    : ""
                            }
                        >
                            <td className="p-2 border-b border-gray-300 text-sm">
                                {index + 1}
                            </td>
                            <td className="p-2 border-b border-gray-300 text-sm">
                                {product.productID}
                            </td>
                            <td className="p-2 border-b border-gray-300 text-sm">
                                {product.name}
                            </td>
                            <td className="p-2 border-b border-gray-300 text-sm">
                                {product.prices.price}
                            </td>

                            <td className="p-2 border-b border-gray-300 text-sm">
                                {product.productInfo.description.length > 50
                                    ? `${product.productInfo.description.substring(
                                          0,
                                          50
                                      )}...`
                                    : product.productInfo.description}
                            </td>
                            <td className="p-2 border-b border-gray-300 text-sm">
                                {product.stock}
                            </td>
                            <td className="p-2 border-b border-gray-300 text-sm">
                                {product.discountRate}
                            </td>
                            <td className="p-2 border-b border-gray-300 text-sm">
                                {product.discountedPrice}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagement;
