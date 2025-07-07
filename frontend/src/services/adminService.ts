import { apiClient } from '../utils/apiClient';

export interface AdminStats {
    users: {
        total: number;
        active: number;
        blocked: number;
        byRole: {
            admin: number;
            moderator: number;
            user: number;
        };
    };
    servers: {
        total: number;
        active: number;
        blocked: number;
        withChannels: number;
    };
    channels: {
        total: number;
        text: number;
        voice: number;
    };
    messages: {
        total: number;
        today: number;
    };
}

export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
}

export interface ServerFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'moderator' | 'admin';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    serverMembers?: any[];
}

export interface Server {
    id: number;
    name: string;
    description?: string;
    ownerId: number;
    isBlocked: boolean;
    blockReason?: string;
    blockedAt?: string;
    blockedBy?: number;
    createdAt: string;
    updatedAt: string;
    owner?: {
        id: number;
        username: string;
        email: string;
    };
    blockedByUser?: {
        id: number;
        username: string;
    };
    channels?: any[];
}

export interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ServersResponse {
    servers: Server[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface LogsResponse {
    system: string;
    errors: string;
    access: string;
}

export interface BlockServerRequest {
    reason: string;
}

export interface UpdateUserRequest {
    role?: 'user' | 'moderator' | 'admin';
    isActive?: boolean;
}

class AdminService {
    async getStats(): Promise<AdminStats> {
        return await apiClient('/admin/stats', { method: 'GET' });
    }

    async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.role) params.append('role', filters.role);
        if (filters.status) params.append('status', filters.status);

        return await apiClient(`/admin/users?${params.toString()}`, { method: 'GET' });
    }

    async getUser(userId: number): Promise<User> {
        return await apiClient(`/admin/users/${userId}`, { method: 'GET' });
    }

    async updateUser(userId: number, updates: UpdateUserRequest): Promise<{ message: string; user: User }> {
        return await apiClient(`/admin/users/${userId}`, { method: 'PUT' }, updates);
    }

    async deleteUser(userId: number): Promise<{ message: string }> {
        return await apiClient(`/admin/users/${userId}`, { method: 'DELETE' });
    }

    async getServers(filters: ServerFilters = {}): Promise<ServersResponse> {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);

        return await apiClient(`/admin/servers?${params.toString()}`, { method: 'GET' });
    }

    async getServer(serverId: number): Promise<Server> {
        return await apiClient(`/admin/servers/${serverId}`, { method: 'GET' });
    }

    async blockServer(serverId: number, data: BlockServerRequest): Promise<{ message: string; server: Server }> {
        return await apiClient(`/admin/servers/${serverId}/block`, { method: 'POST' }, data);
    }

    async unblockServer(serverId: number): Promise<{ message: string; server: Server }> {
        return await apiClient(`/admin/servers/${serverId}/unblock`, { method: 'POST' });
    }

    async deleteServer(serverId: number): Promise<{ message: string }> {
        return await apiClient(`/admin/servers/${serverId}`, { method: 'DELETE' });
    }

    async getLogs(): Promise<LogsResponse> {
        return await apiClient('/admin/logs', { method: 'GET' });
    }
}

export const adminService = new AdminService(); 