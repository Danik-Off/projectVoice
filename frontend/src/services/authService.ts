import { apiClient } from '../utils/apiClient';

export const authService = {
    login: async (email: string, password: string) => {
        const data = await apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        return data;
    },
    register: async (email: string, username: string, password: string) => {
        const data = await apiClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, username, password }),
        });
        return data;
    },
    getMe: async () => {
        return await apiClient('/auth/me', {
            method: 'GET'
        });
    },
};
