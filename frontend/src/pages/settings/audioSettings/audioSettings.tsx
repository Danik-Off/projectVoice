import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import audioSettingsStore from '../../../store/AudioSettingsStore';
import './audioSettings.scss';

const AudioSettingsGroup = observer(() => {
    const { t } = useTranslation();
    
    const test = () => {
        audioSettingsStore.testSpeakers();
    };

    return (
        <div className="audio-settings-group">
            <div className="audio-settings-header">
                <h3>Динамики</h3>
                <div className="test-button-container">
                    <button onClick={test} className="test-button">
                        <span className="test-icon">🔊</span>
                        Тест
                    </button>
                </div>
            </div>
            
            <div className="audio-settings-content">
                <div className="settings-row">
                    <label htmlFor="speaker" className="settings-label">
                        {t('settingsPage.audio.speaker')}
                    </label>
                    <div className="settings-control">
                        <select
                            id="speaker"
                            value={audioSettingsStore.selectedSpeaker?.deviceId || ''}
                            onChange={(e) => audioSettingsStore.setSpeaker(e.target.value)}
                            className="device-select"
                        >
                            {audioSettingsStore.speakerDevices.map((device) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || t('settingsPage.audio.unknownDevice')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AudioSettingsGroup;

