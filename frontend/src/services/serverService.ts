import { apiClient } from '../utils/apiClient';

export const serverService = {
    //создание сервера
    create: async (token: string, id: number | null = null) => {
        const data = await apiClient(`/servers${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
    //получение списка серверов
    get: async (token: string, id: number | null = null) => {
        const data = await apiClient(`/servers${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
    //получение сервера по id
    getBy: async (token: string, id: number | null = null) => {
        const data = await apiClient(`/servers${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
    //обновление информации о сервере
    update: async (token: string, id: number | null = null) => {
        const data = await apiClient(`/servers${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
};
