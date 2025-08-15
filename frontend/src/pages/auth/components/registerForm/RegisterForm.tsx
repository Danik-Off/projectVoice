// RegisterForm.tsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authStore } from '../../../../store/authStore';
import { useTranslation } from 'react-i18next';
import notificationStore from '../../../../store/NotificationStore';
import './RegisterForm.scss';

const RegisterForm: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState<{[key: string]: boolean}>({});

    // Валидация формы
    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};

        // Валидация имени пользователя
        if (!formData.username.trim()) {
            newErrors.username = t('authPage.validation.usernameRequired');
        } else if (formData.username.length < 3) {
            newErrors.username = t('authPage.validation.usernameMinLength');
        } else if (formData.username.length > 20) {
            newErrors.username = t('authPage.validation.usernameMaxLength');
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = t('authPage.validation.usernameInvalid');
        }

        // Валидация email
        if (!formData.email.trim()) {
            newErrors.email = t('authPage.validation.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('authPage.validation.emailInvalid');
        }

        // Валидация пароля
        if (!formData.password) {
            newErrors.password = t('authPage.validation.passwordRequired');
        } else if (formData.password.length < 6) {
            newErrors.password = t('authPage.validation.passwordMinLength');
        } else if (formData.password.length > 50) {
            newErrors.password = t('authPage.validation.passwordMaxLength');
        }

        // Валидация подтверждения пароля
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('authPage.validation.confirmPasswordRequired');
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('authPage.validation.passwordsDoNotMatch');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработка изменения полей
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Очищаем ошибку при вводе
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Обработка потери фокуса
    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    // Функции для оценки силы пароля
    const getPasswordStrength = (password: string): string => {
        if (password.length < 6) return 'weak';
        if (password.length < 10) return 'medium';
        if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
            return 'strong';
        }
        return 'medium';
    };

    const getPasswordStrengthPercentage = (password: string): number => {
        if (password.length < 6) return 25;
        if (password.length < 10) return 50;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
            return 100;
        }
        return 75;
    };

    const getPasswordStrengthText = (password: string): string => {
        const strength = getPasswordStrength(password);
        switch (strength) {
            case 'weak': return t('authPage.passwordStrength.weak');
            case 'medium': return t('authPage.passwordStrength.medium');
            case 'strong': return t('authPage.passwordStrength.strong');
            default: return '';
        }
    };

    // Обработка отправки формы
    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (isSubmitting) return; // Защита от повторной отправки
        
        // Валидация формы
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            await authStore.register(formData.username, formData.email, formData.password, redirect);
            notificationStore.addNotification(t('authPage.messages.registrationSuccess'), 'success');
        } catch (error) {
            console.error('Registration failed:', error);
            if (error instanceof Error) {
                try {
                    const errorData = JSON.parse(error.message);
                    notificationStore.addNotification(errorData.error || t('authPage.messages.registrationError'), 'error');
                } catch {
                    notificationStore.addNotification(error.message || t('authPage.messages.registrationError'), 'error');
                }
            } else {
                notificationStore.addNotification(t('authPage.messages.registrationError'), 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleRegister} className="auth-form">
            <div className="input-group">
                <input 
                    type="text" 
                    name="username" 
                    placeholder={t('authPage.username')} 
                    className={`auth-input ${errors.username && touched.username ? 'auth-input--error' : ''}`}
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onBlur={() => handleBlur('username')}
                    required 
                    maxLength={20}
                />
                {errors.username && touched.username && (
                    <div className="auth-error">
                        {errors.username}
                    </div>
                )}
            </div>

            <div className="input-group">
                <input 
                    type="email" 
                    name="email" 
                    placeholder={t('authPage.email')} 
                    className={`auth-input ${errors.email && touched.email ? 'auth-input--error' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    required 
                />
                {errors.email && touched.email && (
                    <div className="auth-error">
                        {errors.email}
                    </div>
                )}
            </div>

            <div className="input-group">
                <input 
                    type="password" 
                    name="password" 
                    placeholder={t('authPage.password')} 
                    className={`auth-input ${errors.password && touched.password ? 'auth-input--error' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    required 
                    maxLength={50}
                />
                {errors.password && touched.password && (
                    <div className="auth-error">
                        {errors.password}
                    </div>
                )}
            </div>

            <div className="input-group">
                <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder={t('authPage.confirmPassword')} 
                    className={`auth-input ${errors.confirmPassword && touched.confirmPassword ? 'auth-input--error' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    required 
                    maxLength={50}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                    <div className="auth-error">
                        {errors.confirmPassword}
                    </div>
                )}
            </div>

            <button 
                type="submit" 
                className={`auth-button ${isSubmitting ? 'auth-button--loading' : ''}`}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="spinner"></span>
                        {t('authPage.registerButton.loading')}
                    </>
                ) : (
                    t('authPage.signUp')
                )}
            </button>

            {/* Индикатор силы пароля */}
            {formData.password && (
                <div className="password-strength">
                    <div className="strength-bar">
                        <div 
                            className={`strength-fill ${getPasswordStrength(formData.password)}`}
                            style={{ width: `${getPasswordStrengthPercentage(formData.password)}%` }}
                        ></div>
                    </div>
                    <span className="strength-text">
                        {getPasswordStrengthText(formData.password)}
                    </span>
                </div>
            )}
        </form>
    );
};

export default RegisterForm;
