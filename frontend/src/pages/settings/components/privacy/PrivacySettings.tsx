import React from 'react';

const PrivacySettings: React.FC = () => {
    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>Конфиденциальность</h2>
                <p>Настройки приватности и безопасности</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                👁️
                            </div>
                            <div className="header-text">
                                <h3>Статус онлайн</h3>
                                <p>Кто может видеть ваш статус</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Видимость статуса</span>
                            </label>
                            <div className="setting-control">
                                <select className="settings-select" defaultValue="friends">
                                    <option value="everyone">Все пользователи</option>
                                    <option value="friends">Только друзья</option>
                                    <option value="none">Скрыть статус</option>
                                </select>
                                <div className="setting-description">
                                    Определяет кто может видеть ваш статус онлайн
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Показывать активность</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">Включено</span>
                                </div>
                                <div className="setting-description">
                                    Показывать в каком канале вы находитесь
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🔒
                            </div>
                            <div className="header-text">
                                <h3>Безопасность</h3>
                                <p>Настройки безопасности аккаунта</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Двухфакторная аутентификация</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">Отключено</span>
                                </div>
                                <div className="setting-description">
                                    Дополнительный уровень защиты для вашего аккаунта
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Уведомления о входе</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">Включено</span>
                                </div>
                                <div className="setting-description">
                                    Получать уведомления о новых входах в аккаунт
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                📊
                            </div>
                            <div className="header-text">
                                <h3>Аналитика и данные</h3>
                                <p>Управление сбором данных</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Сбор аналитики</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">Включено</span>
                                </div>
                                <div className="setting-description">
                                    Помогает улучшать приложение (анонимные данные)
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Экспорт данных</span>
                            </label>
                            <div className="setting-control">
                                <button className="settings-button secondary">
                                    Экспортировать
                                </button>
                                <div className="setting-description">
                                    Скачать все ваши данные в формате JSON
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Удаление аккаунта</span>
                            </label>
                            <div className="setting-control">
                                <button className="settings-button danger">
                                    Удалить аккаунт
                                </button>
                                <div className="setting-description">
                                    Внимание! Это действие необратимо
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;
