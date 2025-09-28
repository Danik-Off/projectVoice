export interface Message {
    id: number;
    content: string;
    userId: number;
    channelId: number;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: number;
        username: string;
        avatar?: string;
    };
    isEdited?: boolean;
    isDeleted?: boolean;
}

export interface CreateMessageRequest {
    content: string;
    channelId: number;
}

export interface UpdateMessageRequest {
    content: string;
}

export interface MessageResponse {
    messages: Message[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface MessageFilters {
    page?: number;
    limit?: number;
    channelId: number;
} 