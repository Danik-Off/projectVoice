import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import vadService from '../../services/VoiceActivityDetectionService';
import './VADSettings.scss';

interface VADSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const VADSettings: React.FC<VADSettingsProps> = observer(({ isOpen, onClose }) => {
    const [config, setConfig] = useState(vadService.getConfig());

    const handleThresholdChange = (value: number) => {
        const newConfig = { ...config, threshold: value };
        setConfig(newConfig);
        vadService.setConfig(newConfig);
    };

    const handleSilenceTimeoutChange = (value: number) => {
        const newConfig = { ...config, silenceTimeout: value };
        setConfig(newConfig);
        vadService.setConfig(newConfig);
    };

    const handleMinSpeechDurationChange = (value: number) => {
        const newConfig = { ...config, minSpeechDuration: value };
        setConfig(newConfig);
        vadService.setConfig(newConfig);
    };

    const handleSmoothingFactorChange = (value: number) => {
        const newConfig = { ...config, smoothingFactor: value / 100 };
        setConfig(newConfig);
        vadService.setConfig(newConfig);
    };

    if (!isOpen) return null;

    return (
        <div className="vad-settings-overlay" onClick={onClose}>
            <div className="vad-settings-modal" onClick={(e) => e.stopPropagation()}>
                <div className="vad-settings-header">
                    <h3>Настройки VAD (Voice Activity Detection)</h3>
                    <button className="vad-settings-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="vad-settings-content">
                    <div className="vad-setting-group">
                        <label htmlFor="threshold">
                            Порог активации: {config.threshold}%
                        </label>
                        <input
                            id="threshold"
                            type="range"
                            min="10"
                            max="5000"
                            value={config.threshold}
                            onChange={(e) => handleThresholdChange(Number(e.target.value))}
                            className="vad-slider"
                        />
                        <div className="vad-setting-description">
                            Минимальный уровень громкости для определения речи
                        </div>
                    </div>

                    <div className="vad-setting-group">
                        <label htmlFor="silence-timeout">
                            Таймаут тишины: {config.silenceTimeout}мс
                        </label>
                        <input
                            id="silence-timeout"
                            type="range"
                            min="500"
                            max="3000"
                            step="100"
                            value={config.silenceTimeout}
                            onChange={(e) => handleSilenceTimeoutChange(Number(e.target.value))}
                            className="vad-slider"
                        />
                        <div className="vad-setting-description">
                            Время до прекращения активности после тишины
                        </div>
                    </div>

                    <div className="vad-setting-group">
                        <label htmlFor="min-speech-duration">
                            Минимальная длительность речи: {config.minSpeechDuration}мс
                        </label>
                        <input
                            id="min-speech-duration"
                            type="range"
                            min="100"
                            max="1000"
                            step="50"
                            value={config.minSpeechDuration}
                            onChange={(e) => handleMinSpeechDurationChange(Number(e.target.value))}
                            className="vad-slider"
                        />
                        <div className="vad-setting-description">
                            Минимальное время речи для активации
                        </div>
                    </div>

                    <div className="vad-setting-group">
                        <label htmlFor="smoothing-factor">
                            Сглаживание: {Math.round(config.smoothingFactor * 100)}%
                        </label>
                        <input
                            id="smoothing-factor"
                            type="range"
                            min="0"
                            max="100"
                            value={Math.round(config.smoothingFactor * 100)}
                            onChange={(e) => handleSmoothingFactorChange(Number(e.target.value))}
                            className="vad-slider"
                        />
                        <div className="vad-setting-description">
                            Уровень сглаживания для стабильности определения
                        </div>
                    </div>
                </div>

                <div className="vad-settings-footer">
                    <button className="vad-settings-reset" onClick={() => {
                        const defaultConfig = {
                            threshold: 30,
                            silenceTimeout: 1000,
                            minSpeechDuration: 200,
                            smoothingFactor: 0.7
                        };
                        setConfig(defaultConfig);
                        vadService.setConfig(defaultConfig);
                    }}>
                        Сбросить
                    </button>
                    <button className="vad-settings-apply" onClick={onClose}>
                        Применить
                    </button>
                </div>
            </div>
        </div>
    );
});

export default VADSettings;
