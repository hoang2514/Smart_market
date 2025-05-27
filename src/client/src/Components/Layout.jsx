import React from "react";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ content }) => {
    return (
        <div className="flex h-screen">
            <div className="w-1/10">
                <Sidebar />
            </div>
            <div className="flex-grow w-9/10 overflow-y-auto bg-gray-100 p-6">
                {content}
            </div>
        </div>
    );
};

export default Layout;
