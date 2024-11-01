import { io, Socket } from 'socket.io-client';
import { getCookie } from './cookie';

class SocketClient {
    private token: string;
    private socket: Socket | null;
    private peerConnections: { [key: string]: RTCPeerConnection }; // Storage for multiple peer connections
    private localStream: MediaStream | null;
    private remoteStreams: { [key: string]: MediaStream }; // Store remote user streams
    private readonly streamConstraints = {
        audio: true,
    };

    constructor() {
        this.token = getCookie('token') || '';
        this.socket = null;
        this.peerConnections = {};
        this.localStream = null;
        this.remoteStreams = {};
    }

    public connect(channelId: number) {
        if (this.socket && this.socket.connected) {
            console.log('Соединение уже установлено');
            return;
        }

        const url = `https://projectvoice.suzenebl.ru`;
        this.socket = io(url, {
            path: '/socket',
            query: { token: this.token },
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('Соединение с Socket.IO установлено');
            this.socket?.emit('join-room', channelId, this.token);
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
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(
                this.streamConstraints
            );
            if (this.localStream) {
                console.log('Локальный поток получен');
                this.localStream.getTracks().forEach((track) => {
                    // Tracks will be added to each PeerConnection when created
                });
            }
        } catch (error) {
            console.error('Ошибка доступа к локальному медиа:', error);
        }
    }

    private createPeerConnection(targetUserId: string): RTCPeerConnection {
        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("🚀 ~ SocketClient ~ createPeerConnection ~ candidate:", event.candidate)
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
        this.remoteStreams = {};
    }
}

export default SocketClient;
