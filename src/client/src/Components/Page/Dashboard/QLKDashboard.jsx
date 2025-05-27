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

const QLKDashboard = ({ overviewData }) => {
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
        Thống kê kho
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
          label="Số lượng sản phẩm"
          value={overviewData.counter.totalProducts}
          onClick={() => {
            navigate("/product_management");
          }}
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

      <div>
        <RevenueChart
          data={overviewData.myInvoiceAndRevenueByDate}
          title={"Biểu đồ doanh thu cảu bạn"}
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

export default QLKDashboard;
