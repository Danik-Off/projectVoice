import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

const RolesSettings: React.FC = observer(() => {
    const { t } = useTranslation();

    const roles = [
        {
            name: 'Owner',
            description: t('serverSettings.roles.ownerDescription'),
            permissions: [
                t('serverSettings.permissions.manageServer'),
                t('serverSettings.permissions.manageRoles'),
                t('serverSettings.permissions.manageChannels'),
                t('serverSettings.permissions.kickMembers'),
                t('serverSettings.permissions.banMembers'),
                t('serverSettings.permissions.deleteServer')
            ]
        },
        {
            name: 'Admin',
            description: t('serverSettings.roles.adminDescription'),
            permissions: [
                t('serverSettings.permissions.manageRoles'),
                t('serverSettings.permissions.manageChannels'),
                t('serverSettings.permissions.kickMembers'),
                t('serverSettings.permissions.banMembers')
            ]
        },
        {
            name: 'Moderator',
            description: t('serverSettings.roles.moderatorDescription'),
            permissions: [
                t('serverSettings.permissions.kickMembers'),
                t('serverSettings.permissions.manageMessages')
            ]
        },
        {
            name: 'Member',
            description: t('serverSettings.roles.memberDescription'),
            permissions: [
                t('serverSettings.permissions.sendMessages'),
                t('serverSettings.permissions.joinVoice')
            ]
        }
    ];

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('serverSettings.roles')}</h2>
                <p>{t('serverSettings.rolesDescription')}</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🎭
                            </div>
                            <div className="header-text">
                                <h3>{t('serverSettings.serverRoles')}</h3>
                                <p>{t('serverSettings.serverRolesDescription')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="roles-list">
                            {roles.map((role, index) => (
                                <div key={index} className="role-item">
                                    <div className="role-header">
                                        <h4 className="role-name">{role.name}</h4>
                                        <p className="role-description">{role.description}</p>
                                    </div>
                                    <div className="role-permissions">
                                        <h5 className="permissions-title">{t('serverSettings.permissions')}:</h5>
                                        <ul className="permissions-list">
                                            {role.permissions.map((permission, permIndex) => (
                                                <li key={permIndex} className="permission-item">
                                                    ✓ {permission}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default RolesSettings;
