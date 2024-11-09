/* eslint-disable max-len */
import { makeAutoObservable } from 'mobx';
import { serverService } from '../services/serverService'; // Путь к серверному сервису
import { Server } from '../types/server';
import { User } from '../types/user'; // Предполагается, что у вас есть типы для пользователей

class ServerStore {
    servers: Server[] = [];
    currentServer: Server | null = null;
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
        this.loading = true;
        this.error = null;
        try {
            const newServer: Server = await serverService.create(serverData);
            console.log('🚀 ~ ServerStore ~ createServer ~ newServer:', newServer);
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
}

const serverStore = new ServerStore();
export default serverStore;
