import React, { useState } from 'react';
import './Settings.scss';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [privacy, setPrivacy] = useState('Public');
    const [notifications, setNotifications] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [soundEffects, setSoundEffects] = useState(true);
    const [avatar, setAvatar] = useState<string>('');  // Avatar URL or base64
    const [mic, setMic] = useState<string>('default');  // Selected mic device
    const [audioOutput, setAudioOutput] = useState<string>('default');  // Selected audio output device
    const [micGain, setMicGain] = useState(100);  // Mic gain control
    const [noiseSuppression, setNoiseSuppression] = useState(true);  // Noise suppression
    const { i18n } = useTranslation();

    const handleAccountUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Account updated:', { email, password });
    };

    const handlePrivacyChange = () => {
        console.log('Privacy settings updated:', privacy);
    };

    const handleWebRTCSettingsChange = () => {
        console.log('WebRTC settings updated:', { mic, audioOutput, micGain, noiseSuppression });
    };

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'ru' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string); // Update avatar to new image
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h1 className="settings-title">Settings</h1>

            {/* Avatar Settings */}
            <div className="settings-group">
                <h2 className="settings-group-title">Avatar Settings</h2>
                <div className="settings-option avatar-option">
                    <h3>Avatar</h3>
                    <div className="avatar-container">
                        <img
                            src={avatar || 'default-avatar-url.jpg'} // Default avatar if none is set
                            alt="User Avatar"
                            className="avatar-image"
                        />
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="avatar-upload" className="upload-avatar-btn">
                            Change Avatar
                        </label>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="settings-group">
                <h2 className="settings-group-title">Account Settings</h2>
                <form onSubmit={handleAccountUpdate}>
                    <div className="settings-option">
                        <h3>Email</h3>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="settings-option">
                        <h3>Password</h3>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter a new password"
                            required
                        />
                    </div>
                    <div className="settings-option">
                        <button type="submit">Update Account</button>
                    </div>
                </form>
            </div>

            {/* Privacy Settings */}
            <div className="settings-group">
                <h2 className="settings-group-title">Privacy Settings</h2>
                <div className="settings-option">
                    <h3>Profile Visibility</h3>
                    <select value={privacy} onChange={(e) => setPrivacy(e.target.value)} onBlur={handlePrivacyChange}>
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="settings-group">
                <h2 className="settings-group-title">Notification Settings</h2>
                <div className="settings-option">
                    <h3>Email Notifications</h3>
                    <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                    <label>Receive email notifications for updates and messages</label>
                </div>
            </div>

            {/* Security Settings */}
            <div className="settings-group">
                <h2 className="settings-group-title">Security Settings</h2>
                <div className="settings-option">
                    <h3>Two-factor Authentication</h3>
                    <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
                    <label>Enable two-factor authentication for extra security</label>
                </div>
            </div>

            {/* Appearance Settings */}
            <div className="settings-group">
                <h2 className="settings-group-title">Appearance Settings</h2>
                <div className="settings-option">
                    <h3>Dark Mode</h3>
                    <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                    <label>Enable dark mode for better visibility in low-light conditions</label>
                </div>
            </div>

            {/* Sound Settings */}
            <div className="settings-group">
                <h2 className="settings-group-title">Sound Settings</h2>
                <div className="settings-option">
                    <h3>Microphone</h3>
                    <select value={mic} onChange={(e) => setMic(e.target.value)}>
                        <option value="default">Default Microphone</option>
                        <option value="mic1">Microphone 1</option>
                        <option value="mic2">Microphone 2</option>
                    </select>
                </div>
                <div className="settings-option">
                    <h3>Audio Output</h3>
                    <select value={audioOutput} onChange={(e) => setAudioOutput(e.target.value)}>
                        <option value="default">Default Audio Output</option>
                        <option value="speaker1">Speaker 1</option>
                        <option value="speaker2">Speaker 2</option>
                    </select>
                </div>
                <div className="settings-option">
                    <h3>Microphone Gain</h3>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={micGain}
                        onChange={(e) => setMicGain(Number(e.target.value))}
                    />
                    <label>Adjust microphone gain (sensitivity)</label>
                </div>
                <div className="settings-option">
                    <h3>Noise Suppression</h3>
                    <input
                        type="checkbox"
                        checked={noiseSuppression}
                        onChange={() => setNoiseSuppression(!noiseSuppression)}
                    />
                    <label>Enable noise suppression for better sound quality</label>
                </div>
            </div>

            {/* Language Settings */}
            <div className="settings-group">
                <h2 className="settings-group-title">Language Settings</h2>
                <div className="settings-option">
                    <h3>Language</h3>
                    <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Settings;
