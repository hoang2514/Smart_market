const Invoice = require("../models/Invoice");

class InvoiceController {
    // Lưu hoá đơn
    saveInvoice = async (req, res) => {
        try {
            const { invoiceID, items, paymentMethod, totalAmount } = req.body;
            if (!invoiceID || !items || !paymentMethod || !totalAmount) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields" });
            }

            const newInvoice = new Invoice({
                employee: req.user.id,
                invoiceID,
                items,
                totalAmount,
                paymentMethod,
            });

            const invoice = await newInvoice.save();

            res.status(200).json(invoice);
        } catch (error) {
            res.status(500).json({ message: "Error saving invoice", error });
        }
    };

    // Lấy toàn bộ hoá đơn
    getAllInvoices = async (req, res) => {
        try {
            const invoices = await Invoice.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "employee",
                        foreignField: "_id",
                        as: "employeeDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$employeeDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        invoiceID: 1,
                        items: 1,
                        totalAmount: 1,
                        paymentMethod: 1,
                        employee: {
                            $ifNull: ["$employeeDetails.username", "$employee"],
                        },
                        createdAt: 1,
                    },
                },
            ]);
            res.status(200).json(invoices);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            res.status(500).json({
                message: "Lỗi máy chủ khi lấy toàn bộ hoá đơn",
            });
        }
    };

    // Lấy toàn bộ hoá đơn của chỉnh tôi
    getAllYourOwnInvoice = async (req, res) => {
        try {
            const me = req.user.id;
            // Tìm tất cả hóa đơn của user hiện tại
            const invoices = await Invoice.find({ employee: me })
                .populate("employee", "username")
                .select(
                    "invoiceID items totalAmount paymentMethod employee createdAt"
                );

            res.status(200).json(invoices);
        } catch (error) {
            res.status(500).json({
                message: "Lỗi máy chủ khi lấy toàn bộ hoá đơn",
            });
        }
    };

    // Lấy hoá đơn của nhân viên
    getAllEmloyeeInvoices = async (req, res) => {
        try {
            const emloyee = req.params.id;
            const invoices = await Invoice.find({ employee: emloyee });
            res.status(200).json(invoices);
        } catch (error) {
            res.status(500).json({
                message: "Lỗi máy chủ khi lấy toàn bộ hoá đơn",
            });
        }
    };

    // Lấy hoá đơn bằng ID
    getInvoiceByInvoiceID = async (req, res) => {
        try {
            const invoiceID = req.params.id;
            const invoices = await Invoice.find({ invoiceID: invoiceID });
            res.status(200).json(invoices);
        } catch (error) {
            res.status(500).json({
                message: "Lỗi máy chủ khi lấy toàn bộ hoá đơn",
            });
        }
    };
}

module.exports = new InvoiceController();
