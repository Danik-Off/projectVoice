// Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import packageJson from '../../../../../package.json'; // Adjust the path as necessary
import './Sidebar.css';

const Sidebar = () => {
    const version = packageJson.version; // Get the version from package.json

    return (
        <aside className="sidebar">
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
            <div className="version-info">v: {version}</div> {/* Display the version */}
        </aside>
    );
};

export default Sidebar;
