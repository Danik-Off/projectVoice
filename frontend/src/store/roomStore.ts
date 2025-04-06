import { makeAutoObservable, runInAction } from 'mobx';
import SocketClient from '../utils/SocketClient';
import { getCookie } from '../utils/cookie';
import WebRTCClient from '../utils/WebRTCClient';
import audioSettingsStore from './AudioSettingsStore';

class VoiceRoomStore {
    public participants: any[] = [];

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

    public connectToRoom(roomId: number): void {
        
        // eslint-disable-next-line max-len
        const token = getCookie('token'); //TODO отказаться от токена здесь и отправлять его при завпросе на подключение к серверу
        this.socketClient.socketEmit('join-room', roomId, token);
    }
    public disconnectToRoom(): void {
        this.socketClient.socketEmit('leave-room');
        this.webRTCClient.disconect();
    }
    public muteMicrophone() {
        audioSettingsStore.setVolume(0);
    }
    public unmuteMicrophone() {
        audioSettingsStore.setVolume(100);
    }

    private setupServerResponseListeners() {
        this.socketClient.socketOn('connect', () => {
            console.log('Соединение с Socket.IO установлено');
        });
        this.socketClient.socketOn('created', (room) => {
            console.log(`Вы подключены `, room);
            this.participants = room.participants;
        });
        this.socketClient.socketOn('user-connected', (user: { socketId: string }) => {
            console.log(`Пользователь ${user.socketId} подключен`);
            this.webRTCClient.createOffer(user.socketId);
            runInAction(() => {
                this.participants.push(user);
            });
        });
        this.socketClient.socketOn('user-disconnected', (socketId: string) => {
            console.log(`Пользователь ${socketId} отключен`);
            this.webRTCClient.disconnectPeer(socketId);
            this.participants = this.participants.filter((user) => user.socketId !== socketId);
        });
        this.socketClient.socketOn('signal', (data) => {
            console.log(`Сигнал`, data);
            this.webRTCClient.handleSignal(data);
        });
        this.socketClient.socketOn('connect_error', (error) => {
            console.error('Ошибка Socket.IO подключения:', error);
        });
        this.socketClient.socketOn('disconnect', () => {
            console.log('Соединение с Socket.IO закрыто');
        });
    }
    private setupWebRTCSenders() {
        this.webRTCClient.sendSignal = (signal) => {
            this.socketClient.socketEmit('signal', signal);
        };
        this.webRTCClient.changeState = (id, event) => {
            console.log(`Изменен статус ${id}`, event);
        };
    }
}
const voiceRoomStore = new VoiceRoomStore();
export default voiceRoomStore;

