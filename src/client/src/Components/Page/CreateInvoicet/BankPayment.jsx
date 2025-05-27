import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import QRCode from "react-qr-code";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import saveInvoice from "./saveinvoice";
import sellSomething from "./sell_something";

import apiConfig from "../../../config/apiConfig";

function BankPayment() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { items, total, paymentMethod } = state || {
        items: [],
        total: 0,
        paymentMethod: "bank",
    };

    const [qrText, setQrText] = useState("");
    const [orderCode, setOrderCode] = useState();
    const [orderStatus, setOrderStatus] = useState("PENDING");
    const orderCheckIntervalRef = useRef(null);

    const previousOrderStatus = useRef(orderStatus); // Sử dụng useRef để lưu trạng thái trước đó

    useEffect(() => {
        previousOrderStatus.current = orderStatus; // Cập nhật trạng thái trước khi render lại
    }, [orderStatus]);

    const fetchAPIQRCode = async () => {
        if (total <= 0) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Giá trị đơn hàng không được bé hơn hoặc bằng 0!",
                confirmButtonText: "OK",
            });
            navigate(-1);
            return;
        }

        try {
            const token = JSON.parse(localStorage.getItem("user"));
            const response = await axios.post(
                `${apiConfig.serverURL}/v1/app/payment/create-payment-link`,
                { amount: total },
                {
                    headers: { token: `Bearer ${token.accessToken}` },
                }
            );

            const payment = response.data;

            setQrText(payment.qrCodeText);
            setOrderCode(payment.orderCode);
        } catch (error) {
            console.error("Lỗi khi gọi API payment:", error);
        }
    };

    const checkOrderStatus = async (orderID) => {
        try {
            const token = JSON.parse(localStorage.getItem("user"));
            const response = await axios.post(
                `${apiConfig.serverURL}/v1/app/payment/check-order`,
                { orderID },
                {
                    headers: { token: `Bearer ${token.accessToken}` },
                }
            );

            const data = response.data;
            setOrderStatus(data.data.status);

            // Kiểm tra trạng thái trước đó để đảm bảo chỉ gọi 1 lần
            if (
                data.data.status === "PAID" &&
                previousOrderStatus.current !== "PAID"
            ) {
                clearInterval(orderCheckIntervalRef.current);

                // Bán và Lưu hoá đơn
                handleSellSomething();
                handleSaveInvoice();

                Swal.fire({
                    icon: "success",
                    title: "Thanh toán thành công!",
                    html: "Quay lại trang tạo hóa đơn sau <b>3</b> giây...",
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const b = Swal.getHtmlContainer().querySelector("b");
                        let countdown = 3;
                        const timerInterval = setInterval(() => {
                            b.textContent = countdown--;
                        }, 1000);
                        setTimeout(() => clearInterval(timerInterval), 3000);
                    },
                }).then(() => {
                    navigate("/create_invoicet", { state: { reload: true } });
                    // navigate("/create_invoicet");
                    // window.location.reload();
                });
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái:", error);
        }
    };

    const cancelQRCode = async () => {
        if (orderCheckIntervalRef.current) {
            clearInterval(orderCheckIntervalRef.current);
            orderCheckIntervalRef.current = null;
        }
        setQrText("");
        setOrderStatus("CANCEL");

        try {
            const token = JSON.parse(localStorage.getItem("user"));
            const response = await axios.post(
                `${apiConfig.serverURL}/v1/app/payment/cancel-order`,
                { orderID: orderCode },
                {
                    headers: { token: `Bearer ${token.accessToken}` },
                }
            );
            if (response.data.code === "00") {
                Swal.fire({
                    icon: "warning",
                    title: "Đã hủy mã QRCode",
                    text: "Bạn có thể chọn phương thức thanh toán khác.",
                    confirmButtonText: "OK",
                });
                navigate(-1);
            }
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
        }
    };

    const handleSaveInvoice = async () => {
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

    const startCheckingOrderStatus = (orderID) => {
        orderCheckIntervalRef.current = setInterval(() => {
            checkOrderStatus(orderID);
        }, 1000);
    };

    useEffect(() => {
        fetchAPIQRCode();
    }, [fetchAPIQRCode]);

    useEffect(() => {
        if (orderCode) {
            startCheckingOrderStatus(orderCode);
        }
        return () => {
            if (orderCheckIntervalRef.current) {
                clearInterval(orderCheckIntervalRef.current);
            }
        };
    }, [orderCode, startCheckingOrderStatus]);

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-5">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Thanh toán Chuyển khoản Ngân hàng
                </h1>
                {qrText ? (
                    <>
                        <div className="flex justify-center mt-6">
                            <QRCode value={qrText} />
                        </div>
                        <p className="text-center mt-4">
                            Quét mã QR bằng ứng dụng ngân hàng để thanh toán.
                        </p>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={cancelQRCode}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Hủy QRCode
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center">Đang tạo mã QR...</p>
                )}
                <div className="text-center mt-4">
                    Trạng thái đơn hàng:{" "}
                    <strong>
                        {orderStatus === "PENDING"
                            ? "Chưa thanh toán"
                            : orderStatus === "PAID"
                            ? "Đã thanh toán"
                            : "Đã hủy"}
                    </strong>
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
            </div>
        </div>
    );
}

export default BankPayment;
