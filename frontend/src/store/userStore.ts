import { makeAutoObservable } from 'mobx';
import { getCookie } from '../utils/cookie';
import { userService } from '../services/userService';
import { User } from '../types/user';

class AuthStore {
    isAuthenticated = false;
    user: User | null = null;
    token: string | null = null;

    constructor() {
        makeAutoObservable(this);
        // Проверка наличия токена в cookies при инициализации
        this.token = getCookie('token');
        this.isAuthenticated = this.token !== null;
    }

    async get(id: number | null) {
        try {
            if (this.isAuthenticated && this.token) {
                const user = await userService.get(id);

                if (user) {
                    this.user = user; // Сохранение полученного пользователя
                } else {
                    console.warn('User not found');
                }
            } else {
                console.warn('Not authenticated');
            }
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    }
}

export const authStore = new AuthStore();
