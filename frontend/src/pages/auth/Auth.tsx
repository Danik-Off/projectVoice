import React, { useState } from 'react';
import './Auth.css'; // Добавьте файл стилей для оформления

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (event: { preventDefault: () => void }) => {
        event.preventDefault(); // Предотвращение перезагрузки страницы при отправке формы
        // Здесь можно добавить логику для аутентификации
        console.log(isLogin ? 'Logging in...' : 'Signing up...');
    };

    return (
        <div className="auth-container">
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={handleSubmit}>
                {isLogin ? (
                    <>
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit">Login</button>
                    </>
                ) : (
                    <>
                        <input type="text" placeholder="Username" required />
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit">Sign Up</button>
                    </>
                )}
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
            </button>
        </div>
    );
};

export default Auth;
