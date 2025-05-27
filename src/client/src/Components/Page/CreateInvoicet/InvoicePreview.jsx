import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function InvoicePreview() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { items, total } = state || { items: [], total: 0 };

    const handlePaymentMethodChange = (method) => {
        navigate(`/invoice_preview/${method}`, {
            state: { items, total, paymentMethod: method },
        });
    };
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-5">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Thông tin hóa đơn
                </h1>

                <table className="w-full border border-gray-300 mt-6 table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="px-4 py-2 border">STT</th>
                            <th className="px-4 py-2 border">Mã SP</th>
                            <th className="px-4 py-2 border">Tên Sản Phẩm</th>
                            <th className="px-4 py-2 border">Số Lượng</th>
                            <th className="px-4 py-2 border">Giá gốc</th>
                            <th className="px-4 py-2 border">Chiết khấu</th>
                            <th className="px-4 py-2 border">Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">
                                    {index + 1}
                                </td>
                                <td className="border px-4 py-2">
                                    {item.productID}
                                </td>
                                <td className="border px-4 py-2">
                                    {item.product}
                                </td>
                                <td className="border px-4 py-2">
                                    {item.quantity}
                                </td>
                                <td className="border px-4 py-2">
                                    {item.price}
                                </td>
                                <td className="border px-4 py-2">
                                    {item.discountRate}
                                </td>
                                <td className="border px-4 py-2">
                                    {item.total}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-right mt-4 text-lg">
                    <strong>Tổng Tiền: {total} VND</strong>
                </div>

                <div className="flex justify-between mt-4 space-x-4">
                    <button
                        onClick={() => handleBack()}
                        className="w-1/2 px-4 py-2 rounded bg-red-500 text-white"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={() => handlePaymentMethodChange("cash")}
                        className="w-1/2 px-4 py-2 rounded bg-blue-500 text-white"
                    >
                        Thanh toán Tiền mặt
                    </button>
                    <button
                        onClick={() => handlePaymentMethodChange("bank")}
                        className="w-1/2 px-4 py-2 rounded bg-gray-300"
                    >
                        Thanh toán Chuyển khoản
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvoicePreview;
