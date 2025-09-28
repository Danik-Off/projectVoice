import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import serverStore from '../../../../store/serverStore';
import notificationStore from '../../../../store/NotificationStore';

const DangerSettings: React.FC = observer(() => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteServer = async () => {
        try {
            const server = serverStore.currentServer;
            if (!server?.id) return;
            
            // Здесь будет логика удаления сервера через API
            console.log('Deleting server:', server.id);
            
            // Пока что просто показываем уведомление
            notificationStore.addNotification(
                t('serverSettings.serverDeleted'),
                'success',
                3000
            );
            
            // Переходим на главную страницу
            navigate('/');
        } catch (error) {
            console.error('Error deleting server:', error);
            notificationStore.addNotification(
                t('serverSettings.deleteError'),
                'error',
                5000
            );
        }
    };

    const dangerActions = [
        {
            title: t('serverSettings.deleteServer'),
            description: t('serverSettings.deleteServerDescription'),
            buttonText: t('serverSettings.deleteServer'),
            buttonClass: 'danger-button',
            onClick: () => setShowDeleteConfirm(true),
            icon: '🗑️'
        }
    ];

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('serverSettings.danger')}</h2>
                <p>{t('serverSettings.dangerDescription')}</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                ⚠️
                            </div>
                            <div className="header-text">
                                <h3>{t('serverSettings.dangerZone')}</h3>
                                <p>{t('serverSettings.dangerZoneDescription')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="danger-actions">
                            {dangerActions.map((action, index) => (
                                <div key={index} className="danger-item">
                                    <div className="danger-icon">{action.icon}</div>
                                    <div className="danger-content">
                                        <h4 className="danger-title">{action.title}</h4>
                                        <p className="danger-description">{action.description}</p>
                                        <button 
                                            className={action.buttonClass}
                                            onClick={action.onClick}
                                        >
                                            {action.buttonText}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно подтверждения удаления */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">⚠️ {t('serverSettings.confirmDelete')}</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <p>{t('serverSettings.deleteWarning')}</p>
                            <div className="modal-actions">
                                <button 
                                    className="cancel-button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    {t('serverSettings.cancel')}
                                </button>
                                <button 
                                    className="danger-button"
                                    onClick={handleDeleteServer}
                                >
                                    {t('serverSettings.deleteServer')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default DangerSettings;
