import React, { useState } from "react";
import { Pagination, Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";

const ShowPopup = ({ products, closePopup }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(5);

    const totalPages = Math.ceil(products.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleProductsPerPageChange = (event) => {
        setProductsPerPage(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
                <h2 className="text-xl font-semibold mb-4">
                    Tất cả sản phẩm áp dụng:
                </h2>
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">STT</th>
                            <th className="px-4 py-2 border-b">Mã SP</th>
                            <th className="px-4 py-2 border-b">Tên sản phẩm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product, index) => (
                            <tr key={product._id} className="border-b">
                                <td className="px-4 py-2">
                                    {index + 1 + indexOfFirstProduct}
                                </td>
                                <td className="px-4 py-2">
                                    <Link to={`/product/${product._id}`}>
                                        {product.productID}
                                    </Link>
                                </td>
                                <td className="px-4 py-2">{product.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between items-center mt-4">
                    <div>
                        <Select
                            value={productsPerPage}
                            onChange={handleProductsPerPageChange}
                            displayEmpty
                            variant="outlined"
                            size="small"
                        >
                            <MenuItem value={5}>5 hàng</MenuItem>
                            <MenuItem value={10}>10 hàng</MenuItem>
                            <MenuItem value={20}>20 hàng</MenuItem>
                        </Select>
                    </div>

                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </div>

                <button
                    onClick={closePopup}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default ShowPopup;
