// ChannelList.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import serverStore from '../../../../../../store/serverStore';
import { Channel } from '../../../../../../types/channel';

import './ChannelList.css'; // Import the CSS file for styling
import CreateChannelForm from './components/сreateChannelForm/CreateChannelForm';

const ChannelList: React.FC = observer(() => {
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

    // Загрузка данных о каналах при монтировании компонента
    useEffect(() => {
        const fetchChannels = async () => {
            // Получаем сервер из Store
            if (serverStore.currentServer) {
                // Получаем каналы сервера
                await serverStore.fetchChannels();
            }
        };

        fetchChannels();
    }, []); // Убираем зависимость, используем MobX для наблюдения за изменениями

    const textChannels =
        serverStore.currentServer?.channels?.filter(
            (channel: Channel) => channel.type === 'text'
        ) || [];
    const voiceChannels =
        serverStore.currentServer?.channels?.filter(
            (channel: Channel) => channel.type === 'voice'
        ) || [];

    return (
        <div className="channel-list">
            <h2>Text Channels</h2>
            {textChannels.length > 0 ? (
                <ul className="channel-list__items">
                    {textChannels.map((channel: Channel) => (
                        <li key={channel.id} className="channel-list__item">
                            {channel.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="channel-list__empty">
                    No text channels available.
                </p>
            )}

            <h2>Voice Channels</h2>
            {voiceChannels.length > 0 ? (
                <ul className="channel-list__items">
                    {voiceChannels.map((channel: Channel) => (
                        <li key={channel.id} className="channel-list__item">
                            {channel.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="channel-list__empty">
                    No voice channels available.
                </p>
            )}

            <button
                className="channel-list__create-button"
                onClick={() => setIsFormVisible(!isFormVisible)}
            >
                {isFormVisible ? 'Cancel' : 'Create Channel'}
            </button>
            {isFormVisible && (
                <CreateChannelForm onClose={() => setIsFormVisible(false)} />
            )}
        </div>
    );
});

export default ChannelList;
