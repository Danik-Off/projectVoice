import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import { messageStore } from '../../../../store/messageStore';
import './MessageInput.scss';

const MessageInput: React.FC = observer(() => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setMessage(value);
        
        // Автоматическое изменение высоты textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }

        // Индикатор печати
        if (value.trim() && !isTyping) {
            setIsTyping(true);
            // Здесь можно отправить событие "печатает" через WebSocket
        } else if (!value.trim() && isTyping) {
            setIsTyping(false);
            // Здесь можно отправить событие "перестал печатать" через WebSocket
        }

        // Сброс таймера печати
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (value.trim()) {
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
            }, 3000);
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            await messageStore.sendMessage(message);
            setMessage('');
            
            // Сброс высоты textarea
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }

            // Сброс индикатора печати
            setIsTyping(false);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
        }
    };

    const handleSendClick = () => {
        sendMessage();
    };

    useEffect(() => {
        // Очистка таймера при размонтировании
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="message-input-container">
            <div className="message-input-wrapper">
                <div className="input-area">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Написать сообщение..."
                        rows={1}
                        maxLength={2000}
                        className="message-textarea"
                    />
                    <div className="input-actions">
                        <div className="message-actions">
                            <button 
                                className="action-btn emoji-btn"
                                title="Эмодзи"
                                onClick={() => {
                                    // Здесь можно добавить эмодзи пикер
                                    console.log('Emoji picker');
                                }}
                            >
                                😊
                            </button>
                            <button 
                                className="action-btn attachment-btn"
                                title="Прикрепить файл"
                                onClick={() => {
                                    // Здесь можно добавить загрузку файлов
                                    console.log('File upload');
                                }}
                            >
                                📎
                            </button>
                        </div>
                        <button 
                            className={`send-btn ${message.trim() ? 'active' : ''}`}
                            onClick={handleSendClick}
                            disabled={!message.trim()}
                            title="Отправить сообщение (Enter)"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path 
                                    d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" 
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="input-footer">
                    <span className="character-count">
                        {message.length}/2000
                    </span>
                    {isTyping && (
                        <span className="typing-indicator">
                            Печатает...
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});

export default MessageInput; 