import { apiClient } from '../utils/apiClient';

export interface ServerMember {
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
}

class ServerMembersService {
    async getServerMembers(serverId: number): Promise<ServerMember[]> {
        return await apiClient(`/serverMembers/${serverId}/members`, { 
            method: 'GET' 
        });
    }

    async updateMemberRole(serverId: number, memberId: number, role: string): Promise<ServerMember> {
        return await apiClient(`/serverMembers/${serverId}/members/${memberId}`, { 
            method: 'PUT' 
        }, { role });
    }

    async removeMember(serverId: number, memberId: number): Promise<void> {
        await apiClient(`/serverMembers/${serverId}/members/${memberId}`, { 
            method: 'DELETE' 
        });
    }

    async addMember(serverId: number, userId: number, role: string = 'member'): Promise<ServerMember> {
        return await apiClient(`/serverMembers/${serverId}/members`, { 
            method: 'POST' 
        }, { userId, role });
    }
}

export const serverMembersService = new ServerMembersService(); 