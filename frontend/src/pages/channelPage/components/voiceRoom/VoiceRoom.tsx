import React from 'react';
import './VoiceRoom.css'; // стили для оформления комнаты
import voiceRoomStore from '../../../../store/roomStore';
import { observer } from 'mobx-react';

const VoiceRoom: React.FC = observer(() => {
    // const users = [
    //     { id: '1', name: 'Alice', isSpeaking: false },
    //     { id: '2', name: 'Bob', isSpeaking: true },
    //     { id: '3', name: 'Charlie', isSpeaking: false },
    // ];
    const users = voiceRoomStore.participants;
    console.log(users);
    return (
        <div className="voice-room">
            <h2>Voice Room</h2>
            <div className="user-list">
                {users.map((user) => (
                    <div
                    key={user.socketId}
                    className={`user-box ${
                        user.isSpeaking ? 'speaking' : ''
                    }`}
                    >
                        <div className="user-avatar">
                            {/* Тут можно поставить заглушку аватара или иконку */}
                            {/* <span>{user.name}</span> */}
                        </div>
                        <div className="user-name">{user.socketId}</div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default VoiceRoom;
