import { apiClient } from '../utils/apiClient';

export interface Invite {
    id: number;
    token: string;
    serverId: number;
    createdBy: number;
    maxUses?: number;
    uses: number;
    expiresAt?: string;
    createdAt: string;
}

export interface CreateInviteResponse {
    invite: Invite;
}

class InviteService {
    async createInvite(serverId: number, options?: { maxUses?: number; expiresAt?: string }): Promise<Invite> {
        const response = await apiClient(`/invite/${serverId}/invite`, { 
            method: 'POST' 
        }, options);
        return response.invite;
    }

    async getInvite(token: string): Promise<Invite> {
        return await apiClient(`/invite/invite/${token}`, { 
            method: 'GET' 
        });
    }

    async acceptInvite(token: string): Promise<void> {
        await apiClient(`/invite/invite/${token}/accept`, { 
            method: 'POST' 
        });
    }

    async deleteInvite(inviteId: number): Promise<void> {
        await apiClient(`/invite/${inviteId}`, { 
            method: 'DELETE' 
        });
    }

    async getServerInvites(serverId: number): Promise<Invite[]> {
        return await apiClient(`/invite/${serverId}/invites`, { 
            method: 'GET' 
        });
    }
}

export const inviteService = new InviteService(); 