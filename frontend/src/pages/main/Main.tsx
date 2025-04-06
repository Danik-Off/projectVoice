import { Outlet } from 'react-router-dom';
import ServerSidebar from './components/serverSlidebar/ServerSidebar';

import './Main.scss'; // Main CSS for layout
import audioSettingsStore from '../../store/AudioSettingsStore';

const Layout = () => {
    const initMedia = () => {
        audioSettingsStore.initMedia();
    };

    return (
        <div className="main-page" onClick={initMedia}>
            <ServerSidebar />
            <div className="content-page">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;

