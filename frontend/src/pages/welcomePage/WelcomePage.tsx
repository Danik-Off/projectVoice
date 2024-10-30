// src/components/WelcomePage.tsx
import React from 'react';
import './WelcomePage.css';

const WelcomePage: React.FC = () => {
    const handleGetStarted = () => {
        // Логика для перехода на другую страницу или действия
        console.log('Начать работу нажато');
    };

    return (
        <div className="welcome-page">
            <h1>Добро пожаловать на нашу платформу голосовых каналов!</h1>
            <p>
                Этот проект был создан в ответ на блокировку Discord в России. 
                Наша главная цель — предоставить пользователям возможность общаться через голосовые каналы.
            </p>
            <p>
                Присоединяйтесь к нашему сообществу, делитесь идеями и наслаждайтесь свободой голосового общения. 
                Давайте создавать отличные связи вместе!
            </p>
            <button className="get-started-button" onClick={handleGetStarted}>
                Начать работу
            </button>
        </div>
    );
};

export default WelcomePage;
