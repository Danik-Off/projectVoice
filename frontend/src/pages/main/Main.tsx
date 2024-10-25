// Layout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import './Main.css'; // Include your CSS styles here
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';

const Layout = () => {
    return (
        <div className="main-page">
            <Header /> {/* Render Header component */}
            <div className="content">
                <Sidebar /> {/* Render Sidebar component */}
                {/* Outlet for child routes */}
                <main className="feed">
                    <Outlet /> {/* This will render the matched child route */}
                </main>
            </div>
        </div>
    );
};

export default Layout;
