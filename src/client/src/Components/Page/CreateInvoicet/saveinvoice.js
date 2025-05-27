import axios from "axios";

import apiConfig from "../../../config/apiConfig";

const saveInvoice = async (items, orderCode, total, paymentMethod) => {
    try {
        const invoiceData = {
            invoiceID: orderCode, // Sử dụng orderCode làm invoiceID
            items: items.map((item) => ({
                _id: item._id,
                productID: item.productID,
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
            })),
            paymentMethod: paymentMethod,
            totalAmount: total,
        };

        // Gửi yêu cầu lưu hóa đơn qua API
        const token = JSON.parse(localStorage.getItem("user"));
        const response = await axios.post(
            `${apiConfig.serverURL}/v1/app/invoice/save_invoice`,
            invoiceData,
            {
                headers: {
                    token: `Bearer ${token.accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Lỗi khi lưu hóa đơn:", error);
        throw error; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi hàm
    }
};

export default saveInvoice;
