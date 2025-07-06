import React, { useEffect, useRef } from 'react';
import audioSettingsStore from '../../../../../store/AudioSettingsStore';
import { reaction } from 'mobx';

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

                // Draw a single bar representing the overall volume
                const barWidth = (averageVolume / 40) * canvas.width; // Full width of the canvas
                const barHeight = canvas.height; // Normalize to height

                // Set color for the volume bar
                const color = `rgb(${barWidth + 50}, 50, 150)`; // Use barWidth instead of barHeight for color

                // Draw the volume bar
                canvasCtx.fillStyle = color;
                canvasCtx.fillRect(0, 0, barWidth, barHeight);

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
        <div>
            <canvas style={{ backgroundColor: 'white' }} ref={canvasRef} width="800" height="10" />
        </div>
    ); // Adjusted height for horizontal bar
};

export default MicrophoneVisualizer;
