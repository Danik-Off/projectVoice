import React from 'react';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../../../../store/ThemeStore';

const AppearanceSettings: React.FC = observer(() => {
    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>Внешний вид</h2>
                <p>Настройте тему и цвета интерфейса</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🎨
                            </div>
                            <div className="header-text">
                                <h3>Тема оформления</h3>
                                <p>Выберите светлую или темную тему</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Текущая тема</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input
                                        type="checkbox"
                                        checked={themeStore.isDark}
                                        onChange={(e) => themeStore.toggleTheme()}
                                    />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">
                                        {themeStore.isDark ? 'Темная' : 'Светлая'}
                                    </span>
                                </div>
                                <div className="setting-description">
                                    Автоматически подстраивается под системные настройки
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🌈
                            </div>
                            <div className="header-text">
                                <h3>Акцентный цвет</h3>
                                <p>Выберите основной цвет интерфейса</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Цветовая схема</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-grid three-columns">
                                    {['blue', 'green', 'purple', 'orange', 'red', 'pink'].map((color) => (
                                        <button
                                            key={color}
                                            className={`settings-button ${color === 'blue' ? 'active' : ''}`}
                                            style={{
                                                backgroundColor: color === 'blue' ? '#3b82f6' : 
                                                               color === 'green' ? '#10b981' :
                                                               color === 'purple' ? '#8b5cf6' :
                                                               color === 'orange' ? '#f59e0b' :
                                                               color === 'red' ? '#ef4444' : '#ec4899'
                                            }}
                                        >
                                            {color === 'blue' ? 'Активен' : 'Выбрать'}
                                        </button>
                                    ))}
                                </div>
                                <div className="setting-description">
                                    Изменения применяются мгновенно
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                📱
                            </div>
                            <div className="header-text">
                                <h3>Размер интерфейса</h3>
                                <p>Настройте масштаб элементов</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>Масштаб</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-grid three-columns">
                                    <button className="settings-button secondary">Маленький</button>
                                    <button className="settings-button">Средний</button>
                                    <button className="settings-button secondary">Большой</button>
                                </div>
                                <div className="setting-description">
                                    Рекомендуется средний размер для большинства экранов
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AppearanceSettings;
