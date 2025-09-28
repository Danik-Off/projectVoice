import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './styles/main.scss';
import reportWebVitals from './reportWebVitals';
import { router } from './routes/root';
import ToastNotifications from './components/toastNotifications/ToastNotifications';
import { themeStore } from './store/ThemeStore';

import './constants/i18n';

// Инициализируем тему
themeStore.loadTheme();

// Дополнительная проверка инициализации темы
const rootElement = document.documentElement;
if (!rootElement.getAttribute('data-theme')) {
    rootElement.setAttribute('data-theme', themeStore.currentTheme);
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    // <React.StrictMode>
    <>
        <ToastNotifications></ToastNotifications>
        <RouterProvider router={router} />
    </>,
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
