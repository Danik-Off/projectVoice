import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import voiceActivityService from '../../services/VoiceActivityService';
import './VADSettings.scss';

interface VADSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const VADSettings: React.FC<VADSettingsProps> = observer(({ isOpen, onClose }) => {
    const [config, setConfig] = useState({
        threshold: 10,
        smoothingFactor: 0.8
    });

    const handleThresholdChange = (value: number) => {
        const newConfig = { ...config, threshold: value };
        setConfig(newConfig);
        (voiceActivityService as any).config.threshold = value;
    };

    const handleSmoothingFactorChange = (value: number) => {
        const newConfig = { ...config, smoothingFactor: value / 100 };
        setConfig(newConfig);
        (voiceActivityService as any).config.smoothingFactor = value / 100;
    };

    if (!isOpen) return null;

    return (
        <div className="vad-settings-overlay" onClick={onClose}>
            <div className="vad-settings-modal" onClick={(e) => e.stopPropagation()}>
                <div className="vad-settings-header">
                    <h3>Настройки Voice Activity</h3>
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
                            min="5"
                            max="50"
                            value={config.threshold}
                            onChange={(e) => handleThresholdChange(Number(e.target.value))}
                            className="vad-slider"
                        />
                        <div className="vad-setting-description">
                            Минимальный уровень громкости для определения речи
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
                            threshold: 10,
                            smoothingFactor: 0.8
                        };
                        setConfig(defaultConfig);
                        (voiceActivityService as any).config.threshold = 10;
                        (voiceActivityService as any).config.smoothingFactor = 0.8;
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
