// ToastNotifications.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';

import './ToastNotifications.css';
import notificationStore from '../../store/NotificationStore';

const ToastNotifications: React.FC = observer(() => {
    return (
        <div className="toast-container">
            {notificationStore.notifications.map((notification) => (
                <div key={notification.id} className={`toast ${notification.type}`}>
                    <span className="toast-message">{notification.message}</span>
                    <button
                        className="toast-close"
                        onClick={() => notificationStore.removeNotification(notification.id)}
                    >
                        ✖️
                    </button>
                </div>
            ))}
        </div>
    );
});

export default ToastNotifications;
