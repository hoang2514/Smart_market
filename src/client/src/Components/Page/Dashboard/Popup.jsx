import React from "react";
import PieChart from "./PieChart";
import RevenueChart from "./RevenueChart";

import { XCircleIcon } from "@heroicons/react/24/outline";

const Popup = ({ isOpen, onClose, data, title, type }) => {
    if (!isOpen) return null;
    console.log(title);

    // Xử lý dữ liệu hiển thị
    const renderData = () => {
        if (!data) return <p>Không có dữ liệu để hiển thị.</p>;

        if (typeof data === "object" && type === "PieChart") {
            return <PieChart data={data} title={title} />;
        }
        if (typeof data === "object" && type === "RevenueChart") {
            return <RevenueChart data={data} title={title} />;
        }
        return (
            <p>
                <strong>Đầu vào có lỗi:</strong>
                <br />
                {JSON.stringify(data)}
            </p>
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-[1200px] relative">
                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                    <XCircleIcon className="h-8 w-8" />
                </button>

                {/* Nội dung */}
                <div>
                    <div className="overflow-y-hidden">{renderData()}</div>
                </div>
            </div>
        </div>
    );
};

export default Popup;
