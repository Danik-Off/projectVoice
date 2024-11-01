import { apiClient } from '../utils/apiClient';

export const userService = {
    get: async (id: number | null = null) => {
        const data = await apiClient(`/auth/users/${id}`, {
            method: 'GET',
        });
        return data;
    },
};
