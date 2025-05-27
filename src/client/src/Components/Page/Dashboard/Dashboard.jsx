import React, { useState, useEffect } from "react";
import axios from "axios";

import AdminDashboard from "./AdminDashboard";
import QLKDashboard from "./QLKDashboard";
import NVBanHangDashboard from "./NVBanHangDashboard";

import apiConfig from "../../../config/apiConfig";

const Dashboard = () => {
    const [info, setInfo] = useState({});
    const [overviewData, setOverviewData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("user"));
                setInfo(token.user_datas);
                const response = await axios.get(
                    `${apiConfig.serverURL}/v1/app/dashboard`,
                    {
                        headers: {
                            token: `Bearer ${token.accessToken}`,
                        },
                    }
                );
                setOverviewData(response.data);
            } catch (err) {
                setError(
                    "Lỗi khi lấy dữ liệu từ server. Vui lòng thử lại sau."
                );
            }
        };

        fetchData();
    }, []);

    if (error) return <div>{error}</div>;
    if (!overviewData) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="bg-white shadow p-4 rounded-lg mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <h1 className="text-2xl text-blue-600">{info.name} !!!</h1>
            </header>

            {info.role === "admin" && (
                <AdminDashboard overviewData={overviewData} />
            )}
            {info.role === "ql_kho" && (
                <QLKDashboard overviewData={overviewData} />
            )}
            {info.role === "nv_ban_hang" && (
                <NVBanHangDashboard overviewData={overviewData} />
            )}
        </div>
    );
};

export default Dashboard;
