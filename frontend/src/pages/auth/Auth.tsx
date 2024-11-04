/* eslint-disable jsx-a11y/anchor-is-valid */
// AuthPage.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { authStore } from '../../store/authStore';
import Spinner from '../../components/spinner/Spinner';
import './Auth.css';
import LoginForm from './components/loginForm/LoginForm';
import RegisterForm from './components/registerForm/RegisterForm';

const AuthPage: React.FC = observer(() => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-container">
            {authStore.loading && (
                <div className="spinner-conteiner">
                    <Spinner />
                </div>
            )}
            <div className="auth-box">
                <h1 className="auth-title">{isLogin ? 'Welcome back!' : 'Create an account'}</h1>
                {isLogin ? <LoginForm /> : <RegisterForm />}
                <p className="auth-switch">
                    {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
                    <a onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign Up' : 'Login'}</a>
                </p>
            </div>
        </div>
    );
});

export default AuthPage;
