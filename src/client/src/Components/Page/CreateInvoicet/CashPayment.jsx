import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import saveInvoice from "./saveinvoice";
import sellSomething from "./sell_something";

function CashPayment() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { items, total, paymentMethod } = state || {
        items: [],
        total: 0,
        paymentMethod: "cash",
    };

    const [amountGiven, setAmountGiven] = useState(0); // Tiền khách đưa
    const [change, setChange] = useState(0); // Tiền thừa
    const [checkRefund, setCheckRefund] = useState(false);

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        const h = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const s = String(date.getSeconds()).padStart(2, "0");
        return parseInt(`${y}${m}${d}${h}${min}${s}`, 10);
    };

    const handleCalculateChange = () => {
        if (amountGiven >= total) {
            setChange(amountGiven - total);
            setCheckRefund(true);
        } else {
            alert("Số tiền đưa không đủ để thanh toán!");
        }
    };

    const handleFinish = (amountGiven) => {
        console.log(amountGiven);
        if (amountGiven < total) {
            alert("Khách hàng gửi chưa đủ số tiền");
        } else if (checkRefund === false) {
            alert("Vui tính tiền thừa cho khách trước !");
        } else {
            const orderCode = formatDate(new Date());
            handleSellSomething();
            handleSaveInvoice(orderCode);
            navigate("/create_invoicet", { state: { reload: true } });
            // navigate("/create_invoicet");
            // window.location.reload();
        }
    };

    const handleSaveInvoice = async (orderCode) => {
        try {
            const result = await saveInvoice(
                items,
                orderCode,
                total,
                paymentMethod
            );
            console.log("Kết quả lưu hóa đơn:", result);
        } catch (error) {
            console.error("Không thể lưu hóa đơn:", error);
        }
    };

    const handleSellSomething = async () => {
        try {
            const result = await sellSomething(items);
            console.log(result);
        } catch (error) {
            console.error("lỗi trong sản phẩm", error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-5">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Thanh toán Tiền mặt
                </h1>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Tổng tiền: <strong>{total} VND</strong>
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Phương thức thanh toán: <strong>{paymentMethod}</strong>
                    </label>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">
                        Danh sách sản phẩm:
                    </h2>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">
                                    STT
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Mã SP
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Tên sản phẩm
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Số lượng
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Chiết khấu
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Thanh tiền
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.productID}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.product}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {item.quantity}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {item.discountRate}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-right">
                                        {item.quantity * item.discountedPrice}{" "}
                                        VND
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Nhập số tiền khách hàng đưa:
                    </label>
                    <input
                        type="text"
                        onChange={(e) => setAmountGiven(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Nhập số tiền"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Tiền thừa trả lại:
                    </label>
                    <input
                        type="text"
                        value={change}
                        readOnly
                        className="w-full px-3 py-2 border rounded bg-gray-100"
                    />
                </div>

                <div className="flex justify-between space-x-4">
                    <button
                        onClick={handleCalculateChange}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Tính tiền thừa
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={() => handleFinish(amountGiven)}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Hoàn tất
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CashPayment;
