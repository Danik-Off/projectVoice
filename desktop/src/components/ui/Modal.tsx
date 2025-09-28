import React, { useEffect } from 'react';
import './Modal.scss';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    className?: string;
    icon?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium',
    showCloseButton = true,
    closeOnOverlayClick = true,
    className = '',
    icon
}) => {
    // Закрытие модалки по Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Блокируем скролл body
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Обработка клика по overlay
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className={`modal-overlay ${className}`}
            onClick={handleOverlayClick}
        >
            <div className={`modal modal--${size}`}>
                <div className="modal__header">
                    <div className="modal__title">
                        {icon && <span className="modal__icon">{icon}</span>}
                        <h2>{title}</h2>
                    </div>
                    {showCloseButton && (
                        <button 
                            className="modal__close-button"
                            onClick={onClose}
                            aria-label="Закрыть модальное окно"
                        >
                            <span className="modal__close-icon">×</span>
                        </button>
                    )}
                </div>
                <div className="modal__content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
