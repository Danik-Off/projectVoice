import { makeAutoObservable, runInAction } from 'mobx';

class AudioSettingsStore {
    public stream: MediaStream = new MediaStream();

    public microphoneDevices: MediaDeviceInfo[] = [];
    public speakerDevices: MediaDeviceInfo[] = [];
    public selectedMicrophone?: MediaDeviceInfo;
    public selectedSpeaker?: MediaDeviceInfo;

    public echoCancellation = true; // Включает или отключает подавление эха, что помогает избежать эхо-сигналов при передаче звука.
    public noiseSuppression = true; // Включает или отключает подавление шума, что улучшает качество звука, уменьшая фоновый шум.
    public autoGainControl = true; // Включает или отключает автоматическое управление уровнем звука, что помогает автоматически регулировать громкость входящего сигнала.
    public sampleRate = 16000; // Частота дискретизации в Гц. Чем выше частота, тем выше качество звука, но и больше нагрузка на систему.
    public sampleSize = 16; // Размер выборки в битах, определяет точность обработки звука. Чем больше размер, тем лучше качество, но и больше нагрузка.
    public channelCount = 1; // Количество каналов в звуковом потоке. 1 — моно, 2 — стерео.
    public latency = 300; // Задержка в миллисекундах. Указывает на желаемую задержку в обработке звука (например, в реальном времени). Чем ниже значение, тем меньше задержка, но может быть большее использование процессора.
    public volume = 100; // Уровень громкости, где 1.0 — максимальная громкость, а 0 — выключенная.

    private _volume = this.volume / 100;
    public constructor() {
        makeAutoObservable(this);
        this.fetchAudioDevices();
    }

    public setSpeaker(deviceId: string): void {
        const device = this.speakerDevices.find((device) => device.deviceId === deviceId);
        if (device) {
            this.selectedSpeaker = device;
            this.updateMediaStream();
        }
    }

    public setMicrophone(deviceId: string): void {
        const device = this.microphoneDevices.find((device) => device.deviceId === deviceId);
        if (device) {
            this.selectedMicrophone = device;
            this.updateMediaStream();
        }
    }

    public setVolume(newVolume: number): void {
        this.volume = newVolume * 100;
    }

    // Получение списка аудиоустройств
    private fetchAudioDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();

            runInAction(() => {
                this.microphoneDevices = devices.filter((device) => device.kind === 'audioinput');
                this.speakerDevices = devices.filter((device) => device.kind === 'audiooutput');
                this.selectedMicrophone = this.microphoneDevices[0];
                this.selectedSpeaker = this.speakerDevices[0];
                this.updateMediaStream();
            });
        } catch (error) {
            console.error('Error fetching audio devices:', error);
        }
    };

    private async updateMediaStream() {
        this.stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: this.echoCancellation,
                noiseSuppression: this.noiseSuppression,
                autoGainControl: true,
                sampleRate: this.sampleRate,
                sampleSize: this.sampleSize,
                channelCount: this.channelCount,
                deviceId: this.selectedMicrophone?.deviceId,
                groupId: this.selectedMicrophone?.groupId,
            } as MediaTrackConstraints,
            video: false,
        });
    }
}

const audioSettingsStore = new AudioSettingsStore();
export default audioSettingsStore;
