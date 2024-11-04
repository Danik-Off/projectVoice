import { useParams } from 'react-router-dom';
import './ChannelPage.css'; // Assuming you have a separate CSS file for styling
import ChannelSidebar from './components/channelSidebar/ChannelSidebar';
import MessageList from './components/messageList/MessageList';
import UserSidebar from './components/userSidebar/UserSidebar';
import { useEffect } from 'react';
import serverStore from '../../store/serverStore';
import VoiceRoom from './components/voiceRoom/VoiceRoom';

const ChannelPage = () => {
    const { serverId } = useParams<{ serverId: string }>();
    useEffect(() => {
        serverStore.fetchServerById(Number(serverId));
    });
    return (
        <div className="channel-page">
            <ChannelSidebar></ChannelSidebar>
            {/* <MessageList></MessageList> */}
            <VoiceRoom></VoiceRoom>
            <UserSidebar></UserSidebar>
        </div>
    );
};

export default ChannelPage;
