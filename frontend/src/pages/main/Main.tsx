import { Outlet } from 'react-router-dom';
import ServerSidebar from './components/serverSlidebar/ServerSidebar';

import './Main.css'; // Main CSS for layout

const Layout = () => {
    return (
        <div className="main-page">
            {/* Render server sidebar */}
            <ServerSidebar />
            <Outlet /> {/* This will render the matched child route */}
        </div>
    );
};

export default Layout;
