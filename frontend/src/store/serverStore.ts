import { makeAutoObservable } from 'mobx';
import { serverService } from '../services/serverService'; // Путь к серверному сервису
import { channelService } from '../services/channelService'; // Путь к сервису каналов
import { userService } from '../services/userService'; // Путь к сервису пользователей
import { Server } from '../types/server';
import { User } from '../types/user'; // Предполагается, что у вас есть типы для пользователей
import { channelMembersService } from '../services/channelMembers';
import { Channel } from '../types/channel';
import { ChannelMember } from '../types/channelMember';

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
    async createServer(
        serverData: Omit<Server, 'id' | 'ownerId'>
    ): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            const newServer: Server = await serverService.create(serverData);
            this.servers.push(newServer);
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Update an existing server
    async updateServer(
        id: number,
        updatedData: Partial<Server>
    ): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            const updatedServer: Server = await serverService.update(
                id,
                updatedData
            );
            this.servers = this.servers.map((server) =>
                server.id === id ? updatedServer : server
            );
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Delete a server
    async deleteServer(id: number): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            await serverService.delete(id);
            this.servers = this.servers.filter((server) => server.id !== id);
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Fetch channels for the current server
    async fetchChannels(): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            if (this.currentServer) {
                const data: Channel[] = await channelService.getByServer(this.currentServer.id);
                this.channels = data;
            }
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Create a new channel in the current server
    async createChannel(channelData: Omit<Channel, 'id'>): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            if (this.currentServer) {
                const newChannel: Channel = await channelService.create(
                    this.currentServer.id,
                    channelData
                );
                this.channels.push(newChannel);
            }
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Delete a channel from the current server
    async deleteChannel(channelId: number): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            if (this.currentServer) {
                await channelService.delete(this.currentServer.id, channelId);
                this.channels = this.channels.filter(
                    (channel) => channel.id !== channelId
                );
            }
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Fetch the list of users
    async fetchUsers(): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            const data: User[] = await userService.get(); // Метод для получения списка пользователей
            this.users = data;
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Add a member to a channel
    async addChannelMember(
        channelId: number,
        userId: number,
        role: string
    ): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            if (this.currentServer) {
                await channelMembersService.addMember(
                    this.currentServer.id,
                    channelId,
                    userId,
                    role
                );
            }
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Fetch members of a channel
    async fetchChannelMembers(channelId: number): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            if (this.currentServer) {
                const members: ChannelMember[] =
                    await channelMembersService.getMembers(
                        this.currentServer.id,
                        channelId
                    );
                // Handle channel members (you might want to store them in the state)
                console.log(members); // or handle accordingly
            }
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }

    // Remove a member from a channel
    async removeChannelMember(
        channelId: number,
        memberId: number
    ): Promise<void> {
        this.loading = true;
        this.error = null;
        try {
            if (this.currentServer) {
                await channelMembersService.removeMember(
                    this.currentServer.id,
                    channelId,
                    memberId
                );
            }
        } catch (error) {
            this.error = (error as Error).message;
        } finally {
            this.loading = false;
        }
    }
}

const serverStore = new ServerStore();
export default serverStore;
