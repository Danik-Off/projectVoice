import { apiClient } from '../utils/apiClient';

export const messageService = {
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
