import { Outlet, useParams, useNavigate } from 'react-router-dom';
import './ChannelPage.scss'; // Assuming you have a separate CSS file for styling
import ChannelSidebar from './components/channelSidebar/ChannelSidebar';
import VoiceControls from './components/channelSidebar/components/voiceControls/VoiceControls';
import BlockedServerModal from '../../components/BlockedServerModal';
import { useEffect, useState } from 'react';
import serverStore from '../../store/serverStore';
import roomStore from '../../store/roomStore';
import Spinner from '../../components/spinner/Spinner';
import { observer } from 'mobx-react';

const LoadingState: React.FC = () => (
    <div className="loading-state">
        <div className="loading-content">
            <div className="loading-spinner-wrapper">
                <Spinner />
            </div>
            <h2 className="loading-title">Загрузка сервера...</h2>
            <p className="loading-description">
                Подготавливаем все каналы и настройки для вас
            </p>
            <div className="loading-progress">
                <div className="progress-bar">
                    <div className="progress-fill"></div>
                </div>
                <span className="progress-text">Инициализация...</span>
            </div>
        </div>
    </div>
);

const Page = observer(() => {
    const isVoiceConnected = roomStore.currentVoiceChannel !== null;

    return (
        <>
            {!serverStore.loading ? (
                <div className={`channel-page ${isVoiceConnected ? 'with-voice-controls' : ''}`}>
                    <ChannelSidebar />
                    <div className="channel-content">
                        <Outlet />
                    </div>
                    {isVoiceConnected && <VoiceControls />}
                </div>
            ) : (
                <LoadingState />
            )}
        </>
    );
});

const ChannelPage = () => {
    const { serverId } = useParams<{ serverId: string }>();
    const navigate = useNavigate();
    const [showBlockedModal, setShowBlockedModal] = useState(false);
    
    useEffect(() => {
        if (serverId) {
            serverStore.fetchServerById(Number(serverId));
        }
    }, [serverId]);

    // Проверяем, заблокирован ли сервер
    useEffect(() => {
        if (serverStore.currentServer && serverStore.currentServer.isBlocked) {
            setShowBlockedModal(true);
        }
    }, []);

    const handleBlockedModalClose = () => {
        setShowBlockedModal(false);
        navigate('/'); // Перенаправляем на главную страницу
    };

    return (
        <>
            <Page />
            <BlockedServerModal
                isOpen={showBlockedModal}
                onClose={handleBlockedModalClose}
                serverName={serverStore.currentServer?.name || ''}
                reason={serverStore.currentServer?.blockReason}
                blockedAt={serverStore.currentServer?.blockedAt}
                blockedBy={serverStore.currentServer?.blockedByUser?.username}
            />
        </>
    );
};

export default ChannelPage;
