const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const Invoice = require("../models/Invoice");
const Promotion = require("../models/Promotion");

class DashboardController {
    // Hàm đếm các số cần thiết của diêu thị dành cho ADMIN
    counterAllFunction = async () => {
        const dataOut = {};

        try {
            const [
                productsCount,
                usersCount,
                promotionsCount,
                invoicesCount,
                totalValueResult,
                totalValueResultAsPurchasePrice,
                totalProductsResult,
                totalValueAsDiscountedPrice,
            ] = await Promise.all([
                Product.countDocuments({}),
                User.countDocuments({}),
                Promotion.countDocuments({}),
                Invoice.countDocuments({}),
                Product.aggregate([
                    {
                        $project: {
                            totalValue: {
                                $multiply: ["$prices.price", "$stock"],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalValue: { $sum: "$totalValue" },
                        },
                    },
                ]),
                Product.aggregate([
                    {
                        $project: {
                            totalValueAsPurchasePrice: {
                                $multiply: ["$prices.purchasePrice", "$stock"],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalValueAsPurchasePrice: {
                                $sum: "$totalValueAsPurchasePrice",
                            },
                        },
                    },
                ]),
                Product.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalProducts: { $sum: "$stock" },
                        },
                    },
                ]),
            ]);

            dataOut.productsCount = productsCount;
            dataOut.usersCount = usersCount;
            dataOut.promotionsCount = promotionsCount;
            dataOut.invoicesCount = invoicesCount;
            dataOut.totalValue = totalValueResult[0]?.totalValue || 0;
            dataOut.totalValueAsPurchasePrice =
                totalValueResultAsPurchasePrice[0]?.totalValueAsPurchasePrice ||
                0;
            dataOut.totalProducts = totalProductsResult[0]?.totalProducts || 0;
        } catch (error) {
            console.error("Error in counterAllFunction:", error);
            dataOut.productsCount = "Null";
            dataOut.usersCount = "Null";
            dataOut.promotionsCount = "Null";
            dataOut.invoicesCount = "Null";
            dataOut.totalValue = "Null";
            dataOut.totalValueAsPurchasePrice = "Null";
            dataOut.totalProducts = "Null";
        }

        return dataOut;
    };

    // Hàm tình tổng hoá đơn và doanh thu của Siêu thị
    invoiceAndRevenueFunction = async () => {
        try {
            // Lấy tất cả hóa đơn
            const invoices = await Invoice.find();

            const result = invoices.reduce((acc, invoice) => {
                const date = new Date(invoice.createdAt)
                    .toISOString()
                    .split("T")[0];

                if (!acc[date]) {
                    acc[date] = { totalInvoices: 0, cash: 0, bank: 0 };
                }
                acc[date].totalInvoices += 1;
                const paymentMethod = invoice.paymentMethod;
                if (paymentMethod === "cash") {
                    acc[date].cash += invoice.totalAmount;
                } else if (paymentMethod === "bank") {
                    acc[date].bank += invoice.totalAmount;
                }

                return acc;
            }, {});

            return result;
        } catch (error) {
            throw new Error("Internal server error");
        }
    };

    // Hàm tình tổng hoá đơn và doanh thu của 1 nhân viên nào đó
    myInvoiceAndRevenueByDateFunction = async (userID) => {
        try {
            const invoices = await Invoice.find({ employee: userID });
            const result = invoices.reduce((acc, invoice) => {
                const date = new Date(invoice.createdAt)
                    .toISOString()
                    .split("T")[0];
                if (!acc[date]) {
                    acc[date] = { totalInvoices: 0, cash: 0, bank: 0 };
                }
                acc[date].totalInvoices += 1;

                const paymentMethod = invoice.paymentMethod;
                if (paymentMethod === "cash") {
                    acc[date].cash += invoice.totalAmount;
                } else if (paymentMethod === "bank") {
                    acc[date].bank += invoice.totalAmount;
                }

                return acc;
            }, {});

            const formattedResult = Object.keys(result).reduce((acc, date) => {
                acc[date] = {
                    totalInvoices: result[date].totalInvoices,
                    cash: result[date].cash,
                    bank: result[date].bank,
                };
                return acc;
            }, {});

            return formattedResult;
        } catch (error) {
            throw new Error("Internal server error");
        }
    };

    // Lấy dữ liệu của mọi vị trí chung
    dashboardAnyoneFunction = async (userID) => {
        const dataOut = {};
        try {
            const unreadCount = await Notification.countDocuments({
                seenBy: { $ne: userID },
            });
            dataOut.unreadNotifications = unreadCount;
        } catch (error) {
            dataOut.unreadNotifications = "null";
        }

        try {
            const objectId = new mongoose.Types.ObjectId(userID);
            const invoices = await Invoice.find({
                employee: objectId,
            });
            if (!invoices || invoices.length === 0) {
                dataOut.totalMoneySell = { cash: 0, bank: 0 };
            } else {
                const totalMoneySell = invoices.reduce(
                    (acc, invoice) => {
                        if (invoice.paymentMethod === "cash") {
                            acc.cash += invoice.totalAmount;
                        } else if (invoice.paymentMethod === "bank") {
                            acc.bank += invoice.totalAmount;
                        }
                        return acc;
                    },
                    { cash: 0, bank: 0 }
                );

                dataOut.totalMoneySell = totalMoneySell;
            }
        } catch (error) {
            console.error("Error while fetching invoices:", error);
            dataOut.totalMoneySell = { cash: -1, bank: -1 };
        }

        return dataOut;
    };

    // Lấy dữ liệu cảu vị trí ADMIN
    dashboardAdminFunction = async (userID) => {
        const dataOutAdmin = await this.dashboardAnyoneFunction(userID);
        dataOutAdmin.invoiceAndRevenueByDate =
            await this.invoiceAndRevenueFunction();
        dataOutAdmin.myInvoiceAndRevenueByDate =
            await this.myInvoiceAndRevenueByDateFunction(userID);
        dataOutAdmin.counter = await this.counterAllFunction();
        return dataOutAdmin;
    };

    // Lấy dữ liệu cảu vị trí NV_BH
    dashboardNV_BHFunction = async (userID) => {
        const dataOutNV_BH = await this.dashboardAnyoneFunction(userID);
        dataOutNV_BH.myInvoiceAndRevenueByDate =
            await this.myInvoiceAndRevenueByDateFunction(userID);
        return dataOutNV_BH;
    };

    // Lấy dữ liệu cảu vị trí QL_KHO
    dashboardQL_KHOFunction = async (userID) => {
        const dataOutQL_KHO = await this.dashboardAnyoneFunction(userID);
        dataOutQL_KHO.myInvoiceAndRevenueByDate =
            await this.myInvoiceAndRevenueByDateFunction(userID);
        dataOutQL_KHO.counter = await this.counterAllFunction();
        return dataOutQL_KHO;
    };

    getDashboard = async (req, res) => {
        if (req.user.role === "admin") {
            try {
                const dashboardData = await this.dashboardAdminFunction(
                    req.user.id
                );
                return res.status(200).json(dashboardData);
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                return res
                    .status(500)
                    .json({ message: "Error fetching dashboard data." });
            }
        } else if (req.user.role === "nv_ban_hang") {
            try {
                const dashboardData = await this.dashboardNV_BHFunction(
                    req.user.id
                );
                return res.status(200).json(dashboardData);
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                return res
                    .status(500)
                    .json({ message: "Error fetching dashboard data." });
            }
        } else if (req.user.role === "ql_kho") {
            try {
                const dashboardData = await this.dashboardQL_KHOFunction(
                    req.user.id
                );
                return res.status(200).json(dashboardData);
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                return res
                    .status(500)
                    .json({ message: "Error fetching dashboard data." });
            }
        } else {
            return res.status(403).json({ message: "Access denied." });
        }
    };
}

module.exports = new DashboardController();
