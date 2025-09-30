import { makeAutoObservable, action } from 'mobx';

export interface VoiceActivityEvent {
    userId: string;
    isActive: boolean;
    volume: number;
    timestamp: number;
}

class VoiceActivityService {
    private audioContext: AudioContext | null = null;
    private analysers: Map<string, AnalyserNode> = new Map();
    private dataArrays: Map<string, Uint8Array> = new Map();
    private animationFrames: Map<string, number> = new Map();
    private isActive: Map<string, boolean> = new Map();
    private volumes: Map<string, number> = new Map();
    
    public config = {
        localThreshold: 1300, // Порог громкости для локального пользователя
        remoteThreshold: 1000, // Порог громкости для удаленных пользователей
        smoothingFactor: 0.8 // Сглаживание
    };

    private callbacks: ((event: VoiceActivityEvent) => void)[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    public initialize(): void {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
            console.log('VoiceActivityService: AudioContext created');
        }
    }

    public addCallback = action((callback: (event: VoiceActivityEvent) => void): void => {
        this.callbacks.push(callback);
    });

    public removeCallback = action((callback: (event: VoiceActivityEvent) => void): void => {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    });

    private notifyCallbacks(event: VoiceActivityEvent): void {
        this.callbacks.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Error in VoiceActivity callback:', error);
            }
        });
    }

    public startMonitoring = action((userId: string, audioStream: MediaStream): void => {
        console.log(`VoiceActivityService: Starting monitoring for user: ${userId}`);
        
        if (!this.audioContext) {
            console.error('VoiceActivityService: AudioContext not initialized');
            return;
        }

        if (audioStream.getAudioTracks().length === 0) {
            console.error(`VoiceActivityService: No audio tracks for user: ${userId}`);
            return;
        }

        this.stopMonitoring(userId);

        try {
            const source = this.audioContext.createMediaStreamSource(audioStream);
            const analyser = this.audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            
            source.connect(analyser);
            
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            this.analysers.set(userId, analyser);
            this.dataArrays.set(userId, dataArray);
            this.isActive.set(userId, false);
            this.volumes.set(userId, 0);
            
            this.monitorUser(userId);
            
            console.log(`VoiceActivityService: Monitoring started for user: ${userId}`);
        } catch (error) {
            console.error(`VoiceActivityService: Error starting monitoring for user ${userId}:`, error);
        }
    });

    public stopMonitoring = action((userId: string): void => {
        const animationFrame = this.animationFrames.get(userId);
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            this.animationFrames.delete(userId);
        }

        this.analysers.delete(userId);
        this.dataArrays.delete(userId);
        this.isActive.delete(userId);
        this.volumes.delete(userId);
        
        console.log(`VoiceActivityService: Monitoring stopped for user: ${userId}`);
    });

    private monitorUser(userId: string): void {
        const analyser = this.analysers.get(userId);
        const dataArray = this.dataArrays.get(userId);
        
        if (!analyser || !dataArray) {
            return;
        }

        const animate = () => {
            analyser.getByteFrequencyData(dataArray as any);
            
            const volume = this.calculateVolume(dataArray);
            const smoothedVolume = this.smoothVolume(userId, volume);
            
            // Используем разные пороги для локального и удаленных пользователей
            const threshold = userId === 'local' ? this.config.localThreshold : this.config.remoteThreshold;
            const isCurrentlyActive = smoothedVolume > threshold;
            const wasActive = this.isActive.get(userId) || false;
            
            // Обертываем изменения observable значений в action
            this.updateUserState(userId, smoothedVolume, isCurrentlyActive);
            
            if (isCurrentlyActive !== wasActive) {
                const event: VoiceActivityEvent = {
                    userId,
                    isActive: isCurrentlyActive,
                    volume: smoothedVolume,
                    timestamp: Date.now()
                };
                
                this.notifyCallbacks(event);
            }
            
            const frameId = requestAnimationFrame(animate);
            this.updateAnimationFrame(userId, frameId);
        };

        animate();
    }

    private calculateVolume(dataArray: Uint8Array): number {
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        return (sum / dataArray.length) * 100;
    }

    private smoothVolume(userId: string, currentVolume: number): number {
        const previousVolume = this.volumes.get(userId) || 0;
        return previousVolume * this.config.smoothingFactor + currentVolume * (1 - this.config.smoothingFactor);
    }

    // Action для обновления состояния пользователя
    private updateUserState = action((userId: string, volume: number, isActive: boolean) => {
        this.volumes.set(userId, volume);
        this.isActive.set(userId, isActive);
    });

    // Action для обновления animation frame
    private updateAnimationFrame = action((userId: string, frameId: number) => {
        this.animationFrames.set(userId, frameId);
    });

    public getUserActivity(userId: string): boolean {
        return this.isActive.get(userId) || false;
    }

    public getUserVolume(userId: string): number {
        return this.volumes.get(userId) || 0;
    }

    public cleanup = action((): void => {
        this.analysers.forEach((_, userId) => {
            this.stopMonitoring(userId);
        });
        
        this.analysers.clear();
        this.dataArrays.clear();
        this.isActive.clear();
        this.volumes.clear();
        this.animationFrames.clear();
        this.callbacks = [];
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        console.log('VoiceActivityService: Cleaned up');
    });
}

const voiceActivityService = new VoiceActivityService();
export default voiceActivityService;
