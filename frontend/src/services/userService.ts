import { apiClient } from '../utils/apiClient';

export const userService = {
    get: async (id: number | null = null) => {
        const data = await apiClient(`/auth/users/${id}`, {
            method: 'GET',
        });
        return data;
    },

    updateProfile: async (id: number, profileData: { username: string; email: string }) => {
        const data = await apiClient(`/auth/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
        return data;
    },

    changePassword: async (id: number, oldPassword: string, newPassword: string) => {
        const data = await apiClient(`/auth/users/${id}/password`, {
            method: 'PUT',
            body: JSON.stringify({ oldPassword, newPassword }),
        });
        return data;
    },
};
