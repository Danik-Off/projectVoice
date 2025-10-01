import { makeAutoObservable, runInAction } from 'mobx';

class AudioSettingsStore {
    public stream: MediaStream = new MediaStream();

    public microphoneDevices: MediaDeviceInfo[] = [];
    public speakerDevices: MediaDeviceInfo[] = [];
    public selectedMicrophone?: MediaDeviceInfo;
    public selectedSpeaker?: MediaDeviceInfo;

    // Режимы настроек
    public settingsMode: 'simple' | 'detailed' = 'simple';
    public audioQuality: 'low' | 'medium' | 'high' | 'ultra' = 'high';

    // Основные настройки - оптимизированы для максимального качества
    public echoCancellation = true;
    public noiseSuppression = true;
    public autoGainControl = true;
    public sampleRate = 48000; // Максимальная частота дискретизации для лучшего качества
    public sampleSize = 24; // Увеличенная разрядность для лучшего качества
    public channelCount = 2; // Стерео для лучшего качества звука
    public latency = 50; // Минимальная задержка для лучшего отклика
    public volume = 80; // Оптимальная громкость по умолчанию
    public isMicrophoneMuted = false;
    public isSpeakerMuted = false;

    // Дополнительные настройки для детального режима - оптимизированы для максимального качества
    public bitrate = 256; // Максимальный битрейт для лучшего качества
    public bufferSize = 2048; // Уменьшенный буфер для меньшей задержки
    public compressionLevel = 0.1; // Минимальное сжатие для лучшего качества
    public voiceEnhancement = true; // Улучшение голоса
    public voiceClarity = 0.8; // Максимальная четкость голоса
    public backgroundNoiseReduction = 0.8; // Максимальное снижение шума
    public voiceBoost = 0.3; // Оптимальное усиление голоса
    public bassBoost = 0.2; // Усиление басов для лучшего звучания
    public trebleBoost = 0.2; // Усиление высоких частот для четкости
    public stereoEnhancement = true; // Включаем стерео улучшение
    public spatialAudio = true; // Включаем пространственный звук
    public voiceIsolation = true; // Изоляция голоса
    public dynamicRangeCompression = 0.2; // Минимальное сжатие для лучшего качества

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

    public setAudioQuality(quality: 'low' | 'medium' | 'high' | 'ultra') {
        this.audioQuality = quality;
        this.applySimpleQualitySettings();
    }

    private applySimpleQualitySettings() {
        switch (this.audioQuality) {
            case 'low':
                this.sampleRate = 24000; // Улучшенная частота даже для низкого качества
                this.sampleSize = 16;
                this.bitrate = 96; // Увеличенный битрейт
                this.latency = 100; // Уменьшенная задержка
                this.echoCancellation = true;
                this.noiseSuppression = true;
                this.autoGainControl = true;
                this.voiceEnhancement = true; // Включаем даже для низкого качества
                this.voiceIsolation = true;
                this.voiceClarity = 0.5; // Улучшенная четкость
                this.backgroundNoiseReduction = 0.6;
                this.voiceBoost = 0.2;
                this.bassBoost = 0.1;
                this.trebleBoost = 0.1;
                this.dynamicRangeCompression = 0.2;
                this.stereoEnhancement = false;
                this.spatialAudio = false;
                break;
            case 'medium':
                this.sampleRate = 48000; // Максимальная частота для среднего качества
                this.sampleSize = 24; // Увеличенная разрядность
                this.bitrate = 192; // Высокий битрейт
                this.latency = 75; // Минимальная задержка
                this.echoCancellation = true;
                this.noiseSuppression = true;
                this.autoGainControl = true;
                this.voiceEnhancement = true;
                this.voiceIsolation = true;
                this.voiceClarity = 0.7; // Высокая четкость
                this.backgroundNoiseReduction = 0.7;
                this.voiceBoost = 0.25;
                this.bassBoost = 0.15;
                this.trebleBoost = 0.15;
                this.dynamicRangeCompression = 0.2;
                this.stereoEnhancement = true;
                this.spatialAudio = true;
                break;
            case 'high':
                this.sampleRate = 48000; // Максимальная частота дискретизации
                this.sampleSize = 24; // Максимальная разрядность
                this.bitrate = 320; // Максимальный битрейт
                this.latency = 50; // Минимальная задержка
                this.echoCancellation = true;
                this.noiseSuppression = true;
                this.autoGainControl = true;
                this.voiceEnhancement = true;
                this.voiceIsolation = true;
                this.voiceClarity = 0.9; // Максимальная четкость
                this.backgroundNoiseReduction = 0.8;
                this.voiceBoost = 0.3;
                this.bassBoost = 0.2;
                this.trebleBoost = 0.2;
                this.dynamicRangeCompression = 0.1; // Минимальное сжатие
                this.stereoEnhancement = true;
                this.spatialAudio = true;
                break;
            case 'ultra':
                this.sampleRate = 48000; // Максимальная частота дискретизации
                this.sampleSize = 32; // Профессиональная разрядность
                this.bitrate = 512; // Профессиональный битрейт
                this.latency = 25; // Минимальная задержка
                this.echoCancellation = true;
                this.noiseSuppression = true;
                this.autoGainControl = true;
                this.voiceEnhancement = true;
                this.voiceIsolation = true;
                this.voiceClarity = 1.0; // Максимальная четкость
                this.backgroundNoiseReduction = 0.9;
                this.voiceBoost = 0.4;
                this.bassBoost = 0.3;
                this.trebleBoost = 0.3;
                this.dynamicRangeCompression = 0.05; // Минимальное сжатие
                this.stereoEnhancement = true;
                this.spatialAudio = true;
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

    public async setMicrophone(deviceId: string): Promise<void> {
        const device = this.microphoneDevices.find((device) => device.deviceId === deviceId);
        if (device && this.selectedMicrophone?.deviceId !== deviceId) {
            console.log('AudioSettingsStore: Switching microphone from', this.selectedMicrophone?.deviceId, 'to', deviceId);
            this.selectedMicrophone = device;
            
            try {
                // Принудительно обновляем поток при смене микрофона
                await this.updateMediaStream(true);
                
                // Показываем уведомление об успехе
                import('./NotificationStore').then(({ default: notificationStore }) => {
                    notificationStore.addNotification(
                        `Микрофон изменен на: ${device.label || 'Неизвестное устройство'}`,
                        'success'
                    );
                });
            } catch (error) {
                console.error('AudioSettingsStore: Error switching microphone:', error);
                
                // Показываем уведомление об ошибке
                import('./NotificationStore').then(({ default: notificationStore }) => {
                    notificationStore.addNotification(
                        `Ошибка при смене микрофона: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
                        'error'
                    );
                });
            }
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
        
        // Управляем удаленными аудиоэлементами через roomStore
        import('./roomStore').then(({ default: roomStore }) => {
            // Используем экземпляр WebRTCClient из roomStore
            (roomStore as any).webRTCClient?.setRemoteAudioMuted(this.isSpeakerMuted);
        });
        
        console.log('Speaker mute toggled:', this.isSpeakerMuted);
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

    private async updateMediaStream(forceUpdate: boolean = false) {
        try {
            console.log('AudioSettingsStore: Starting media stream update...', forceUpdate ? '(forced)' : '');
            await this.ensureAudioContextIsRunning();
            
            // Проверяем, нужно ли пересоздавать поток
            const needsRecreation = forceUpdate || 
                !this._stream || 
                this._stream.getAudioTracks().length === 0 ||
                this._stream.getAudioTracks().some(track => track.readyState === 'ended');
            
            if (!needsRecreation) {
                console.log('AudioSettingsStore: Existing media stream is still valid, skipping recreation');
                return;
            }
            
            console.log('AudioSettingsStore: Recreating media stream...');
            
            // Останавливаем предыдущий поток
            if (this._stream) {
                this._stream.getTracks().forEach(track => track.stop());
            }
            
            runInAction(async () => {
                console.log('AudioSettingsStore: Requesting getUserMedia with device:', this.selectedMicrophone?.deviceId);
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
                
                // Обновляем WebRTC поток после смены микрофона
                if (forceUpdate) {
                    console.log('AudioSettingsStore: Updating WebRTC stream after microphone change...');
                    this.updateWebRTCStream();
                }
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

