import React from "react";
// Component cho các thẻ Overview
const OverviewCard = ({ color, icon, label, value, onClick }) => {
    return (
        <div
            className={`bg-white p-4 rounded-lg shadow-md flex items-center cursor-pointer`}
            onClick={onClick}
        >
            <div
                className={`p-3 rounded-full bg-${color}-100 text-${color}-500 mr-4`}
            >
                {React.cloneElement(icon, {
                    className: `h-6 w-6 text-${color}-500`,
                })}
            </div>
            <div>
                <h4 className="text-gray-600">{label}</h4>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    );
};

export default OverviewCard;