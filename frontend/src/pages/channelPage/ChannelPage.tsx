import { Outlet, useParams } from 'react-router-dom';
import './ChannelPage.scss'; // Assuming you have a separate CSS file for styling
import ChannelSidebar from './components/channelSidebar/ChannelSidebar';
import { useEffect } from 'react';
import serverStore from '../../store/serverStore';
import Spinner from '../../components/spinner/Spinner';
import { observer } from 'mobx-react';

const Page = observer(() => (
    <>
        {!serverStore.loading ? (
            <div className="channel-page">
                <ChannelSidebar />
                <Outlet />
                {/* <UserSidebar /> */}
            </div>
        ) : (
            <div className="spinner-conteiner">
                <Spinner />
            </div>
        )}
    </>
));

const ChannelPage = () => {
    const { serverId } = useParams<{ serverId: string }>();
    useEffect(() => {
        serverStore.fetchServerById(Number(serverId));
    }, [serverId]);

    return <Page></Page>;
};

export default ChannelPage;
