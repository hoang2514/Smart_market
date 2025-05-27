const PayOS = require("@payos/node");
const axios = require("axios");

class PaymentController {
    // Tạo dạng yyyymmddhhmmss
    formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        const h = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const s = String(date.getSeconds()).padStart(2, "0");
        return parseInt(`${y}${m}${d}${h}${min}${s}`, 10);
    };

    createPaymentLink = async (req, res) => {
        const payOS = new PayOS(
            process.env.PAY_OS_CLIENT_ID,
            process.env.PAY_OS_API_KEY,
            process.env.PAY_OS_CHECKSUM_KEY
        );
        // Lấy domain từ request
        const YOUR_DOMAIN = `${req.protocol}://${req.headers.host}`;

        const { amount } = req.body;

        const orderCode = this.formatDate(new Date());

        const body_pay = {
            orderCode: orderCode, // Tạo mã đơn hàng
            amount: amount,
            expiredAt: Math.floor(Date.now() / 1000) + 600,
            description: `DON ${orderCode}`,
            returnUrl: `${YOUR_DOMAIN}?success=true`,
            cancelUrl: `${YOUR_DOMAIN}?canceled=true`,
        };

        try {
            const paymentLinkResponse = await payOS.createPaymentLink(body_pay);
            res.status(200).json({
                paymentLink: paymentLinkResponse.checkoutUrl,
                qrCodeText: paymentLinkResponse.qrCode,
                description: paymentLinkResponse.description,
                amount: paymentLinkResponse.amount,
                currency: paymentLinkResponse.currency,
                bin: paymentLinkResponse.bin,
                accountNumber: paymentLinkResponse.accountNumber,
                orderCode: orderCode,
                returnUrl: body_pay.returnUrl,
                cancelUrl: body_pay.cancelUrl,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Some thing error at payment" });
        }
    };

    checkOrder = async (req, res) => {
        try {
            const { PAY_OS_CLIENT_ID, PAY_OS_API_KEY } = process.env;
            const orderID = req.body.orderID;

            // Gửi yêu cầu
            const response = await axios.get(
                `https://api-merchant.payos.vn/v2/payment-requests/${orderID}`,
                {
                    headers: {
                        "x-client-id": PAY_OS_CLIENT_ID,
                        "x-api-key": PAY_OS_API_KEY,
                    },
                }
            );
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json(error);
        }
    };

    cancelOrder = async (req, res) => {
        try {
            const { PAY_OS_CLIENT_ID, PAY_OS_API_KEY } = process.env;
            const orderID = req.body.orderID;

            const cancellationReason = {
                cancellationReason: "Null",
            };

            // Gửi yêu cầu
            const response = await axios.post(
                `https://api-merchant.payos.vn/v2/payment-requests/${orderID}/cancel`,
                cancellationReason,
                {
                    headers: {
                        "x-client-id": PAY_OS_CLIENT_ID,
                        "x-api-key": PAY_OS_API_KEY,
                    },
                }
            );
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json(error);
        }
    };
}

module.exports = new PaymentController();
