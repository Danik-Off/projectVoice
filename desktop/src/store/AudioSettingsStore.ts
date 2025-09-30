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
    public volume = 50; // Уровень громкости, где 1.0 — максимальная громкость, а 0 — выключенная.
    public isMicrophoneMuted = false; // Состояние отключения микрофона
    public isSpeakerMuted = false; // Состояние отключения колонок

    private _stream: MediaStream = new MediaStream();
    private audioContext = new AudioContext();
    private gainNode: GainNode = new GainNode(this.audioContext);
    private audioSource: MediaStreamAudioSourceNode | null = null;

    public constructor() {
        makeAutoObservable(this);
        this.fetchAudioDevices();
    }

    public initMedia() {
        // Проверяем, не инициализирован ли уже поток
        if (this._stream && this._stream.getAudioTracks().length > 0) {
            console.log('AudioSettingsStore: Media stream already exists, skipping initialization');
            return;
        }
        console.log('AudioSettingsStore: Initializing media stream...');
        this.updateMediaStream();
    }

    public cleanup() {
        console.log('AudioSettingsStore: Cleaning up media resources...');
        
        // Останавливаем все треки
        if (this._stream) {
            this._stream.getTracks().forEach(track => track.stop());
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        
        // Закрываем аудио контекст
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        
        // Сбрасываем потоки
        this._stream = new MediaStream();
        this.stream = new MediaStream();
        
        // Пересоздаем аудио контекст для следующего использования
        this.audioContext = new AudioContext();
        this.gainNode = new GainNode(this.audioContext);
        this.audioSource = null;
        
        console.log('AudioSettingsStore: Media resources cleaned up');
    }

    // Методы для изменения настроек
    public setEchoCancellation(value: boolean) {
        if (this.echoCancellation === value) return;
        this.echoCancellation = value;
        this.updateMediaStream();
    }

    public setNoiseSuppression(value: boolean) {
        if (this.noiseSuppression === value) return;
        this.noiseSuppression = value;
        this.updateMediaStream();
    }

    public setAutoGainControl(value: boolean) {
        if (this.autoGainControl === value) return;
        this.autoGainControl = value;
        this.updateMediaStream();
    }

    public setSampleRate(rate: number) {
        if (this.sampleRate === rate) return;
        this.sampleRate = rate;
        this.updateMediaStream();
    }

    public setSampleSize(size: number) {
        if (this.sampleSize === size) return;
        this.sampleSize = size;
        this.updateMediaStream();
    }

    public setLatency(latency: number) {
        this.latency = latency;
        // Задержка не требует пересоздания потока
    }

    public setChannelCount(channelCount: 'stereo' | 'mono') {
        this.channelCount = channelCount === 'stereo' ? 2 : 1;
        this.updateMediaStream();
    }

    public setSpeaker(deviceId: string): void {
        const device = this.speakerDevices.find((device) => device.deviceId === deviceId);
        if (device) {
            this.selectedSpeaker = device;
            // Применяем выбранное устройство к удаленным аудиоэлементам
            import('./roomStore').then(({ default: roomStore }) => {
                (roomStore as any).webRTCClient?.setRemoteAudioMuted(this.isSpeakerMuted);
            });
        }
    }

    public setMicrophone(deviceId: string): void {
        const device = this.microphoneDevices.find((device) => device.deviceId === deviceId);
        if (device && this.selectedMicrophone?.deviceId !== deviceId) {
            this.selectedMicrophone = device;
            this.updateMediaStream();
        }
    }

    public setVolume(newVolume: number): void {
        this.volume = newVolume;
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume / 50;
        }
        // Не пересоздаем поток для изменения громкости
    }

    public toggleMicrophoneMute(): void {
        this.isMicrophoneMuted = !this.isMicrophoneMuted;
        if (this.isMicrophoneMuted) {
            // Отключаем микрофон
            this._stream.getAudioTracks().forEach(track => {
                track.enabled = false;
            });
            // Также отключаем в обработанном потоке
            this.stream.getAudioTracks().forEach(track => {
                track.enabled = false;
            });
        } else {
            // Включаем микрофон
            this._stream.getAudioTracks().forEach(track => {
                track.enabled = true;
            });
            // Также включаем в обработанном потоке
            this.stream.getAudioTracks().forEach(track => {
                track.enabled = true;
            });
        }
    }

    public toggleSpeakerMute(): void {
        this.isSpeakerMuted = !this.isSpeakerMuted;
        if (this.isSpeakerMuted) {
            // Отключаем звук колонок
            this.gainNode.gain.value = 0;
        } else {
            // Включаем звук колонок
            this.gainNode.gain.value = this.volume / 50;
        }
        
        // Управляем удаленными аудиоэлементами через roomStore
        import('./roomStore').then(({ default: roomStore }) => {
            // Используем экземпляр WebRTCClient из roomStore
            (roomStore as any).webRTCClient?.setRemoteAudioMuted(this.isSpeakerMuted);
        });
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
            });
        } catch (error) {
            console.error('Error fetching audio devices:', error);
        }
    };

    private async updateMediaStream() {
        try {
            console.log('AudioSettingsStore: Starting media stream update...');
            await this.ensureAudioContextIsRunning();
            
            // Проверяем, нужно ли пересоздавать поток
            const needsRecreation = !this._stream || 
                this._stream.getAudioTracks().length === 0 ||
                this._stream.getAudioTracks().some(track => track.readyState === 'ended');
            
            if (!needsRecreation) {
                console.log('AudioSettingsStore: Existing media stream is still valid, skipping recreation');
                return;
            }
            
            // Останавливаем предыдущий поток
            if (this._stream) {
                this._stream.getTracks().forEach(track => track.stop());
            }
            
            runInAction(async () => {
                console.log('AudioSettingsStore: Requesting getUserMedia...');
                this._stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: this.echoCancellation,
                        noiseSuppression: this.noiseSuppression,
                        autoGainControl: this.autoGainControl,
                        sampleRate: this.sampleRate,
                        sampleSize: this.sampleSize,
                        channelCount: this.channelCount,
                        deviceId: this.selectedMicrophone?.deviceId,
                        groupId: this.selectedMicrophone?.groupId,
                    } as MediaTrackConstraints,
                    video: false,
                });
                console.log('AudioSettingsStore: getUserMedia success, audio tracks:', this._stream.getAudioTracks().length);
                this.prepareMediaStream();
            });
        } catch (error) {
            console.error('AudioSettingsStore: Error updating media stream:', error);
        }
    }
    private prepareMediaStream() {
        try {
            console.log('AudioSettingsStore: Preparing media stream...');
            // Создаем источник из потока микрофона
            this.audioSource = this.audioContext.createMediaStreamSource(this._stream);

            // Создаем GainNode для регулировки громкости
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.volume / 50; // Используем текущее значение громкости

            // Подключаем источник к GainNode
            this.audioSource.connect(this.gainNode);

            // Создаем destination, в который будут включены фильтры
            const destination = this.audioContext.createMediaStreamDestination();

            // Создаем фильтры для улучшения голоса и подключаем их к GainNode
            const { highpassFilter, lowpassFilter } = this.createVoiceEnhancementFilters();
            this.gainNode.connect(highpassFilter);
            highpassFilter.connect(lowpassFilter);
            lowpassFilter.connect(destination); // Подключаем выходной поток фильтров к destination

            // Сохраняем новый поток
            this.stream = destination.stream;
            console.log('AudioSettingsStore: Media stream prepared, output tracks:', this.stream.getAudioTracks().length);
        } catch (error) {
            console.error('AudioSettingsStore: Error preparing media stream:', error);
        }
    }

    private async ensureAudioContextIsRunning() {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    private createVoiceEnhancementFilters() {
        // Создаем высокочастотный фильтр для удаления низкочастотных шумов
        const highpassFilter = this.audioContext.createBiquadFilter();
        highpassFilter.type = 'highpass';
        highpassFilter.frequency.value = 300; // Срезаем частоты ниже 300 Гц

        // Создаем низкочастотный фильтр для удаления высокочастотных шумов
        const lowpassFilter = this.audioContext.createBiquadFilter();
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.value = 3400; // Срезаем частоты выше 3400 Гц

        return { highpassFilter, lowpassFilter };
    }

    public testSpeakers(): void {
        if (!this.selectedSpeaker) {
            console.error('Нет выбранных динамиков для тестирования');
            return;
        }

        // Создаем аудиоконтекст
        const audioContext = new window.AudioContext();

        // Создаем осциллятор для тестового звука
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz (A4 нота)
        oscillator.type = 'sine'; // Синусоидальная волна

        // Создаем усилитель (gain node)
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Громкость 50%

        // Подключаем осциллятор к усилителю, а усилитель — к выходу
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Запускаем осциллятор
        oscillator.start();

        // Останавливаем осциллятор через 1 секунду
        oscillator.stop(audioContext.currentTime + 1);

        console.log('Тестирование динамиков...');
    }

    public testMicrophone(): void {
        if (!this.selectedMicrophone) {
            console.error('Нет выбранного микрофона для тестирования');
            return;
        }

        // Создание аудио контекста и источника для записи
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const bufferSize = 2048;
        const microphoneStream = this._stream; // Поток микрофона, который мы получаем

        const microphoneSource = audioContext.createMediaStreamSource(microphoneStream);
        microphoneSource.connect(analyser);

        // Установка параметров для анализа
        analyser.fftSize = bufferSize;

        const buffer = new Float32Array(analyser.frequencyBinCount);

        // Функция для анализа звука
        const checkMicrophone = () => {
            analyser.getFloatFrequencyData(buffer);

            // Проверка, если есть значительная активность на микрофоне
            if (buffer.some((value) => value > -50)) {
                // Примерная пороговая величина
                console.log('Микрофон работает, есть звук');
            } else {
                console.log('Микрофон не регистрирует звук');
            }

            requestAnimationFrame(checkMicrophone);
        };

        // Запуск проверки
        checkMicrophone();
    }
}

const audioSettingsStore = new AudioSettingsStore();
export default audioSettingsStore;

