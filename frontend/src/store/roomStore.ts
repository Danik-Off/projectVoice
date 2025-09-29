import { makeAutoObservable, runInAction } from 'mobx';
import SocketClient from '../utils/SocketClient';
import { getCookie } from '../utils/cookie';
import WebRTCClient from '../utils/WebRTCClient';
import audioSettingsStore from './AudioSettingsStore';
import notificationStore from './NotificationStore';

interface UserData {
    id: number;
    username: string;
    profilePicture?: string;
    role: string;
}

interface Participant {
    socketId: string;
    micToggle: boolean;
    userData: UserData;
    isSpeaking?: boolean;
}

class VoiceRoomStore {
    public participants: Participant[] = [];
    public currentVoiceChannel: { id: number; name: string } | null = null;
    public state = '';

    private socketClient: SocketClient = new SocketClient();
    private webRTCClient: WebRTCClient = new WebRTCClient();

    public constructor() {
        makeAutoObservable(this);
        this.socketClient.connect();
        this.setupServerResponseListeners();
        this.setupWebRTCSenders();
        this.webRTCClient.initializeMedia();
    }

    public connectToRoom(roomId: number, channelName?: string): void {
        // eslint-disable-next-line max-len
        const token = getCookie('token'); //TODO отказаться от токена здесь и отправлять его при завпросе на подключение к серверу
        this.socketClient.socketEmit('join-room', roomId, token);
        
        runInAction(() => {
            this.currentVoiceChannel = { id: roomId, name: channelName || `Voice Channel ${roomId}` };
        });
        notificationStore.addNotification(`Подключились к голосовому каналу: ${channelName || `Voice Channel ${roomId}`}`, 'info');
    }
    public disconnectToRoom(): void {
        this.socketClient.socketEmit('leave-room');
        this.webRTCClient.disconect();
        
        runInAction(() => {
            this.currentVoiceChannel = null;
        });
    }
    public muteMicrophone() {
        audioSettingsStore.setVolume(0);
    }
    public unmuteMicrophone() {
        audioSettingsStore.setVolume(100);
    }

    private setupServerResponseListeners() {
        // this.socketClient.socketOn('connect', () => {
        //     console.log('Соединение с Socket.IO установлено');
        // });
        this.socketClient.socketOn('created', (room) => {
            runInAction(() => {
                this.participants = room.participants;
            });
        });
        this.socketClient.socketOn('user-connected', (user: { socketId: string; userData: UserData }) => {
            this.webRTCClient.createOffer(user.socketId);
            runInAction(() => {
                this.participants.push({
                    socketId: user.socketId,
                    micToggle: true,
                    userData: user.userData,
                    isSpeaking: false
                });
            });
            notificationStore.addNotification(`${user.userData?.username || 'Пользователь'} присоединился к голосовому каналу`, 'info');
        });
        this.socketClient.socketOn('user-disconnected', (socketId: string) => {
            const disconnectedUser = this.participants.find(user => user.socketId === socketId);
            this.webRTCClient.disconnectPeer(socketId);
            runInAction(() => {
                this.participants = this.participants.filter((user) => user.socketId !== socketId);
            });
            if (disconnectedUser) {
                notificationStore.addNotification(`${disconnectedUser.userData?.username || 'Пользователь'} покинул голосовой канал`, 'info');
            }
        });
        this.socketClient.socketOn('signal', (data) => {
            this.webRTCClient.handleSignal(data);
        });
        this.socketClient.socketOn('connect_error', (error) => {
            console.error('Ошибка Socket.IO подключения:', error);
            notificationStore.addNotification('notifications.voiceConnectError', 'error');
        });
        this.socketClient.socketOn('disconnect', () => {
            console.warn('Соединение с Socket.IO закрыто');
        });
    }
    private setupWebRTCSenders() {
        this.webRTCClient.sendSignal = (signal) => {
            this.socketClient.socketEmit('signal', signal);
        };
        this.webRTCClient.changeState = (id, event) => {
            console.warn(`Изменен статус ${id}`, event);
        };
    }
}
const voiceRoomStore = new VoiceRoomStore();
export default voiceRoomStore;

