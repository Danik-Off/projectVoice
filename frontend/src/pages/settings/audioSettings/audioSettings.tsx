import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import audioSettingsStore from '../../../store/AudioSettingsStore';
import MicrophoneVisualizer from './components/MicrophoneVisualizer/MicrophoneVisualizer';

const AudioSettingsGroup = observer(() => {
    const { t } = useTranslation();
    // public echoCancellation = true; // Включает или отключает подавление эха, что помогает избежать эхо-сигналов при передаче звука.
    // public noiseSuppression = true; // Включает или отключает подавление шума, что улучшает качество звука, уменьшая фоновый шум.
    // public autoGainControl = true; // Включает или отключает автоматическое управление уровнем звука, что помогает автоматически регулировать громкость входящего сигнала.
    // public sampleRate = 16000; // Частота дискретизации в Гц. Чем выше частота, тем выше качество звука, но и больше нагрузка на систему.
    // public sampleSize = 16; // Размер выборки в битах, определяет точность обработки звука. Чем больше размер, тем лучше качество, но и больше нагрузка.
    // public channelCount = 1; // Количество каналов в звуковом потоке. 1 — моно, 2 — стерео.
    // public latency = 300; // Задержка в миллисекундах. Указывает на желаемую задержку в обработке звука (например, в реальном времени). Чем ниже значение, тем меньше задержка, но может быть большее использование процессора.
    return (
        <div className="settings-group">
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
        </div>
    );
});

export default AudioSettingsGroup;
