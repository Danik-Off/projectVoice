import { apiClient } from '../utils/apiClient';

export const authService = {
    login: async (email: string, password: string) => {
        const data = await apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        return data.token;
    },
    register: async (email: string, username: string, password: string) => {
        const data = await apiClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, username, password }),
        });
        return data;
    },
};
