import React from 'react';

const UserInfo: React.FC = () => {
    return (
        <div className="user-info">
            <img className="avatar" src="avatar-placeholder.png" alt="User Avatar" />
            <div className="username">Username</div>
            <button className="settings-button">⚙️</button>
        </div>
    );
};

export default UserInfo;
