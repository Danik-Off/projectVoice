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
    search?: string;
    role?: string;
    status?: string;
}

export interface UsersResponse {
    users: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ServersResponse {
    servers: any[];
    total: number;
}

export interface LogsResponse {
    system: string;
    errors: string;
    access: string;
}

class AdminService {
    async getStats(): Promise<AdminStats> {
        return await apiClient('/admin/stats', { method: 'GET' });
    }

    async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.role) params.append('role', filters.role);
        if (filters.status) params.append('status', filters.status);

        return await apiClient(`/admin/users?${params.toString()}`, { method: 'GET' });
    }

    async updateUser(userId: number, updates: any): Promise<void> {
        await apiClient(`/admin/users/${userId}`, { method: 'PUT' }, updates);
    }

    async deleteUser(userId: number): Promise<void> {
        await apiClient(`/admin/users/${userId}`, { method: 'DELETE' });
    }

    async getServers(): Promise<ServersResponse> {
        return await apiClient('/admin/servers', { method: 'GET' });
    }

    async deleteServer(serverId: number): Promise<void> {
        await apiClient(`/admin/servers/${serverId}`, { method: 'DELETE' });
    }

    async getLogs(): Promise<LogsResponse> {
        return await apiClient('/admin/logs', { method: 'GET' });
    }
}

export const adminService = new AdminService(); 