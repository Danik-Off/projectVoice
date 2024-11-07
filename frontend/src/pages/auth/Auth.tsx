import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { authStore } from '../../store/authStore';
import Spinner from '../../components/spinner/Spinner';
import './Auth.scss';
import LoginForm from './components/loginForm/LoginForm';
import RegisterForm from './components/registerForm/RegisterForm';
import { useTranslation } from 'react-i18next';

const AuthPage: React.FC = observer(() => {
    const [isLogin, setIsLogin] = useState(true);
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'ru' : 'en'; // Переключение между английским и русским
        i18n.changeLanguage(newLanguage);
    };

    return (
        <div className="auth-container">
            {authStore.loading && (
                <div className="spinner-container">
                    <Spinner />
                </div>
            )}
            <div className="auth-box">
                <h1 className="auth-title">{isLogin ? t('authPage.welcomeBack') : t('authPage.createAccount')}</h1>
                {isLogin ? <LoginForm /> : <RegisterForm />}
                <p className="auth-switch">
                    {isLogin ? t('authPage.needAccount') : t('authPage.alreadyHaveAccount')}{' '}
                    <a onClick={() => setIsLogin(!isLogin)}>{isLogin ? t('authPage.signUp') : t('authPage.login')}</a>
                </p>

                {/* Кнопка для переключения языка */}
                <button onClick={toggleLanguage} className="language-toggle">
                    {i18n.language === 'en' ? 'Русский' : 'English'}
                </button>
            </div>
        </div>
    );
});

export default AuthPage;
