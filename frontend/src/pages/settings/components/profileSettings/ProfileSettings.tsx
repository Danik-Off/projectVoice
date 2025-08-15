import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { authStore } from '../../../../store/authStore';
import { userStore } from '../../../../store/userStore';
import { notificationStore } from '../../../../store/NotificationStore';
import './ProfileSettings.scss';

interface ValidationErrors {
    username?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const ProfileSettings: React.FC = observer(() => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [editForm, setEditForm] = useState({
        username: authStore.user?.username || '',
        email: authStore.user?.email || ''
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [originalForm, setOriginalForm] = useState({
        username: authStore.user?.username || '',
        email: authStore.user?.email || ''
    });

    // Обновляем формы при изменении пользователя
    useEffect(() => {
        if (authStore.user) {
            const userData = {
                username: authStore.user.username || '',
                email: authStore.user.email || ''
            };
            setEditForm(userData);
            setOriginalForm(userData);
        }
    }, []);

    // Валидация формы профиля
    const validateProfileForm = (): boolean => {
        const errors: ValidationErrors = {};

        if (!editForm.username.trim()) {
            errors.username = t('settingsPage.profile.validation.usernameRequired');
        } else if (editForm.username.length < 3) {
            errors.username = t('settingsPage.profile.validation.usernameMinLength');
        } else if (editForm.username.length > 20) {
            errors.username = t('settingsPage.profile.validation.usernameMaxLength');
        }

        if (!editForm.email.trim()) {
            errors.email = t('settingsPage.profile.validation.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
            errors.email = t('settingsPage.profile.validation.emailInvalid');
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Валидация формы пароля
    const validatePasswordForm = (): boolean => {
        const errors: ValidationErrors = {};

        if (!passwordForm.currentPassword.trim()) {
            errors.currentPassword = t('settingsPage.profile.validation.currentPasswordRequired');
        }

        if (!passwordForm.newPassword.trim()) {
            errors.newPassword = t('settingsPage.profile.validation.newPasswordRequired');
        } else if (passwordForm.newPassword.length < 6) {
            errors.newPassword = t('settingsPage.profile.validation.passwordMinLength');
        } else if (passwordForm.newPassword.length > 50) {
            errors.newPassword = t('settingsPage.profile.validation.passwordMaxLength');
        }

        if (!passwordForm.confirmPassword.trim()) {
            errors.confirmPassword = t('settingsPage.profile.validation.confirmPasswordRequired');
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            errors.confirmPassword = t('settingsPage.profile.validation.passwordsDoNotMatch');
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEdit = () => {
        setIsEditing(true);
        setValidationErrors({});
    };

    const handleSave = async () => {
        if (!validateProfileForm()) {
            return;
        }

        // Проверяем, изменились ли данные
        if (editForm.username === originalForm.username && editForm.email === originalForm.email) {
            notificationStore.addNotification(t('settingsPage.profile.messages.noChanges'), 'info');
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            if (authStore.user?.id) {
                await userStore.updateProfile(editForm);
                setOriginalForm(editForm);
                setIsEditing(false);
                notificationStore.addNotification(t('settingsPage.profile.messages.profileUpdated'), 'success');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('settingsPage.profile.messages.updateError');
            notificationStore.addNotification(errorMessage, 'error');
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditForm(originalForm);
        setIsEditing(false);
        setValidationErrors({});
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        authStore.logout();
        setShowLogoutConfirm(false);
    };

    const handleChangePassword = () => {
        setShowPasswordForm(true);
        setValidationErrors({});
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handlePasswordSave = async () => {
        if (!validatePasswordForm()) {
            return;
        }

        setIsPasswordLoading(true);
        try {
            if (authStore.user?.id) {
                await userStore.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
                setShowPasswordForm(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                notificationStore.addNotification(t('settingsPage.profile.messages.passwordChanged'), 'success');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('settingsPage.profile.messages.passwordChangeError');
            notificationStore.addNotification(errorMessage, 'error');
            console.error('Error changing password:', error);
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handlePasswordCancel = () => {
        setShowPasswordForm(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setValidationErrors({});
    };

    const handleAvatarChange = () => {
        // TODO: Реализовать загрузку аватара
        notificationStore.addNotification(t('settingsPage.profile.messages.avatarFeatureComing'), 'info');
    };

    if (!authStore.user) {
        return null;
    }

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('settingsPage.profile.title')}</h2>
                <p>{t('settingsPage.profile.description')}</p>
            </div>
            
            <div className="section-content">
                {/* Основная информация профиля */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                👤
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.profile.basicInfo.title')}</h3>
                                <p>{t('settingsPage.profile.basicInfo.description')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="profile-info-section">
                            <div className="profile-avatar-section">
                                <div className="profile-avatar">
                                    {authStore.user.profilePicture ? (
                                        <img 
                                            src={authStore.user.profilePicture} 
                                            alt={authStore.user.username}
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {authStore.user.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <button 
                                    className="btn-change-avatar"
                                    onClick={handleAvatarChange}
                                    disabled={isLoading}
                                >
                                    {t('settingsPage.profile.basicInfo.changeAvatar')}
                                </button>
                            </div>

                            <div className="profile-fields">
                                <div className="setting-group">
                                    <div className="setting-header">
                                        <label className="setting-label">
                                            {t('settingsPage.profile.basicInfo.username')}
                                        </label>
                                    </div>
                                    <div className="setting-control">
                                        {isEditing ? (
                                            <div className="input-container">
                                                <input
                                                    type="text"
                                                    value={editForm.username}
                                                    onChange={(e) => {
                                                        setEditForm({ ...editForm, username: e.target.value });
                                                        if (validationErrors.username) {
                                                            setValidationErrors({ ...validationErrors, username: undefined });
                                                        }
                                                    }}
                                                    className={`edit-input ${validationErrors.username ? 'error' : ''}`}
                                                    placeholder={t('settingsPage.profile.basicInfo.usernamePlaceholder')}
                                                    disabled={isLoading}
                                                />
                                                {validationErrors.username && (
                                                    <div className="error-message">{validationErrors.username}</div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="info-display">
                                                {authStore.user.username}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <div className="setting-header">
                                        <label className="setting-label">
                                            {t('settingsPage.profile.basicInfo.email')}
                                        </label>
                                    </div>
                                    <div className="setting-control">
                                        {isEditing ? (
                                            <div className="input-container">
                                                <input
                                                    type="email"
                                                    value={editForm.email}
                                                    onChange={(e) => {
                                                        setEditForm({ ...editForm, email: e.target.value });
                                                        if (validationErrors.email) {
                                                            setValidationErrors({ ...validationErrors, email: undefined });
                                                        }
                                                    }}
                                                    className={`edit-input ${validationErrors.email ? 'error' : ''}`}
                                                    placeholder={t('settingsPage.profile.basicInfo.emailPlaceholder')}
                                                    disabled={isLoading}
                                                />
                                                {validationErrors.email && (
                                                    <div className="error-message">{validationErrors.email}</div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="info-display">
                                                {authStore.user.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <div className="setting-header">
                                        <label className="setting-label">
                                            {t('settingsPage.profile.basicInfo.role')}
                                        </label>
                                    </div>
                                    <div className="setting-control">
                                        <div className="info-display role-display">
                                            <span className="role-badge">
                                                {authStore.user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-actions">
                                {isEditing ? (
                                    <div className="edit-actions">
                                        <button 
                                            className="btn-save" 
                                            onClick={handleSave}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <span className="loading-spinner">⏳</span>
                                            ) : (
                                                t('settingsPage.profile.basicInfo.save')
                                            )}
                                        </button>
                                        <button 
                                            className="btn-cancel" 
                                            onClick={handleCancel}
                                            disabled={isLoading}
                                        >
                                            {t('settingsPage.profile.basicInfo.cancel')}
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        className="btn-edit" 
                                        onClick={handleEdit}
                                        disabled={isLoading}
                                    >
                                        {t('settingsPage.profile.basicInfo.edit')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Безопасность */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🔒
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.profile.security.title')}</h3>
                                <p>{t('settingsPage.profile.security.description')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <div className="setting-header">
                                <label className="setting-label">
                                    {t('settingsPage.profile.security.password')}
                                </label>
                            </div>
                            <div className="setting-control">
                                <button 
                                    className="btn-change-password" 
                                    onClick={handleChangePassword}
                                    disabled={isLoading}
                                >
                                    {t('settingsPage.profile.security.changePassword')}
                                </button>
                            </div>
                        </div>

                        <div className="setting-group">
                            <div className="setting-header">
                                <label className="setting-label">
                                    {t('settingsPage.profile.security.logout')}
                                </label>
                            </div>
                            <div className="setting-control">
                                <button 
                                    className="btn-logout" 
                                    onClick={handleLogout}
                                    disabled={isLoading}
                                >
                                    {t('settingsPage.profile.security.logout')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Модальное окно изменения пароля */}
                {showPasswordForm && (
                    <div className="password-modal-overlay">
                        <div className="password-modal">
                            <div className="modal-header">
                                <h3>{t('settingsPage.profile.security.changePassword')}</h3>
                                <button 
                                    className="btn-close" 
                                    onClick={handlePasswordCancel}
                                    disabled={isPasswordLoading}
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="modal-content">
                                <div className="setting-group">
                                    <label className="setting-label">
                                        {t('settingsPage.profile.security.currentPassword')}
                                    </label>
                                    <div className="input-container">
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => {
                                                setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                                                if (validationErrors.currentPassword) {
                                                    setValidationErrors({ ...validationErrors, currentPassword: undefined });
                                                }
                                            }}
                                            className={`password-input ${validationErrors.currentPassword ? 'error' : ''}`}
                                            placeholder={t('settingsPage.profile.security.currentPasswordPlaceholder')}
                                            disabled={isPasswordLoading}
                                        />
                                        {validationErrors.currentPassword && (
                                            <div className="error-message">{validationErrors.currentPassword}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <label className="setting-label">
                                        {t('settingsPage.profile.security.newPassword')}
                                    </label>
                                    <div className="input-container">
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => {
                                                setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                                                if (validationErrors.newPassword) {
                                                    setValidationErrors({ ...validationErrors, newPassword: undefined });
                                                }
                                            }}
                                            className={`password-input ${validationErrors.newPassword ? 'error' : ''}`}
                                            placeholder={t('settingsPage.profile.security.newPasswordPlaceholder')}
                                            disabled={isPasswordLoading}
                                        />
                                        {validationErrors.newPassword && (
                                            <div className="error-message">{validationErrors.newPassword}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <label className="setting-label">
                                        {t('settingsPage.profile.security.confirmPassword')}
                                    </label>
                                    <div className="input-container">
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => {
                                                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                                                if (validationErrors.confirmPassword) {
                                                    setValidationErrors({ ...validationErrors, confirmPassword: undefined });
                                                }
                                            }}
                                            className={`password-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                                            placeholder={t('settingsPage.profile.security.confirmPasswordPlaceholder')}
                                            disabled={isPasswordLoading}
                                        />
                                        {validationErrors.confirmPassword && (
                                            <div className="error-message">{validationErrors.confirmPassword}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button 
                                    className="btn-save" 
                                    onClick={handlePasswordSave}
                                    disabled={isPasswordLoading}
                                >
                                    {isPasswordLoading ? (
                                        <span className="loading-spinner">⏳</span>
                                    ) : (
                                        t('settingsPage.profile.security.savePassword')
                                    )}
                                </button>
                                <button 
                                    className="btn-cancel" 
                                    onClick={handlePasswordCancel}
                                    disabled={isPasswordLoading}
                                >
                                    {t('settingsPage.profile.security.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Модальное окно подтверждения выхода */}
                {showLogoutConfirm && (
                    <div className="password-modal-overlay">
                        <div className="password-modal logout-confirm-modal">
                            <div className="modal-header">
                                <h3>{t('settingsPage.profile.security.logoutConfirmTitle')}</h3>
                            </div>
                            
                            <div className="modal-content">
                                <p className="logout-message">
                                    {t('settingsPage.profile.security.logoutConfirmMessage')}
                                </p>
                            </div>

                            <div className="modal-actions">
                                <button 
                                    className="btn-logout" 
                                    onClick={confirmLogout}
                                >
                                    {t('settingsPage.profile.security.confirmLogout')}
                                </button>
                                <button 
                                    className="btn-cancel" 
                                    onClick={() => setShowLogoutConfirm(false)}
                                >
                                    {t('settingsPage.profile.security.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ProfileSettings;
