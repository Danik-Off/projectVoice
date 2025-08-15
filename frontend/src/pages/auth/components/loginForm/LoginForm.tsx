// LoginForm.tsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authStore } from '../../../../store/authStore';
import { useTranslation } from 'react-i18next';
import notificationStore from '../../../../store/NotificationStore';

const LoginForm: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (isSubmitting) return; // Защита от повторной отправки
        
        const formData = event.currentTarget.elements as typeof event.currentTarget.elements & {
            email: HTMLInputElement;
            password: HTMLInputElement;
        };

        const email = formData.email.value;
        const password = formData.password.value;

        setIsSubmitting(true);
        
        try {
            await authStore.login(email, password, redirect);
        } catch (error) {
            console.error('Login failed:', error);
            if (error instanceof Error) {
                try {
                    const errorData = JSON.parse(error.message);
                    notificationStore.addNotification(errorData.error || t('authPage.messages.loginError'), 'error');
                } catch {
                    notificationStore.addNotification(error.message || t('authPage.messages.loginError'), 'error');
                }
            } else {
                notificationStore.addNotification(t('authPage.messages.loginError'), 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
                <input 
                    type="email" 
                    name="email" 
                    placeholder={t('authPage.email')} 
                    className="auth-input" 
                    required 
                />
            </div>
            <div className="input-group">
                <input
                    type="password"
                    name="password"
                    placeholder={t('authPage.password')}
                    className="auth-input"
                    required
                />
            </div>
            <button 
                type="submit" 
                className={`auth-button ${isSubmitting ? 'auth-button--loading' : ''}`}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="spinner"></span>
                        {t('authPage.loginButton.loading')}
                    </>
                ) : (
                    t("authPage.btnLogin")
                )}
            </button>
        </form>
    );
};

export default LoginForm;
