import React from 'react';

const AboutSettings: React.FC = () => {
    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>О приложении</h2>
                <p>Информация о ProjectVoice</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🎯
                            </div>
                            <div className="header-text">
                                <h3>ProjectVoice</h3>
                                <p>Простая альтернатива для голосового общения</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="settings-info">
                            <div className="info-header">
                                <h4>Информация о приложении</h4>
                            </div>
                            <div className="info-content">
                                <div className="info-row">
                                    <span className="info-label">Версия:</span>
                                    <span className="info-value">1.0.0</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Сборка:</span>
                                    <span className="info-value">2025.12.19</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Разработчик:</span>
                                    <span className="info-value">Danik Off</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Лицензия:</span>
                                    <span className="info-value">MIT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                📖
                            </div>
                            <div className="header-text">
                                <h3>Описание</h3>
                                <p>Что такое ProjectVoice</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <div className="setting-control">
                                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                    ProjectVoice — это простая, но эффективная альтернатива для голосового общения 
                                    на базе peer-to-peer WebRTC. Создан для тех, кто хочет общаться с друзьями 
                                    и товарищами без зависимости от внешних сервисов.
                                </p>
                                <div className="setting-description">
                                    Приложение находится на раннем этапе разработки
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🔗
                            </div>
                            <div className="header-text">
                                <h3>Ссылки</h3>
                                <p>Полезные ресурсы</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Документация</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-grid two-columns">
                                    <button className="settings-button secondary">
                                        📚 Руководство
                                    </button>
                                    <button className="settings-button secondary">
                                        🐛 Отчеты об ошибках
                                    </button>
                                </div>
                                <div className="setting-description">
                                    Помощь по использованию и обратная связь
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Сообщество</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-grid three-columns">
                                    <button className="settings-button secondary">
                                        💬 Telegram
                                    </button>
                                    <button className="settings-button secondary">
                                        📱 VK
                                    </button>
                                    <button className="settings-button secondary">
                                        🐙 GitHub
                                    </button>
                                </div>
                                <div className="setting-description">
                                    Присоединяйтесь к сообществу разработчиков
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                ⚙️
                            </div>
                            <div className="header-text">
                                <h3>Техническая информация</h3>
                                <p>Детали реализации</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="settings-info">
                            <div className="info-header">
                                <h4>Технологии</h4>
                            </div>
                            <div className="info-content">
                                <div className="info-row">
                                    <span className="info-label">Frontend:</span>
                                    <span className="info-value">React + TypeScript</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Backend:</span>
                                    <span className="info-value">Node.js + Express</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">WebRTC:</span>
                                    <span className="info-value">Peer-to-peer</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">База данных:</span>
                                    <span className="info-value">SQLite</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSettings;
