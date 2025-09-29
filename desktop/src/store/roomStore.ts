import { makeAutoObservable, runInAction } from 'mobx';
import SocketClient from '../utils/SocketClient';
import { getCookie } from '../utils/cookie';
import WebRTCClient from '../utils/WebRTCClient';
import audioSettingsStore from './AudioSettingsStore';
import notificationStore from './NotificationStore';
import vadService, { VoiceActivityEvent } from '../services/VoiceActivityDetectionService';

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
        this.webRTCClient.initializeMedia();
        this.setupVADListeners();
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
                this.participants = room.participants;
            });
        });
        this.socketClient.socketOn('user-connected', (user: { socketId: string; userData: UserData }) => {
            console.log(`Пользователь ${user.userData?.username || user.socketId} подключен`);
            this.webRTCClient.createOffer(user.socketId);
            runInAction(() => {
                // Проверяем, не существует ли уже участник с таким socketId
                const existingParticipant = this.participants.find(p => p.socketId === user.socketId);
                if (!existingParticipant) {
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
        this.socketClient.socketOn('force-disconnect', (reason: string) => {
            console.log('Принудительное отключение:', reason);
            notificationStore.addNotification('Переподключение с нового устройства', 'info');
            this.disconnectToRoom();
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

    private setupVADListeners(): void {
        vadService.addCallback((event: VoiceActivityEvent) => {
            runInAction(() => {
                const participant = this.participants.find(p => p.socketId === event.userId);
                if (participant) {
                    participant.isSpeaking = event.isActive;
                    console.log(`VAD: ${participant.userData?.username || event.userId} ${event.isActive ? 'говорит' : 'молчит'} (${event.volume.toFixed(1)}%)`);
                } else if (event.userId === 'local') {
                    // Обрабатываем локального пользователя
                    console.log(`VAD: Локальный пользователь ${event.isActive ? 'говорит' : 'молчит'} (${event.volume.toFixed(1)}%)`);
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
        return vadService.getUserActivity('local');
    }

    // Получить уровень громкости участника
    public getParticipantVolumeLevel(socketId: string): number {
        return vadService.getUserVolume(socketId);
    }

    // Получить уровень громкости локального пользователя
    public getLocalVolumeLevel(): number {
        return vadService.getUserVolume('local');
    }
}
const voiceRoomStore = new VoiceRoomStore();
export default voiceRoomStore;

