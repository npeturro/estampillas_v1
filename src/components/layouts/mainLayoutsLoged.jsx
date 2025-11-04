import React from "react";
import TopNav from "./sideNav.jsx";

const MainLayoutLoged = ({ children }) => {
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Barra superior */}
            <TopNav />

            {/* Contenido principal */}
            <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
    );
};

export default MainLayoutLoged;
