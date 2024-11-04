// NotificationStore.ts
import { makeAutoObservable } from 'mobx';

interface Notification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
    duration?: number; // duration in milliseconds, optional
}

class NotificationStore {
    notifications: Notification[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    addNotification(message: string, type: 'info' | 'success' | 'error' | 'warning', duration: number = 5000) {
        const id = Math.random().toString(36).substr(2, 9); // simple ID generator
        const notification: Notification = { id, message, type, duration };
        this.notifications.push(notification);

        // Automatically remove the notification after the specified duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(id);
            }, duration);
        }
    }

    removeNotification(id: string) {
        this.notifications = this.notifications.filter((notification) => notification.id !== id);
    }

    clearNotifications() {
        this.notifications = [];
    }
}

export const notificationStore = new NotificationStore();
export default notificationStore;
