/* eslint-disable max-len */
// src/components/Icons/PencilIcon.tsx
import React from 'react';

const PencilIcon: React.FC<{ width?: number; height?: number; color?: string }> = ({
    width = 16,
    height = 16,
    color = 'currentColor',
}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={color} viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l2.5 2.5a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2L3 10.207V11h.793L13 3.793 11.207 2zM2.5 11.5l-.5 1.293L3.207 12 2.5 11.5zm10-10L13.5 2.793 12.207 4.5l.5.5L14.5 2.793 12.5.793z" />
    </svg>
);

export default PencilIcon;
