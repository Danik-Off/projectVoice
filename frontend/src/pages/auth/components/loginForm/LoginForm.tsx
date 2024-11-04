// LoginForm.tsx
import React from 'react';
import { authStore } from '../../../../store/authStore';

const LoginForm: React.FC = () => {
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
            <input type="email" name="email" placeholder="Email" className="auth-input" required />
            <input type="password" name="password" placeholder="Password" className="auth-input" required />
            <button type="submit" className="auth-button">
                Login
            </button>
        </form>
    );
};

export default LoginForm;
