import { makeAutoObservable } from 'mobx';
import { authService } from '../services/authService';
import { getCookie, setCookie } from '../utils/cookie';

class AuthStore {
    isAuthenticated = false;
    user: { username: string } | null = null;
    token: string | null = null;

    constructor() {
        makeAutoObservable(this);
        // Проверка наличия токена в cookies при инициализации
        this.token = getCookie('token');
        this.isAuthenticated = this.token !== null;
       
    }

    async login(username: string, password: string) {
        try {
            const token = await authService.login(username, password);
            this.user = { username };
            this.token = token;

            // Сохранение токена в cookie
            setCookie('token', token, 7); // Токен будет действителен 7 дней

            this.isAuthenticated = true;

            // Перенаправление после успешного входа
            window.location.href = '/'; // Замените '/dashboard' на нужный URL
        } catch (error) {
            console.error('Login failed', error);
        }
    }

    async register(username: string, email: string, password: string) {
        try {
            const token = await authService.register(username, email, password);
            this.user = { username };
            this.token = token;

            // Сохранение токена в cookie
            setCookie('token', token, 7); // Токен будет действителен 7 дней

            this.isAuthenticated = true;

            // Перенаправление после успешной регистрации
            window.location.href = '/'; // Замените '/welcome' на нужный URL
        } catch (error) {
            console.error('Registration failed', error);
        }
    }

    logout() {
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
