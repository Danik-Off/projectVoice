import { apiClient } from '../utils/apiClient';

export const channelService = {
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
