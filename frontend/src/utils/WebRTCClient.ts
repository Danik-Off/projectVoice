import { iceServers } from '../configs/iceServers';
import { Signal } from '../types/WebRTCClient.types';
import { STREAM_CONSTRAINTS } from './constants/WebRTCClient.constants';

class WebRTCClient {
    public sendSignal: null | ((signal: Signal) => void) = null;

    private readonly remoteStreams: Map<string, MediaStream> = new Map();
    private readonly peerConnections: Map<string, RTCPeerConnection> =
        new Map();

    private localStream: MediaStream | null;

    constructor() {
        this.localStream = null;
    }

    //управление Медиа
    public async initializeMedia() {
        try {
            this.localStream =
                await navigator.mediaDevices.getUserMedia(STREAM_CONSTRAINTS);
            if (this.localStream) {
                for (const socketId in this.peerConnections) {
                    const peerConnection = this.peerConnections.get(socketId);
                    this.localStream.getTracks().forEach((track) => {
                        this.localStream &&
                            peerConnection &&
                            peerConnection.addTrack(track, this.localStream);
                    });
                }
            }
        } catch (error) {
            console.error('Ошибка доступа к локальному медиа:', error);
        }
    }

    public muteMicrophone() {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach((track) => {
                track.enabled = false; // Mute the audio track
            });
            console.log('Микрофон отключен');
        }
    }

    public unmuteMicrophone() {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach((track) => {
                track.enabled = true; // Unmute the audio track
            });
            console.log('Микрофон включен');
        }
    }

    //Логика подключения
    public createPeerConnection(id: string) {
        console.log('создание peerConnection c id', id);
        const newPeerConnection = new RTCPeerConnection({
            iceServers: iceServers,
        });

        newPeerConnection.onicecandidate = (event) => {
            console.log('КААААААААНННННДИИИИИДАТ');
            if (!event.candidate) {
                console.error('candidate не существует');
                return;
            }
            if (!this.sendSignal) {
                console.error('sendSignal не существует');
                return;
            }
            console.log(
                '🚀 ~ SocketClient ~ createPeerConnection ~ candidate:',
                event.candidate
            );
            this.sendSignal({
                to: id,
                type: 'candidate',
                candidate: event.candidate,
            });
        };

        newPeerConnection.ontrack = (event) => {
            this.addRemoteStream(event.track, id);
        };

        this.peerConnections.set(id, newPeerConnection);
        this.addLocalStream(id);
        return newPeerConnection;
    }

    public async createOffer(id: string) {
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
        const peerConnection = this.peerConnections.get(id);
        console.log(
            '🚀 ~ WebRTCClient ~ createAnswer ~ peerConnection:',
            peerConnection
        );
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
        console.log('🚀 ~ WebRTCClient ~ handleSignal ~ data:', data);

        let peerConnection = this.peerConnections.get(from) || false;
        console.log(
            '🚀 ~ WebRTCClient ~ handleSignal ~ peerConnection:',
            peerConnection
        );

        if (!peerConnection) {
            peerConnection = await this.createPeerConnection(from); // Create PeerConnection if it doesn't exist
        }

        switch (type) {
            case 'offer':
                await peerConnection.setRemoteDescription(
                    new RTCSessionDescription({ type, sdp })
                );
                console.log(
                    '🚀 ~ WebRTCClient ~ handleSignal ~ peerConnection:',
                    peerConnection
                );
                await this.createAnswer(from);
                break;
            case 'answer':
                console.log('🚀 ~ SocketClient ~ handleSignal ~ data:', data);
                await peerConnection.setRemoteDescription(
                    new RTCSessionDescription({ type, sdp })
                );
                break;
            case 'candidate':
                await peerConnection.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
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
            const audioElement = document.createElement('audio');
            audioElement.srcObject = remoteStream;
            audioElement.autoplay = true;
            document.body.appendChild(audioElement);
        }

        remoteStream.addTrack(track);
    }

    private addLocalStream(id: string): void {
        if (this.localStream) {
            const peerConnection = this.peerConnections.get(id);
            this.localStream.getTracks().forEach((track) => {
                //Если существет локальный стрим и пир для подключения то рассылаем стрим
                this.localStream &&
                    peerConnection &&
                    peerConnection.addTrack(track, this.localStream);
            });
        }
    }

    // отключение

    // если пользователь отключился
    public disconnectPeer(id: string) {
        const peerConnection = this.peerConnections.get(id);
        if (peerConnection) {
            peerConnection.close();
            this.peerConnections.delete(id);
            console.log(`Соединение с пользователем ${id} закрыто`);
        }

        const remoteStream = this.remoteStreams.get(id);
        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
            this.remoteStreams.delete(id);
        }
    }
    // когда мы сами отключаемся
    public disconect() {
        //закрываем потоки
        this.peerConnections.forEach((peerConnection) => {
            peerConnection.close();
        });
        this.peerConnections.clear();

        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => track.stop());
            this.localStream = null;
        }

        //тормозим стримы
        this.remoteStreams.forEach((stream) => {
            stream.getTracks().forEach((track) => track.stop());
        });
        this.remoteStreams.clear();
    }
}

export default WebRTCClient;
