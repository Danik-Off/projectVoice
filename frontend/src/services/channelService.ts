import { apiClient } from '../utils/apiClient';

export const channelService = {
    // Создание канала
    create: async (serverId: number, data: any) => {
        const response = await apiClient(`/servers/${serverId}/channels`, {
            method: 'POST',
            body: JSON.stringify(data), // Предполагается, что data - это данные канала
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    },
    // Получение списка каналов по ID сервера
    getByServer: async (serverId: number) => {
        const data = await apiClient(`/servers/${serverId}/channels`, {
            method: 'GET',
        });
        return data;
    },
    // Получение канала по ID
    getById: async (serverId: number, channelId: number) => {
        const data = await apiClient(`/servers/${serverId}/channels/${channelId}`, {
            method: 'GET',
        });
        return data;
    },
    // Обновление информации о канале
    update: async (serverId: number, channelId: number, data: any) => {
        const response = await apiClient(`/servers/${serverId}/channels/${channelId}`, {
            method: 'PUT',
            body: JSON.stringify(data), // Предполагается, что data - это обновленные данные канала
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    },
    // Удаление канала
    delete: async (serverId: number, channelId: number) => {
        const response = await apiClient(`/servers/${serverId}/channels/${channelId}`, {
            method: 'DELETE',
        });
        return response;
    },
};
