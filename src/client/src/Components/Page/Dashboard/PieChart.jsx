import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const PieChart = ({ data, title }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    const handleDateChange = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const filtered = {};
        for (const date in data) {
            const currentDate = new Date(date);
            if (currentDate >= start && currentDate <= end) {
                filtered[date] = data[date];
            }
        }
        setFilteredData(filtered);
    };

    const calculatePercentages = (data) => {
        const totalAmount = Object.values(data).reduce(
            (acc, curr) => acc + curr.cash + curr.bank,
            0
        );
        const cashAmount = Object.values(data).reduce(
            (acc, curr) => acc + curr.cash,
            0
        );
        const bankAmount = Object.values(data).reduce(
            (acc, curr) => acc + curr.bank,
            0
        );
        const totalInvoices = Object.values(data).reduce(
            (acc, curr) => acc + curr.totalInvoices,
            0
        );

        return {
            cashPercentage: (cashAmount / totalAmount) * 100,
            bankPercentage: (bankAmount / totalAmount) * 100,
            cashAmount,
            bankAmount,
            totalInvoices,
        };
    };

    const {
        cashPercentage,
        bankPercentage,
        cashAmount,
        bankAmount,
        totalInvoices,
    } = calculatePercentages(filteredData);

    const chartData = {
        labels: ["Tiền mặt", "Bank"],
        datasets: [
            {
                data: [cashPercentage, bankPercentage],
                backgroundColor: ["#FF6384", "#36A2EB"],
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label;
                        const value = context.raw;
                        const percentage = value.toFixed(3);
                        if (label === "Tiền mặt") {
                            return `${label}: ${percentage}% (${cashAmount.toLocaleString(
                                "vi-VN"
                            )} VND)`;
                        } else if (label === "Bank") {
                            return `${label}: ${percentage}% (${bankAmount.toLocaleString(
                                "vi-VN"
                            )} VND)`;
                        }
                        return "";
                    },
                },
            },
        },
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>

            <div className="flex justify-between mb-4">
                <div>
                    <label
                        htmlFor="startDate"
                        className="block text-sm font-medium"
                    >
                        Từ ngày
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="endDate"
                        className="block text-sm font-medium"
                    >
                        Đến ngày
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2"
                    />
                </div>
                <button
                    onClick={() => {
                        setStartDate("");
                        setEndDate("");
                        setFilteredData(data);
                    }}
                    className="self-end bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Chọn tất cả ngày
                </button>

                <button
                    onClick={handleDateChange}
                    className="self-end bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    Áp dụng
                </button>
            </div>

            <div className="mb-6 w-80 h-80 mx-auto">
                <Pie data={chartData} options={options} />
            </div>

            <div className="flex space-x-6 mb-4 justify-between mx-auto">
                <div>
                    <h3 className="text-x font-semibold">Tiền mặt:</h3>
                    <h2 className="text-xl">
                        {cashAmount.toLocaleString("vi-VN")} VND
                    </h2>
                </div>
                <div>
                    <h3 className="text-xlfont-semibold">Ngân hàng:</h3>
                    <h2 className="text-xl">
                        {bankAmount.toLocaleString("vi-VN")} VND
                    </h2>
                </div>
                <div>
                    <h3 className="text-x font-semibold">Tổng số hóa đơn:</h3>
                    <h2 className="text-xl">{totalInvoices}</h2>
                </div>
            </div>
        </div>
    );
};

export default PieChart;
