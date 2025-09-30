/**
 * Утилита для тестирования аудио настроек
 * Проверяет качество звука и работу фильтров
 */

import audioSettingsStore from '../store/AudioSettingsStore';

export class AudioTest {
    private testContext: AudioContext | null = null;
    private testOscillator: OscillatorNode | null = null;
    private testGain: GainNode | null = null;

    /**
     * Тест качества звука с разными частотами
     */
    public async testAudioQuality(): Promise<void> {
        console.log('🎵 Начинаем тест качества аудио...');
        
        try {
            // Создаем тестовый аудио контекст
            this.testContext = new AudioContext();
            
            // Тестируем разные частоты
            const testFrequencies = [440, 880, 1760, 3520]; // A4, A5, A6, A7
            const frequencyNames = ['A4 (440 Гц)', 'A5 (880 Гц)', 'A6 (1760 Гц)', 'A7 (3520 Гц)'];
            
            for (let i = 0; i < testFrequencies.length; i++) {
                await this.playTestTone(testFrequencies[i], frequencyNames[i]);
                await this.delay(1000); // Пауза между тонами
            }
            
            console.log('✅ Тест качества аудио завершен');
        } catch (error) {
            console.error('❌ Ошибка при тестировании качества аудио:', error);
        } finally {
            this.cleanup();
        }
    }

    /**
     * Тест фильтров обработки звука
     */
    public async testAudioFilters(): Promise<void> {
        console.log('🔧 Начинаем тест фильтров...');
        
        try {
            this.testContext = new AudioContext();
            
            // Тестируем базовые фильтры
            await this.testHighPassFilter();
            await this.delay(500);
            await this.testLowPassFilter();
            await this.delay(500);
            await this.testBandPassFilter();
            
            console.log('✅ Тест фильтров завершен');
        } catch (error) {
            console.error('❌ Ошибка при тестировании фильтров:', error);
        } finally {
            this.cleanup();
        }
    }

    /**
     * Тест настроек по умолчанию
     */
    public testDefaultSettings(): void {
        console.log('⚙️ Проверяем настройки по умолчанию...');
        
        const settings = {
            sampleRate: audioSettingsStore.sampleRate,
            bitrate: audioSettingsStore.bitrate,
            latency: audioSettingsStore.latency,
            volume: audioSettingsStore.volume,
            echoCancellation: audioSettingsStore.echoCancellation,
            noiseSuppression: audioSettingsStore.noiseSuppression,
            autoGainControl: audioSettingsStore.autoGainControl,
            voiceEnhancement: audioSettingsStore.voiceEnhancement,
            voiceClarity: audioSettingsStore.voiceClarity,
            backgroundNoiseReduction: audioSettingsStore.backgroundNoiseReduction,
            voiceBoost: audioSettingsStore.voiceBoost,
            bassBoost: audioSettingsStore.bassBoost,
            trebleBoost: audioSettingsStore.trebleBoost,
            dynamicRangeCompression: audioSettingsStore.dynamicRangeCompression
        };

        console.log('📊 Текущие настройки:', settings);
        
        // Проверяем разумность настроек
        const checks = [
            { name: 'Частота дискретизации', value: settings.sampleRate, min: 8000, max: 48000 },
            { name: 'Битрейт', value: settings.bitrate, min: 64, max: 320 },
            { name: 'Задержка', value: settings.latency, min: 50, max: 1000 },
            { name: 'Громкость', value: settings.volume, min: 0, max: 100 },
            { name: 'Четкость голоса', value: settings.voiceClarity * 100, min: 0, max: 100 },
            { name: 'Снижение шума', value: settings.backgroundNoiseReduction * 100, min: 0, max: 100 },
            { name: 'Усиление голоса', value: settings.voiceBoost * 100, min: 0, max: 100 },
            { name: 'Усиление басов', value: settings.bassBoost * 100, min: 0, max: 100 },
            { name: 'Усиление высоких', value: settings.trebleBoost * 100, min: 0, max: 100 },
            { name: 'Динамическое сжатие', value: settings.dynamicRangeCompression * 100, min: 0, max: 100 }
        ];

        let allGood = true;
        checks.forEach(check => {
            if (check.value < check.min || check.value > check.max) {
                console.warn(`⚠️ ${check.name}: ${check.value} (должно быть ${check.min}-${check.max})`);
                allGood = false;
            } else {
                console.log(`✅ ${check.name}: ${check.value}`);
            }
        });

        if (allGood) {
            console.log('✅ Все настройки в пределах нормы');
        } else {
            console.log('❌ Обнаружены проблемы в настройках');
        }
    }

    /**
     * Воспроизведение тестового тона
     */
    private async playTestTone(frequency: number, name: string): Promise<void> {
        return new Promise((resolve) => {
            if (!this.testContext) return resolve();

            console.log(`🎵 Воспроизводим ${name}...`);
            
            this.testOscillator = this.testContext.createOscillator();
            this.testGain = this.testContext.createGain();
            
            this.testOscillator.frequency.value = frequency;
            this.testOscillator.type = 'sine';
            
            this.testGain.gain.value = 0.1; // Низкая громкость для теста
            
            this.testOscillator.connect(this.testGain);
            this.testGain.connect(this.testContext.destination);
            
            this.testOscillator.start();
            
            setTimeout(() => {
                if (this.testOscillator) {
                    this.testOscillator.stop();
                }
                resolve();
            }, 800);
        });
    }

    /**
     * Тест высокочастотного фильтра
     */
    private async testHighPassFilter(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.testContext) return resolve();

            console.log('🔊 Тестируем высокочастотный фильтр...');
            
            const oscillator = this.testContext.createOscillator();
            const filter = this.testContext.createBiquadFilter();
            const gain = this.testContext.createGain();
            
            oscillator.frequency.value = 200; // Низкая частота
            oscillator.type = 'sine';
            
            filter.type = 'highpass';
            filter.frequency.value = 300;
            filter.Q.value = 0.5;
            
            gain.gain.value = 0.1;
            
            oscillator.connect(filter);
            filter.connect(gain);
            gain.connect(this.testContext.destination);
            
            oscillator.start();
            
            setTimeout(() => {
                oscillator.stop();
                resolve();
            }, 500);
        });
    }

    /**
     * Тест низкочастотного фильтра
     */
    private async testLowPassFilter(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.testContext) return resolve();

            console.log('🔇 Тестируем низкочастотный фильтр...');
            
            const oscillator = this.testContext.createOscillator();
            const filter = this.testContext.createBiquadFilter();
            const gain = this.testContext.createGain();
            
            oscillator.frequency.value = 5000; // Высокая частота
            oscillator.type = 'sine';
            
            filter.type = 'lowpass';
            filter.frequency.value = 3000;
            filter.Q.value = 0.5;
            
            gain.gain.value = 0.1;
            
            oscillator.connect(filter);
            filter.connect(gain);
            gain.connect(this.testContext.destination);
            
            oscillator.start();
            
            setTimeout(() => {
                oscillator.stop();
                resolve();
            }, 500);
        });
    }

    /**
     * Тест полосового фильтра
     */
    private async testBandPassFilter(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.testContext) return resolve();

            console.log('🎛️ Тестируем полосовой фильтр...');
            
            const oscillator = this.testContext.createOscillator();
            const filter = this.testContext.createBiquadFilter();
            const gain = this.testContext.createGain();
            
            oscillator.frequency.value = 1000; // Средняя частота
            oscillator.type = 'sine';
            
            filter.type = 'bandpass';
            filter.frequency.value = 1200;
            filter.Q.value = 1.2;
            
            gain.gain.value = 0.1;
            
            oscillator.connect(filter);
            filter.connect(gain);
            gain.connect(this.testContext.destination);
            
            oscillator.start();
            
            setTimeout(() => {
                oscillator.stop();
                resolve();
            }, 500);
        });
    }

    /**
     * Задержка
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Очистка ресурсов
     */
    private cleanup(): void {
        if (this.testOscillator) {
            this.testOscillator.stop();
            this.testOscillator = null;
        }
        
        if (this.testContext && this.testContext.state !== 'closed') {
            this.testContext.close();
            this.testContext = null;
        }
        
        this.testGain = null;
    }
}

// Экспортируем экземпляр для использования
export const audioTest = new AudioTest();
