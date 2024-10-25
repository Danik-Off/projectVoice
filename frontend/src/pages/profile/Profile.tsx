import React from 'react';
import './Profile.css';

const Profile = () => {
    return (
        <div className="profile-container">
            <div className="cover-photo"></div>
            <div className="profile-header">
                <img className="profile-picture" src="/path/to/profile-picture.jpg" alt="Profile" />
                <div className="profile-info">
                    <h2 className="username">Username</h2>
                    <p className="tag">@username</p>
                    <p className="bio">Bio: Short bio about the user.</p>
                    <button className="edit-button">Edit Profile</button>
                </div>
            </div>
            <div className="navigation">
                <span>Tweets</span>
                <span>Following</span>
                <span>Followers</span>
                <span>Likes</span>
            </div>
            <div className="activity-section">
                <h3 className="activity-title">Recent Activity</h3>
                <div className="activity-item">
                    <p>This is a user’s recent activity...</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
