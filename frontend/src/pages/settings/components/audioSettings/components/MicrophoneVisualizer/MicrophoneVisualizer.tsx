import React, { useEffect, useRef } from 'react';
import audioSettingsStore from '../../../../../../store/AudioSettingsStore';
import { reaction } from 'mobx';
import './MicrophoneVisualizer.scss';

const MicrophoneVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        // Request permission and set up the microphone stream
        const setupMicrophone = async () => {
            try {
                const stream = audioSettingsStore.stream;
                if (!stream) {
                    return;
                }

                // Проверяем, есть ли аудио треки в stream
                const audioTracks = stream.getAudioTracks();
                if (audioTracks.length === 0) {
                    console.log('No audio tracks found in stream');
                    return;
                }

                const audioContext = new AudioContext();
                audioContextRef.current = audioContext;

                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256; // Determines the number of frequency bins
                analyserRef.current = analyser;

                source.connect(analyser);
                visualize();
            } catch (err) {
                console.error('Error accessing microphone:', err);
            }
        };

        const visualize = () => {
            if (!canvasRef.current || !analyserRef.current) return;
            const canvas = canvasRef.current;
            const canvasCtx = canvas.getContext('2d');
            const analyser = analyserRef.current;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                if (!canvasCtx) return;

                analyser.getByteFrequencyData(dataArray);

                // Очистка канваса перед рисованием новой полосы
                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

                // Calculate the overall volume by averaging the data
                let total = 0;
                for (let i = 0; i < bufferLength; i++) {
                    total += dataArray[i];
                }
                const averageVolume = total / bufferLength;

                // Draw a modern volume bar with gradient
                const barWidth = (averageVolume / 40) * canvas.width;
                const barHeight = canvas.height;

                // Create gradient for the volume bar
                const gradient = canvasCtx.createLinearGradient(0, 0, barWidth, 0);
                gradient.addColorStop(0, '#7289da');
                gradient.addColorStop(0.5, '#5865f2');
                gradient.addColorStop(1, '#43b581');

                // Draw the main volume bar
                canvasCtx.fillStyle = gradient;
                canvasCtx.fillRect(0, 0, barWidth, barHeight);

                // Add glow effect
                canvasCtx.shadowColor = '#7289da';
                canvasCtx.shadowBlur = 10;
                canvasCtx.fillRect(0, 0, barWidth, barHeight);
                canvasCtx.shadowBlur = 0;

                // Draw frequency bars for more visual appeal
                const barCount = 20;
                const barSpacing = canvas.width / barCount;
                const barMaxHeight = canvas.height * 0.8;

                for (let i = 0; i < barCount; i++) {
                    const barIndex = Math.floor((i / barCount) * bufferLength);
                    const barValue = dataArray[barIndex] || 0;
                    const barHeight = (barValue / 255) * barMaxHeight;
                    const x = i * barSpacing + barSpacing / 2;
                    const y = canvas.height - barHeight;

                    // Create gradient for each frequency bar
                    const barGradient = canvasCtx.createLinearGradient(x, y, x, canvas.height);
                    barGradient.addColorStop(0, '#7289da');
                    barGradient.addColorStop(1, '#5865f2');

                    canvasCtx.fillStyle = barGradient;
                    canvasCtx.fillRect(x - 2, y, 4, barHeight);
                }

                animationFrameRef.current = requestAnimationFrame(draw);
            };

            draw();
        };

        reaction(
            () => audioSettingsStore.stream, // React to microphone change
            () => {
                setupMicrophone();
            },
        );
        try {
            setupMicrophone();
        } catch {}

        return () => {
            // Clean up on component unmount
            if (audioContextRef.current) audioContextRef.current.close();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return (
        <div className="microphone-visualizer">
            <div className="visualizer-header">
                <h3>Микрофон</h3>
                <div className="status-indicator">
                    <div className="status-dot"></div>
                    <span>Активен</span>
                </div>
            </div>
            <div className="visualizer-container">
                <canvas 
                    ref={canvasRef} 
                    width="800" 
                    height="60"
                    className="visualizer-canvas"
                />
            </div>
        </div>
    );
};

export default MicrophoneVisualizer;
