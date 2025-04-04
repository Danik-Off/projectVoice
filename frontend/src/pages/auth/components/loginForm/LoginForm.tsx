// LoginForm.tsx
import React from 'react';
import { authStore } from '../../../../store/authStore';
import { useTranslation } from 'react-i18next';

const LoginForm: React.FC = () => {
    const { t } = useTranslation();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = event.currentTarget.elements as typeof event.currentTarget.elements & {
            email: HTMLInputElement;
            password: HTMLInputElement;
        };

        const email = formData.email.value;
        const password = formData.password.value;

        authStore.login(email, password);
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" name="email" placeholder={t('authPage.email')} className="auth-input" required />
            <input
                type="password"
                name="password"
                placeholder={t('authPage.password')}
                className="auth-input"
                required
            />
            <button type="submit" className="auth-button">
            {t("authPage.btnLogin")}
            </button>
        </form>
    );
};

export default LoginForm;
