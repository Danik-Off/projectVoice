import React, { useEffect, useRef, useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { messageStore } from '../../../../store/messageStore';
import channelsStore from '../../../../store/channelsStore';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import './MessageList.scss';
import roomStore from '../../../../store/roomStore';

const MessageList: React.FC = observer(() => {
    const { roomId } = useParams<{ roomId: string }>();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isNearBottom, setIsNearBottom] = useState(true);

    const { messages, loading, error, hasMore, currentChannelId } = messageStore;
    const { currentChannel, channels } = channelsStore;
    const isConnected = roomStore.currentVoiceChannel !== null;

    // Отладочная информация
    console.log('MessageList Debug:', {
        roomId,
        currentChannel,
        currentChannelId,
        channels: channels.length,
        messages: messages.length,
        loading,
        error
    });

    // Установка текущего канала при загрузке компонента
    useEffect(() => {
        if (roomId && channels.length > 0) {
            const channel = channels.find(ch => ch.id === parseInt(roomId));
            if (channel) {
                channelsStore.setCurrentChannel(channel);
                console.log('Установлен текущий канал:', channel);
            } else {
                console.log('Канал не найден:', roomId, 'Доступные каналы:', channels);
            }
        } else if (roomId && channels.length === 0) {
            console.log('Каналы еще не загружены, roomId:', roomId);
        }
    }, [roomId, channels]);

    // Загрузка сообщений при изменении канала
    useEffect(() => {
        if (currentChannel?.id) {
            messageStore.setCurrentChannel(currentChannel.id);
        }
    }, [currentChannel?.id]);

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

    const EmptyChatState: React.FC<{ channelName?: string }> = ({ channelName }) => (
        <div className="no-messages">
            <div className="no-messages-content">
                <div className="empty-chat-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" 
                              fill="var(--accent-color)" opacity="0.3"/>
                        <path d="M7 9H17V11H7V9ZM7 13H13V15H7V13Z" fill="var(--accent-color)"/>
                    </svg>
                </div>
                <h3>Добро пожаловать в #{channelName || 'канал'}!</h3>
                <p>Это начало канала. Отправьте первое сообщение, чтобы начать общение.</p>
                <div className="empty-chat-tips">
                    <div className="tip">
                        <span className="tip-icon">💬</span>
                        <span>Напишите сообщение ниже</span>
                    </div>
                    <div className="tip">
                        <span className="tip-icon">👥</span>
                        <span>Пригласите друзей в сервер</span>
                    </div>
                    <div className="tip">
                        <span className="tip-icon">⚙️</span>
                        <span>Настройте канал под себя</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const NoChannelSelected: React.FC = () => (
        <div className="no-channel-selected">
            <div className="no-channel-content">
                <div className="empty-chat-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" 
                              fill="var(--accent-color)" opacity="0.3"/>
                        <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" 
                              fill="var(--accent-color)"/>
                    </svg>
                </div>
                <h3>Выберите канал</h3>
                <p>Выберите канал из списка слева, чтобы начать общение.</p>
            </div>
        </div>
    );

    const VoiceStatusIndicator: React.FC = () => {
        if (!isConnected) return null;

        return (
            <div className="voice-status-indicator">
                <div className="voice-status-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1C10.9 1 10 1.9 10 3V11C10 12.1 10.9 13 12 13C13.1 13 14 12.1 14 11V3C14 1.9 13.1 1 12 1Z" 
                              fill="var(--accent-color)"/>
                        <path d="M19 10V11C19 14.87 15.87 18 12 18C8.13 18 5 14.87 5 11V10C5 9.45 5.45 9 6 9C6.55 9 7 9.45 7 10V11C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11V10C17 9.45 17.45 9 18 9C18.55 9 19 9.45 19 10Z" 
                              fill="var(--accent-color)"/>
                        <path d="M12 19C12.55 19 13 19.45 13 20V23C13 23.55 12.55 24 12 24C11.45 24 11 23.55 11 23V20C11 19.45 11.45 19 12 19Z" 
                              fill="var(--accent-color)"/>
                    </svg>
                </div>
                <span className="voice-status-text">Подключен к голосовому каналу</span>
            </div>
        );
    };

    if (!currentChannel) {
        return (
            <div className="message-list-container">
                <NoChannelSelected />
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
                <VoiceStatusIndicator />
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
                        <EmptyChatState channelName={currentChannel.name} />
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
