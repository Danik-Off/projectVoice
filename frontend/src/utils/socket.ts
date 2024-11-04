import { io, Socket } from 'socket.io-client';
import { getCookie } from './cookie';
import { SocketClientState } from '../types/socket.types';
import { iceServers } from '../configs/iceServers';

class SocketClient {
    public users = [];

    public onStateChange: ((state: SocketClientState) => void) | null = null;

    // Getter for state
    public get state(): SocketClientState {
        return this._state;
    }

    // Public setter for state
    public set state(newState: SocketClientState) {
        this._state = newState; // Update the state
        if (this.onStateChange) {
            this.onStateChange(this._state); // Invoke the handler if set
        }
    }

    private _state: SocketClientState;

    private token: string;
    private socket: Socket | null;
    private peerConnections: { [key: string]: RTCPeerConnection }; // Storage for multiple peer connections
    private localStream: MediaStream | null;
    private remoteStreams: { [key: string]: MediaStream }; // Store remote user streams

    public isMuteMicro = false;

    private readonly streamConstraints = {
        audio: true,
    };

    constructor() {
        this.token = getCookie('token') || '';
        this.socket = null;
        this.peerConnections = {};
        this.localStream = null;
        this.remoteStreams = {};
        this._state = SocketClientState.INIT;
    }

    public muteMicrophone() {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach((track) => {
                track.enabled = false; // Mute the audio track
            });
            console.log('Микрофон отключен');
            this.socket?.emit('mute');
            this.isMuteMicro = true;
        }
    }

    public unmuteMicrophone() {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach((track) => {
                track.enabled = true; // Unmute the audio track
            });
            console.log('Микрофон включен');
            this.socket?.emit('unmute');
            this.isMuteMicro = false;
        }
    }

    public connect(channelId: number) {
        if (this.socket && this.socket.connected) {
            console.log('Соединение уже установлено');
            return;
        }

        // const url = `https://projectvoice.suzenebl.ru`;
        const url = `http://localhost:5555`;
        this.socket = io(url, {
            path: '/socket',
            query: { token: this.token },
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('Соединение с Socket.IO установлено');
            this.socket?.emit('join-room', channelId, this.token);
        });

        this.socket.on('created', async (user: { socketId: string }) => {
            console.log(`Пользователь ${user.socketId} подключен`);
            await this.initializeMedia(); // Initialize media
        });

        this.socket.on('user-connected', async (user: { socketId: string }) => {
            console.log(`Пользователь ${user.socketId} подключен`);
            await this.initializeMedia(); // Initialize media
            this.createOffer(user.socketId); // Initiate connection with the new user
        });

        this.socket.on('user-disconnected', (socketId: string) => {
            console.log(`Пользователь ${socketId} отключен`);
            this.disconnectPeer(socketId); // Close connection with the disconnected user
        });

        this.socket.on('signal', (data) => {
            console.log(data);
            this.handleSignal(data);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Ошибка Socket.IO подключения:', error);
        });

        this.socket.on('disconnect', () => {
            console.log('Соединение с Socket.IO закрыто');
        });
    }

    private async initializeMedia() {
        this.state = SocketClientState.MEDIA_INITIALIZING;
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(
                this.streamConstraints
            );
            this.state = SocketClientState.MEDIA_INITIALIZED;
            if (this.localStream) {
                for (const socketId in this.peerConnections) {
                    this.localStream.getTracks().forEach((track) => {
                        this.localStream &&
                            this.peerConnections[socketId].addTrack(
                                track,
                                this.localStream
                            );
                    });
                }
            }
            if (this.isMuteMicro) {
                this.localStream.getAudioTracks().forEach((track) => {
                    track.enabled = false; // Mute the audio track
                });
            }
        } catch (error) {
            console.error('Ошибка доступа к локальному медиа:', error);
            this.state = SocketClientState.MEDIA_ERROR;
        }
    }

    private createPeerConnection(targetUserId: string): RTCPeerConnection {
        this.state = SocketClientState.PEER_CONNECTION_CREATING;
        const peerConnection = new RTCPeerConnection({
            iceServers: iceServers,
        });

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket?.emit('signal', {
                    to: targetUserId,
                    type: 'candidate',
                    candidate: event.candidate,
                });
            }
        };

        peerConnection.ontrack = (event) => {
            if (!this.remoteStreams[targetUserId]) {
                this.remoteStreams[targetUserId] = new MediaStream();
                console.log(
                    'Удалённый поток добавлен для пользователя:',
                    targetUserId
                );
                const audioElement = document.createElement('audio');
                audioElement.srcObject = this.remoteStreams[targetUserId];
                audioElement.autoplay = true;
                document.body.appendChild(audioElement);
            }
            this.remoteStreams[targetUserId].addTrack(event.track);
        };

        // Add local tracks to the PeerConnection
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => {
                this.localStream &&
                    peerConnection.addTrack(track, this.localStream);
            });
        }

        this.peerConnections[targetUserId] = peerConnection; // Save PeerConnection for the user
        this.state = SocketClientState.PEER_CONNECTION_ESTABLISHED;
        return peerConnection;
    }

    private async createOffer(targetUserId: string) {
        const peerConnection = this.createPeerConnection(targetUserId);
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            this.socket?.emit('signal', {
                to: targetUserId,
                type: 'offer',
                sdp: offer.sdp,
            });
        } catch (error) {
            console.error('Ошибка при создании предложения:', error);
        }
    }

    private async createAnswer(targetUserId: string) {
        const peerConnection = this.peerConnections[targetUserId];
        try {
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            this.socket?.emit('signal', {
                to: targetUserId,
                type: 'answer',
                sdp: answer.sdp,
            });
        } catch (error) {
            console.error('Ошибка при создании ответа:', error);
        }
    }

    private async handleSignal(data: any) {
        const { from, type, sdp, candidate } = data;

        if (!this.peerConnections[from]) {
            this.createPeerConnection(from); // Create PeerConnection if it doesn't exist
        }

        if (type === 'offer') {
            await this.peerConnections[from].setRemoteDescription(
                new RTCSessionDescription({ type, sdp })
            );
            await this.createAnswer(from); // Reply to the user who sent the offer
        } else if (type === 'answer') {
            console.log('🚀 ~ SocketClient ~ handleSignal ~ data:', data);
            await this.peerConnections[from].setRemoteDescription(
                new RTCSessionDescription({ type, sdp })
            );
        } else if (type === 'candidate') {
            await this.peerConnections[from].addIceCandidate(
                new RTCIceCandidate(candidate)
            );
        }
    }

    private disconnectPeer(socketId: string) {
        if (this.peerConnections[socketId]) {
            this.peerConnections[socketId].close(); // Close the connection
            delete this.peerConnections[socketId]; // Remove from storage
            console.log(`Соединение с пользователем ${socketId} закрыто`);
        }
        if (this.remoteStreams[socketId]) {
            this.remoteStreams[socketId]
                .getTracks()
                .forEach((track) => track.stop());
            delete this.remoteStreams[socketId]; // Remove remote stream
        }
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            console.log('Socket.IO соединение закрыто');
        }
        Object.values(this.peerConnections).forEach((peerConnection) =>
            peerConnection.close()
        );
        this.peerConnections = {};
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => track.stop());
            this.localStream = null;
        }
        Object.values(this.remoteStreams).forEach((stream) => {
            stream.getTracks().forEach((track) => track.stop());
        });
        this.state = SocketClientState.PEER_CONNECTION_CLOSED;
        this.remoteStreams = {};
    }
}

export default SocketClient;
