import { io, Socket } from 'socket.io-client';
import { getCookie } from './cookie';
import { BASE_URL } from '../configs/apiConfig';

class SocketClient {

    private token: string;
    private socket: Socket | null;

    public constructor() {
        this.token = getCookie('token') || '';
        this.socket = null;
    }

    public connect() {
        if (this.socket && this.socket.connected) {
            console.log('Соединение уже установлено');
            return;
        }

        this.socket = io(BASE_URL, {
            path: '/socket',
            query: { token: this.token },
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('Соединение с Socket.IO установлено');
        });
    }

    public socketOn(ev: string, listner: (data: any) => void) {
        this.socket && this.socket.on(ev, listner);
    }

    public socketEmit(ev: string, ...args: any) {
        this.socket && this.socket.emit(ev, ...args);
    }

    public getSocketId(): string | undefined {
        return this.socket?.id;
    }
}

export default SocketClient;
