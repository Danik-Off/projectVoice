import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../../../../../../components/ui';
import serverStore from '../../../../../../../../store/serverStore';
import channelsStore from '../../../../../../../../store/channelsStore';
import { Channel } from '../../../../../../../../types/channel';

interface CreateChannelFormProps {
    onClose: () => void;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [channelName, setChannelName] = useState('');
    const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateChannel = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!channelName.trim() || !serverStore.currentServer) return;

        setIsLoading(true);
        try {
            const newChannel: Omit<Channel, 'id'> = {
                serverId: serverStore.currentServer.id,
                name: channelName.trim(),
                type: channelType,
                description: description.trim(),
            };

            await channelsStore.createChannel(serverStore.currentServer.id, newChannel);
            
            setChannelName('');
            setDescription('');
            onClose();
        } catch (error) {
            console.error('Ошибка создания канала:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setChannelName('');
            setDescription('');
            onClose();
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={handleClose}
            title={t('createChannelForm.title')}
            size="medium"
            icon="📝"
        >
            <form onSubmit={handleCreateChannel}>
                <div className="form-group">
                    <label className="form-label">
                        {t('createChannelForm.channelName')}
                        <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder={t('createChannelForm.channelNamePlaceholder')}
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        disabled={isLoading}
                        className="input-field"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        {t('createChannelForm.channelType')}
                        <span className="required">*</span>
                    </label>
                    <select
                        value={channelType}
                        onChange={(e) => setChannelType(e.target.value as 'text' | 'voice')}
                        className="select-field"
                        disabled={isLoading}
                    >
                        <option value="text">{t('createChannelForm.text')}</option>
                        <option value="voice">{t('createChannelForm.voice')}</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        {t('createChannelForm.description')}
                    </label>
                    <input
                        type="text"
                        placeholder={t('createChannelForm.descriptionPlaceholder')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isLoading}
                        className="input-field"
                    />
                </div>

                <div className="modal-actions">
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        {t('createChannelForm.cancel')}
                    </button>
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={!channelName.trim() || isLoading}
                    >
                        {isLoading ? 'Создание...' : t('createChannelForm.create')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateChannelForm;