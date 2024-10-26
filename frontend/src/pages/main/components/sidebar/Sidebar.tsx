import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

// eslint-disable-next-line max-lines-per-function
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true); // Initially, sidebar is open
    const sidebarRef = useRef(null);
    const startX = useRef(0); // Track starting position for swipe detection

    // const toggleSidebar = () => {
    //     setIsOpen(!isOpen);
    // };

    const handleTouchStart = (e: any) => {
        startX.current = e.touches[0].clientX; // Get starting touch position
    };

    const handleTouchMove = (e: any) => {
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX.current; // Calculate the difference
        if (isOpen && diffX < -50) {
            setIsOpen(false); // Swipe left to close
        } else if (!isOpen && diffX > 50) {
            setIsOpen(true); // Swipe right to open
        }
    };

    return (
        <>
            <aside
                className={`sidebar ${isOpen ? 'open' : 'closed'}`}
                ref={sidebarRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
            >
                <nav className="nav-menu">
                    <ul>
                        <li>
                            <Link to="/feed">Feed</Link>
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li>
                            <Link to="/message">Messages</Link>
                        </li>
                        <li>
                            <Link to="/settings">Settings</Link>
                        </li>
                    </ul>
                </nav>
                <div className="version-info">v: 1.0.0</div>
            </aside>
        </>
    );
};

export default Sidebar;
