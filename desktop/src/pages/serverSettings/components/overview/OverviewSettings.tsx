import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import serverStore from '../../../../store/serverStore';

const OverviewSettings: React.FC = observer(() => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: serverStore.currentServer?.name || '',
        description: serverStore.currentServer?.description || ''
    });

    const server = serverStore.currentServer;

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm({
            name: server?.name || '',
            description: server?.description || ''
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            name: server?.name || '',
            description: server?.description || ''
        });
    };

    const handleSave = async () => {
        try {
            // Здесь будет логика сохранения
            console.log('Saving server settings:', editForm);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving server settings:', error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('serverSettings.overview')}</h2>
                <p>{t('serverSettings.overviewDescription')}</p>
            </div>
            
            <div className="section-content">
                {/* Информация о сервере */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                📊
                            </div>
                            <div className="header-text">
                                <h3>{t('serverSettings.serverInfo')}</h3>
                                <p>{t('serverSettings.serverInfoDescription')}</p>
                            </div>
                        </div>
                        {!isEditing && (
                            <div className="header-actions">
                                <button className="edit-button" onClick={handleEdit}>
                                    {t('serverSettings.edit')}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="card-content">
                        {!isEditing ? (
                            <div className="server-info">
                                <div className="info-item">
                                    <label className="info-label">{t('serverSettings.serverName')}</label>
                                    <span className="info-value">{server?.name}</span>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">{t('serverSettings.serverDescription')}</label>
                                    <span className="info-value">{server?.description || t('serverSettings.noDescription')}</span>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">{t('serverSettings.serverId')}</label>
                                    <span className="info-value">{server?.id}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="edit-form">
                                <div className="setting-group">
                                    <div className="setting-header">
                                        <label className="setting-label">
                                            {t('serverSettings.serverName')} <span className="required">*</span>
                                        </label>
                                    </div>
                                    <div className="setting-control">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder={t('serverSettings.serverNamePlaceholder')}
                                            className="setting-input"
                                        />
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <div className="setting-header">
                                        <label className="setting-label">
                                            {t('serverSettings.serverDescription')}
                                        </label>
                                    </div>
                                    <div className="setting-control">
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder={t('serverSettings.serverDescriptionPlaceholder')}
                                            className="setting-textarea"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button className="cancel-button" onClick={handleCancel}>
                                        {t('serverSettings.cancel')}
                                    </button>
                                    <button className="save-button" onClick={handleSave}>
                                        {t('serverSettings.save')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default OverviewSettings;
