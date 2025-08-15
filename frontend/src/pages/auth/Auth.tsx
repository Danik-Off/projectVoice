import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import { themeStore } from '../../store/ThemeStore';
import Spinner from '../../components/spinner/Spinner';
import BlockedAccountModal from '../../components/BlockedAccountModal';
import './Auth.scss';
import LoginForm from './components/loginForm/LoginForm';
import RegisterForm from './components/registerForm/RegisterForm';
import { useTranslation } from 'react-i18next';

const AuthPage: React.FC = observer(() => {
    const [isLogin, setIsLogin] = useState(true);
    const [showBlockedModal, setShowBlockedModal] = useState(false);
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const redirect = searchParams.get('redirect');

    // Если пользователь уже авторизован, перенаправляем его
    useEffect(() => {
        if (authStore.isAuthenticated) {
            if (redirect) {
                navigate(redirect);
            } else {
                navigate('/');
            }
        }
    }, [redirect, navigate]);

    // Проверяем, заблокирован ли аккаунт
    useEffect(() => {
        if (authStore.user && !authStore.user.isActive) {
            setShowBlockedModal(true);
        }
    }, []);

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'ru' : 'en'; // Переключение между английским и русским
        i18n.changeLanguage(newLanguage);
    };

    return (
        <div className={`auth-container theme-${themeStore.currentTheme}`}>
            {authStore.loading && (
                <div className="spinner-container">
                    <Spinner />
                </div>
            )}
            
            {/* Анимированный фон */}
            <div className="auth-background">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                    <div className="shape shape-5"></div>
                </div>
            </div>

            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="logo">
                            <div className="logo-icon">🎙️</div>
                            <h1 className="logo-text">ProjectVoice</h1>
                        </div>
                        <h2 className="auth-title">{isLogin ? t('authPage.welcomeBack') : t('authPage.createAccount')}</h2>
                        <p className="auth-subtitle">
                            {isLogin ? t('authPage.loginSubtitle') : t('authPage.registerSubtitle')}
                        </p>
                    </div>

                    <div className="auth-form-container">
                        {isLogin ? <LoginForm /> : <RegisterForm />}
                    </div>

                    <div className="auth-footer">
                        <p className="auth-switch">
                            {isLogin ? t('authPage.needAccount') : t('authPage.alreadyHaveAccount')}{' '}
                            <button 
                                type="button" 
                                className="switch-button"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? t('authPage.signUp') : t('authPage.login')}
                            </button>
                        </p>

                        <div className="auth-footer-controls">
                            <button onClick={toggleLanguage} className="language-toggle">
                                <span className="language-icon">🌐</span>
                                {i18n.language === 'en' ? 'Русский' : 'English'}
                            </button>
                            
                            <button 
                                onClick={() => themeStore.toggleTheme()} 
                                className="theme-toggle"
                                title={t('common.toggleTheme')}
                            >
                                <span className="theme-icon">
                                    {themeStore.currentTheme === 'dark' ? '☀️' : '🌙'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно заблокированного аккаунта */}
            <BlockedAccountModal
                isOpen={showBlockedModal}
                onClose={() => {
                    setShowBlockedModal(false);
                    authStore.logout();
                }}
                reason={authStore.user?.blockReason}
                blockedAt={authStore.user?.blockedAt}
                blockedBy={authStore.user?.blockedBy}
            />
        </div>
    );
});

export default AuthPage;
