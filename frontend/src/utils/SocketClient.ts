import { io, Socket } from 'socket.io-client';
import { getCookie } from './cookie';

class SocketClient {
    // private url = `https://projectvoice.suzenebl.ru`; //todo вынести в конфиг
    private url = `http://localhost:5555`

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

        this.socket = io(this.url, {
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
}

export default SocketClient;
