import React, { useState, useEffect } from "react";
import axios from "axios";
import InvoiceView from "./InvoiceView";

import apiConfig from "../../../config/apiConfig";

const InvoicePage = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [employeeQuery, setEmployeeQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                setError("");
                const token = JSON.parse(localStorage.getItem("user"));
                if (token.user_datas.role === "admin") {
                    console.log("admin");
                    
                    const response = await axios.get(
                        `${apiConfig.serverURL}/v1/app/invoice`,
                        {
                            headers: {
                                token: `Bearer ${token.accessToken}`,
                            },
                        }
                    );
                    setInvoices(response.data.reverse());
                } else {
                    const response = await axios.get(
                        `${apiConfig.serverURL}/v1/app/invoice/me`,
                        {
                            headers: {
                                token: `Bearer ${token.accessToken}`,
                            },
                        }
                    );
                    setInvoices(response.data.reverse());
                }
            } catch (err) {
                setError(
                    err.response?.data?.message || "Failed to fetch invoices."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const handleFilter = () => {
        let result = invoices;

        if (searchQuery) {
            result = result.filter((invoice) =>
                invoice.invoiceID
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
        }

        if (employeeQuery) {
            result = result.filter((invoice) =>
                invoice.employee
                    .toLowerCase()
                    .includes(employeeQuery.toLowerCase())
            );
        }

        if (startDate) {
            result = result.filter(
                (invoice) => new Date(invoice.createdAt) >= new Date(startDate)
            );
        }

        if (endDate) {
            result = result.filter(
                (invoice) => new Date(invoice.createdAt) <= new Date(endDate)
            );
        }

        setFilteredInvoices(result);
    };

    if (loading) return <p className="text-blue-500">Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Danh sách hóa đơn
            </h1>

            {/* Tìm kiếm và bộ lọc */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Mã hóa đơn."
                        className="border rounded p-2 text-sm w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="username nhân viên"
                        className="border rounded p-2 text-sm w-full"
                        value={employeeQuery}
                        onChange={(e) => setEmployeeQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <input
                        type="date"
                        className="border rounded p-2 text-sm w-1/2"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        className="border rounded p-2 text-sm w-1/2"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
                        onClick={handleFilter}
                    >
                        Lọc
                    </button>
                </div>
            </div>

            {filteredInvoices.length === 0 ? (
                <p className="text-gray-500 text-center">Không thấy hóa đơn.</p>
            ) : (
                filteredInvoices.map((invoice) => (
                    <InvoiceView key={invoice._id} invoice={invoice} />
                ))
            )}
        </div>
    );
};

export default InvoicePage;
