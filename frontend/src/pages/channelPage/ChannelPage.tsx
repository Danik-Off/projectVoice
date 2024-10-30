import './ChannelPage.css'; // Assuming you have a separate CSS file for styling
import ChannelSidebar from './components/channelSidebar/ChannelSidebar';
import MessageList from './components/messageList/MessageList';
import UserSidebar from './components/userSidebar/UserSidebar';

const ChannelPage = () => {
    return (
        <div className='channel-page'>
            <ChannelSidebar></ChannelSidebar>
            <MessageList></MessageList>
            <UserSidebar></UserSidebar>
        </div>
    );
};

export default ChannelPage;
