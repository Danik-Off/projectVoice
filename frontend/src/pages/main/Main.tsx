import { Outlet } from 'react-router-dom';
import ServerSidebar from './components/serverSlidebar/ServerSidebar';

import './Main.scss'; // Main CSS for layout

const Layout = () => {
    return (
        <div className="main-page">
            <ServerSidebar />
            <div className="content-page">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
