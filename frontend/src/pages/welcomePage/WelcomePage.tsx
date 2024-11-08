// src/components/WelcomePage.tsx
import React from 'react';
import './WelcomePage.css';

const WelcomePage: React.FC = () => {
    return (
        <div className="welcome-page">
            <h1>Добро пожаловать на нашу платформу голосовых каналов!</h1>
            <p>
                Этот проект был создан в ответ на блокировку Discord в России. Наша главная цель — предоставить
                пользователям возможность общаться через голосовые каналы.
            </p>
            <p>
                Присоединяйтесь к нашему сообществу, делитесь идеями и наслаждайтесь свободой голосового общения.
                Давайте создавать отличные связи вместе!
            </p>
        </div>
    );
};

export default WelcomePage;
