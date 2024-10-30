import './UserSidebar.css'; // Assuming you have a separate CSS file for styling

const UserSidebar = () => {
    return (
        <aside className="user-sidebar">
            <div className="user-info">
                <p><strong>Username</strong></p>
                <p>#1234</p>
            </div>
            {/* Add friends or additional info here */}
        </aside>
    );
};

export default UserSidebar;
