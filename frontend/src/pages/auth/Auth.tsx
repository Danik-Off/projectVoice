import React, { useState } from 'react';
import './Auth.css';
import { authStore } from '../../store/authStore';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const formData = event.currentTarget.elements as typeof event.currentTarget.elements & {
            email: HTMLInputElement;
            password: HTMLInputElement;
            username?: HTMLInputElement;
        };

        const email = formData.email.value;
        const password = formData.password.value;
        const username = isLogin ? undefined : formData.username?.value;

        if (isLogin) {
            authStore.login(email, password);
        } else {
            authStore.register(username || '', email, password);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">{isLogin ? 'Welcome back!' : 'Create an account'}</h1>
                <form onSubmit={handleLogin}>
                    {!isLogin && (
                        <input type="text" name="username" placeholder="Username" className="auth-input" required />
                    )}
                    <input type="email" name="email" placeholder="Email" className="auth-input" required />
                    <input type="password" name="password" placeholder="Password" className="auth-input" required />
                    <button type="submit" className="auth-button">{isLogin ? 'Login' : 'Sign Up'}</button>
                </form>
                <p className="auth-switch">
                    {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
                    <a href={isLogin ? '#register' : '#login'} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Auth;
