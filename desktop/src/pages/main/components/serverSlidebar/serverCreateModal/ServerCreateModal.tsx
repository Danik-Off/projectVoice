import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../../../components/ui';
import serverStore from '../../../../../store/serverStore';
import notificationStore from '../../../../../store/NotificationStore';

interface ServerCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ServerCreateModal: React.FC<ServerCreateModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [serverName, setServerName] = useState('');
    const [serverDescription, setServerDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateServer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!serverName.trim()) return;
        
        setIsLoading(true);
        try {
            await serverStore.createServer({ 
                name: serverName.trim(), 
                description: serverDescription.trim() 
            });
            
            setServerName('');
            setServerDescription('');
            onClose();
            
            notificationStore.addNotification('Сервер создан успешно!', 'success');
        } catch (error) {
            console.error('Ошибка создания сервера:', error);
            notificationStore.addNotification('Ошибка создания сервера', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setServerName('');
            setServerDescription('');
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={t('createServerModal.title')}
            size="medium"
            icon="🏗️"
        >
            <form onSubmit={handleCreateServer}>
                <div className="form-group">
                    <label className="form-label">
                        {t('createServerModal.nameLabel')}
                        <span className="required">*</span>
                    </label>
                    <input
                        className="input"
                        type="text"
                        placeholder={t('createServerModal.namePlaceholder')}
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        {t('createServerModal.descriptionLabel')}
                    </label>
                    <textarea
                        className="textArea description"
                        placeholder={t('createServerModal.descriptionPlaceholder')}
                        value={serverDescription}
                        onChange={(e) => setServerDescription(e.target.value)}
                        disabled={isLoading}
                        rows={3}
                    />
                </div>

                <div className="modal-buttons">
                    <button 
                        type="button" 
                        className="button button--secondary" 
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        {t('createServerModal.btnCancel')}
                    </button>
                    <button 
                        type="submit" 
                        className="button button--primary"
                        disabled={!serverName.trim() || isLoading}
                    >
                        {isLoading ? 'Создание...' : t('createServerModal.btnCreate')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ServerCreateModal;