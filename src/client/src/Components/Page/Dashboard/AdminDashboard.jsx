import React, { useState } from "react";
import OverviewCard from "./OverviewCard";
import Popup from "./Popup";
import {
    BellIcon,
    CurrencyDollarIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { calculateTotalCashAndBank, calculateTotalMyInvoices } from "./utils";
import RevenueChart from "./RevenueChart";

const AdminDashboard = ({ overviewData }) => {
    const [activePopup, setActivePopup] = useState({
        isActive: false,
        data: null,
        title: "",
        type: "",
    });
    const navigate = useNavigate();

    const handlePopupOpen = (popupData) => {
        setActivePopup({
            isActive: true,
            data: popupData.data,
            title: popupData.title,
            type: popupData.type,
        });
    };

    const handlePopupClose = () => {
        setActivePopup({
            isActive: false,
            data: null,
            title: "",
            type: "",
        });
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Thống kê cửa hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <OverviewCard
                    color="yellow"
                    icon={<BellIcon />}
                    label="Thông báo mới"
                    value={overviewData.unreadNotifications}
                    onClick={() => {
                        navigate("/notification");
                    }}
                />
                <OverviewCard
                    color="green"
                    icon={<CurrencyDollarIcon />}
                    label="Giá trị tồn kho"
                    value={
                        overviewData?.counter?.totalValueAsPurchasePrice
                            ? `${overviewData.counter.totalValueAsPurchasePrice.toLocaleString(
                                  "vi-VN"
                              )} VND`
                            : "Dữ liệu không sẵn sàng"
                    }
                    onClick={() => {
                        navigate("/product_management");
                    }}
                />

                <OverviewCard
                    color="red"
                    icon={<UsersIcon />}
                    label="Tổng tiền bán ra"
                    value={
                        overviewData?.invoiceAndRevenueByDate
                            ? `${calculateTotalCashAndBank(
                                  overviewData.invoiceAndRevenueByDate
                              ).total.toLocaleString("vi-VN")} VND`
                            : "Dữ liệu không sẵn sàng"
                    }
                    onClick={() =>
                        handlePopupOpen({
                            data: overviewData.invoiceAndRevenueByDate,
                            title: "Biểu đồ doanh thu của siêu thị",
                            type: "PieChart",
                        })
                    }
                />
                <OverviewCard
                    color="blue"
                    icon={<UsersIcon />}
                    label="Số loại sản phẩm"
                    value={overviewData.counter.productsCount}
                    onClick={() => {
                        navigate("/product_management");
                    }}
                />

                <OverviewCard
                    color="blue"
                    icon={<UsersIcon />}
                    label="Số nhân viên"
                    value={overviewData.counter.usersCount}
                    onClick={() => {
                        navigate("/employee_management");
                    }}
                />
                <OverviewCard
                    color="blue"
                    icon={<UsersIcon />}
                    label="Số hoá đơn"
                    value={overviewData.counter.invoicesCount}
                    onClick={() => {
                        navigate("/invoice_history");
                    }}
                />
                <OverviewCard
                    color="blue"
                    icon={<UsersIcon />}
                    label="Số khuyến mãi đang chạy"
                    value={overviewData.counter.promotionsCount}
                    onClick={() => {
                        navigate("/promotion");
                    }}
                />
            </div>

            <div>
                <RevenueChart
                    data={overviewData?.invoiceAndRevenueByDate}
                    title={"Biểu đồ doanh thu cửa hàng"}
                />
            </div>
            <br />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Thống kê của tôi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <OverviewCard
                    color="red"
                    icon={<BellIcon />}
                    label="Số hoá đơn của tôi"
                    value={calculateTotalMyInvoices(
                        overviewData.myInvoiceAndRevenueByDate
                    )}
                />
                <OverviewCard
                    color="red"
                    icon={<UsersIcon />}
                    label="Tổng tiền hoá đơn của tôi"
                    value={
                        overviewData?.myInvoiceAndRevenueByDate
                            ? `${calculateTotalCashAndBank(
                                  overviewData.myInvoiceAndRevenueByDate
                              ).total.toLocaleString("vi-VN")} VND`
                            : "Dữ liệu không sẵn sàng"
                    }
                    onClick={() =>
                        handlePopupOpen({
                            data: overviewData.myInvoiceAndRevenueByDate,
                            title: "Số tiền bạn đã bán",
                            type: "RevenueChart",
                        })
                    }
                />
                <OverviewCard
                    color="red"
                    icon={<UsersIcon />}
                    label="Biểu đồ Pie"
                    value={"..."}
                    onClick={() =>
                        handlePopupOpen({
                            data: overviewData.myInvoiceAndRevenueByDate,
                            title: "Số tiền bạn đã bán",
                            type: "PieChart",
                        })
                    }
                />
            </div>

            <Popup
                isOpen={activePopup.isActive}
                data={activePopup.data}
                title={activePopup.title}
                type={activePopup.type}
                onClose={handlePopupClose}
            />
        </>
    );
};

export default AdminDashboard;
