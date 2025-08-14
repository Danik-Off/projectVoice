import React from 'react';

const NotificationsSettings: React.FC = () => {
    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>Уведомления</h2>
                <p>Настройте оповещения и уведомления</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🔔
                            </div>
                            <div className="header-text">
                                <h3>Общие уведомления</h3>
                                <p>Основные настройки оповещений</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Включить уведомления</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">Включено</span>
                                </div>
                                <div className="setting-description">
                                    Разрешить приложению показывать уведомления
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Звуковые уведомления</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">Включено</span>
                                </div>
                                <div className="setting-description">
                                    Проигрывать звук при получении уведомлений
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                💬
                            </div>
                            <div className="header-text">
                                <h3>Уведомления чата</h3>
                                <p>Настройки для сообщений и чатов</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Новые сообщения</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">Включено</span>
                                </div>
                                <div className="setting-description">
                                    Уведомления о новых сообщениях в чате
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Упоминания</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">Включено</span>
                                </div>
                                <div className="setting-description">
                                    Уведомления когда вас упоминают в сообщениях
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Голосовые вызовы</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">Включено</span>
                                </div>
                                <div className="setting-description">
                                    Уведомления о входящих голосовых вызовах
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                ⏰
                            </div>
                            <div className="header-text">
                                <h3>Время уведомлений</h3>
                                <p>Настройте когда показывать уведомления</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Тихие часы</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">Отключено</span>
                                </div>
                                <div className="setting-description">
                                    Не показывать уведомления в определенное время
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Время тишины</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-grid two-columns">
                                    <div>
                                        <label>С:</label>
                                        <input type="time" className="settings-input" defaultValue="22:00" />
                                    </div>
                                    <div>
                                        <label>До:</label>
                                        <input type="time" className="settings-input" defaultValue="08:00" />
                                    </div>
                                </div>
                                <div className="setting-description">
                                    Уведомления не будут показываться в это время
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsSettings;
