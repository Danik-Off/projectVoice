import { makeAutoObservable } from 'mobx';

export interface VADConfig {
    threshold: number; // Порог для определения активности речи (0-100)
    silenceTimeout: number; // Время в мс до прекращения активности после тишины
    minSpeechDuration: number; // Минимальная длительность речи в мс
    smoothingFactor: number; // Фактор сглаживания (0-1)
}

export interface VoiceActivityEvent {
    userId: string;
    isActive: boolean;
    volume: number;
    timestamp: number;
}

class VoiceActivityDetectionService {
    private audioContext: AudioContext | null = null;
    private analysers: Map<string, AnalyserNode> = new Map();
    private dataArrays: Map<string, Uint8Array> = new Map();
    private animationFrames: Map<string, number> = new Map();
    private lastActivityTime: Map<string, number> = new Map();
    private isActive: Map<string, boolean> = new Map();
    private volumeHistory: Map<string, number[]> = new Map();
    
    private config: VADConfig = {
        threshold: 10, // Порог 10% (снижен для лучшей чувствительности)
        silenceTimeout: 1000, // 1 секунда тишины
        minSpeechDuration: 200, // Минимально 200мс речи
        smoothingFactor: 0.7 // Сглаживание 70%
    };

    private callbacks: ((event: VoiceActivityEvent) => void)[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    public initialize(): void {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
    }

    public setConfig(config: Partial<VADConfig>): void {
        this.config = { ...this.config, ...config };
    }

    public getConfig(): VADConfig {
        return { ...this.config };
    }

    public addCallback(callback: (event: VoiceActivityEvent) => void): void {
        this.callbacks.push(callback);
    }

    public removeCallback(callback: (event: VoiceActivityEvent) => void): void {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

    private notifyCallbacks(event: VoiceActivityEvent): void {
        this.callbacks.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Error in VAD callback:', error);
            }
        });
    }

    public startMonitoring(userId: string, audioStream: MediaStream): void {
        if (!this.audioContext) {
            console.error('AudioContext not initialized');
            return;
        }

        // Останавливаем предыдущий мониторинг для этого пользователя
        this.stopMonitoring(userId);

        try {
            // Создаем источник из аудио потока
            const source = this.audioContext.createMediaStreamSource(audioStream);
            
            // Создаем анализатор
            const analyser = this.audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            
            // Подключаем источник к анализатору
            source.connect(analyser);
            
            // Создаем массив для данных
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            // Сохраняем ссылки
            this.analysers.set(userId, analyser);
            this.dataArrays.set(userId, dataArray);
            this.volumeHistory.set(userId, []);
            this.lastActivityTime.set(userId, 0);
            this.isActive.set(userId, false);
            
            // Запускаем мониторинг
            this.monitorUser(userId);
            
            console.log(`VAD monitoring started for user: ${userId}`);
        } catch (error) {
            console.error(`Error starting VAD monitoring for user ${userId}:`, error);
        }
    }

    public stopMonitoring(userId: string): void {
        // Останавливаем анимацию
        const animationFrame = this.animationFrames.get(userId);
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            this.animationFrames.delete(userId);
        }

        // Очищаем данные
        this.analysers.delete(userId);
        this.dataArrays.delete(userId);
        this.volumeHistory.delete(userId);
        this.lastActivityTime.delete(userId);
        this.isActive.delete(userId);
        
        console.log(`VAD monitoring stopped for user: ${userId}`);
    }

    private monitorUser(userId: string): void {
        const analyser = this.analysers.get(userId);
        const dataArray = this.dataArrays.get(userId);
        
        if (!analyser || !dataArray) {
            return;
        }

        const animate = () => {
            // Получаем данные о частотах
            analyser.getByteFrequencyData(dataArray as any);
            
            // Вычисляем средний уровень громкости
            const average = this.calculateAverageVolume(dataArray);
            
            // Применяем сглаживание
            const smoothedVolume = this.applySmoothing(userId, average);
            
            // Определяем активность речи
            const isCurrentlyActive = this.detectSpeechActivity(userId, smoothedVolume);
            
            // Обновляем состояние
            this.updateUserActivity(userId, isCurrentlyActive, smoothedVolume);
            
            // Продолжаем мониторинг
            const frameId = requestAnimationFrame(animate);
            this.animationFrames.set(userId, frameId);
        };

        animate();
    }

    private calculateAverageVolume(dataArray: Uint8Array): number {
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Конвертируем в проценты и добавляем отладочную информацию
        const percentage = (average / 255) * 100;
        if (percentage > 5) { // Логируем только если есть звук
            console.log(`VAD: Volume level: ${percentage.toFixed(1)}%`);
        }
        return percentage;
    }

    private applySmoothing(userId: string, currentVolume: number): number {
        const history = this.volumeHistory.get(userId) || [];
        
        // Добавляем текущее значение
        history.push(currentVolume);
        
        // Ограничиваем историю последними 10 значениями
        if (history.length > 10) {
            history.shift();
        }
        
        // Вычисляем сглаженное значение
        const smoothed = history.reduce((sum, vol) => sum + vol, 0) / history.length;
        
        // Применяем экспоненциальное сглаживание
        const previousSmoothed = this.getLastSmoothedVolume(userId);
        const finalSmoothed = previousSmoothed * this.config.smoothingFactor + 
                             smoothed * (1 - this.config.smoothingFactor);
        
        this.volumeHistory.set(userId, history);
        this.setLastSmoothedVolume(userId, finalSmoothed);
        
        return finalSmoothed;
    }

    private lastSmoothedVolumes: Map<string, number> = new Map();

    private getLastSmoothedVolume(userId: string): number {
        return this.lastSmoothedVolumes.get(userId) || 0;
    }

    private setLastSmoothedVolume(userId: string, volume: number): void {
        this.lastSmoothedVolumes.set(userId, volume);
    }

    private detectSpeechActivity(userId: string, volume: number): boolean {
        const now = Date.now();
        const lastActivity = this.lastActivityTime.get(userId) || 0;
        const wasActive = this.isActive.get(userId) || false;
        
        // Если громкость выше порога
        if (volume > this.config.threshold) {
            this.lastActivityTime.set(userId, now);
            
            // Если уже был активен, продолжаем
            if (wasActive) {
                return true;
            }
            
            // Если не был активен, проверяем минимальную длительность
            const timeSinceLastActivity = now - lastActivity;
            return timeSinceLastActivity >= this.config.minSpeechDuration;
        }
        
        // Если громкость ниже порога
        if (wasActive) {
            // Проверяем, не прошло ли слишком много времени с последней активности
            const timeSinceLastActivity = now - lastActivity;
            return timeSinceLastActivity < this.config.silenceTimeout;
        }
        
        return false;
    }

    private updateUserActivity(userId: string, isActive: boolean, volume: number): void {
        const wasActive = this.isActive.get(userId) || false;
        
        // Обновляем состояние
        this.isActive.set(userId, isActive);
        
        // Уведомляем только при изменении состояния
        if (isActive !== wasActive) {
            const event: VoiceActivityEvent = {
                userId,
                isActive,
                volume,
                timestamp: Date.now()
            };
            
            this.notifyCallbacks(event);
        }
    }

    public getUserActivity(userId: string): boolean {
        return this.isActive.get(userId) || false;
    }

    public getUserVolume(userId: string): number {
        return this.getLastSmoothedVolume(userId);
    }

    public cleanup(): void {
        // Останавливаем все мониторинги
        this.analysers.forEach((_, userId) => {
            this.stopMonitoring(userId);
        });
        
        // Очищаем все данные
        this.analysers.clear();
        this.dataArrays.clear();
        this.volumeHistory.clear();
        this.lastActivityTime.clear();
        this.isActive.clear();
        this.lastSmoothedVolumes.clear();
        this.animationFrames.clear();
        this.callbacks = [];
        
        // Закрываем аудио контекст
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        console.log('VAD service cleaned up');
    }
}

const vadService = new VoiceActivityDetectionService();
export default vadService;
