// RegisterForm.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { authStore } from '../../../../store/authStore';
import { useTranslation } from 'react-i18next';

const RegisterForm: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = event.currentTarget.elements as typeof event.currentTarget.elements & {
            username: HTMLInputElement;
            email: HTMLInputElement;
            password: HTMLInputElement;
        };

        const username = formData.username.value;
        const email = formData.email.value;
        const password = formData.password.value;

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
                    required 
                />
            </div>
            <button type="submit" className="auth-button">
                {t('authPage.signUp')}
            </button>
        </form>
    );
};

export default RegisterForm;
