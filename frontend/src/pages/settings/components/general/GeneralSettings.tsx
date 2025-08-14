import React from 'react';

const GeneralSettings: React.FC = () => {
    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>Общие настройки</h2>
                <p>Основные параметры приложения</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🌐
                            </div>
                            <div className="header-text">
                                <h3>Язык интерфейса</h3>
                                <p>Выберите предпочитаемый язык</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Язык</span>
                            </label>
                            <div className="setting-control">
                                <select className="settings-select" defaultValue="ru">
                                    <option value="ru">Русский</option>
                                    <option value="en">English</option>
                                </select>
                                <div className="setting-description">
                                    Изменения вступят в силу после перезапуска приложения
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                💾
                            </div>
                            <div className="header-text">
                                <h3>Кэш и данные</h3>
                                <p>Управление локальными данными</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Очистить кэш</span>
                            </label>
                            <div className="setting-control">
                                <button className="settings-button secondary">
                                    Очистить
                                </button>
                                <div className="setting-description">
                                    Освободит место на диске, но может замедлить загрузку
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Экспорт настроек</span>
                            </label>
                            <div className="setting-control">
                                <button className="settings-button">
                                    Экспортировать
                                </button>
                                <div className="setting-description">
                                    Сохранит все ваши настройки в файл
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
