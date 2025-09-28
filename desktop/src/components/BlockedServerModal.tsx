import React from 'react';
import './BlockedServerModal.scss';

interface BlockedServerModalProps {
    isOpen: boolean;
    onClose: () => void;
    serverName: string;
    reason?: string;
    blockedAt?: string;
    blockedBy?: string;
}

const BlockedServerModal: React.FC<BlockedServerModalProps> = ({
    isOpen,
    onClose,
    serverName,
    reason,
    blockedAt,
    blockedBy
}) => {

    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="blocked-server-modal-overlay">
            <div className="blocked-server-modal">
                <div className="modal-header">
                    <div className="icon">🏠🚫</div>
                    <h2>Сервер заблокирован</h2>
                </div>
                
                <div className="modal-content">
                    <div className="server-info">
                        <h3>Сервер: <span className="server-name">{serverName}</span></h3>
                    </div>
                    
                    <p className="message">
                        Этот сервер был заблокирован администрацией.
                    </p>
                    
                    {reason && (
                        <div className="reason-section">
                            <h3>Причина блокировки:</h3>
                            <p className="reason">{reason}</p>
                        </div>
                    )}
                    
                    {blockedAt && (
                        <div className="details-section">
                            <p><strong>Дата блокировки:</strong> {formatDate(blockedAt)}</p>
                            {blockedBy && (
                                <p><strong>Заблокирован:</strong> {blockedBy}</p>
                            )}
                        </div>
                    )}
                    
                    <div className="contact-info">
                        <p>
                            Если вы считаете, что блокировка была применена по ошибке, 
                            обратитесь к администрации системы.
                        </p>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button 
                        className="close-button"
                        onClick={onClose}
                    >
                        Понятно
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockedServerModal; 