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
        } catch (error) {
            console.error('Login failed', error);
        }
    }

   

    logout() {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;

        // Удаление токена из cookie
        setCookie('token', '', -1); // Устанавливаем срок действия в -1, чтобы удалить cookie
    }
}

export const authStore = new AuthStore();
