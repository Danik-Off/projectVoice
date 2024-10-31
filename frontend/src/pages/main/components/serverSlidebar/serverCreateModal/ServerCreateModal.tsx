// src/components/ServerSidebar/ServerCreateModal.tsx
import React, { useState } from 'react';
import './ServerCreateModal.css';

interface ServerCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}

const ServerCreateModal: React.FC<ServerCreateModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [serverName, setServerName] = useState('');

    const handleCreateServer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onCreate(serverName);
        setServerName('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Create Server</h2>
                <form onSubmit={handleCreateServer}>
                    <input
                        type="text"
                        placeholder="Server Name"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        required
                    />
                    <div className="modal-buttons">
                        <button type="submit">Create</button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServerCreateModal;
