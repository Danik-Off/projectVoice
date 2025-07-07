import { apiClient } from '../utils/apiClient';

export const serverService = {
    // Создание сервера
    create: async (data: any) => {
        const response = await apiClient('/servers', {
            method: 'POST',
            body: JSON.stringify(data), // Assuming data is the server details
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    },
    // Получение списка серверов
    get: async () => {
        const data = await apiClient('/servers', {
            method: 'GET',
        });
        return data;
    },
    // Получение сервера по ID
    getBy: async (id: number) => {
        const data = await apiClient(`/servers/${id}`, {
            method: 'GET',
        });
        return data;
    },
    // Обновление информации о сервере
    update: async (id: number, data: any) => {
        const response = await apiClient(`/servers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data), // Assuming data is the updated server details
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    },
    // Удаление сервера
    delete: async (id: number) => {
        const response = await apiClient(`/servers/${id}`, {
            method: 'DELETE',
        });
        console.log('ServerService delete response:', response);
        return response || { success: true }; // Возвращаем объект успеха если ответ null
    },
};
