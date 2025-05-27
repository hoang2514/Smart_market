import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const RevenueChart = ({ data, title }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [viewMode, setViewMode] = useState("day"); // "day", "week", hoặc "month"
    const [filteredData, setFilteredData] = useState(data);

    // Hàm nhóm dữ liệu theo tuần
    const groupByWeek = (data) => {
        const result = {};
        Object.keys(data).forEach((date) => {
            const currentDate = new Date(date);
            const year = currentDate.getFullYear();
            const week = Math.ceil(
                (currentDate.getDate() - currentDate.getDay() + 1) / 7
            );
            const key = `${year}-W${week}`;
            if (!result[key]) {
                result[key] = { cash: 0, bank: 0 };
            }
            result[key].cash += data[date].cash;
            result[key].bank += data[date].bank;
        });
        return result;
    };

    // Hàm nhóm dữ liệu theo tháng
    const groupByMonth = (data) => {
        const result = {};
        Object.keys(data).forEach((date) => {
            const currentDate = new Date(date);
            const key = `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
            ).padStart(2, "0")}`;
            if (!result[key]) {
                result[key] = { cash: 0, bank: 0 };
            }
            result[key].cash += data[date].cash;
            result[key].bank += data[date].bank;
        });
        return result;
    };

    const applyViewMode = (mode) => {
        if (mode === "day") {
            setFilteredData(data);
        } else if (mode === "week") {
            setFilteredData(groupByWeek(data));
        } else if (mode === "month") {
            setFilteredData(groupByMonth(data));
        }
        setViewMode(mode);
    };

    const dates = Object.keys(filteredData);
    const cash = dates.map((date) => filteredData[date].cash / 1000);
    const bank = dates.map((date) => filteredData[date].bank / 1000);

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: "Tiền mặt",
                data: cash,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
                label: "Bank",
                data: bank,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: "Thời gian",
                },
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: "Gái trị (nghìn đồng)",
                },
                beginAtZero: true,
            },
        },
    };

    const calculateData = (data) => {
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
            cashAmount,
            bankAmount,
            totalAmount,
            totalInvoices,
        };
    };

    const { cashAmount, bankAmount, totalAmount, totalInvoices } =
        calculateData(filteredData);

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                {title}
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-2">
                    <label
                        htmlFor="start-date"
                        className="font-medium text-gray-600"
                    >
                        Bắt đầu:
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded px-3 py-2 text-gray-800"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <label
                        htmlFor="end-date"
                        className="font-medium text-gray-600"
                    >
                        Kết thúc:
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded px-3 py-2 text-gray-800"
                    />
                </div>

                {/* Dropdown cho Day, Week, Month */}
                <div className="relative">
                    <select
                        onChange={(e) => applyViewMode(e.target.value)}
                        value={viewMode}
                        className="border rounded px-4 py-2 bg-gray-200 text-gray-800"
                    >
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => {
                            setStartDate("");
                            setEndDate("");
                            setFilteredData(data);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                    >
                        Chọn tất cả ngày
                    </button>
                    <button
                        onClick={() => {
                            const start = new Date(startDate);
                            const end = new Date(endDate);
                            const filtered = Object.keys(data)
                                .filter((date) => {
                                    const current = new Date(date);
                                    return current >= start && current <= end;
                                })
                                .reduce((result, key) => {
                                    result[key] = data[key];
                                    return result;
                                }, {});
                            setFilteredData(filtered);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
            <Bar data={chartData} options={options} />
            <div className="flex space-x-6 mb-4 justify-between mx-auto">
                <div>
                    <h3 className="text-x font-semibold">Tổng:</h3>
                    <h2 className="text-xl">
                        {totalAmount.toLocaleString("vi-VN")} VND
                    </h2>
                </div>
                <div>
                    <h3 className="text-x font-semibold">Tiền mặt:</h3>
                    <h2 className="text-xl">
                        {cashAmount.toLocaleString("vi-VN")} VND
                    </h2>
                </div>
                <div>
                    <h3 className="text-x font-semibold">Ngân hàng:</h3>
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

export default RevenueChart;
