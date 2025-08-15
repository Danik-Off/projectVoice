// RegisterForm.tsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authStore } from '../../../../store/authStore';
import { useTranslation } from 'react-i18next';

const RegisterForm: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            setPasswordError(t('authPage.passwordsMismatch'));
            return;
        }
        
        if (password.length < 6) {
            setPasswordError(t('authPage.passwordTooShort'));
            return;
        }
        
        setPasswordError('');
        
        const formData = event.currentTarget.elements as typeof event.currentTarget.elements & {
            username: HTMLInputElement;
            email: HTMLInputElement;
            password: HTMLInputElement;
            confirmPassword: HTMLInputElement;
        };

        const username = formData.username.value;
        const email = formData.email.value;

        authStore.register(username, email, password, redirect);
    };

    return (
        <form onSubmit={handleRegister} className="auth-form">
            <div className="input-group">
                <input 
                    type="text" 
                    name="username" 
                    placeholder={t('authPage.username')} 
                    className="auth-input" 
                    required 
                />
            </div>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
            </div>
            <div className="input-group">
                <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder={t('authPage.confirmPassword')} 
                    className={`auth-input ${passwordError ? 'auth-input--error' : ''}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                />
                {passwordError && (
                    <div className="auth-error">
                        {passwordError}
                    </div>
                )}
            </div>
            <button type="submit" className="auth-button">
                {t('authPage.signUp')}
            </button>
        </form>
    );
};

export default RegisterForm;
