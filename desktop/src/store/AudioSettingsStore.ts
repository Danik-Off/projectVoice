import { makeAutoObservable, runInAction } from 'mobx';

class AudioSettingsStore {
    public stream: MediaStream = new MediaStream();

    public microphoneDevices: MediaDeviceInfo[] = [];
    public speakerDevices: MediaDeviceInfo[] = [];
    public selectedMicrophone?: MediaDeviceInfo;
    public selectedSpeaker?: MediaDeviceInfo;

    // Режимы настроек
    public settingsMode: 'simple' | 'detailed' = 'simple';
    public audioQuality: 'low' | 'medium' | 'high' = 'medium';

    // Основные настройки
    public echoCancellation = true;
    public noiseSuppression = true;
    public autoGainControl = true;
    public sampleRate = 24000; // Улучшенная частота дискретизации по умолчанию
    public sampleSize = 16;
    public channelCount = 1;
    public latency = 150; // Уменьшенная задержка по умолчанию
    public volume = 70; // Более разумная громкость по умолчанию
    public isMicrophoneMuted = false;
    public isSpeakerMuted = false;

    // Дополнительные настройки для детального режима
    public bitrate = 128; // Битрейт в kbps
    public bufferSize = 4096; // Размер буфера
    public compressionLevel = 0.3; // Уменьшенный уровень сжатия
    public voiceEnhancement = true; // Улучшение голоса
    public voiceClarity = 0.5; // Более мягкая четкость голоса
    public backgroundNoiseReduction = 0.6; // Умеренное снижение шума
    public voiceBoost = 0.2; // Умеренное усиление голоса
    public bassBoost = 0.1; // Легкое усиление басов
    public trebleBoost = 0.1; // Легкое усиление высоких частот
    public stereoEnhancement = false; // Стерео улучшение
    public spatialAudio = false; // Пространственный звук
    public voiceIsolation = true; // Изоляция голоса
    public dynamicRangeCompression = 0.3; // Умеренное динамическое сжатие

    private _stream: MediaStream = new MediaStream();
    private audioContext = new AudioContext();
    private gainNode: GainNode = new GainNode(this.audioContext);
    private audioSource: MediaStreamAudioSourceNode | null = null;
    
    // Кэш для аудио процессоров для обновления в реальном времени
    private audioProcessors: {
        voiceEnhancer?: BiquadFilterNode;
        voiceIsolator?: BiquadFilterNode;
        voiceBooster?: BiquadFilterNode;
        bassBooster?: BiquadFilterNode;
        trebleBooster?: BiquadFilterNode;
        compressor?: DynamicsCompressorNode;
        stereoEnhancer?: BiquadFilterNode;
        spatialProcessor?: BiquadFilterNode;
    } = {};

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
        
        // Очищаем кэш процессоров
        this.audioProcessors = {};
        
        console.log('AudioSettingsStore: Media resources cleaned up');
    }

    // Методы для управления режимами
    public setSettingsMode(mode: 'simple' | 'detailed') {
        this.settingsMode = mode;
        if (mode === 'simple') {
            this.applySimpleQualitySettings();
        }
    }

    public setAudioQuality(quality: 'low' | 'medium' | 'high') {
        this.audioQuality = quality;
        this.applySimpleQualitySettings();
    }

    private applySimpleQualitySettings() {
        switch (this.audioQuality) {
            case 'low':
                this.sampleRate = 16000;
                this.sampleSize = 16;
                this.bitrate = 64;
                this.latency = 200;
                this.echoCancellation = true;
                this.noiseSuppression = true;
                this.autoGainControl = true;
                this.voiceEnhancement = false;
                this.voiceIsolation = false;
                this.voiceClarity = 0.3;
                this.backgroundNoiseReduction = 0.5;
                this.voiceBoost = 0.1;
                this.bassBoost = 0.0;
                this.trebleBoost = 0.0;
                this.dynamicRangeCompression = 0.2;
                break;
            case 'medium':
                this.sampleRate = 24000;
                this.sampleSize = 16;
                this.bitrate = 128;
                this.latency = 150;
                this.echoCancellation = true;
                this.noiseSuppression = true;
                this.autoGainControl = true;
                this.voiceEnhancement = true;
                this.voiceIsolation = true;
                this.voiceClarity = 0.5;
                this.backgroundNoiseReduction = 0.6;
                this.voiceBoost = 0.2;
                this.bassBoost = 0.1;
                this.trebleBoost = 0.1;
                this.dynamicRangeCompression = 0.3;
                break;
            case 'high':
                this.sampleRate = 48000;
                this.sampleSize = 24;
                this.bitrate = 256;
                this.latency = 100;
                this.echoCancellation = true;
                this.noiseSuppression = true;
                this.autoGainControl = true;
                this.voiceEnhancement = true;
                this.voiceIsolation = true;
                this.voiceClarity = 0.7;
                this.backgroundNoiseReduction = 0.7;
                this.voiceBoost = 0.3;
                this.bassBoost = 0.2;
                this.trebleBoost = 0.2;
                this.dynamicRangeCompression = 0.4;
                break;
        }
        this.updateMediaStream();
    }

    // Методы для изменения настроек (требуют пересоздания потока)
    public setEchoCancellation(value: boolean) {
        if (this.echoCancellation === value) return;
        this.echoCancellation = value;
        this.updateMediaStream();
        this.updateWebRTCStream();
    }

    public setNoiseSuppression(value: boolean) {
        if (this.noiseSuppression === value) return;
        this.noiseSuppression = value;
        this.updateMediaStream();
        this.updateWebRTCStream();
    }

    public setAutoGainControl(value: boolean) {
        if (this.autoGainControl === value) return;
        this.autoGainControl = value;
        this.updateMediaStream();
        this.updateWebRTCStream();
    }

    public setSampleRate(rate: number) {
        if (this.sampleRate === rate) return;
        this.sampleRate = rate;
        this.updateMediaStream();
        this.updateWebRTCStream();
    }

    public setSampleSize(size: number) {
        if (this.sampleSize === size) return;
        this.sampleSize = size;
        this.updateMediaStream();
        this.updateWebRTCStream();
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

    // Методы для дополнительных настроек (требуют пересоздания потока)
    public setBitrate(bitrate: number): void {
        if (this.bitrate === bitrate) return;
        this.bitrate = bitrate;
        this.updateMediaStream();
        this.updateWebRTCStream();
    }

    public setBufferSize(bufferSize: number): void {
        if (this.bufferSize === bufferSize) return;
        this.bufferSize = bufferSize;
        this.updateMediaStream();
        this.updateWebRTCStream();
    }

    public setCompressionLevel(level: number): void {
        if (this.compressionLevel === level) return;
        this.compressionLevel = Math.max(0, Math.min(1, level));
        this.updateMediaStream();
        this.updateWebRTCStream();
    }

    // Метод для принудительного обновления WebRTC потока
    public updateWebRTCStream(): void {
        try {
            console.log('AudioSettingsStore: Updating WebRTC stream...');
            // Импортируем roomStore динамически, чтобы избежать циклических зависимостей
            import('./roomStore').then(({ default: roomStore }) => {
                if (roomStore.webRTCClient && typeof roomStore.webRTCClient.resendlocalStream === 'function') {
                    roomStore.webRTCClient.resendlocalStream();
                    console.log('AudioSettingsStore: WebRTC stream updated successfully');
                }
            });
        } catch (error) {
            console.error('AudioSettingsStore: Error updating WebRTC stream:', error);
        }
    }

    // Методы для настроек в реальном времени (не требуют пересоздания потока)
    public setVoiceEnhancement(enabled: boolean): void {
        if (this.voiceEnhancement === enabled) return;
        this.voiceEnhancement = enabled;
        this.updateRealtimeSettings();
    }

    public setVoiceClarity(clarity: number): void {
        if (this.voiceClarity === clarity) return;
        this.voiceClarity = Math.max(0, Math.min(1, clarity));
        this.updateRealtimeSettings();
    }

    public setBackgroundNoiseReduction(reduction: number): void {
        if (this.backgroundNoiseReduction === reduction) return;
        this.backgroundNoiseReduction = Math.max(0, Math.min(1, reduction));
        this.updateRealtimeSettings();
    }

    public setVoiceBoost(boost: number): void {
        if (this.voiceBoost === boost) return;
        this.voiceBoost = Math.max(0, Math.min(1, boost));
        this.updateRealtimeSettings();
    }

    public setBassBoost(boost: number): void {
        if (this.bassBoost === boost) return;
        this.bassBoost = Math.max(0, Math.min(1, boost));
        this.updateRealtimeSettings();
    }

    public setTrebleBoost(boost: number): void {
        if (this.trebleBoost === boost) return;
        this.trebleBoost = Math.max(0, Math.min(1, boost));
        this.updateRealtimeSettings();
    }

    public setStereoEnhancement(enabled: boolean): void {
        if (this.stereoEnhancement === enabled) return;
        this.stereoEnhancement = enabled;
        this.updateRealtimeSettings();
    }

    public setSpatialAudio(enabled: boolean): void {
        if (this.spatialAudio === enabled) return;
        this.spatialAudio = enabled;
        this.updateRealtimeSettings();
    }

    public setVoiceIsolation(enabled: boolean): void {
        if (this.voiceIsolation === enabled) return;
        this.voiceIsolation = enabled;
        this.updateRealtimeSettings();
    }

    public setDynamicRangeCompression(compression: number): void {
        if (this.dynamicRangeCompression === compression) return;
        this.dynamicRangeCompression = Math.max(0, Math.min(1, compression));
        this.updateRealtimeSettings();
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
            console.log('AudioSettingsStore: Preparing media stream with enhanced settings...');
            // Создаем источник из потока микрофона
            this.audioSource = this.audioContext.createMediaStreamSource(this._stream);

            // Создаем GainNode для регулировки громкости
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.volume / 50;

            // Подключаем источник к GainNode
            this.audioSource.connect(this.gainNode);

            // Создаем destination для выходного потока
            const destination = this.audioContext.createMediaStreamDestination();

            // Создаем цепочку обработки аудио
            const audioChain = this.createAudioProcessingChain();
            
            // Подключаем цепочку обработки
            this.gainNode.connect(audioChain.input);
            audioChain.output.connect(destination);

            // Сохраняем новый поток
            this.stream = destination.stream;
            console.log('AudioSettingsStore: Enhanced media stream prepared, output tracks:', this.stream.getAudioTracks().length);
        } catch (error) {
            console.error('AudioSettingsStore: Error preparing media stream:', error);
        }
    }

    // Обновление настроек в реальном времени без пересоздания потока
    private updateRealtimeSettings() {
        try {
            console.log('AudioSettingsStore: Updating realtime audio settings...');
            
            // Обновляем параметры существующих процессоров
            if (this.audioProcessors.voiceEnhancer) {
                this.audioProcessors.voiceEnhancer.gain.value = this.voiceClarity * 3;
            }
            
            if (this.audioProcessors.voiceBooster) {
                this.audioProcessors.voiceBooster.gain.value = this.voiceBoost * 8;
            }
            
            if (this.audioProcessors.bassBooster) {
                this.audioProcessors.bassBooster.gain.value = this.bassBoost * 5;
            }
            
            if (this.audioProcessors.trebleBooster) {
                this.audioProcessors.trebleBooster.gain.value = this.trebleBoost * 5;
            }
            
            if (this.audioProcessors.compressor) {
                const compressionRatio = 1 + (this.dynamicRangeCompression * 8); // 1-9
                this.audioProcessors.compressor.ratio.value = compressionRatio;
            }
            
            console.log('AudioSettingsStore: Realtime settings updated successfully');
        } catch (error) {
            console.error('AudioSettingsStore: Error updating realtime settings:', error);
        }
    }

    private createAudioProcessingChain() {
        const input = this.audioContext.createGain();
        const output = this.audioContext.createGain();
        
        let currentNode = input;

        // Базовые фильтры
        if (this.echoCancellation || this.noiseSuppression || this.autoGainControl) {
            const { highpassFilter, lowpassFilter } = this.createVoiceEnhancementFilters();
            currentNode.connect(highpassFilter);
            currentNode = highpassFilter;
            currentNode.connect(lowpassFilter);
            currentNode = lowpassFilter;
        }

        // Улучшение голоса
        if (this.voiceEnhancement) {
            const voiceEnhancer = this.createVoiceEnhancer();
            this.audioProcessors.voiceEnhancer = voiceEnhancer;
            currentNode.connect(voiceEnhancer);
            currentNode = voiceEnhancer;
        }

        // Изоляция голоса
        if (this.voiceIsolation) {
            const voiceIsolator = this.createVoiceIsolator();
            this.audioProcessors.voiceIsolator = voiceIsolator;
            currentNode.connect(voiceIsolator);
            currentNode = voiceIsolator;
        }

        // Усиление голоса
        if (this.voiceBoost > 0) {
            const voiceBooster = this.createVoiceBooster();
            this.audioProcessors.voiceBooster = voiceBooster;
            currentNode.connect(voiceBooster);
            currentNode = voiceBooster;
        }

        // Усиление басов
        if (this.bassBoost > 0) {
            const bassBooster = this.createBassBooster();
            this.audioProcessors.bassBooster = bassBooster;
            currentNode.connect(bassBooster);
            currentNode = bassBooster;
        }

        // Усиление высоких частот
        if (this.trebleBoost > 0) {
            const trebleBooster = this.createTrebleBooster();
            this.audioProcessors.trebleBooster = trebleBooster;
            currentNode.connect(trebleBooster);
            currentNode = trebleBooster;
        }

        // Динамическое сжатие
        if (this.dynamicRangeCompression > 0) {
            const compressor = this.createDynamicCompressor();
            this.audioProcessors.compressor = compressor;
            currentNode.connect(compressor);
            currentNode = compressor;
        }

        // Стерео улучшение
        if (this.stereoEnhancement) {
            const stereoEnhancer = this.createStereoEnhancer();
            this.audioProcessors.stereoEnhancer = stereoEnhancer;
            currentNode.connect(stereoEnhancer);
            currentNode = stereoEnhancer;
        }

        // Пространственный звук
        if (this.spatialAudio) {
            const spatialProcessor = this.createSpatialProcessor();
            this.audioProcessors.spatialProcessor = spatialProcessor;
            currentNode.connect(spatialProcessor);
            currentNode = spatialProcessor;
        }

        currentNode.connect(output);

        return { input, output };
    }

    private async ensureAudioContextIsRunning() {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    private createVoiceEnhancementFilters() {
        // Создаем более мягкие фильтры для предотвращения эффекта "бочки"
        const highpassFilter = this.audioContext.createBiquadFilter();
        highpassFilter.type = 'highpass';
        highpassFilter.frequency.value = 80; // Более мягкий срез низких частот
        highpassFilter.Q.value = 0.5; // Мягкий переход

        // Создаем низкочастотный фильтр для удаления высокочастотных шумов
        const lowpassFilter = this.audioContext.createBiquadFilter();
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.value = 8000; // Расширяем диапазон для лучшего качества голоса
        lowpassFilter.Q.value = 0.5; // Мягкий переход

        return { highpassFilter, lowpassFilter };
    }

    private createVoiceEnhancer() {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = 1500; // Оптимальная частота для голоса
        filter.Q.value = 0.7; // Более мягкий резонанс
        filter.gain.value = this.voiceClarity * 3; // Уменьшенное усиление для предотвращения искажений
        return filter;
    }

    private createVoiceIsolator() {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200; // Оптимальная частота для речи
        filter.Q.value = 1.2; // Более мягкая изоляция
        return filter;
    }

    private createVoiceBooster() {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = 1200; // Оптимальная частота для голоса
        filter.Q.value = 0.5; // Мягкий резонанс
        filter.gain.value = this.voiceBoost * 8; // Уменьшенное усиление
        return filter;
    }

    private createBassBooster() {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowshelf';
        filter.frequency.value = 250;
        filter.gain.value = this.bassBoost * 10; // Усиление басов
        return filter;
    }

    private createTrebleBooster() {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highshelf';
        filter.frequency.value = 3000;
        filter.gain.value = this.trebleBoost * 10; // Усиление высоких частот
        return filter;
    }

    private createDynamicCompressor() {
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.value = -24;
        compressor.knee.value = 30;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;
        return compressor as any; // Приводим к типу AudioNode для совместимости
    }

    private createStereoEnhancer() {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = 2000;
        filter.Q.value = 0.3;
        filter.gain.value = 3; // Легкое стерео улучшение
        return filter;
    }

    private createSpatialProcessor() {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = 1000;
        filter.Q.value = 0.5;
        filter.gain.value = 2; // Пространственный эффект
        return filter;
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

