import React, { useState } from 'react';
import SpeakerSettings from './SpeakerSettings';
import MicrophoneSettings from './MicrophoneSettings';
import AudioEffectsSettings from './AudioEffectsSettings';
import AudioQualitySettings from './AudioQualitySettings';
import './AudioSettings.scss';

const AudioSettings: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'devices' | 'quality' | 'effects' | 'advanced'>('devices');

    return (
        <div className="audio-settings-container">
            <div className="audio-settings-header">
                <h2 className="section-title">Настройки аудио</h2>
                <p className="section-description">
                    Настройте микрофон, динамики и качество звука для оптимального голосового общения
                </p>
            </div>

            {/* Навигация по разделам */}
            <div className="audio-settings-nav">
                <button 
                    className={`nav-button ${activeSection === 'devices' ? 'active' : ''}`}
                    onClick={() => setActiveSection('devices')}
                >
                    🎤 Устройства
                </button>
                <button 
                    className={`nav-button ${activeSection === 'quality' ? 'active' : ''}`}
                    onClick={() => setActiveSection('quality')}
                >
                    🎵 Качество
                </button>
                <button 
                    className={`nav-button ${activeSection === 'effects' ? 'active' : ''}`}
                    onClick={() => setActiveSection('effects')}
                >
                    ✨ Эффекты
                </button>
                <button 
                    className={`nav-button ${activeSection === 'advanced' ? 'active' : ''}`}
                    onClick={() => setActiveSection('advanced')}
                >
                    ⚙️ Расширенные
                </button>
            </div>

            {/* Содержимое разделов */}
            <div className="audio-settings-content">
                {activeSection === 'devices' && (
                    <div className="settings-section-content">
                        <div className="section-header">
                            <h3>🎤 Настройки устройств</h3>
                            <p>Выберите и настройте микрофон и динамики</p>
                        </div>
                        <div className="audio-settings-grid">
                            <MicrophoneSettings />
                            <SpeakerSettings />
                        </div>
                    </div>
                )}

                {activeSection === 'quality' && (
                    <div className="settings-section-content">
                        <div className="section-header">
                            <h3>🎵 Качество звука</h3>
                            <p>Настройте параметры качества записи и воспроизведения</p>
                        </div>
                        <AudioQualitySettings />
                    </div>
                )}

                {activeSection === 'effects' && (
                    <div className="settings-section-content">
                        <div className="section-header">
                            <h3>✨ Аудио эффекты</h3>
                            <p>Настройте фильтры и обработку звука</p>
                        </div>
                        <AudioEffectsSettings />
                    </div>
                )}

                {activeSection === 'advanced' && (
                    <div className="settings-section-content">
                        <div className="section-header">
                            <h3>⚙️ Расширенные настройки</h3>
                            <p>Профессиональные параметры для опытных пользователей</p>
                        </div>
                        <div className="advanced-settings-grid">
                            <div className="advanced-settings-card">
                                <h4>🔧 Системные настройки</h4>
                                <div className="setting-item">
                                    <label>Буфер аудио:</label>
                                    <select defaultValue="256">
                                        <option value="128">128 сэмплов</option>
                                        <option value="256">256 сэмплов</option>
                                        <option value="512">512 сэмплов</option>
                                        <option value="1024">1024 сэмпла</option>
                                    </select>
                                </div>
                                <div className="setting-item">
                                    <label>Приоритет потока:</label>
                                    <select defaultValue="normal">
                                        <option value="low">Низкий</option>
                                        <option value="normal">Обычный</option>
                                        <option value="high">Высокий</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="advanced-settings-card">
                                <h4>📊 Мониторинг</h4>
                                <div className="setting-item">
                                    <label>Показывать уровни:</label>
                                    <input type="checkbox" defaultChecked />
                                </div>
                                <div className="setting-item">
                                    <label>Логирование:</label>
                                    <input type="checkbox" />
                                </div>
                                <div className="setting-item">
                                    <label>Автотест:</label>
                                    <input type="checkbox" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Футер с советами */}
            <div className="audio-settings-footer">
                <div className="footer-info">
                    <h4>💡 Советы по настройке</h4>
                    <div className="tips-grid">
                        <div className="tip-item">
                            <h5>🎤 Микрофон</h5>
                            <ul>
                                <li>Используйте качественный микрофон для лучшего звука</li>
                                <li>Настройте громкость так, чтобы не было искажений</li>
                                <li>Включите шумоподавление в шумных помещениях</li>
                            </ul>
                        </div>
                        <div className="tip-item">
                            <h5>🔊 Динамики</h5>
                            <ul>
                                <li>Тестируйте настройки перед важными разговорами</li>
                                <li>Используйте наушники для лучшей изоляции</li>
                                <li>Настройте баланс левого и правого канала</li>
                            </ul>
                        </div>
                        <div className="tip-item">
                            <h5>⚡ Производительность</h5>
                            <ul>
                                <li>Высокое качество требует больше ресурсов</li>
                                <li>Низкая задержка может вызвать артефакты</li>
                                <li>Тестируйте настройки на вашем устройстве</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioSettings;

