import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import channelsStore from '../../../../store/channelsStore';
import { Channel } from '../../../../types/channel';

const ChannelsSettings: React.FC = observer(() => {
    const { t } = useTranslation();
    const channels = channelsStore.channels;

    const textChannels = channels.filter((channel: Channel) => channel.type === 'text');
    const voiceChannels = channels.filter((channel: Channel) => channel.type === 'voice');

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('serverSettings.channels')}</h2>
                <p>{t('serverSettings.channelsDescription')}</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                📝
                            </div>
                            <div className="header-text">
                                <h3>{t('serverSettings.serverChannels')}</h3>
                                <p>{t('serverSettings.serverChannelsDescription')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        {/* Текстовые каналы */}
                        <div className="channel-category">
                            <h4 className="category-title">
                                💬 {t('serverSettings.textChannels')} ({textChannels.length})
                            </h4>
                            <div className="channels-list">
                                {textChannels.map((channel: Channel) => (
                                    <div key={channel.id} className="channel-item">
                                        <div className="channel-icon">#</div>
                                        <div className="channel-name">{channel.name}</div>
                                        <div className="channel-type">text</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Голосовые каналы */}
                        <div className="channel-category">
                            <h4 className="category-title">
                                🔊 {t('serverSettings.voiceChannels')} ({voiceChannels.length})
                            </h4>
                            <div className="channels-list">
                                {voiceChannels.map((channel: Channel) => (
                                    <div key={channel.id} className="channel-item">
                                        <div className="channel-icon">🔊</div>
                                        <div className="channel-name">{channel.name}</div>
                                        <div className="channel-type">voice</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {channels.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">📝</div>
                                <h4>{t('serverSettings.noChannels')}</h4>
                                <p>{t('serverSettings.noChannelsDescription')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ChannelsSettings;
