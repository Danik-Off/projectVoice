import React from 'react';
import './VolumeControl.scss';
interface VolumeControlProps {
    volume: number;
    onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onVolumeChange(Number(e.target.value));
    };

    return (
        <div className="volume-control">
            <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleChange}
                className="volume-slider"
                aria-label="Volume control"
            />
            <span className="volume-label">{volume}</span>
        </div>
    );
};

export default VolumeControl;
