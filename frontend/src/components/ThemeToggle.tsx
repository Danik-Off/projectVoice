import React from 'react';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../store/ThemeStore';
import './ThemeToggle.scss';

const ThemeToggle: React.FC = () => {
    const handleToggle = () => {
        themeStore.toggleTheme();
    };

    return (
        <button 
            className="theme-toggle" 
            onClick={handleToggle}
            title={themeStore.isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
        >
            <div className="theme-toggle-icon">
                {themeStore.isDark ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>
        </button>
    );
};

export default observer(ThemeToggle); 