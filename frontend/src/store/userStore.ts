import { makeAutoObservable } from 'mobx';
import { getCookie } from '../utils/cookie';
import { userService } from '../services/userService';
import { User } from '../types/user';

class UserStore {
    isAuthenticated = false;
    currentUser: User | null = null;
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
                    this.currentUser = user; // Сохранение полученного пользователя
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

    async updateProfile(profileData: { username: string; email: string }) {
        try {
            if (this.isAuthenticated && this.token && this.currentUser) {
                const updatedUser = await userService.updateProfile(this.currentUser.id, profileData);
                
                if (updatedUser) {
                    this.currentUser = { ...this.currentUser, ...updatedUser };
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Failed to update profile', error);
            throw error;
        }
    }

    async changePassword(oldPassword: string, newPassword: string) {
        try {
            if (this.isAuthenticated && this.token && this.currentUser) {
                const success = await userService.changePassword(this.currentUser.id, oldPassword, newPassword);
                return success;
            }
            return false;
        } catch (error) {
            console.error('Failed to change password', error);
            throw error;
        }
    }
}

export const userStore = new UserStore();
