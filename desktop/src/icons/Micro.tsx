/* eslint-disable max-len */
import React from 'react';

interface MicIconProps {
    isMuted: boolean;
}

const MicIcon: React.FC<MicIconProps> = ({ isMuted }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 11a3 3 0 0 0 3-3V4a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3Zm0 1a4 4 0 0 1-4-4V4a4 4 0 0 1 8 0v4a4 4 0 0 1-4 4ZM6.5 8a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V8ZM8 13a5 5 0 0 1-5-5h1a4 4 0 0 0 8 0h1a5 5 0 0 1-5 5Z" />
        {/* Перечеркнутая линия для выключенного микрофона */}
        {isMuted && <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    </svg>
);

export default MicIcon;
