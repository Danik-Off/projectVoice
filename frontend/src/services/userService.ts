import { apiClient } from '../utils/apiClient';

export const userService = {
    get: async (token: string, id: number | null = null) => {
        const data = await apiClient(`/auth/users/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
};
