import { reaction } from 'mobx';
import { iceServers } from '../configs/iceServers';
import { Signal } from '../types/WebRTCClient.types';
import audioSettingsStore from '../store/AudioSettingsStore';
import participantVolumeStore from '../store/ParticipantVolumeStore';
import vadService from '../services/VoiceActivityDetectionService';
class WebRTCClient {
    public sendSignal: null | ((signal: Signal) => void) = null;

    public changeState: null | ((id: string, signal: Event) => void) = null;

    private readonly remoteStreams: Map<string, MediaStream> = new Map();
    private readonly peerConnections: Map<string, RTCPeerConnection> = new Map();
    private readonly remoteAudioElements: Map<string, HTMLAudioElement> = new Map();
    private readonly audioContexts: Map<string, AudioContext> = new Map();
    private readonly gainNodes: Map<string, GainNode> = new Map();
    private readonly audioSources: Map<string, MediaStreamAudioSourceNode> = new Map();

    private localStream: MediaStream | null = null;

    private isMuteMicro = false;

    //управление Медиа
    public async initializeMedia() {
        // Инициализируем VAD сервис
        vadService.initialize();
        
        reaction(
            () => audioSettingsStore.stream,
            (val) => {
                console.log('🚀 ~ WebRTCClient ~ initializeMedia ~ val:', val);
                this.resendlocalStream();
                this.setupLocalVAD();
            },
        );
    }

    //Логика подключения
    public createPeerConnection(id: string) {
        console.log('создание peerConnection c id', id);
        const newPeerConnection = new RTCPeerConnection({
            iceServers: iceServers,
        });

        newPeerConnection.onicecandidate = (event) => {
            console.log(event);
            if (!event.candidate) {
                console.error('candidate не существует');
                return;
            }
            if (!this.sendSignal) {
                console.error('sendSignal не существует');
                return;
            }
            this.sendSignal({
                to: id,
                type: 'candidate',
                candidate: event.candidate,
            });
        };

        newPeerConnection.onconnectionstatechange = (state) => {
            this.changeState && this.changeState(id, state);
        };

        newPeerConnection.ontrack = (event) => {
            console.log('ontrack', id, event.track.kind);
            if (event.track.kind === 'audio') {
                this.addRemoteStream(event.track, id);
            }
        };

        this.peerConnections.set(id, newPeerConnection);
        this.addLocalStream(id);
        return newPeerConnection;
    }

    public async createOffer(id: string) {
        console.log('создание офера');
        const peerConnection = this.createPeerConnection(id);
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            const sdp = offer.sdp;

            if (!this.sendSignal) {
                console.error('sendSignal не найден или равняется null');
                return;
            }

            if (!sdp) {
                console.error('offer.sdp не найден или равняется null');
                return;
            }

            this.sendSignal({
                to: id,
                type: 'offer',
                sdp: sdp,
            });
        } catch (error) {
            console.error('Ошибка при создании предложения:', error);
        }
    }

    public async createAnswer(id: string) {
        console.log('создание  ответа');
        const peerConnection = this.peerConnections.get(id);
        if (!peerConnection) {
            console.error('peerConnection не существует при создании ответа');
            return;
        }
        try {
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            const sdp = answer.sdp;

            if (!this.sendSignal) {
                console.error('sendSignalr не найден или равняется null');
                return;
            }

            if (!sdp) {
                console.error('answer.sdp не найден или равняется null');
                return;
            }
            this.sendSignal({
                to: id,
                type: 'answer',
                sdp: sdp,
            });
        } catch (error) {
            console.error('Ошибка при создании ответа:', error);
        }
    }

    public async handleSignal(data: any) {
        const { from, type, sdp, candidate } = data;
        console.log('обработка сигнала:', type);
        let peerConnection = this.peerConnections.get(from) || false;
        if (!peerConnection) {
            peerConnection = await this.createPeerConnection(from);
        }

        switch (type) {
            case 'offer':
                await peerConnection.setRemoteDescription(new RTCSessionDescription({ type, sdp }));
                await this.createAnswer(from);
                break;
            case 'answer':
                await peerConnection.setRemoteDescription(new RTCSessionDescription({ type, sdp }));
                break;
            case 'candidate':
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                break;
        }
    }

    //логика работы с потоками
    private addRemoteStream(track: any, id: string): void {
        console.log('попытка добавить поток', id);
        let remoteStream = this.remoteStreams.get(id);
        if (!remoteStream) {
            remoteStream = new MediaStream();
            this.remoteStreams.set(id, remoteStream);
            console.log('Удалённый поток добавлен для пользователя:', id);
            
            // Создаем аудио контекст для этого участника
            const audioContext = new AudioContext();
            const gainNode = audioContext.createGain();
            
            // Устанавливаем начальную громкость
            const initialVolume = participantVolumeStore.getParticipantVolume(id);
            gainNode.gain.value = initialVolume / 100;
            
            this.audioContexts.set(id, audioContext);
            this.gainNodes.set(id, gainNode);
            
            // Создаем аудио элемент, но не добавляем его в DOM
            // Используем только для получения потока
            const audioElement = document.createElement('audio');
            audioElement.srcObject = remoteStream;
            audioElement.autoplay = true;
            audioElement.muted = true; // Всегда muted, используем только Web Audio API
            
            // Добавляем обработчик для события loadedmetadata
            audioElement.addEventListener('loadedmetadata', () => {
                console.log('Аудио метаданные загружены для участника:', id);
                // Повторно пытаемся настроить аудио обработку после загрузки метаданных
                const currentStream = this.remoteStreams.get(id);
                if (currentStream && currentStream.getAudioTracks().length > 0) {
                    this.setupAudioProcessing(id, currentStream);
                }
            });
            
            // Не добавляем в DOM, используем только для Web Audio API
            this.remoteAudioElements.set(id, audioElement); // Сохраняем ссылку
        } else {
            console.log('remoteStream не существует ');
        }

        // Добавляем трек в поток
        remoteStream.addTrack(track);
        
        // Проверяем, есть ли аудио треки в потоке, и только тогда создаем источник
        if (remoteStream.getAudioTracks().length > 0 && !this.audioContexts.get(id)?.state.includes('closed')) {
            this.setupAudioProcessing(id, remoteStream);
        }
    }

    // Настройка аудио обработки для участника
    private setupAudioProcessing(id: string, remoteStream: MediaStream): void {
        const audioContext = this.audioContexts.get(id);
        const gainNode = this.gainNodes.get(id);
        
        if (!audioContext || !gainNode) {
            console.error('AudioContext или GainNode не найдены для участника:', id);
            return;
        }

        // Проверяем, не создан ли уже источник для этого участника
        if (this.audioSources.has(id)) {
            console.log('Аудио источник уже существует для участника:', id);
            return;
        }

        try {
            // Проверяем, что поток содержит аудио треки
            if (remoteStream.getAudioTracks().length === 0) {
                console.warn('Поток не содержит аудио треков для участника:', id);
                return;
            }

            // Создаем источник только если его еще нет и контекст активен
            if (!audioContext.state.includes('closed')) {
                const source = audioContext.createMediaStreamSource(remoteStream);
                source.connect(gainNode);
                gainNode.connect(audioContext.destination);
                this.audioSources.set(id, source);
                
                // Настраиваем VAD для удаленного участника
                this.setupRemoteVAD(id, remoteStream);
            }
        } catch (error) {
            console.error('Ошибка при настройке аудио обработки для участника:', id, error);
        }
    }

    private resendlocalStream() {
        if (audioSettingsStore.stream) {
            this.peerConnections.forEach((peerConnection) => {
                const newAudioTrack = audioSettingsStore.stream.getAudioTracks()[0];
                const sender = peerConnection.getSenders().find((s) => s.track?.kind === 'audio');
                if (sender && newAudioTrack) {
                    sender.replaceTrack(newAudioTrack);
                    // Синхронизируем состояние mute
                    newAudioTrack.enabled = !audioSettingsStore.isMicrophoneMuted;
                }
            });
        } 
    }

    private addLocalStream(id: string): void {
        const peerConnection = this.peerConnections.get(id);
      
        if (audioSettingsStore.stream) {
            audioSettingsStore.stream.getTracks().forEach((track) => {
                //Если существет локальный стрим и пир для подключения то рассылаем стрим
                peerConnection && peerConnection.addTrack(track, audioSettingsStore.stream);
                track.enabled = !audioSettingsStore.isMicrophoneMuted;
            });
        }
    }

    private setState(): void {}

    // Управление состоянием mute для всех удаленных аудиоэлементов
    public setRemoteAudioMuted(muted: boolean): void {
        this.gainNodes.forEach((gainNode, socketId) => {
            if (muted) {
                gainNode.gain.value = 0;
            } else {
                // Восстанавливаем громкость из store
                const volume = participantVolumeStore.getParticipantVolume(socketId);
                gainNode.gain.value = volume / 100;
            }
        });
    }

    // Управление громкостью конкретного участника
    public setParticipantVolume(socketId: string, volume: number): void {
        const gainNode = this.gainNodes.get(socketId);
        if (gainNode) {
            gainNode.gain.value = volume / 100;
            participantVolumeStore.setParticipantVolume(socketId, volume);
        }
    }

    // Получить громкость участника
    public getParticipantVolume(socketId: string): number {
        return participantVolumeStore.getParticipantVolume(socketId);
    }

    // отключение

    // если пользователь отключился
    public disconnectPeer(id: string) {
        const peerConnection = this.peerConnections.get(id);
        if (peerConnection) {
            peerConnection.close();
            this.peerConnections.delete(id);
        }

        const remoteStream = this.remoteStreams.get(id);
        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
            this.remoteStreams.delete(id);
        }

        // Удаляем аудиоэлемент
        const audioElement = this.remoteAudioElements.get(id);
        if (audioElement) {
            // Не нужно удалять из DOM, так как мы его не добавляли
            this.remoteAudioElements.delete(id);
        }

        // Очищаем аудио контекст и gain node
        const audioContext = this.audioContexts.get(id);
        if (audioContext) {
            audioContext.close();
            this.audioContexts.delete(id);
        }
        this.gainNodes.delete(id);
        this.audioSources.delete(id);

        // Останавливаем VAD для этого участника
        vadService.stopMonitoring(id);

        // Удаляем из store громкости
        participantVolumeStore.removeParticipant(id);
    }
    // когда мы сами отключаемся
    public disconect() {
        //закрываем потоки
        this.peerConnections.forEach((peerConnection) => {
            peerConnection.close();
        });
        this.peerConnections.clear();

        if (audioSettingsStore.stream) {
            audioSettingsStore.stream.getTracks().forEach((track) => track.stop());
        }

        //тормозим стримы
        this.remoteStreams.forEach((stream) => {
            stream.getTracks().forEach((track) => track.stop());
        });
        this.remoteStreams.clear();

        // Очищаем все аудиоэлементы
        this.remoteAudioElements.clear();

        // Закрываем все аудио контексты
        this.audioContexts.forEach((audioContext) => {
            audioContext.close();
        });
        this.audioContexts.clear();
        this.gainNodes.clear();
        this.audioSources.clear();

        // Очищаем store громкости
        participantVolumeStore.resetAllVolumes();
        
        // Очищаем VAD сервис
        vadService.cleanup();
    }

    // Настройка VAD для локального потока (после gain)
    private setupLocalVAD(): void {
        if (audioSettingsStore.stream) {
            // Используем обработанный поток после gain и фильтров
            vadService.startMonitoring('local', audioSettingsStore.stream);
        }
    }

    // Настройка VAD для удаленного участника
    private setupRemoteVAD(userId: string, remoteStream: MediaStream): void {
        vadService.startMonitoring(userId, remoteStream);
    }

    // Получить состояние активности речи пользователя
    public getUserVoiceActivity(userId: string): boolean {
        return vadService.getUserActivity(userId);
    }

    // Получить уровень громкости пользователя
    public getUserVolumeLevel(userId: string): number {
        return vadService.getUserVolume(userId);
    }
}

export default WebRTCClient;

