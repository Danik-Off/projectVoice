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
    isBlocked?: boolean;
    blockReason?: string;
    blockedAt?: string;
    blockedBy?: number;
    blockedByUser?: {
        id: number;
        username: string;
    };
};
