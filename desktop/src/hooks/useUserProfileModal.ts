import { useState, useCallback } from 'react';
import { User } from '../types/user';

interface UseUserProfileModalReturn {
    isOpen: boolean;
    user: User | null;
    isOwnProfile: boolean;
    openProfile: (user: User, isOwnProfile?: boolean) => void;
    closeProfile: () => void;
}

export const useUserProfileModal = (): UseUserProfileModalReturn => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    const openProfile = useCallback((userData: User, ownProfile: boolean = false) => {
        setUser(userData);
        setIsOwnProfile(ownProfile);
        setIsOpen(true);
    }, []);

    const closeProfile = useCallback(() => {
        setIsOpen(false);
        setUser(null);
        setIsOwnProfile(false);
    }, []);

    return {
        isOpen,
        user,
        isOwnProfile,
        openProfile,
        closeProfile
    };
};
