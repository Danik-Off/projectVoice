import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import audioSettingsStore from '../../../../store/AudioSettingsStore';
import { SettingsIcon, WaveIcon, QualityIcon } from './icons';

const AudioEffectsSettings: React.FC = observer(() => {
    const [activeFilter, setActiveFilter] = useState<'voice' | 'music' | 'custom'>('voice');

    return (
        <div className="audio-effects-settings">
            <div className="effects-settings-grid">
                {/* Основные эффекты */}
                <div className="effects-settings-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <SettingsIcon />
                        </div>
                        <div className="header-content">
                            <h4>Основные эффекты</h4>
                            <p>Базовые настройки обработки звука</p>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Эхо-канселлинг</span>
                            </label>
                            <div className="setting-control">
                                <div className="toggle-group">
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={audioSettingsStore.echoCancellation}
                                            onChange={(e) => audioSettingsStore.setEchoCancellation(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                    <span className="toggle-label">
                                        {audioSettingsStore.echoCancellation ? 'Включено' : 'Отключено'}
                                    </span>
                                </div>
                                <div className="setting-description">
                                    Убирает эхо и обратную связь в голосовом чате
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Шумоподавление</span>
                            </label>
                            <div className="setting-control">
                                <div className="toggle-group">
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={audioSettingsStore.noiseSuppression}
                                            onChange={(e) => audioSettingsStore.setNoiseSuppression(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                    <span className="toggle-label">
                                        {audioSettingsStore.noiseSuppression ? 'Включено' : 'Отключено'}
                                    </span>
                                </div>
                                <div className="setting-description">
                                    Фильтрует фоновые шумы и помехи
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Автоконтроль громкости</span>
                            </label>
                            <div className="setting-control">
                                <div className="toggle-group">
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={audioSettingsStore.autoGainControl}
                                            onChange={(e) => audioSettingsStore.setAutoGainControl(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                    <span className="toggle-label">
                                        {audioSettingsStore.autoGainControl ? 'Включено' : 'Отключено'}
                                    </span>
                                </div>
                                <div className="setting-description">
                                    Автоматически регулирует уровень входящего сигнала
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Фильтры частот */}
                <div className="effects-settings-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <QualityIcon />
                        </div>
                        <div className="header-content">
                            <h4>Частотные фильтры</h4>
                            <p>Настройка диапазона частот</p>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Высокочастотный фильтр</span>
                            </label>
                            <div className="setting-control">
                                <div className="frequency-control">
                                    <input
                                        type="range"
                                        min="100"
                                        max="1000"
                                        defaultValue="300"
                                        className="frequency-slider"
                                        onChange={(e) => {
                                            // TODO: Добавить поддержку высокочастотного фильтра в AudioSettingsStore
                                            console.log('Highpass filter frequency:', e.target.value);
                                        }}
                                    />
                                    <span className="frequency-value">300 Гц</span>
                                </div>
                                <div className="setting-description">
                                    Убирает низкочастотные шумы (гул, вибрации)
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Низкочастотный фильтр</span>
                            </label>
                            <div className="setting-control">
                                <div className="frequency-control">
                                    <input
                                        type="range"
                                        min="2000"
                                        max="8000"
                                        defaultValue="3400"
                                        className="frequency-slider"
                                        onChange={(e) => {
                                            // TODO: Добавить поддержку низкочастотного фильтра в AudioSettingsStore
                                            console.log('Lowpass filter frequency:', e.target.value);
                                        }}
                                    />
                                    <span className="frequency-value">3400 Гц</span>
                                </div>
                                <div className="setting-description">
                                    Убирает высокочастотные шумы (шипение, свист)
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Полосовой фильтр</span>
                            </label>
                            <div className="setting-control">
                                <div className="bandpass-control">
                                    <div className="frequency-range">
                                        <span>Центр: 1000 Гц</span>
                                        <span>Ширина: 2000 Гц</span>
                                    </div>
                                    <div className="bandpass-sliders">
                                        <input
                                            type="range"
                                            min="500"
                                            max="2000"
                                            defaultValue="1000"
                                            className="center-slider"
                                        />
                                        <input
                                            type="range"
                                            min="500"
                                            max="4000"
                                            defaultValue="2000"
                                            className="width-slider"
                                        />
                                    </div>
                                </div>
                                <div className="setting-description">
                                    Выделяет определенную полосу частот
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Предустановки фильтров */}
                <div className="effects-settings-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <QualityIcon />
                        </div>
                        <div className="header-content">
                            <h4>Предустановки фильтров</h4>
                            <p>Готовые конфигурации для разных ситуаций</p>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="filter-presets">
                            <button className="preset-button voice-preset" onClick={() => setActiveFilter('voice')}>
                                <h5>🎤 Голос</h5>
                                <p>Оптимизировано для речи</p>
                                <ul>
                                    <li>Эхо-канселлинг: Вкл</li>
                                    <li>Шумоподавление: Вкл</li>
                                    <li>Диапазон: 300-3400 Гц</li>
                                </ul>
                            </button>
                            
                            <button className="preset-button music-preset" onClick={() => setActiveFilter('music')}>
                                <h5>🎵 Музыка</h5>
                                <p>Для музыкальных инструментов</p>
                                <ul>
                                    <li>Эхо-канселлинг: Выкл</li>
                                    <li>Шумоподавление: Мягкий</li>
                                    <li>Диапазон: 80-8000 Гц</li>
                                </ul>
                            </button>
                            
                            <button className="preset-button custom-preset" onClick={() => setActiveFilter('custom')}>
                                <h5>⚙️ Пользовательский</h5>
                                <p>Настройки вручную</p>
                                <ul>
                                    <li>Все фильтры: Настраиваются</li>
                                    <li>Гибкая конфигурация</li>
                                    <li>Для опытных пользователей</li>
                                </ul>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Дополнительные эффекты */}
                <div className="effects-settings-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <SettingsIcon />
                        </div>
                        <div className="header-content">
                            <h4>Дополнительные эффекты</h4>
                            <p>Специальные возможности обработки</p>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Компрессор</span>
                            </label>
                            <div className="setting-control">
                                <div className="compressor-control">
                                    <div className="compressor-params">
                                        <div className="param-item">
                                            <label>Порог:</label>
                                            <input type="range" min="-60" max="0" defaultValue="-20" />
                                            <span>-20 дБ</span>
                                        </div>
                                        <div className="param-item">
                                            <label>Соотношение:</label>
                                            <input type="range" min="1" max="20" defaultValue="4" />
                                            <span>4:1</span>
                                        </div>
                                        <div className="param-item">
                                            <label>Атака:</label>
                                            <input type="range" min="0" max="100" defaultValue="10" />
                                            <span>10 мс</span>
                                        </div>
                                        <div className="param-item">
                                            <label>Восстановление:</label>
                                            <input type="range" min="0" max="1000" defaultValue="100" />
                                            <span>100 мс</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="setting-description">
                                    Выравнивает динамический диапазон звука
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Эквалайзер</span>
                            </label>
                            <div className="setting-control">
                                <div className="equalizer-control">
                                    <div className="eq-bands">
                                        {[60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000].map((freq) => (
                                            <div key={freq} className="eq-band">
                                                <span className="freq-label">{freq < 1000 ? freq : `${freq/1000}k`}</span>
                                                <input
                                                    type="range"
                                                    min="-12"
                                                    max="12"
                                                    defaultValue="0"
                                                    className="eq-slider"
                                                />
                                                <span className="db-value">0 дБ</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="setting-description">
                                    Точная настройка частотных характеристик
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Статус активных фильтров */}
            <div className="active-filters-status">
                <h4>🔍 Активные фильтры</h4>
                <div className="filters-summary">
                    <div className="filter-status">
                        <span className="filter-name">Эхо-канселлинг:</span>
                        <span className={`filter-state ${audioSettingsStore.echoCancellation ? 'active' : 'inactive'}`}>
                            {audioSettingsStore.echoCancellation ? 'Активен' : 'Неактивен'}
                        </span>
                    </div>
                    <div className="filter-status">
                        <span className="filter-name">Шумоподавление:</span>
                        <span className={`filter-state ${audioSettingsStore.noiseSuppression ? 'active' : 'inactive'}`}>
                            {audioSettingsStore.noiseSuppression ? 'Активен' : 'Неактивен'}
                        </span>
                    </div>
                    <div className="filter-status">
                        <span className="filter-name">Автоконтроль:</span>
                        <span className={`filter-state ${audioSettingsStore.autoGainControl ? 'active' : 'inactive'}`}>
                            {audioSettingsStore.autoGainControl ? 'Активен' : 'Неактивен'}
                        </span>
                    </div>
                    <div className="filter-status">
                        <span className="filter-name">Текущий профиль:</span>
                        <span className="filter-state active">{activeFilter === 'voice' ? 'Голос' : activeFilter === 'music' ? 'Музыка' : 'Пользовательский'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AudioEffectsSettings;
