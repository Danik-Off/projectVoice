import { API_URL } from '../configs/apiConfig';
import { authStore } from '../store/authStore';
import { getCookie } from './cookie';

export const apiClient = async (
    endpoint: string,
    options: RequestInit = {},
    body?: any
) => {
    const token = getCookie('token');

    // Установка заголовков
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    // Создание объекта запроса
    const requestOptions: RequestInit = {
        ...options,
        headers,
    };

    // Если тело запроса передано, сериализуем его в JSON
    if (body) {
        requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, requestOptions);

    if (!response.ok) {
        const errorMessage = await response.text();

        if (errorMessage === '{"error":"Недействительный токен."}') {
            authStore.logout();
        }
        throw new Error(errorMessage);
    }

    // Для ответов с кодом 204 (No Content) не пытаемся парсить JSON
    if (response.status === 204) {
        return null;
    }

    return response.json();
};
