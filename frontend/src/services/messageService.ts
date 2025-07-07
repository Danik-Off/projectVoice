import { apiClient } from '../utils/apiClient';
import { Message, CreateMessageRequest, UpdateMessageRequest, MessageResponse, MessageFilters } from '../types/message';

class MessageService {
    // Получение сообщений канала с пагинацией
    async getMessages(filters: MessageFilters): Promise<MessageResponse> {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        params.append('channelId', filters.channelId.toString());

        return await apiClient(`/messages?${params.toString()}`, { method: 'GET' });
    }

    // Создание нового сообщения
    async createMessage(data: CreateMessageRequest): Promise<Message> {
        return await apiClient('/messages', { method: 'POST' }, data);
    }

    // Обновление сообщения
    async updateMessage(messageId: number, data: UpdateMessageRequest): Promise<Message> {
        return await apiClient(`/messages/${messageId}`, { method: 'PUT' }, data);
    }

    // Удаление сообщения
    async deleteMessage(messageId: number): Promise<void> {
        await apiClient(`/messages/${messageId}`, { method: 'DELETE' });
    }

    // Получение одного сообщения
    async getMessage(messageId: number): Promise<Message> {
        return await apiClient(`/messages/${messageId}`, { method: 'GET' });
    }

    // Поиск сообщений
    async searchMessages(query: string, channelId: number): Promise<MessageResponse> {
        const params = new URLSearchParams();
        params.append('query', query);
        params.append('channelId', channelId.toString());

        return await apiClient(`/messages/search?${params.toString()}`, { method: 'GET' });
    }
}

export const messageService = new MessageService();
