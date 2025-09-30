import { makeAutoObservable, runInAction } from 'mobx';
import SocketClient from '../utils/SocketClient';
import { getCookie } from '../utils/cookie';
import WebRTCClient from '../utils/WebRTCClient';
import audioSettingsStore from './AudioSettingsStore';
import notificationStore from './NotificationStore';
import voiceActivityService, { VoiceActivityEvent } from '../services/VoiceActivityService';

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
    public webRTCClient: WebRTCClient = new WebRTCClient();

    public constructor() {
        makeAutoObservable(this);
        this.socketClient.connect();
        this.setupServerResponseListeners();
        this.setupWebRTCSenders();
        this.setupVoiceActivityListeners();
        
        // Убираем автоматическую инициализацию аудио из конструктора
        // Аудио будет инициализироваться только при подключении к голосовому каналу
        console.log('VoiceRoomStore: Constructor initialized (audio will be initialized on voice channel join)');
    }

    public connectToRoom(roomId: number, channelName?: string): void {
        // Проверяем, не подключен ли уже пользователь к голосовой комнате
        if (this.currentVoiceChannel) {
            if (this.currentVoiceChannel.id === roomId) {
                console.log('VoiceRoomStore: Already connected to this voice channel, just opening interface');
                notificationStore.addNotification(`Вы уже подключены к голосовому каналу: ${this.currentVoiceChannel.name}`, 'info');
                return;
            } else {
                console.log('VoiceRoomStore: Switching from channel', this.currentVoiceChannel.id, 'to channel', roomId);
                // Отключаемся от текущего канала перед подключением к новому
                this.disconnectToRoom();
            }
        }
        
        // eslint-disable-next-line max-len
        const token = getCookie('token'); //TODO отказаться от токена здесь и отправлять его при завпросе на подключение к серверу
        this.socketClient.socketEmit('join-room', roomId, token);
        
        // Инициализируем аудио только при подключении к голосовому каналу
        console.log('VoiceRoomStore: Initializing audio settings for voice channel...');
        audioSettingsStore.initMedia();
        
        // Инициализируем WebRTC и VAS при подключении к голосовому каналу
        console.log('VoiceRoomStore: Initializing WebRTC and VAS for voice call...');
        this.webRTCClient.initializeMedia();
        
        runInAction(() => {
            this.currentVoiceChannel = { id: roomId, name: channelName || `Voice Channel ${roomId}` };
        });
        notificationStore.addNotification(`Подключились к голосовому каналу: ${channelName || `Voice Channel ${roomId}`}`, 'info');
    }
    // Проверка, подключен ли пользователь к голосовой комнате
    public isConnectedToVoiceChannel(): boolean {
        return this.currentVoiceChannel !== null;
    }

    // Получение информации о текущем голосовом канале
    public getCurrentVoiceChannel(): { id: number; name: string } | null {
        return this.currentVoiceChannel;
    }

    public disconnectToRoom(): void {
        this.socketClient.socketEmit('leave-room');
        this.webRTCClient.disconect();
        
        // Очищаем аудио ресурсы при отключении от голосового канала
        console.log('VoiceRoomStore: Cleaning up audio resources after voice call...');
        audioSettingsStore.cleanup();
        
        // Очищаем VAS при отключении от голосового канала
        console.log('VoiceRoomStore: Cleaning up VAS after voice call...');
        voiceActivityService.cleanup();
        
        runInAction(() => {
            this.currentVoiceChannel = null;
            // Сбрасываем состояние активности речи для всех участников
            this.participants.forEach(participant => {
                participant.isSpeaking = false;
            });
        });
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
                // Исключаем локального пользователя из списка участников
                // так как он отображается отдельно в UI
                this.participants = room.participants.filter((participant: Participant) => 
                    participant.socketId !== this.socketClient.getSocketId()
                );
            });
        });
        this.socketClient.socketOn('user-connected', (user: { socketId: string; userData: UserData }) => {
            console.log(`Пользователь ${user.userData?.username || user.socketId} подключен`);
            this.webRTCClient.createOffer(user.socketId);
            runInAction(() => {
                // Проверяем, что это не локальный пользователь
                if (user.socketId !== this.socketClient.getSocketId()) {
                    this.participants.push({
                        socketId: user.socketId,
                        micToggle: true,
                        userData: user.userData,
                        isSpeaking: false
                    });
                }
            });
            notificationStore.addNotification(`${user.userData?.username || 'Пользователь'} присоединился к голосовому каналу`, 'info');
        });
        this.socketClient.socketOn('user-disconnected', (socketId: string) => {
            console.log(`Пользователь отключен: ${socketId}`);
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
            console.log(`Сигнал`, data);
            this.webRTCClient.handleSignal(data);
        });
        this.socketClient.socketOn('connect_error', (error) => {
            console.error('Ошибка Socket.IO подключения:', error);
            notificationStore.addNotification('notifications.voiceConnectError', 'error');
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

    private setupVoiceActivityListeners(): void {
        voiceActivityService.addCallback((event: VoiceActivityEvent) => {
            runInAction(() => {
                const participant = this.participants.find(p => p.socketId === event.userId);
                if (participant) {
                    participant.isSpeaking = event.isActive;
                } 
            });
        });
    }

    // Получить состояние активности речи для участника
    public getParticipantSpeakingState(socketId: string): boolean {
        const participant = this.participants.find(p => p.socketId === socketId);
        return participant?.isSpeaking || false;
    }

    // Получить состояние активности речи для локального пользователя
    public getLocalSpeakingState(): boolean {
        return voiceActivityService.getUserActivity('local');
    }

    // Получить уровень громкости участника
    public getParticipantVolumeLevel(socketId: string): number {
        return voiceActivityService.getUserVolume(socketId);
    }

    // Получить уровень громкости локального пользователя
    public getLocalVolumeLevel(): number {
        return voiceActivityService.getUserVolume('local');
    }
}
const voiceRoomStore = new VoiceRoomStore();
export default voiceRoomStore;

