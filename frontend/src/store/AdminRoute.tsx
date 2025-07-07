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
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
                color: 'var(--text-color)',
                fontSize: '1.2rem',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 80%, rgba(114, 137, 218, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(67, 181, 129, 0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }}></div>
                
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid rgba(114, 137, 218, 0.3)',
                    borderTop: '3px solid var(--accent-color)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                
                <div style={{
                    background: 'linear-gradient(135deg, var(--text-color) 0%, var(--accent-color) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '600'
                }}>
                    Проверка прав доступа...
                </div>
                
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return <>{children}</>;
});

export default AdminRoute; 