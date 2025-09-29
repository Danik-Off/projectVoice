import { reaction } from 'mobx';
import { iceServers } from '../configs/iceServers';
import { Signal } from '../types/WebRTCClient.types';
import audioSettingsStore from '../store/AudioSettingsStore';
class WebRTCClient {
    public sendSignal: null | ((signal: Signal) => void) = null;

    public changeState: null | ((id: string, signal: Event) => void) = null;

    private readonly remoteStreams: Map<string, MediaStream> = new Map();
    private readonly peerConnections: Map<string, RTCPeerConnection> = new Map();

    private localStream: MediaStream | null = null;

    private isMuteMicro = false;

    //управление Медиа
    public async initializeMedia() {
        reaction(
            () => audioSettingsStore.stream,
            (val: any) => {
                this.resendlocalStream();
            },
        );
    }

    //Логика подключения
    public createPeerConnection(id: string) {
        const newPeerConnection = new RTCPeerConnection({
            iceServers: iceServers,
        });

        newPeerConnection.onicecandidate = (event) => {
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
     
        let remoteStream = this.remoteStreams.get(id);
        if (!remoteStream) {
            remoteStream = new MediaStream();
            this.remoteStreams.set(id, remoteStream);
            const audioElement = document.createElement('audio');
            audioElement.srcObject = remoteStream;
            audioElement.autoplay = true;
            document.body.appendChild(audioElement);
        } 

        remoteStream.addTrack(track);
    }

    private resendlocalStream() {
        if (audioSettingsStore.stream) {
            this.peerConnections.forEach((peerConnection) => {
                const newAudioTrack = audioSettingsStore.stream.getAudioTracks()[0];
                const sender = peerConnection.getSenders().find((s) => s.track?.kind === 'audio');
                if (sender) {
                    sender.replaceTrack(newAudioTrack);
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
                track.enabled = !this.isMuteMicro;
            });
        }
    }

    private setState(): void {}

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
    }
}

export default WebRTCClient;

