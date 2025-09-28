import React from 'react';
import { useUserProfile } from './UserProfileProvider';
import ClickableAvatar from './ClickableAvatar';
import { User } from '../types/user';

const ProfileDemo: React.FC = () => {
    const { openProfile } = useUserProfile();

    // Создаем тестовых пользователей
    const testUsers: User[] = [
        {
            id: 1,
            username: 'Alice',
            email: 'alice@example.com',
            role: 'admin',
            isActive: true,
            profilePicture: undefined,
            status: 'online',
            tag: '1234',
            createdAt: '2024-01-01T00:00:00Z'
        },
        {
            id: 2,
            username: 'Bob',
            email: 'bob@example.com',
            role: 'moderator',
            isActive: true,
            profilePicture: undefined,
            status: 'idle',
            tag: '5678',
            createdAt: '2024-02-01T00:00:00Z'
        },
        {
            id: 3,
            username: 'Charlie',
            email: 'charlie@example.com',
            role: 'member',
            isActive: false,
            profilePicture: undefined,
            status: 'offline',
            tag: '9012',
            createdAt: '2024-03-01T00:00:00Z'
        },
        {
            id: 4,
            username: 'Diana',
            email: 'diana@example.com',
            role: 'admin',
            isActive: true,
            profilePicture: undefined,
            status: 'dnd',
            tag: '3456',
            createdAt: '2024-04-01T00:00:00Z',
            blockedAt: '2024-05-01T00:00:00Z',
            blockedBy: 'System',
            blockReason: 'Violation of community guidelines'
        }
    ];

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: '800px', 
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1>Демонстрация модального окна профиля</h1>
            <p>Нажмите на любой аватар, чтобы открыть профиль пользователя</p>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px',
                marginTop: '30px'
            }}>
                {testUsers.map((user) => (
                    <div key={user.id} style={{
                        padding: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '12px',
                        textAlign: 'center',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <ClickableAvatar
                                user={user}
                                size="large"
                                onClick={() => openProfile(user, false)}
                            />
                        </div>
                        <h3 style={{ margin: '0 0 10px 0' }}>{user.username}</h3>
                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>#{user.tag}</p>
                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>Роль: {user.role}</p>
                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>Статус: {user.status}</p>
                        <button 
                            onClick={() => openProfile(user, false)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Открыть профиль
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ 
                marginTop: '40px', 
                padding: '20px', 
                backgroundColor: '#e9ecef', 
                borderRadius: '12px' 
            }}>
                <h2>Тестирование собственного профиля</h2>
                <p>Нажмите на аватар ниже, чтобы открыть свой профиль:</p>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <ClickableAvatar
                        user={testUsers[0]}
                        size="large"
                        onClick={() => openProfile(testUsers[0], true)}
                    />
                    <p style={{ marginTop: '10px' }}>
                        <button 
                            onClick={() => openProfile(testUsers[0], true)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Открыть мой профиль
                        </button>
                    </p>
                </div>
            </div>

            <div style={{ 
                marginTop: '40px', 
                padding: '20px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '12px',
                border: '1px solid #ffeaa7'
            }}>
                <h2>Инструкции по использованию</h2>
                <ul style={{ lineHeight: '1.6' }}>
                    <li><strong>Клик по аватару:</strong> Открывает модальное окно профиля пользователя</li>
                    <li><strong>Вкладки:</strong> Переключение между обзором, активностью, серверами и друзьями</li>
                    <li><strong>Действия:</strong> Кнопки для отправки сообщения, добавления в друзья, блокировки</li>
                    <li><strong>Адаптивность:</strong> Модальное окно корректно отображается на всех устройствах</li>
                    <li><strong>Темы:</strong> Поддержка светлой и темной темы</li>
                </ul>
            </div>
        </div>
    );
};

export default ProfileDemo;
