import React from 'react';
import { User } from '../types/user';
import './ClickableAvatar.scss';

interface ClickableAvatarProps {
    user: User;
    size?: 'small' | 'medium' | 'large';
    showStatus?: boolean;
    onClick?: (user: User) => void;
    className?: string;
}

const ClickableAvatar: React.FC<ClickableAvatarProps> = ({
    user,
    size = 'medium',
    showStatus = true,
    onClick,
    className = ''
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick(user);
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'online': return '#4CAF50';
            case 'idle': return '#FF9800';
            case 'dnd': return '#F44336';
            case 'invisible': return '#9E9E9E';
            default: return '#9E9E9E';
        }
    };

    const getSizeClass = () => {
        switch (size) {
            case 'small': return 'avatar-small';
            case 'large': return 'avatar-large';
            default: return 'avatar-medium';
        }
    };

    return (
        <div 
            className={`clickable-avatar ${getSizeClass()} ${className}`}
            onClick={handleClick}
            title={`${user.username} - Click to view profile`}
        >
            {user.profilePicture ? (
                <img 
                    src={user.profilePicture} 
                    alt={user.username}
                    className="avatar-image"
                />
            ) : (
                <div className="avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                </div>
            )}
            
            {showStatus && (
                <div 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                ></div>
            )}
        </div>
    );
};

export default ClickableAvatar;
