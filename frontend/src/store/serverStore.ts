/* eslint-disable max-len */
import { makeAutoObservable, runInAction } from 'mobx';
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
        runInAction(() => {
            this.loading = true;
            this.error = null;
        });
        
        try {
            const data: Server[] = await serverService.get();
            runInAction(() => {
                this.servers = data;
            });
        } catch (error) {
            runInAction(() => {
                this.error = (error as Error).message;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    // Fetch a specific server by ID
    async fetchServerById(id: number): Promise<void> {
        runInAction(() => {
            this.loading = true;
            this.error = null;
        });
        
        try {
            const data: Server = await serverService.getBy(id);
            runInAction(() => {
                this.currentServer = data;
            });
        } catch (error) {
            runInAction(() => {
                this.error = (error as Error).message;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    // Fetch current server (alias for fetchServerById)
    async fetchCurrentServer(id: number): Promise<void> {
        await this.fetchServerById(id);
    }

    // Create a new server
    async createServer(serverData: Omit<Server, 'id' | 'ownerId'>): Promise<void> {
        runInAction(() => {
            this.loading = true;
            this.error = null;
        });
        
        try {
            const newServer: Server = await serverService.create(serverData);
            console.log('🚀 ~ ServerStore ~ createServer ~ newServer:', newServer);
            runInAction(() => {
                this.servers.push(newServer);
            });
        } catch (error) {
            runInAction(() => {
                this.error = (error as Error).message;
            });
        }
    }

    // Update an existing server
    async updateServer(id: number, updatedData: Partial<Server>): Promise<void> {
        runInAction(() => {
            this.error = null;
        });
        
        try {
            const updatedServer: Server = await serverService.update(id, updatedData);
            runInAction(() => {
                this.servers = this.servers.map((server) => (server.id === id ? updatedServer : server));
                
                // Обновляем currentServer если он был обновлен
                if (this.currentServer && this.currentServer.id === id) {
                    this.currentServer = updatedServer;
                }
            });
        } catch (error) {
            runInAction(() => {
                this.error = (error as Error).message;
            });
        }
    }

    // Delete a server
    async deleteServer(id: number): Promise<void> {
        runInAction(() => {
            this.error = null;
        });
        
        try {
            await serverService.delete(id);
            runInAction(() => {
                this.servers = this.servers.filter((server) => server.id !== id);
            });
        } catch (error) {
            runInAction(() => {
                this.error = (error as Error).message;
            });
        }
    }
}

const serverStore = new ServerStore();
export default serverStore;
