import { makeAutoObservable } from 'mobx';
import { authService } from '../services/authService';
import { getCookie, setCookie } from '../utils/cookie';
import notificationStore from './NotificationStore';

class AuthStore {
    public loading = false;

    public isAuthenticated = false;
    public user: { 
        id: number;
        username: string; 
        email: string;
        role: string;
        isActive: boolean;
        profilePicture?: string;
        status?: string;
        tag?: string;
        createdAt: string;
        blockedAt?: string;
        blockedBy?: string;
        blockReason?: string;
    } | null = null;

    private token: string | null = null;

    public constructor() {
        makeAutoObservable(this);
        // Проверка наличия токена в cookies при инициализации
        this.token = getCookie('token');
        this.isAuthenticated = this.token !== null;
        
        console.log('AuthStore constructor - token:', this.token, 'isAuthenticated:', this.isAuthenticated);
        
        // Загружаем данные пользователя, если есть токен
        if (this.token) {
            this.loadUserData();
        }
    }

    public async login(email: string, password: string, redirect?: string | null): Promise<void> {
        try {
            this.loading = true;
            const data = await authService.login(email, password);
            this.user = data.user;
            this.token = data.token;

            // Сохранение токена в cookie
            setCookie('token', data.token, 7); // Токен будет действителен 7 дней

            this.isAuthenticated = true;
            this.loading = false;
            
            // Перенаправление после успешного входа
            if (redirect) {
                window.location.href = redirect;
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            this.loading = false;
            console.error('Login failed', error);
            throw error; // Пробрасываем ошибку для обработки в компоненте
        }
    }

    public async loadUserData(): Promise<void> {
        try {
            if (!this.token) {
                console.log('No token available for loadUserData');
                return;
            }
            
            console.log('Loading user data with token:', this.token);
            const userData = await authService.getMe();
            console.log('User data loaded:', userData);
            this.user = userData;
            this.isAuthenticated = true;
        } catch (error) {
            console.error('Failed to load user data:', error);
            notificationStore.addNotification('notifications.serverDataLoadError', 'error');
            // Если не удалось загрузить данные пользователя, очищаем токен
            this.logout();
        }
    }

    public async register(username: string, email: string, password: string, redirect?: string | null): Promise<void> {
        try {
            this.loading = true;
            const data = await authService.register( email,username, password);
            
            // После успешной регистрации получаем информацию о пользователе
            const userData = await authService.getMe();
            this.user = userData;
            this.token = data.token;

            // Сохранение токена в cookie
            setCookie('token', data.token, 7); // Токен будет действителен 7 дней

            this.isAuthenticated = true;
            this.loading = false;
            
            // Перенаправление после успешной регистрации
            if (redirect) {
                window.location.href = redirect;
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            this.loading = false;
            console.error('Registration failed', error);
            throw error; // Пробрасываем ошибку для обработки в компоненте
        }
    }

    public getToken(): string | null {
        return this.token;
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
