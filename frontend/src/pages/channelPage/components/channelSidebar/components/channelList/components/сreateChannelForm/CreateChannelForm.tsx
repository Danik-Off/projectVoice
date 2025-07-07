// CreateChannelForm.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import serverStore from '../../../../../../../../store/serverStore';
import { Channel } from '../../../../../../../../types/channel';
import './CreateChannelForm.css'; // Import the CSS file for styling
import channelsStore from '../../../../../../../../store/channelsStore';
import notificationStore from '../../../../../../../../store/NotificationStore';

interface CreateChannelFormProps {
    onClose: () => void; // Callback to close the form
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [channelName, setChannelName] = useState<string>('');
    const [channelType, setChannelType] = useState<'text' | 'voice'>('text'); // Default to 'text'
    const [description, setDescription] = useState<string>('');

    // Функция для обработки создания канала
    const handleCreateChannel = async (e: React.FormEvent) => {
        e.preventDefault();

        if (serverStore.currentServer) {
            const newChannel: Omit<Channel, 'id'> = {
                serverId: serverStore.currentServer.id,
                name: channelName,
                type: channelType,
                description,
            };

            await channelsStore.createChannel(serverStore.currentServer.id, newChannel);
            setChannelName(''); // Сброс поля
            setDescription(''); // Сброс описания
            onClose(); // Закрыть форму после создания канала
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{t('createChannelForm.title')}</h2>
                <form onSubmit={handleCreateChannel}>
                    <div>
                        <label>
                            {t('createChannelForm.channelName')}
                            <input
                                type="text"
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                                required
                                className="input-field"
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            {t('createChannelForm.channelType')}
                            <select
                                value={channelType}
                                onChange={(e) => setChannelType(e.target.value as 'text' | 'voice')}
                                className="select-field"
                            >
                                <option value="text">{t('createChannelForm.text')}</option>
                                <option value="voice">{t('createChannelForm.voice')}</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            {t('createChannelForm.description')}
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input-field"
                            />
                        </label>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="submit-button">
                            {t('createChannelForm.create')}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-button">
                            {t('createChannelForm.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateChannelForm;
