import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import ServerSidebar from './components/serverSlidebar/ServerSidebar';
import ServerCreateModal from './components/serverSlidebar/serverCreateModal/ServerCreateModal';
import VoiceControls from '../channelPage/components/channelSidebar/components/voiceControls/VoiceControls';
import voiceRoomStore from '../../store/roomStore';
import audioSettingsStore from '../../store/AudioSettingsStore';

import './Main.scss'; // Main CSS for layout

const Layout = observer(() => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [voiceControlsHeight, setVoiceControlsHeight] = useState(0);
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

    // Обновляем высоту VoiceControls при изменении состояния
    useEffect(() => {
        const updateVoiceControlsHeight = () => {
            const voiceControls = document.querySelector('.voice-controls');
            if (voiceControls) {
                const height = voiceControls.getBoundingClientRect().height;
                setVoiceControlsHeight(height);
            }
        };

        // Обновляем высоту сразу
        updateVoiceControlsHeight();
        
        // Используем ResizeObserver для отслеживания изменений размера
        const resizeObserver = new ResizeObserver(() => {
            updateVoiceControlsHeight();
        });

        const voiceControls = document.querySelector('.voice-controls');
        if (voiceControls) {
            resizeObserver.observe(voiceControls);
        }

        // Также наблюдаем за изменениями в DOM
        const mutationObserver = new MutationObserver(() => {
            setTimeout(updateVoiceControlsHeight, 50); // Небольшая задержка для анимаций
        });

        if (voiceControls) {
            mutationObserver.observe(voiceControls, { 
                childList: true, 
                subtree: true, 
                attributes: true,
                attributeFilter: ['class']
            });
        }

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [shouldShowVoiceControls]);

    return (
        <div className="main-page" onClick={initMedia}>
            {shouldShowVoiceControls && <VoiceControls />}
            <ServerSidebar onOpenModal={() => setModalOpen(true)} />
            <div 
                className="content-page"
                style={{ 
                    transition: 'margin-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </div>

            <ServerCreateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
});

export default Layout;

