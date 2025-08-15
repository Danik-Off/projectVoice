import React, { createContext, useContext, ReactNode } from 'react';
import { useUserProfileModal } from '../hooks/useUserProfileModal';
import UserProfileModal from './UserProfileModal';

interface UserProfileContextType {
    openProfile: (user: any, isOwnProfile?: boolean) => void;
    closeProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
    children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
    const { isOpen, user, isOwnProfile, openProfile, closeProfile } = useUserProfileModal();

    const contextValue: UserProfileContextType = {
        openProfile,
        closeProfile
    };

    return (
        <UserProfileContext.Provider value={contextValue}>
            {children}
            <UserProfileModal
                isOpen={isOpen}
                onClose={closeProfile}
                user={user}
                isOwnProfile={isOwnProfile}
            />
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = (): UserProfileContextType => {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};
