import { makeAutoObservable } from 'mobx';
import SocketClient from '../utils/SocketClient';
import { getCookie } from '../utils/cookie';
import WebRTCClient from '../utils/WebRTCClient';

class VoiceRoomStore {
    private socketClient: SocketClient = new SocketClient();
    private webRTCClient: WebRTCClient = new WebRTCClient();

    public constructor() {
        makeAutoObservable(this);
        this.socketClient.connect();
        this.setupServerResponseListeners();
        this.setupWebRTCSenders();
    }

    public connectToRoom(roomId: number): void {
        // eslint-disable-next-line max-len
        const token = getCookie('token'); //TODO отказаться от токена здесь и отправлять его при завпросе на подключение к серверу
        this.socketClient.socketEmit('join-room', roomId, token);
    }
    public disconnectToRoom(): void {
        this.webRTCClient.disconect();

        // eslint-disable-next-line max-len
        // this.socketClient.socketEmit('') TODO сделать на сервере инфорсмацию о том что пользователь отключился от комнаты
    }
    public muteMicrophone() {
        this.webRTCClient.muteMicrophone();
    }
    public unmuteMicrophone() {
        this.webRTCClient.unmuteMicrophone();
    }

    private setupServerResponseListeners() {
        this.socketClient.socketOn('connect', () => {
            console.log('Соединение с Socket.IO установлено');
        });
        this.socketClient.socketOn('created', (room) => {
            console.log(`Вы подключены `, room);
            this.webRTCClient.initializeMedia();
        });
        this.socketClient.socketOn(
            'user-connected',
            (user: { socketId: string }) => {
                console.log(user);
                console.log(`Пользователь ${user.socketId} подключен`);
                this.webRTCClient.initializeMedia();
                this.webRTCClient.createOffer(user.socketId);
            }
        );
        this.socketClient.socketOn('user-disconnected', (socketId: string) => {
            console.log(`Пользователь ${socketId} подключен`);
            this.webRTCClient.disconnectPeer(socketId);
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
    }
}
const voiceRoomStore = new VoiceRoomStore();
export default voiceRoomStore;
