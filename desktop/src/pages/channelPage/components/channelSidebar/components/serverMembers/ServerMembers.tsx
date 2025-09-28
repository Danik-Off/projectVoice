import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { authStore } from '../../../../../../store/authStore';
import { ServerMember } from '../../../../../../types/server';
import { useUserProfile } from '../../../../../../components/UserProfileProvider';
import ClickableAvatar from '../../../../../../components/ClickableAvatar';
import './ServerMembers.scss';

interface ServerMembersProps {
    members: ServerMember[];
    onRoleChange?: (memberId: number, newRole: string) => void;
    onRemoveMember?: (memberId: number) => void;
}

const ServerMembers: React.FC<ServerMembersProps> = observer(({ 
    members, 
    onRoleChange, 
    onRemoveMember 
}) => {
    const { t } = useTranslation();
    const { openProfile } = useUserProfile();
    console.log('ServerMembers - received members:', members);
    const [expandedRoles, setExpandedRoles] = useState<{ [key: string]: boolean }>({});

    const currentUser = authStore.user;
    const currentUserMember = members.find(member => member.userId === currentUser?.id);
    const currentUserRole = currentUserMember?.role || 'member';

    const canManageMembers = ['owner', 'admin'].includes(currentUserRole);
    const canChangeRoles = currentUserRole === 'owner' || currentUserRole === 'admin';

    const toggleRoleExpansion = (role: string) => {
        setExpandedRoles(prev => ({
            ...prev,
            [role]: !prev[role]
        }));
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'owner': return '#ff6b6b';
            case 'admin': return '#ffa726';
            case 'moderator': return '#66bb6a';
            case 'member': return '#90a4ae';
            default: return '#90a4ae';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'owner': return '👑';
            case 'admin': return '⚡';
            case 'moderator': return '🛡️';
            case 'member': return '👤';
            default: return '👤';
        }
    };

    const roleOrder = ['owner', 'admin', 'moderator', 'member'];

    return (
        <div className="server-members">
            <h3 className="members-title">{t('serverMembers.title')} — {members.length}</h3>
            
            {roleOrder.map(role => {
                const roleMembers = members.filter(member => member.role === role);
                if (roleMembers.length === 0) return null;

                const isExpanded = expandedRoles[role] !== false; // По умолчанию развернуто

                return (
                    <div key={role} className="role-section">
                        <div 
                            className="role-header"
                            onClick={() => toggleRoleExpansion(role)}
                        >
                            <span className="role-icon">{getRoleIcon(role)}</span>
                            <span className="role-name">{t(`serverMembers.roles.${role}`)}</span>
                            <span className="role-count">({roleMembers.length})</span>
                            <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                        </div>
                        
                        {isExpanded && (
                            <div className="members-list">
                                {roleMembers.map(member => (
                                    <div key={member.id} className="member-item">
                                        <div className="member-info">
                                            {member.user && (
                                                <ClickableAvatar
                                                    user={{
                                                        id: member.user.id,
                                                        username: member.user.username,
                                                        email: `${member.user.username}@temp.com`,
                                                        profilePicture: member.user.profilePicture,
                                                        role: member.role,
                                                        isActive: true,
                                                        createdAt: new Date().toISOString(),
                                                        status: 'online'
                                                    }}
                                                    size="small"
                                                    onClick={() => {
                                                        if (member.user) {
                                                            openProfile({
                                                                id: member.user.id,
                                                                username: member.user.username,
                                                                email: `${member.user.username}@temp.com`,
                                                                profilePicture: member.user.profilePicture,
                                                                role: member.role,
                                                                isActive: true,
                                                                createdAt: new Date().toISOString(),
                                                                status: 'online'
                                                            }, false);
                                                        }
                                                    }}
                                                    className="member-avatar"
                                                />
                                            )}
                                            <span className="member-name">
                                                {member.user?.username || 'Unknown User'}
                                            </span>
                                        </div>
                                        
                                        {canManageMembers && member.userId !== currentUser?.id && (
                                            <div className="member-actions">
                                                {canChangeRoles && (
                                                    <select
                                                        value={member.role}
                                                        onChange={(e) => onRoleChange?.(member.id, e.target.value)}
                                                        className="role-select"
                                                    >
                                                        <option value="member">{t('serverMembers.roles.member')}</option>
                                                        <option value="moderator">{t('serverMembers.roles.moderator')}</option>
                                                        <option value="admin">{t('serverMembers.roles.admin')}</option>
                                                        {currentUserRole === 'owner' && (
                                                            <option value="owner">{t('serverMembers.roles.owner')}</option>
                                                        )}
                                                    </select>
                                                )}
                                                
                                                {currentUserRole === 'owner' && member.role !== 'owner' && (
                                                    <button
                                                        onClick={() => onRemoveMember?.(member.id)}
                                                        className="remove-member-btn"
                                                        title={t('serverMembers.removeMember')}
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});

export default ServerMembers; 