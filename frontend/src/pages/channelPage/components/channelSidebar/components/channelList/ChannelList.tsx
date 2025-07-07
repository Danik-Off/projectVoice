// ChannelList.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import serverStore from '../../../../../../store/serverStore';
import { Channel } from '../../../../../../types/channel';

import './ChannelList.scss'; // Import the CSS file for styling
import CreateChannelForm from './components/сreateChannelForm/CreateChannelForm';
import voiceRoomStore from '../../../../../../store/roomStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import channelsStore from '../../../../../../store/channelsStore';
import Spinner from '../../../../../../components/spinner/Spinner';

const ChannelList: React.FC = observer(() => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

    // Загрузка данных о каналах при монтировании компонента
    useEffect(() => {
        const fetchChannels = async () => {
            // Получаем сервер из Store
            if (serverStore.currentServer) {
                // Получаем каналы сервера
                await channelsStore.fetchChannels(serverStore.currentServer.id);
            }
        };

        fetchChannels();
    }, []);

    const handleNavigate = (channel: Channel) => {
        const serverId = serverStore.currentServer?.id;
        if (!serverId) return;
        let newPath = '';
        if (channel.type === 'voice') {
            newPath = `/server/${serverId}/voiceRoom/${channel.id}`;
            voiceRoomStore.connectToRoom(channel.id, channel.name);
        } else {
            newPath = `/server/${serverId}/textRoom/${channel.id}`;
            // Не отключаемся от голосового канала при переходе на текстовый
            // voiceRoomStore.disconnectToRoom();
        }
        navigate(newPath);
    };

    const textChannels = channelsStore?.channels?.filter((channel: Channel) => channel.type === 'text') || [];
    const voiceChannels = channelsStore?.channels?.filter((channel: Channel) => channel.type === 'voice') || [];

    const channelList = (
        <div className="channel-list">
            <button className="button " onClick={() => setIsFormVisible(!isFormVisible)}>
                {t('channelsPage.channelList.' + (isFormVisible ? 'cancel' : 'create') + 'Btn')}
            </button>
            <h2>{t('channelsPage.channelList.textTitle')}</h2>
            {textChannels.length > 0 ? (
                <ul className="channel-list__items">
                    {textChannels.map((channel: Channel) => (
                        <li key={channel.id} onClick={() => handleNavigate(channel)} className="channel-list__item">
                            {channel.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="channel-list__empty">No text channels available.</p>
            )}

            <h2>{t('channelsPage.channelList.voiceTitle')}</h2>
            {voiceChannels.length > 0 ? (
                <ul className="channel-list__items">
                    {voiceChannels.map((channel: Channel) => (
                        <li key={channel.id} onClick={() => handleNavigate(channel)} className="channel-list__item">
                            {channel.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="channel-list__empty">No voice channels available.</p>
            )}

            {isFormVisible && <CreateChannelForm onClose={() => setIsFormVisible(false)} />}
        </div>
    );
    const loadingList = (
        <div className="spinner-conteiner">
            <Spinner></Spinner>
        </div>
    );
    return channelsStore.loading ? loadingList : channelList;
});

export default ChannelList;

