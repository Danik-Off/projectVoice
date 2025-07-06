import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { authStore } from './authStore';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = observer(({ children }) => {
    useEffect(() => {
        // Проверяем, что пользователь аутентифицирован и является администратором
        if (!authStore.isAuthenticated) {
            window.location.href = '/auth';
            return;
        }

        if (authStore.user?.role !== 'admin') {
            window.location.href = '/';
            return;
        }
    }, []);

    // Показываем загрузку, пока проверяем права
    if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '1.2rem'
            }}>
                Проверка прав доступа...
            </div>
        );
    }

    return <>{children}</>;
});

export default AdminRoute; 