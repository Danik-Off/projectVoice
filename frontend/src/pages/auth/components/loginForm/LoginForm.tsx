// LoginForm.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { authStore } from '../../../../store/authStore';
import { useTranslation } from 'react-i18next';

const LoginForm: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = event.currentTarget.elements as typeof event.currentTarget.elements & {
            email: HTMLInputElement;
            password: HTMLInputElement;
        };

        const email = formData.email.value;
        const password = formData.password.value;

        authStore.login(email, password, redirect);
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
            <button type="submit" className="auth-button">
                {t("authPage.btnLogin")}
            </button>
        </form>
    );
};

export default LoginForm;
