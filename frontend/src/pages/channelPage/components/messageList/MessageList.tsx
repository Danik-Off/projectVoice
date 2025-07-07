import React, { useEffect, useRef, useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { messageStore } from '../../../../store/messageStore';
import channelsStore from '../../../../store/channelsStore';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import './MessageList.scss';

const MessageList: React.FC = observer(() => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isNearBottom, setIsNearBottom] = useState(true);

    const { messages, loading, error, hasMore, currentChannelId } = messageStore;
    const { currentChannel } = channelsStore;

    // Автопрокрутка к новым сообщениям
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Проверка, находится ли пользователь внизу списка
    const checkIfNearBottom = useCallback(() => {
        if (!messagesContainerRef.current) return;
        
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const threshold = 100;
        const isNear = scrollHeight - scrollTop - clientHeight < threshold;
        setIsNearBottom(isNear);
        setShowScrollToBottom(!isNear);
    }, []);

    // Обработчик прокрутки
    const handleScroll = useCallback(() => {
        checkIfNearBottom();
        
        // Загрузка предыдущих сообщений при прокрутке вверх
        if (messagesContainerRef.current && messagesContainerRef.current.scrollTop === 0 && hasMore) {
            messageStore.loadMoreMessages();
        }
    }, [checkIfNearBottom, hasMore]);

    // Загрузка сообщений при изменении канала
    useEffect(() => {
        if (currentChannel?.id) {
            messageStore.setCurrentChannel(currentChannel.id);
        }
    }, [currentChannel?.id]);

    // Автопрокрутка к новым сообщениям
    useEffect(() => {
        if (isNearBottom) {
            scrollToBottom();
        }
    }, [messages.length, isNearBottom, scrollToBottom]);

    // Прокрутка к началу при загрузке предыдущих сообщений
    useEffect(() => {
        if (messagesContainerRef.current && !isNearBottom) {
            const container = messagesContainerRef.current;
            const oldHeight = container.scrollHeight;
            
            // Сохраняем позицию прокрутки
            const oldScrollTop = container.scrollTop;
            
            // Ждем обновления DOM
            requestAnimationFrame(() => {
                const newHeight = container.scrollHeight;
                const heightDifference = newHeight - oldHeight;
                container.scrollTop = oldScrollTop + heightDifference;
            });
        }
    }, [messages, isNearBottom]);

    // Группировка сообщений по пользователям
    const groupMessages = () => {
        const groups: Array<{ userId: number; messages: typeof messages }> = [];
        
        messages.forEach(message => {
            const lastGroup = groups[groups.length - 1];
            
            if (lastGroup && lastGroup.userId === message.userId) {
                lastGroup.messages.push(message);
            } else {
                groups.push({
                    userId: message.userId,
                    messages: [message]
                });
            }
        });
        
        return groups;
    };

    const messageGroups = groupMessages();

    if (!currentChannel) {
        return (
            <div className="message-list-container">
                <div className="no-channel-selected">
                    <div className="no-channel-content">
                        <h3>Выберите канал</h3>
                        <p>Выберите канал из списка слева, чтобы начать общение</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="message-list-container">
            <div className="channel-header">
                <div className="channel-info">
                    <h2 className="channel-name">#{currentChannel.name}</h2>
                    <span className="channel-description">
                        {currentChannel.description || 'Текстовый канал'}
                    </span>
                </div>
                <div className="channel-actions">
                    <button className="action-btn" title="Поиск сообщений">
                        🔍
                    </button>
                    <button className="action-btn" title="Настройки канала">
                        ⚙️
                    </button>
                </div>
            </div>

            <div className="messages-area">
                <div 
                    className="messages-container"
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                >
                    {loading && messages.length === 0 && (
                        <div className="loading-messages">
                            <div className="loading-spinner"></div>
                            <span>Загрузка сообщений...</span>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <span>Ошибка загрузки сообщений: {error}</span>
                            <button onClick={() => messageStore.loadMessages()}>
                                Попробовать снова
                            </button>
                        </div>
                    )}

                    {!loading && messages.length === 0 && (
                        <div className="no-messages">
                            <div className="no-messages-content">
                                <h3>Нет сообщений</h3>
                                <p>Будьте первым, кто напишет в этом канале!</p>
                            </div>
                        </div>
                    )}

                    {messageGroups.map((group, groupIndex) => (
                        <div key={`${group.userId}-${groupIndex}`} className="message-group">
                            {group.messages.map((message, messageIndex) => (
                                <MessageItem
                                    key={message.id}
                                    message={message}
                                    isFirstInGroup={messageIndex === 0}
                                />
                            ))}
                        </div>
                    ))}

                    {loading && messages.length > 0 && (
                        <div className="loading-more">
                            <div className="loading-spinner small"></div>
                            <span>Загрузка предыдущих сообщений...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {showScrollToBottom && (
                    <button 
                        className="scroll-to-bottom-btn"
                        onClick={scrollToBottom}
                        title="Прокрутить к новым сообщениям"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path 
                                d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" 
                                fill="currentColor"
                            />
                        </svg>
                        <span>Новые сообщения</span>
                    </button>
                )}
            </div>

            <MessageInput />
        </div>
    );
});

export default MessageList;
