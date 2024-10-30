import './Main.css';

const Layout = () => {
    return (
        <div className="main-page">
            {/* Sidebar for servers */}
            <aside className="server-sidebar">
                {/* Placeholder for server icons */}
                <div className="server-icon">+</div>
                <div className="server-icon active">D</div>
                {/* More server icons... */}
            </aside>

            {/* Sidebar for channels within a selected server */}
            <aside className="channel-sidebar">
                <div className="channel-header">Server Name</div>
                <div className="channel-list">
                    <div className="channel"># general</div>
                    <div className="channel"># memes</div>
                    <div className="channel"># gaming</div>
                    {/* More channels... */}
                </div>
            </aside>

            {/* Main content area for messages */}
            <main className="content">
                <div className="message-list">
                    <p className="message"><strong>User1:</strong> Hello everyone!</p>
                    <p className="message"><strong>User2:</strong> How's it going?</p>
                    {/* More messages... */}
                </div>
            </main>

            {/* Right sidebar for user/friends info */}
            <aside className="user-sidebar">
                <div className="user-info">
                    <p><strong>Username</strong></p>
                    <p>#1234</p>
                </div>
                {/* Friends or additional info... */}
            </aside>
        </div>
    );
};

export default Layout;
