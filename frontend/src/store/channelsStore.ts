import { makeAutoObservable, runInAction } from 'mobx';
import { Channel } from '../types/channel';
import { channelService } from '../services/channelService';

class ChannelsStore {
    public channels: Channel[] = [];
    public loading: boolean = false;
    public error: string | null = null;

    public constructor() {
        makeAutoObservable(this);
    }
    // Fetch channels for the current server
    async fetchChannels(serverId: number): Promise<void> {
        runInAction(() => {
            this.error = null;
        });
        
        try {
            const data: Channel[] = await channelService.getByServer(serverId);
            runInAction(() => {
                this.channels = data;
            });
        } catch (error) {
            runInAction(() => {
                this.error = (error as Error).message;
            });
        }
        console.log("ok")
    }

    // Create a new channel in the current server
    async createChannel(serverId: number, channelData: Omit<Channel, 'id'>): Promise<void> {
        runInAction(() => {
            this.error = null;
        });
        
        try {
            const newChannel: Channel = await channelService.create(serverId, channelData);
            runInAction(() => {
                this.channels.push(newChannel);
            });
        } catch (error) {
            runInAction(() => {
                this.error = (error as Error).message;
            });
        }
    }

    // Delete a channel from the current server
    async deleteChannel(channelId: number, serverId: number): Promise<void> {
        runInAction(() => {
            this.error = null;
        });
        
        try {
            await channelService.delete(serverId, channelId);
            runInAction(() => {
                this.channels = this.channels.filter((channel) => channel.id !== channelId);
            });
        } catch (error) {
            runInAction(() => {
                this.error = (error as Error).message;
            });
        }
    }
}
const channelsStore = new ChannelsStore();
export default channelsStore;
