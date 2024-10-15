import React, { useState } from 'react';
import './Auth.css'; // Добавьте файл стилей для оформления
import { authStore } from '../../store/authStore';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleLogin = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault(); // Предотвратить перезагрузку страницы
        const formData = event.currentTarget.elements as typeof event.currentTarget.elements & {
            email: HTMLInputElement;
            password: HTMLInputElement;
            username?: HTMLInputElement; // Для регистрации
        };

        const email = formData.email.value;
        const password = formData.password.value;
        const username = isLogin ? undefined : formData.username?.value; // Проверка для регистрации

        if (isLogin) {
            // Обработка логина
            console.log("🚀 ~ handleLogin ~ Email:", email, "Password:", password);
            authStore.login(email, password);
        } else {
            // Обработка регистрации
            console.log("🚀 ~ handleLogin ~ Username:", username, "Email:", email, "Password:", password);
            // authStore.register(username, email, password); // Реализуйте эту функцию в authStore
        }
    };

    return (
        <div className="auth-container">
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={handleLogin}>
                {isLogin ? (
                    <>
                        <input type="email" name="email" placeholder="Email" required />
                        <input type="password" name="password" placeholder="Password" required />
                        <button type="submit">Login</button>
                    </>
                ) : (
                    <>
                        <input type="text" name="username" placeholder="Username" required />
                        <input type="email" name="email" placeholder="Email" required />
                        <input type="password" name="password" placeholder="Password" required />
                        <button type="submit">Sign Up</button>
                    </>
                )}
            </form>
            <br />
            <a href={isLogin ? '#login' : '#register'} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
            </a>
        </div>
    );
};

export default Auth;
