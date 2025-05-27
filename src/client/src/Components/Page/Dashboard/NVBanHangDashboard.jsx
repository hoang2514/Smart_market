import React, { useState } from "react";
import OverviewCard from "./OverviewCard";
import Popup from "./Popup";
import {
    BellIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { calculateTotalCashAndBank, calculateTotalMyInvoices } from "./utils";
import RevenueChart from "./RevenueChart";

const NVBanHangDashboard = ({ overviewData }) => {
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
                Thống kê của bạn
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
                    color="red"
                    icon={<UsersIcon />}
                    label="Tổng tiền bán ra"
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
                            title: "Biểu đồ doanh thu của siêu thị",
                            type: "PieChart",
                        })
                    }
                />
                <OverviewCard
                    color="blue"
                    icon={<UsersIcon />}
                    label="Số hoá đơn của bạn"
                    value={calculateTotalMyInvoices(
                        overviewData.myInvoiceAndRevenueByDate
                    )}
                />
            </div>

            <div>
                <RevenueChart
                    data={overviewData?.myInvoiceAndRevenueByDate}
                    title={"Biểu đồ doanh thu cửa hàng"}
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

export default NVBanHangDashboard;
