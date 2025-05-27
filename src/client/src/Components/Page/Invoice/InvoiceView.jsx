import React, { useState } from "react";

const InvoiceView = ({ invoice }) => {
    const [showItems, setShowItems] = useState(false);

    if (!invoice) return <p className="text-red-500">Không có dữ liệu.</p>;

    const {
        invoiceID,
        items,
        totalAmount,
        paymentMethod,
        employee,
        createdAt,
    } = invoice;

    const toggleItems = () => {
        setShowItems(!showItems);
    };

    return (
        <div className="border rounded-lg shadow-lg p-6 mb-6">
            <div className="cursor-pointer" onClick={toggleItems}>
                <h2 className="text-xl font-bold mb-2">
                    Mã hoá đơn: {invoiceID}
                </h2>
                <p>
                    <strong>Mã nhân viên:</strong>{" "}
                    {typeof employee === "object" && employee !== null
                        ? employee.username
                        : employee}
                </p>
                <p>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    <strong className="text-green-500">{paymentMethod}</strong>
                </p>
                <p>
                    <strong>Date:</strong>{" "}
                    {new Date(createdAt).toLocaleString()}
                </p>
                <p>
                    <strong className="text-red-500">
                        Tổng: ${totalAmount}
                    </strong>
                </p>
            </div>

            {showItems && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Chi tiết:</h3>
                    <table className="table-auto w-full border-collapse border border-gray-300 mt-2">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Mã SP</th>
                                <th className="border px-4 py-2">Tên SP</th>
                                <th className="border px-4 py-2">Số lượng</th>
                                <th className="border px-4 py-2">Giá</th>
                                <th className="border px-4 py-2">Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr
                                    key={item._id}
                                    className="odd:bg-white even:bg-gray-50"
                                >
                                    <td className="border px-4 py-2">
                                        {item.productID}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {item.product}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {item.quantity}
                                    </td>
                                    <td className="border px-4 py-2">
                                        ${item.price}
                                    </td>
                                    <td className="border px-4 py-2">
                                        ${item.total}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InvoiceView;
