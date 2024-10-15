import React from 'react';

const Profile = () => {
    return (
        <div>
            <h1>Profile</h1>
            <div className="profile-header">
                <img src="/path/to/profile-picture.jpg" alt="Profile" />
                <h2>Username</h2>
                <p>@username</p>
                <p>Bio: Short bio about the user.</p>
                <button>Edit Profile</button>
            </div>
            <div className="tweets">
                <h3>Tweets</h3>
                <div className="tweet">
                    <p>This is a user’s tweet...</p>
                </div>
                {/* Add more tweets */}
            </div>
        </div>
    );
};

export default Profile;
