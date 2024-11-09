import { makeAutoObservable } from 'mobx';
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
        this.error = null;
        try {
            const data: Channel[] = await channelService.getByServer(serverId);
            this.channels = data;
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Create a new channel in the current server
    async createChannel(serverId: number, channelData: Omit<Channel, 'id'>): Promise<void> {
        this.error = null;
        try {
            const newChannel: Channel = await channelService.create(serverId, channelData);
            this.channels.push(newChannel);
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    // Delete a channel from the current server
    async deleteChannel(channelId: number, serverId: number): Promise<void> {
        this.error = null;
        try {
            await channelService.delete(serverId, channelId);
            this.channels = this.channels.filter((channel) => channel.id !== channelId);
        } catch (error) {
            this.error = (error as Error).message;
        }
    }
}
const channelsStore = new ChannelsStore();
export default channelsStore;
