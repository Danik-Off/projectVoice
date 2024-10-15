import React from 'react';
import { Navigate } from 'react-router-dom';
import { authStore } from './authStore';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // Проверка на аутентификацию
    if (!authStore.isAuthenticated) {
        return <Navigate to="/auth" />;
    }
    return children; // Если пользователь аутентифицирован, возвращаем дочерние элементы
};

export default ProtectedRoute;
