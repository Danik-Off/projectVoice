import { makeAutoObservable } from 'mobx';
import { authService } from '../services/authService';
import { getCookie, setCookie } from '../utils/cookie';
import notificationStore from './NotificationStore';

class AuthStore {
    public loading = false;

    public isAuthenticated = false;
    public user: { username: string } | null = null;

    private token: string | null = null;

    public constructor() {
        makeAutoObservable(this);
        // Проверка наличия токена в cookies при инициализации
        this.token = getCookie('token');
        this.isAuthenticated = this.token !== null;
    }

    public async login(username: string, password: string): Promise<void> {
        try {
            this.loading = true;
            const token = await authService.login(username, password);
            this.user = { username };
            this.token = token;

            // Сохранение токена в cookie
            setCookie('token', token, 7); // Токен будет действителен 7 дней

            this.isAuthenticated = true;
            this.loading = false;
            // Перенаправление после успешного входа
            window.location.href = '/'; // Замените '/dashboard' на нужный URL
        } catch (error) {
            this.loading = false;
            if (error instanceof Error) {
                // Обрабатываем как экземпляр Error
                console.error('Login failed', error.message);
                const errorAnswer = JSON.parse(error.message);
                notificationStore.addNotification(errorAnswer.error, 'error');
            } else {
                console.error('Login failed with unknown error', error);
                notificationStore.addNotification('неизвестная ошибка', 'error');
            }
        }
    }

    public async register(username: string, email: string, password: string): Promise<void> {
        try {
            this.loading = true;
            const token = await authService.register(username, email, password);
            this.user = { username };
            this.token = token;

            // Сохранение токена в cookie
            setCookie('token', token, 7); // Токен будет действителен 7 дней

            this.isAuthenticated = true;
            this.loading = false;
            // Перенаправление после успешной регистрации
            window.location.href = '/'; // Замените '/welcome' на нужный URL
        } catch (error) {
            this.loading = false;
            console.error('Registration failed', error);
        }
    }

    public logout(): void {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;

        // Удаление токена из cookie
        setCookie('token', '', -1); // Устанавливаем срок действия в -1, чтобы удалить cookie

        // Перенаправление после выхода
        window.location.href = '/auth'; // Замените '/login' на нужный URL
    }
}

export const authStore = new AuthStore();
