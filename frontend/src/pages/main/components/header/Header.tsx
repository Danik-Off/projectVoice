import React, { useState, useEffect, useCallback } from 'react';
import './Header.css'; // CSS styles for the Header
import { authStore } from '../../../../store/authStore';
import { Link } from 'react-router-dom';

// eslint-disable-next-line max-lines-per-function
const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const clickLogOut = () => {
        authStore.logout();
    };

    // Close dropdown if clicking outside
    const handleClickOutside = useCallback((event: any) => {
        if (dropdownOpen && !event.target.closest('.dropdown-menu') && !event.target.closest('.profile-icon')) {
            setDropdownOpen(false);
        }
    }, [dropdownOpen]); // Добавьте dropdownOpen как зависимость

    // Attach event listener to handle clicks outside the dropdown
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]); // Используйте handleClickOutside в зависимостях

    return (
        <header className="header">
            <div className="logo">ProjectSocial</div>
            <input type="text" className="header-search-bar" placeholder="Search..." />
            <div className="profile-icon" onClick={toggleDropdown}>
                Profile
            </div>
            {dropdownOpen && (
                <div className="dropdown-menu">
                    <ul>
                        <li>
                            <Link to="/settings">Settings</Link>
                        </li>
                        <li onClick={clickLogOut}>Log Out</li>
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;
