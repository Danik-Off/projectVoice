import { makeAutoObservable, runInAction } from 'mobx';
import SocketClient from '../utils/SocketClient';
import { getCookie } from '../utils/cookie';
import WebRTCClient from '../utils/WebRTCClient';
import audioSettingsStore from './AudioSettingsStore';

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
            runInAction(() => {
                this.participants = room.participants;
            });
        });
        this.socketClient.socketOn('user-connected', (user: { socketId: string; userData: UserData }) => {
            console.log(`Пользователь ${user.userData?.username || user.socketId} подключен`);
            this.webRTCClient.createOffer(user.socketId);
            runInAction(() => {
                this.participants.push({
                    socketId: user.socketId,
                    micToggle: true,
                    userData: user.userData,
                    isSpeaking: false
                });
            });
        });
        this.socketClient.socketOn('user-disconnected', (socketId: string) => {
            console.log(`Пользователь отключен: ${socketId}`);
            this.webRTCClient.disconnectPeer(socketId);
            runInAction(() => {
                this.participants = this.participants.filter((user) => user.socketId !== socketId);
            });
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

