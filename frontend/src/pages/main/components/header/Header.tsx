import React from 'react';
import './Header.css'; // You can create a separate CSS file for Header styles if needed

const Header = () => {
    return (
        <header className="header">
            <div className="logo">ProjectSocial</div>
            <input type="text" className="header-search-bar" placeholder="Search..." />
            <div className="profile-icon">Profile</div>
        </header>
    );
};

export default Header;
