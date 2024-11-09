import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import audioSettingsStore from '../../../store/AudioSettingsStore';
import MicrophoneVisualizer from './components/MicrophoneVisualizer/MicrophoneVisualizer';

const AudioSettingsGroup = observer(() => {
    const { t } = useTranslation();

    return (
        <div className="settings-group">
            <h2 className="settings-group__title">{t('settingsPage.audio.title')}</h2>

            {/* Select Microphone */}
            <MicrophoneVisualizer></MicrophoneVisualizer>
            <div className="settings-group__option">
                <label htmlFor="microphone">{t('settingsPage.audio.microphone')}</label>
                <select
                    id="microphone"
                    value={audioSettingsStore.selectedMicrophone?.deviceId || ''}
                    onChange={(e) => audioSettingsStore.setMicrophone(e.target.value)}
                >
                    {audioSettingsStore.microphoneDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || t('settingsPage.audio.unknownDevice')}
                        </option>
                    ))}
                </select>
            </div>

            {/* Select Speaker */}
            <div className="settings-group__option">
                <label htmlFor="speaker">{t('settingsPage.audio.speaker')}</label>
                <select
                    id="speaker"
                    value={audioSettingsStore.selectedSpeaker?.deviceId || ''}
                    onChange={(e) => audioSettingsStore.setSpeaker(e.target.value)}
                >
                    {audioSettingsStore.speakerDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || t('settingsPage.audio.unknownDevice')}
                        </option>
                    ))}
                </select>
            </div>

            {/* Volume Control */}
            <div className="settings-group__option">
                <label htmlFor="volume">{t('settingsPage.audio.volume')}</label>
                <input
                    type="range"
                    id="volume"
                    min="0"
                    max="100"
                    value={audioSettingsStore.volume}
                    onChange={(e) => audioSettingsStore.setVolume(Number(e.target.value))}
                />
            </div>
        </div>
    );
});

export default AudioSettingsGroup;
