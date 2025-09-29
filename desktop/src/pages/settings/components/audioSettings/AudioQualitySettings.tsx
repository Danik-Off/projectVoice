import React from 'react';
import { observer } from 'mobx-react-lite';
import audioSettingsStore from '../../../../store/AudioSettingsStore';
import { QualityIcon, WaveIcon, SettingsIcon } from './icons';

const AudioQualitySettings: React.FC = observer(() => {

    return (
        <div className="audio-quality-settings">
            <div className="quality-settings-grid">
                {/* Основные параметры качества */}
                <div className="quality-settings-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <QualityIcon />
                        </div>
                        <div className="header-content">
                            <h4>Основные параметры</h4>
                            <p>Базовые настройки качества звука</p>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Частота дискретизации</span>
                            </label>
                            <div className="setting-control">
                                <select
                                    value={audioSettingsStore.sampleRate}
                                    onChange={(e) => audioSettingsStore.setSampleRate(parseInt(e.target.value))}
                                    className="quality-select"
                                >
                                    <option value="8000">8 кГц - Телефонное качество</option>
                                    <option value="16000">16 кГц - Радио качество</option>
                                    <option value="22050">22.05 кГц - Вещательное качество</option>
                                    <option value="44100">44.1 кГц - CD качество</option>
                                    <option value="48000">48 кГц - Профессиональное</option>
                                    <option value="96000">96 кГц - Студийное</option>
                                </select>
                                <div className="setting-description">
                                    Более высокая частота = лучшее качество, но больше ресурсов
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Битность</span>
                            </label>
                            <div className="setting-control">
                                <select
                                    value={audioSettingsStore.sampleSize}
                                    onChange={(e) => audioSettingsStore.setSampleSize(parseInt(e.target.value))}
                                    className="quality-select"
                                >
                                    <option value="8">8 бит - Низкое качество</option>
                                    <option value="16">16 бит - Стандартное качество</option>
                                    <option value="24">24 бита - Высокое качество</option>
                                    <option value="32">32 бита - Профессиональное</option>
                                </select>
                                <div className="setting-description">
                                    Больше бит = лучшее разрешение звука
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Каналы</span>
                            </label>
                            <div className="setting-control">
                                <div className="radio-group">
                                    <label className="radio-item">
                                        <input
                                            type="radio"
                                            name="quality-channel"
                                            value="mono"
                                            checked={audioSettingsStore.channelCount === 1}
                                            onChange={() => audioSettingsStore.setChannelCount('mono')}
                                            className="custom-radio"
                                        />
                                        <span className="radio-mark"></span>
                                        <span>Моно (1 канал) - Экономия ресурсов</span>
                                    </label>
                                    <label className="radio-item">
                                        <input
                                            type="radio"
                                            name="quality-channel"
                                            value="stereo"
                                            checked={audioSettingsStore.channelCount === 2}
                                            onChange={() => audioSettingsStore.setChannelCount('stereo')}
                                            className="custom-radio"
                                        />
                                        <span className="radio-mark"></span>
                                        <span>Стерео (2 канала) - Пространственный звук</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Настройки производительности */}
                <div className="quality-settings-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <SettingsIcon />
                        </div>
                        <div className="header-content">
                            <h4>Производительность</h4>
                            <p>Баланс между качеством и нагрузкой</p>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <SettingsIcon />
                                <span>Задержка</span>
                            </label>
                            <div className="setting-control">
                                <div className="latency-control">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={audioSettingsStore.latency}
                                        onChange={(e) => audioSettingsStore.setLatency(parseInt(e.target.value))}
                                        className="latency-slider"
                                    />
                                    <span className="latency-value">{audioSettingsStore.latency}мс</span>
                                </div>
                                <div className="setting-description">
                                    Низкая задержка = лучший отклик, но больше артефактов
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <SettingsIcon />
                                <span>Буфер аудио</span>
                            </label>
                            <div className="setting-control">
                                <select 
                                    defaultValue="256" 
                                    className="quality-select"
                                    onChange={(e) => {
                                        // TODO: Добавить поддержку буфера аудио в AudioSettingsStore
                                        console.log('Audio buffer size:', e.target.value);
                                    }}
                                >
                                    <option value="128">128 сэмплов - Минимальная задержка</option>
                                    <option value="256">256 сэмплов - Рекомендуется</option>
                                    <option value="512">512 сэмплов - Стабильность</option>
                                    <option value="1024">1024 сэмпла - Максимальная стабильность</option>
                                </select>
                                <div className="setting-description">
                                    Меньший буфер = меньше задержка, но больше нагрузка
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <SettingsIcon />
                                <span>Приоритет потока</span>
                            </label>
                            <div className="setting-control">
                                <select 
                                    defaultValue="normal" 
                                    className="quality-select"
                                    onChange={(e) => {
                                        // TODO: Добавить поддержку приоритета потока в AudioSettingsStore
                                        console.log('Stream priority:', e.target.value);
                                    }}
                                >
                                    <option value="low">Низкий - Экономия ресурсов</option>
                                    <option value="normal">Обычный - Рекомендуется</option>
                                    <option value="high">Высокий - Максимальное качество</option>
                                </select>
                                <div className="setting-description">
                                    Высокий приоритет = лучшее качество, но больше CPU
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Предустановки качества */}
                <div className="quality-settings-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <QualityIcon />
                        </div>
                        <div className="header-content">
                            <h4>Предустановки</h4>
                            <p>Готовые конфигурации для разных задач</p>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="presets-grid">
                            <button className="preset-button" onClick={() => {
                                audioSettingsStore.setSampleRate(8000);
                                audioSettingsStore.setSampleSize(16);
                                audioSettingsStore.setChannelCount('mono');
                                audioSettingsStore.setLatency(500);
                            }}>
                                <h5>📞 Телефон</h5>
                                <p>8кГц, 16бит, моно</p>
                                <span className="preset-desc">Экономия трафика</span>
                            </button>
                            
                            <button className="preset-button" onClick={() => {
                                audioSettingsStore.setSampleRate(44100);
                                audioSettingsStore.setSampleSize(16);
                                audioSettingsStore.setChannelCount('stereo');
                                audioSettingsStore.setLatency(200);
                            }}>
                                <h5>🎵 Музыка</h5>
                                <p>44.1кГц, 16бит, стерео</p>
                                <span className="preset-desc">CD качество</span>
                            </button>
                            
                            <button className="preset-button" onClick={() => {
                                audioSettingsStore.setSampleRate(48000);
                                audioSettingsStore.setSampleSize(24);
                                audioSettingsStore.setChannelCount('stereo');
                                audioSettingsStore.setLatency(100);
                            }}>
                                <h5>🎙️ Студия</h5>
                                <p>48кГц, 24бит, стерео</p>
                                <span className="preset-desc">Профессиональное</span>
                            </button>
                            
                            <button className="preset-button" onClick={() => {
                                audioSettingsStore.setSampleRate(96000);
                                audioSettingsStore.setSampleSize(32);
                                audioSettingsStore.setChannelCount('stereo');
                                audioSettingsStore.setLatency(50);
                            }}>
                                <h5>🏆 Премиум</h5>
                                <p>96кГц, 32бит, стерео</p>
                                <span className="preset-desc">Максимальное качество</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Информация о текущих настройках */}
            <div className="current-settings-info">
                <h4>📊 Текущие настройки качества</h4>
                <div className="settings-summary">
                    <div className="summary-item">
                        <span className="label">Частота:</span>
                        <span className="value">{audioSettingsStore.sampleRate} Гц</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Битность:</span>
                        <span className="value">{audioSettingsStore.sampleSize} бит</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Каналы:</span>
                        <span className="value">{audioSettingsStore.channelCount === 1 ? 'Моно' : 'Стерео'}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Задержка:</span>
                        <span className="value">{audioSettingsStore.latency} мс</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Качество:</span>
                        <span className="value quality-indicator">
                            {audioSettingsStore.sampleRate >= 48000 && audioSettingsStore.sampleSize >= 24 ? 'Высокое' :
                             audioSettingsStore.sampleRate >= 44100 && audioSettingsStore.sampleSize >= 16 ? 'Среднее' : 'Базовое'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AudioQualitySettings;
