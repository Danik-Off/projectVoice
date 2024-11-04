export const STREAM_CONSTRAINTS = {
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000,
        sampleSize: 16,
        channelCount: 1,
        latency: 300, // Можно указать желаемую задержку
        volume: 1.0, // Уровень громкости (от 0 до 1)
        // deviceId: 'myDeviceId', // Если нужно указать конкретное устройство
        // groupId: 'myGroupId', // Если нужно указать группу устройств
    },
    video: false,
};
