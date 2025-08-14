import React, { useEffect, useRef, useState } from 'react';
import audioSettingsStore from '../../../../../store/AudioSettingsStore';
import { reaction } from 'mobx';
import { MicrophoneIcon, WaveIcon } from '../icons';

const MicrophoneVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        const setupMicrophone = async () => {
            try {
                const stream = audioSettingsStore.stream;
                if (!stream) {
                    setIsActive(false);
                    return;
                }

                const audioTracks = stream.getAudioTracks();
                if (audioTracks.length === 0) {
                    setIsActive(false);
                    return;
                }

                const audioContext = new AudioContext();
                audioContextRef.current = audioContext;

                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                analyserRef.current = analyser;

                source.connect(analyser);
                setIsActive(true);
                visualize();
            } catch (err) {
                console.error('Error accessing microphone:', err);
                setIsActive(false);
            }
        };

        const visualize = () => {
            if (!canvasRef.current || !analyserRef.current) return;
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const analyser = analyserRef.current;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                analyser.getByteFrequencyData(dataArray);

                // Очистка канваса
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Вычисление средней громкости
                let total = 0;
                for (let i = 0; i < bufferLength; i++) {
                    total += dataArray[i];
                }
                const averageVolume = total / bufferLength;
                setVolume(averageVolume);

                // Рисуем основной индикатор громкости
                const barWidth = (averageVolume / 255) * canvas.width;
                const barHeight = canvas.height;

                // Градиент для основного индикатора
                const gradient = ctx.createLinearGradient(0, 0, barWidth, 0);
                gradient.addColorStop(0, '#64b5f6');
                gradient.addColorStop(0.5, '#5865f2');
                gradient.addColorStop(1, '#43b581');

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, barWidth, barHeight);

                // Эффект свечения
                ctx.shadowColor = '#64b5f6';
                ctx.shadowBlur = 15;
                ctx.fillRect(0, 0, barWidth, barHeight);
                ctx.shadowBlur = 0;

                // Рисуем частотные полосы
                const barCount = 32;
                const barSpacing = canvas.width / barCount;
                const barMaxHeight = canvas.height * 0.7;

                for (let i = 0; i < barCount; i++) {
                    const barIndex = Math.floor((i / barCount) * bufferLength);
                    const barValue = dataArray[barIndex] || 0;
                    const barHeight = (barValue / 255) * barMaxHeight;
                    const x = i * barSpacing + barSpacing / 2;
                    const y = canvas.height - barHeight;

                    // Градиент для каждой полосы
                    const barGradient = ctx.createLinearGradient(x, y, x, canvas.height);
                    barGradient.addColorStop(0, '#64b5f6');
                    barGradient.addColorStop(1, '#5865f2');

                    ctx.fillStyle = barGradient;
                    ctx.fillRect(x - 2, y, 4, barHeight);

                    // Добавляем эффект свечения для активных полос
                    if (barValue > 128) {
                        ctx.shadowColor = '#64b5f6';
                        ctx.shadowBlur = 8;
                        ctx.fillRect(x - 2, y, 4, barHeight);
                        ctx.shadowBlur = 0;
                    }
                }

                animationFrameRef.current = requestAnimationFrame(draw);
            };

            draw();
        };

        reaction(
            () => audioSettingsStore.stream,
            () => {
                setupMicrophone();
            },
        );

        setupMicrophone();

        return () => {
            if (audioContextRef.current) audioContextRef.current.close();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return (
        <div className="microphone-visualizer">
            <div className="visualizer-header">
                <div className="header-left">
                    <div className="icon-container">
                        <MicrophoneIcon />
                    </div>
                    <div className="header-text">
                        <h4 className="visualizer-title">Визуализация микрофона</h4>
                        <p className="visualizer-subtitle">Реальное время записи звука</p>
                    </div>
                </div>
                <div className="header-right">
                    <div className={`status-indicator ${isActive ? 'active' : 'inactive'}`}>
                        <div className="status-dot"></div>
                        <span className="status-text">
                            {isActive ? 'Активен' : 'Неактивен'}
                        </span>
                    </div>
                    <div className="volume-display">
                        <WaveIcon />
                        <span className="volume-text">{Math.round((volume / 255) * 100)}%</span>
                    </div>
                </div>
            </div>
            
            <div className="visualizer-container">
                <canvas 
                    ref={canvasRef} 
                    width="600" 
                    height="80"
                    className="visualizer-canvas"
                />
            </div>

            {!isActive && (
                <div className="inactive-message">
                    <p>Микрофон не активен. Проверьте разрешения браузера.</p>
                </div>
            )}
        </div>
    );
};

export default MicrophoneVisualizer;
