import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import SpeakerSettings from './SpeakerSettings';
import MicrophoneSettings from './MicrophoneSettings';
import audioSettingsStore from '../../../../store/AudioSettingsStore';

const AudioSettings: React.FC = observer(() => {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState<'devices' | 'quality' | 'advanced'>('devices');

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('settingsPage.audio.title')}</h2>
                <p>{t('settingsPage.audio.description')}</p>
            </div>

            <div className="section-content">
                {/* Навигация по разделам */}
                <div className="settings-tabs">
                    <button
                        className={`tab-button ${activeSection === 'devices' ? 'active' : ''}`}
                        onClick={() => setActiveSection('devices')}
                    >
                        🎤 {t('settingsPage.audio.tabs.devices')}
                    </button>
                    <button
                        className={`tab-button ${activeSection === 'quality' ? 'active' : ''}`}
                        onClick={() => setActiveSection('quality')}
                    >
                        🎵 {t('settingsPage.audio.tabs.quality')}
                    </button>
                    <button
                        className={`tab-button ${activeSection === 'advanced' ? 'active' : ''}`}
                        onClick={() => setActiveSection('advanced')}
                    >
                        ⚙️ Детальные настройки
                    </button>
                </div>

                {/* Содержимое разделов */}
                {activeSection === 'devices' && (
                    <div className="settings-grid two-columns">
                        <MicrophoneSettings />
                        <SpeakerSettings />
                    </div>
                )}

                {activeSection === 'quality' && (
                    <div className="settings-card">
                        <div className="card-header">
                            <div className="header-content">
                                <div className="icon-container">🎵</div>
                                <div className="header-text">
                                    <h3>Качество звука</h3>
                                    <p>Выберите подходящий уровень качества звука</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            {/* Переключатель режимов */}
                            <div className="setting-group">
                                <label className="setting-label">
                                    <span>Режим настроек</span>
                                </label>
                                <div className="setting-control">
                                    <div className="mode-switcher">
                                        <button 
                                            className={`mode-btn ${audioSettingsStore.settingsMode === 'simple' ? 'active' : ''}`}
                                            onClick={() => audioSettingsStore.setSettingsMode('simple')}
                                        >
                                            Простой
                                        </button>
                                        <button 
                                            className={`mode-btn ${audioSettingsStore.settingsMode === 'detailed' ? 'active' : ''}`}
                                            onClick={() => audioSettingsStore.setSettingsMode('detailed')}
                                        >
                                            Детальный
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Простой режим */}
                            {audioSettingsStore.settingsMode === 'simple' && (
                                <div className="setting-group">
                                    <label className="setting-label">
                                        <span>Качество звука</span>
                                        <span className="setting-description">Выберите подходящий уровень качества для вашего соединения</span>
                                    </label>
                                    <div className="setting-control">
                                        <div className="quality-selector">
                                            <button 
                                                className={`quality-btn ${audioSettingsStore.audioQuality === 'low' ? 'active' : ''}`}
                                                onClick={() => audioSettingsStore.setAudioQuality('low')}
                                            >
                                                <div className="quality-title">Низкое</div>
                                                <div className="quality-desc">Экономия трафика, базовая обработка</div>
                                                <div className="quality-specs">16 кГц, 64 kbps, 200 мс</div>
                                            </button>
                                            <button 
                                                className={`quality-btn ${audioSettingsStore.audioQuality === 'medium' ? 'active' : ''}`}
                                                onClick={() => audioSettingsStore.setAudioQuality('medium')}
                                            >
                                                <div className="quality-title">Среднее</div>
                                                <div className="quality-desc">Оптимальный баланс качества и производительности</div>
                                                <div className="quality-specs">24 кГц, 128 kbps, 150 мс</div>
                                            </button>
                                            <button 
                                                className={`quality-btn ${audioSettingsStore.audioQuality === 'high' ? 'active' : ''}`}
                                                onClick={() => audioSettingsStore.setAudioQuality('high')}
                                            >
                                                <div className="quality-title">Высокое</div>
                                                <div className="quality-desc">Максимальное качество звука</div>
                                                <div className="quality-specs">48 кГц, 256 kbps, 100 мс</div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Детальный режим */}
                            {audioSettingsStore.settingsMode === 'detailed' && (
                                <>
                                    {/* Основные настройки */}
                                    <div className="setting-group">
                                        <label className="setting-label">
                                            <span>Основные настройки</span>
                                            <span className="setting-description">Базовые параметры обработки звука</span>
                                        </label>
                                        <div className="setting-control">
                                            <div className="checkbox-group">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={audioSettingsStore.echoCancellation}
                                                        onChange={(e) => audioSettingsStore.setEchoCancellation(e.target.checked)}
                                                    />
                                                    <span>Подавление эха</span>
                                                    <span className="checkbox-description">Убирает эхо и обратную связь</span>
                                                </label>
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={audioSettingsStore.noiseSuppression}
                                                        onChange={(e) => audioSettingsStore.setNoiseSuppression(e.target.checked)}
                                                    />
                                                    <span>Шумоподавление</span>
                                                    <span className="checkbox-description">Убирает фоновые шумы</span>
                                                </label>
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={audioSettingsStore.autoGainControl}
                                                        onChange={(e) => audioSettingsStore.setAutoGainControl(e.target.checked)}
                                                    />
                                                    <span>Автоконтроль громкости</span>
                                                    <span className="checkbox-description">Автоматически регулирует уровень звука</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Технические параметры */}
                                    <div className="setting-group">
                                        <label className="setting-label">
                                            <span>Технические параметры</span>
                                            <span className="setting-description">Настройки качества и производительности</span>
                                        </label>
                                        <div className="setting-control">
                                            <div className="slider-group">
                                                <div className="slider-item">
                                                    <label>Частота дискретизации</label>
                                                    <input
                                                        type="range"
                                                        min="8000"
                                                        max="48000"
                                                        step="8000"
                                                        value={audioSettingsStore.sampleRate}
                                                        onChange={(e) => audioSettingsStore.setSampleRate(Number(e.target.value))}
                                                        className="settings-slider"
                                                    />
                                                    <span className="slider-value">{audioSettingsStore.sampleRate} Гц</span>
                                                    <span className="slider-description">Выше = лучше качество, больше трафика</span>
                                                </div>
                                                <div className="slider-item">
                                                    <label>Битрейт</label>
                                                    <input
                                                        type="range"
                                                        min="64"
                                                        max="320"
                                                        step="32"
                                                        value={audioSettingsStore.bitrate}
                                                        onChange={(e) => audioSettingsStore.setBitrate(Number(e.target.value))}
                                                        className="settings-slider"
                                                    />
                                                    <span className="slider-value">{audioSettingsStore.bitrate} kbps</span>
                                                    <span className="slider-description">Качество передачи звука</span>
                                                </div>
                                                <div className="slider-item">
                                                    <label>Задержка</label>
                                                    <input
                                                        type="range"
                                                        min="50"
                                                        max="1000"
                                                        step="50"
                                                        value={audioSettingsStore.latency}
                                                        onChange={(e) => audioSettingsStore.setLatency(Number(e.target.value))}
                                                        className="settings-slider"
                                                    />
                                                    <span className="slider-value">{audioSettingsStore.latency} мс</span>
                                                    <span className="slider-description">Меньше = быстрее отклик</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'advanced' && (
                    <div className="settings-card">
                        <div className="card-header">
                            <div className="header-content">
                                <div className="icon-container">⚙️</div>
                                <div className="header-text">
                                    <h3>Расширенные настройки</h3>
                                    <p>Дополнительные параметры обработки звука для опытных пользователей</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            {/* Улучшение голоса */}
                            <div className="setting-group">
                                <label className="setting-label">
                                    <span>Улучшение голоса</span>
                                    <span className="setting-description">Настройки для улучшения качества и четкости голоса</span>
                                </label>
                                <div className="setting-control">
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={audioSettingsStore.voiceEnhancement}
                                                onChange={(e) => audioSettingsStore.setVoiceEnhancement(e.target.checked)}
                                            />
                                            <span>Улучшение голоса</span>
                                            <span className="checkbox-description">Общее улучшение качества голоса</span>
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={audioSettingsStore.voiceIsolation}
                                                onChange={(e) => audioSettingsStore.setVoiceIsolation(e.target.checked)}
                                            />
                                            <span>Изоляция голоса</span>
                                            <span className="checkbox-description">Выделяет только голосовые частоты</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Настройки обработки звука */}
                            <div className="setting-group">
                                <label className="setting-label">
                                    <span>Обработка звука</span>
                                    <span className="setting-description">Тонкая настройка параметров обработки</span>
                                </label>
                                <div className="setting-control">
                                    <div className="slider-group">
                                        <div className="slider-item">
                                            <label>Четкость голоса</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={audioSettingsStore.voiceClarity * 100}
                                                onChange={(e) => audioSettingsStore.setVoiceClarity(Number(e.target.value) / 100)}
                                                className="settings-slider"
                                            />
                                            <span className="slider-value">{Math.round(audioSettingsStore.voiceClarity * 100)}%</span>
                                            <span className="slider-description">Улучшает разборчивость речи</span>
                                        </div>
                                        <div className="slider-item">
                                            <label>Снижение фонового шума</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={audioSettingsStore.backgroundNoiseReduction * 100}
                                                onChange={(e) => audioSettingsStore.setBackgroundNoiseReduction(Number(e.target.value) / 100)}
                                                className="settings-slider"
                                            />
                                            <span className="slider-value">{Math.round(audioSettingsStore.backgroundNoiseReduction * 100)}%</span>
                                            <span className="slider-description">Убирает фоновые звуки</span>
                                        </div>
                                        <div className="slider-item">
                                            <label>Усиление голоса</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={audioSettingsStore.voiceBoost * 100}
                                                onChange={(e) => audioSettingsStore.setVoiceBoost(Number(e.target.value) / 100)}
                                                className="settings-slider"
                                            />
                                            <span className="slider-value">{Math.round(audioSettingsStore.voiceBoost * 100)}%</span>
                                            <span className="slider-description">Усиливает голосовые частоты</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Эквалайзер */}
                            <div className="setting-group">
                                <label className="setting-label">
                                    <span>Эквалайзер</span>
                                    <span className="setting-description">Настройка частотной характеристики звука</span>
                                </label>
                                <div className="setting-control">
                                    <div className="slider-group">
                                        <div className="slider-item">
                                            <label>Усиление басов</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={audioSettingsStore.bassBoost * 100}
                                                onChange={(e) => audioSettingsStore.setBassBoost(Number(e.target.value) / 100)}
                                                className="settings-slider"
                                            />
                                            <span className="slider-value">{Math.round(audioSettingsStore.bassBoost * 100)}%</span>
                                            <span className="slider-description">Усиливает низкие частоты</span>
                                        </div>
                                        <div className="slider-item">
                                            <label>Усиление высоких частот</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={audioSettingsStore.trebleBoost * 100}
                                                onChange={(e) => audioSettingsStore.setTrebleBoost(Number(e.target.value) / 100)}
                                                className="settings-slider"
                                            />
                                            <span className="slider-value">{Math.round(audioSettingsStore.trebleBoost * 100)}%</span>
                                            <span className="slider-description">Усиливает высокие частоты</span>
                                        </div>
                                        <div className="slider-item">
                                            <label>Динамическое сжатие</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={audioSettingsStore.dynamicRangeCompression * 100}
                                                onChange={(e) => audioSettingsStore.setDynamicRangeCompression(Number(e.target.value) / 100)}
                                                className="settings-slider"
                                            />
                                            <span className="slider-value">{Math.round(audioSettingsStore.dynamicRangeCompression * 100)}%</span>
                                            <span className="slider-description">Выравнивает громкость</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Дополнительные эффекты */}
                            <div className="setting-group">
                                <label className="setting-label">
                                    <span>Дополнительные эффекты</span>
                                </label>
                                <div className="setting-control">
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={audioSettingsStore.stereoEnhancement}
                                                onChange={(e) => audioSettingsStore.setStereoEnhancement(e.target.checked)}
                                            />
                                            <span>Стерео улучшение</span>
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={audioSettingsStore.spatialAudio}
                                                onChange={(e) => audioSettingsStore.setSpatialAudio(e.target.checked)}
                                            />
                                            <span>Пространственный звук</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Управление настройками */}
                            <div className="setting-group">
                                <label className="setting-label">
                                    <span>Управление настройками</span>
                                    <span className="setting-description">Сброс и тестирование аудио</span>
                                </label>
                                <div className="setting-control">
                                    <div className="button-group">
                                        <button 
                                            className="settings-button settings-button--reset"
                                            onClick={() => {
                                                audioSettingsStore.setAudioQuality('medium');
                                                audioSettingsStore.setSettingsMode('simple');
                                            }}
                                        >
                                            🔄 Сбросить к умолчанию
                                        </button>
                                        <button 
                                            className="settings-button settings-button--test"
                                            onClick={() => audioSettingsStore.testMicrophone()}
                                        >
                                            🎤 Тест микрофона
                                        </button>
                                        <button 
                                            className="settings-button settings-button--test"
                                            onClick={() => audioSettingsStore.testSpeakers()}
                                        >
                                            🔊 Тест динамиков
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default AudioSettings;

