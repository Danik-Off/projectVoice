import { Channel } from './channel';

export type ServerMember = {
    id: number;
    userId: number;
    serverId: number;
    role: 'member' | 'moderator' | 'admin' | 'owner';
    user?: {
        id: number;
        username: string;
        profilePicture?: string;
    };
    createdAt: string;
    updatedAt: string;
};

// Define types for the server data
export type Server = {
    id: number;
    name: string;
    ownerId: number;
    description?: string;
    icon?: string;
    channels?: Channel[];
    members?: ServerMember[];
    
    // Состояния сервера
    isBlocked?: boolean;
    blockReason?: string;
    blockedAt?: string;
    blockedBy?: number;
    blockedByUser?: {
        id: number;
        username: string;
    };
    
    // Новые состояния для VoiceVerse дизайна
    hasNotifications?: boolean;
    notificationCount?: number;
    connectionError?: boolean;
    maintenance?: boolean;
    
    // Метаданные сервера
    memberCount?: number;
    onlineCount?: number;
    lastActivity?: string;
    isPrivate?: boolean;
    isVerified?: boolean;
    
    // Настройки сервера
    allowInvites?: boolean;
    requireVerification?: boolean;
    maxMembers?: number;
    
    // Статистика
    messageCount?: number;
    voiceChannelCount?: number;
    textChannelCount?: number;
};
