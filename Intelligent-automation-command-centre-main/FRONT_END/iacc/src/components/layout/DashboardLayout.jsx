import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="main-content w-full">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
