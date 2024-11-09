import React, { useState } from 'react';
import './ServerCreateModal.scss';
import { useTranslation } from 'react-i18next';

interface ServerCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onCreate: (data: { name: string; description: string; avatar: File | null; isPrivate: boolean }) => void;
}

const ServerCreateModal: React.FC<ServerCreateModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    const [serverName, setServerName] = useState('');
    const [serverDescription, setServerDescription] = useState('');

    const handleCreateServer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // onCreate({ name: serverName, description: serverDescription, avatar, isPrivate });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{t('createServerModal.title')}</h2>
                <form onSubmit={handleCreateServer}>
                    <input
                        className="input"
                        type="text"
                        placeholder={t('createServerModal.titlePlaceholder')}
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        required
                    />
                    <textarea
                        className="textArea description"
                        placeholder={t('createServerModal.descriptionPlaceholder')}
                        value={serverDescription}
                        onChange={(e) => setServerDescription(e.target.value)}
                        required
                    />
                    <div className="modal-buttons">
                        <button type="submit" className="button">
                            {t('createServerModal.btnCreate')}
                        </button>
                        <button type="button" className="button" onClick={onClose}>
                            {t('createServerModal.btnCancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServerCreateModal;
