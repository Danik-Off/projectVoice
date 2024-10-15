import React from 'react';

const Settings = () => {
    return (
        <div>
            <h1>Settings</h1>
            <div className="settings-option">
                <h3>Account</h3>
                <p>Update your account details like email, password, etc.</p>
            </div>
            <div className="settings-option">
                <h3>Privacy</h3>
                <p>Control your privacy settings.</p>
            </div>
            <div className="settings-option">
                <h3>Notifications</h3>
                <p>Manage your notification preferences.</p>
            </div>
            {/* Add more settings options */}
        </div>
    );
};

export default Settings;
