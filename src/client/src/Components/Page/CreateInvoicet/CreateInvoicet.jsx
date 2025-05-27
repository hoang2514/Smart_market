import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import unidecode from "unidecode";
import Swal from "sweetalert2";

import apiConfig from "../../../config/apiConfig";

function CreateInvoice() {
    const [items, setItems] = useState([]);
    const [productList, setProductList] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const token = JSON.parse(localStorage.getItem("user"));
    //             const response = await axios.get(
    //                 `${apiConfig.serverURL}/v1/app/products`,
    //                 {
    //                     headers: {
    //                         token: `Bearer ${token.accessToken}`,
    //                     },
    //                 }
    //             );
    //             setProductList(response.data);
    //         } catch (error) {
    //             console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    //         }
    //     };
    //     fetchProducts();
    // }, []);

    const fetchProducts = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("user"));
            const response = await axios.get(
                `${apiConfig.serverURL}/v1/app/products`,
                {
                    headers: {
                        token: `Bearer ${token.accessToken}`,
                    },
                }
            );
            setProductList(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error.message);
        }
    };

    useEffect(() => {
        // Kiểm tra nếu state.reload tồn tại và là true
        if (location.state?.reload) {
            fetchProducts();
        }
    }, [location.state]);

    useEffect(() => {
        // Tải dữ liệu lần đầu khi trang được load
        fetchProducts();
    }, []);

    const handleAddItem = (product) => {
        if (!product || !quantity[product._id] || quantity[product._id] <= 0)
            return;

        const existingItem = items.find(
            (item) => item.product === product.name
        );
        const totalQuantityInCart = existingItem ? existingItem.quantity : 0;
        const requestedQuantity = Number(quantity[product._id]);

        if (totalQuantityInCart + requestedQuantity > product.stock) {
            const availableQuantity = product.stock - totalQuantityInCart;
            setErrorMessage(
                `Số lượng yêu cầu vượt quá số lượng tồn kho! Tồn kho còn lại: ${availableQuantity}`
            );
            setQuantity({ ...quantity, [product._id]: availableQuantity });
            return;
        }

        const discountRate = product.discountRate || 0; // Giả sử discountRate được cung cấp trong product.prices
        const discountedPrice = product.discountedPrice;

        if (existingItem) {
            const updatedItems = items.map((item) =>
                item.product === product.name
                    ? {
                          ...item,
                          quantity: item.quantity + requestedQuantity,
                          total:
                              (item.quantity + requestedQuantity) *
                              discountedPrice,
                      }
                    : item
            );
            setItems(updatedItems);
            setTotal(updatedItems.reduce((sum, item) => sum + item.total, 0));
        } else {
            const newItem = {
                _id: product._id,
                productID: product.productID,
                product: product.name,
                quantity: requestedQuantity,
                price: product.prices.price,
                discountRate,
                discountedPrice,
                total: requestedQuantity * discountedPrice,
            };
            setItems([...items, newItem]);
            setTotal(total + newItem.total);
        }

        setQuantity({ ...quantity, [product._id]: "" });
        setSearchTerm("");
        setIsSearching(false);
        setErrorMessage("");
    };

    const handleQuantityChange = (e, productId) => {
        const value = e.target.value;
        setQuantity({ ...quantity, [productId]: value });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCreateInvoice = () => {
        if (total <= 0) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Giá trị đơn hàng không được bé hơn hoặc bằng 0!",
                confirmButtonText: "OK",
            });
            return;
        }
        navigate("/invoice_preview", {
            state: { items, total, paymentMethod },
        });
    };

    const handleFocus = () => {
        setIsFocused(true); // Khi ô tìm kiếm được focus, danh sách sẽ hiển thị
        setIsSearching(true); // Hiển thị danh sách khi có focus vào ô tìm kiếm
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!isFocused) {
                setIsSearching(false); // Ẩn danh sách khi mất focus mà không tương tác
            }
        }, 200); // Đảm bảo danh sách không bị ẩn ngay lập tức
    };

    // Lọc sản phẩm theo từ khóa (có dấu hoặc không dấu)
    const filteredProducts = searchTerm
        ? productList.filter((product) => {
              const barcode = product.productInfo?.barcode?.toLowerCase() || "";
              const productID = product.productID.toLowerCase();
              const productName = product.name.toLowerCase();
              const search = searchTerm.trim().toLowerCase();
              const productWithoutAccents = unidecode(productName);
              const searchWithoutAccents = unidecode(search);

              // Ưu tiên tìm theo barcode
              if (barcode.includes(search)) {
                  return true;
              }

              // Tiếp tục tìm theo productID
              if (productID.includes(search)) {
                  return true;
              }

              // Cuối cùng, tìm theo name
              if (search !== searchWithoutAccents) {
                  return productName.includes(search);
              } else {
                  return productWithoutAccents.includes(searchWithoutAccents);
              }
          })
        : productList; // Nếu không có từ khóa tìm kiếm, hiển thị tất cả sản phẩm

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-5">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Tạo Hóa Đơn Siêu Thị
                </h1>

                {/* Form nhập tên sản phẩm */}
                <div className="mb-4">
                    <label className="block text-gray-700">
                        Nhập Tên Sản Phẩm:
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange} // Cập nhật giá trị tìm kiếm
                        placeholder="Nhập tên sản phẩm..."
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        onFocus={handleFocus} // Khi focus vào input, hiển thị danh sách sản phẩm
                        onBlur={handleBlur} // Khi mất focus, kiểm tra và ẩn danh sách sau thời gian
                    />
                </div>

                {/* Hiển thị thông báo lỗi nếu có */}
                {errorMessage && (
                    <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                        <strong>Lỗi: </strong>
                        {errorMessage}
                    </div>
                )}

                {/* Hiển thị danh sách sản phẩm khi người dùng tìm kiếm */}
                {isSearching && (
                    <div className="bg-white shadow-lg rounded p-4 mt-2 max-h-64 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="flex items-center justify-between p-2 border border-gray-300 mb-2"
                                >
                                    <div>
                                        <strong>
                                            {product.productID}: {product.name}
                                        </strong>

                                        <p>
                                            Giá:{" "}
                                            <strong>
                                                {product.discountedPrice} VND
                                            </strong>{" "}
                                        </p>
                                        <p>Tồn kho: {product.stock}</p>
                                        <p>
                                            Barcode:{" "}
                                            {product.productInfo.barcode}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={quantity[product._id] || ""} // Giữ lại giá trị số lượng đã nhập
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    e,
                                                    product._id
                                                )
                                            } // Cập nhật số lượng cho sản phẩm cụ thể
                                            placeholder="Số lượng"
                                            className="border border-gray-300 rounded px-3 py-2 w-20"
                                        />
                                        <button
                                            onClick={() =>
                                                handleAddItem(product)
                                            }
                                            className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-700"
                                        >
                                            Thêm vào Hóa Đơn
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">
                                Không có sản phẩm nào khớp với từ khóa tìm kiếm.
                            </p>
                        )}
                    </div>
                )}

                {/* Hiển thị các mặt hàng đã thêm vào hóa đơn */}
                <table className="w-full border border-gray-300 mt-6 table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="px-4 py-2 border">STT</th>
                            <th className="px-4 py-2 border">Mã SP</th>
                            <th className="px-4 py-2 border">Tên Sản Phẩm</th>
                            <th className="px-4 py-2 border">Số Lượng</th>
                            <th className="px-4 py-2 border">Giá ban đầu</th>
                            <th className="px-4 py-2 border">Chiết khấu</th>
                            <th className="px-4 py-2 border">Giá KM</th>
                            <th className="px-4 py-2 border">Thanh tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 border">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-2 border">
                                    {item.productID}
                                </td>
                                <td className="px-4 py-2 border">
                                    {item.product}
                                </td>
                                <td className="px-4 py-2 border">
                                    {item.quantity}
                                </td>
                                <td className="px-4 py-2 border">
                                    {item.price} VND
                                </td>
                                <td className="px-4 py-2 border">
                                    {item.discountRate}
                                </td>
                                <td className="px-4 py-2 border">
                                    {item.discountedPrice} VND
                                </td>
                                <td className="px-4 py-2 border">
                                    {item.total} VND
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Hiển thị tổng tiền */}
                <div className="mt-4 text-right font-bold text-lg">
                    Tổng: {total} VND
                </div>

                {/* Phương thức thanh toán và tạo hóa đơn */}
                <div className="flex justify-between items-center mt-4">
                    <div className="w-1/3 text-left">
                        <button
                            onClick={handleCreateInvoice}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                        >
                            Tạo Hóa Đơn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateInvoice;
