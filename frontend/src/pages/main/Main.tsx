import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import ServerSidebar from './components/serverSlidebar/ServerSidebar';
import ServerCreateModal from './components/serverSlidebar/serverCreateModal/ServerCreateModal';
import VoiceControls from '../channelPage/components/channelSidebar/components/voiceControls/VoiceControls';
import { UserProfileProvider } from '../../components/UserProfileProvider';
import voiceRoomStore from '../../store/roomStore';
import audioSettingsStore from '../../store/AudioSettingsStore';

import './Main.scss'; // Main CSS for layout

const Layout = observer(() => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [wasConnectedToVoice, setWasConnectedToVoice] = useState(false);
    
    const initMedia = () => {
        audioSettingsStore.initMedia();
    };

    const isConnectedToVoice = voiceRoomStore.currentVoiceChannel !== null;

    // Отслеживаем, был ли пользователь подключен к голосовому каналу
    useEffect(() => {
        if (isConnectedToVoice) {
            setWasConnectedToVoice(true);
        } else if (wasConnectedToVoice && !isConnectedToVoice) {
            // Если пользователь отключился от голосового канала, скрываем VoiceControls
            setWasConnectedToVoice(false);
        }
    }, [isConnectedToVoice, wasConnectedToVoice]);

    // VoiceControls остается видимым, если пользователь был подключен к голосовому каналу
    const shouldShowVoiceControls = isConnectedToVoice || wasConnectedToVoice;



    return (
        <UserProfileProvider>
            <div className={`main-page ${shouldShowVoiceControls ? 'with-voice-controls' : ''}`} onClick={initMedia}>
                {shouldShowVoiceControls && <VoiceControls />}
                <ServerSidebar onOpenModal={() => setModalOpen(true)} />
                <div className="content-page">
                    <div className="content-wrapper">
                        <Outlet />
                    </div>
                </div>

                <ServerCreateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
            </div>
        </UserProfileProvider>
    );
});

export default Layout;

