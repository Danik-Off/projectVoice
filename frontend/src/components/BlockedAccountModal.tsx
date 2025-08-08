import React from 'react';
import './BlockedAccountModal.scss';

interface BlockedAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    reason?: string;
    blockedAt?: string;
    blockedBy?: string;
}

const BlockedAccountModal: React.FC<BlockedAccountModalProps> = ({
    isOpen,
    onClose,
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
        <div className="blocked-account-modal-overlay">
            <div className="blocked-account-modal">
                <div className="modal-header">
                    <div className="icon">🚫</div>
                    <h2>Аккаунт заблокирован</h2>
                </div>
                
                <div className="modal-content">
                    <p className="message">
                        Ваш аккаунт был заблокирован администрацией.
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

export default BlockedAccountModal; 