/* eslint-disable max-len */
import { makeAutoObservable } from 'mobx';
import { serverService } from '../services/serverService'; // Путь к серверному сервису
import { channelService } from '../services/channelService'; // Путь к сервису каналов сервису пользователей
import { Server } from '../types/server';
import { User } from '../types/user'; // Предполагается, что у вас есть типы для пользователей

import { Channel } from '../types/channel';
import { ChannelMember } from '../types/channelMember';
import { serverMembersService } from '../services/serverMembers';

class ServerStore {
    servers: Server[] = [];
    currentServer: Server | null = null;
    channels: Channel[] = [];
    users: User[] = []; // Список пользователей
    loading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Fetch the list of servers
    async fetchServers(): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            const data: Server[] = await serverService.get();
            this.servers = data;
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Fetch a specific server by ID
    async fetchServerById(id: number): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            const data: Server = await serverService.getBy(id);
            this.currentServer = data;
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Create a new server
    async createServer(serverData: Omit<Server, 'id' | 'ownerId'>): Promise<void> {
        this.error = null;
        try {
            const newServer: Server = await serverService.create(serverData);
            this.servers.push(newServer);
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Update an existing server
    async updateServer(id: number, updatedData: Partial<Server>): Promise<void> {
        this.error = null;
        try {
            const updatedServer: Server = await serverService.update(id, updatedData);
            this.servers = this.servers.map((server) => (server.id === id ? updatedServer : server));
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Delete a server
    async deleteServer(id: number): Promise<void> {
        this.error = null;
        try {
            await serverService.delete(id);
            this.servers = this.servers.filter((server) => server.id !== id);
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Fetch channels for the current server
    async fetchChannels(): Promise<void> {
        this.error = null;
        try {
            if (this.currentServer) {
                const data: Channel[] = await channelService.getByServer(this.currentServer.id);
                this.channels = data;
            }
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Create a new channel in the current server
    async createChannel(channelData: Omit<Channel, 'id'>): Promise<void> {
        this.error = null;
        try {
            if (this.currentServer) {
                const newChannel: Channel = await channelService.create(this.currentServer.id, channelData);
                this.channels.push(newChannel);
            }
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Delete a channel from the current server
    async deleteChannel(channelId: number): Promise<void> {
        this.error = null;
        try {
            if (this.currentServer) {
                await channelService.delete(this.currentServer.id, channelId);
                this.channels = this.channels.filter((channel) => channel.id !== channelId);
            }
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Fetch the list of users
    async fetchUsers(): Promise<void> {
        this.error = null;
        try {
            if (this.currentServer) {
                const data: User[] = await serverMembersService.getMembers(this.currentServer.id); // Метод для получения списка пользователей
                this.users = data;
            }
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Add a member to a channel
    async addChannelMember(userId: number, role: string): Promise<void> {
        this.error = null;
        try {
            if (this.currentServer) {
                await serverMembersService.addMember(this.currentServer.id, userId, role);
            }
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Fetch members of a channel
    async fetchChannelMembers(): Promise<void> {
        this.error = null;
        try {
            if (this.currentServer) {
                const members: ChannelMember[] = await serverMembersService.getMembers(this.currentServer.id);
                // Handle channel members (you might want to store them in the state)
                console.log(members); // or handle accordingly
            }
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Remove a member from a channel
    async removeChannelMember(channelId: number, memberId: number): Promise<void> {
        this.error = null;
        try {
            if (this.currentServer) {
                await serverMembersService.removeMember(this.currentServer.id, memberId);
            }
        } catch (error) {
            this.error = (error as Error).message;
        }
    }
}

const serverStore = new ServerStore();
export default serverStore;
