import React from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import audioSettingsStore from '../../../../store/AudioSettingsStore';
import MicrophoneVisualizer from './components/MicrophoneVisualizer/MicrophoneVisualizer';

const MicrophoneSettingsGroup = observer(() => {
    const { t } = useTranslation();

    return (
        <div className="settings-group">
            <MicrophoneVisualizer />

            <table className="settings-table">
                <tbody>
                    {/* Микрофон */}
                    <tr>
                        <th>
                            <label htmlFor="microphone">{t('settingsPage.audio.microphone')}</label>
                        </th>
                        <td>
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
                        </td>
                    </tr>

                    {/* Канал (моно или стерео) */}
                    <tr>
                        <th>
                            <label>{t('settingsPage.audio.channel')}</label>
                        </th>
                        <td>
                            <div className="radioGroup">
                                <div className="radioGroup__item">
                                    <input
                                        type="radio"
                                        id="mono"
                                        name="channel"
                                        value="mono"
                                        checked={audioSettingsStore.channelCount === 1}
                                        onChange={() => audioSettingsStore.setChannelCount('mono')}
                                    />
                                    <label htmlFor="mono">{t('settingsPage.audio.mono')}</label>
                                </div>
                                <div className="radioGroup__item">
                                    <input
                                        type="radio"
                                        id="stereo"
                                        name="channel"
                                        value="stereo"
                                        checked={audioSettingsStore.channelCount === 2}
                                        onChange={() => audioSettingsStore.setChannelCount('stereo')}
                                    />
                                    <label htmlFor="stereo">{t('settingsPage.audio.stereo')}</label>
                                </div>
                            </div>
                        </td>
                    </tr>

                    {/* Эхо-канселлинг */}
                    <tr>
                        <th>
                            <label htmlFor="echoCancellation">{t('settingsPage.audio.echoCancellation')}</label>
                        </th>
                        <td>
                            <input
                                type="checkbox"
                                id="echoCancellation"
                                checked={audioSettingsStore.echoCancellation}
                                onChange={(e) => audioSettingsStore.setEchoCancellation(e.target.checked)}
                            />
                        </td>
                    </tr>

                    {/* Шумоподавление */}
                    <tr>
                        <th>
                            <label htmlFor="noiseSuppression">{t('settingsPage.audio.noiseSuppression')}</label>
                        </th>
                        <td>
                            <input
                                type="checkbox"
                                id="noiseSuppression"
                                checked={audioSettingsStore.noiseSuppression}
                                onChange={(e) => audioSettingsStore.setNoiseSuppression(e.target.checked)}
                            />
                        </td>
                    </tr>

                    {/* Автоматический контроль громкости */}
                    <tr>
                        <th>
                            <label htmlFor="autoGainControl">{t('settingsPage.audio.autoGainControl')}</label>
                        </th>
                        <td>
                            <input
                                type="checkbox"
                                id="autoGainControl"
                                checked={audioSettingsStore.autoGainControl}
                                onChange={(e) => audioSettingsStore.setAutoGainControl(e.target.checked)}
                            />
                        </td>
                    </tr>

                    {/* Частота дискретизации */}
                    <tr>
                        <th>
                            <label htmlFor="sampleRate">{t('settingsPage.audio.sampleRate')}</label>
                        </th>
                        <td>
                            <input
                                type="number"
                                id="sampleRate"
                                value={audioSettingsStore.sampleRate}
                                onChange={(e) => audioSettingsStore.setSampleRate(parseInt(e.target.value, 10))}
                                min="8000"
                                max="48000"
                                step="1000"
                            />
                        </td>
                    </tr>

                    {/* Размер выборки */}
                    <tr>
                        <th>
                            <label htmlFor="sampleSize">{t('settingsPage.audio.sampleSize')}</label>
                        </th>
                        <td>
                            <input
                                type="number"
                                id="sampleSize"
                                value={audioSettingsStore.sampleSize}
                                onChange={(e) => audioSettingsStore.setSampleSize(parseInt(e.target.value, 10))}
                                min="8"
                                max="32"
                                step="8"
                            />
                        </td>
                    </tr>

                    {/* Задержка */}
                    <tr>
                        <th>
                            <label htmlFor="latency">{t('settingsPage.audio.latency')}</label>
                        </th>
                        <td>
                            <input
                                type="number"
                                id="latency"
                                value={audioSettingsStore.latency}
                                onChange={(e) => audioSettingsStore.setLatency(parseInt(e.target.value, 10))}
                                min="0"
                                max="1000"
                                step="50"
                            />
                        </td>
                    </tr>

                    {/* Громкость */}
                    <tr>
                        <th>
                            <label htmlFor="volume">{t('settingsPage.audio.volume')}</label>
                        </th>
                        <td>
                            <input
                                type="range"
                                id="volume"
                                value={audioSettingsStore.volume}
                                onChange={(e) => audioSettingsStore.setVolume(parseInt(e.target.value, 10))}
                                min="0"
                                max="100"
                                step="1"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
});

export default MicrophoneSettingsGroup;
