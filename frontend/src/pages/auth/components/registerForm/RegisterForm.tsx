// RegisterForm.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { authStore } from '../../../../store/authStore';

const RegisterForm: React.FC = () => {
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
        <form onSubmit={handleRegister}>
            <input type="text" name="username" placeholder="Username" className="auth-input" required />
            <input type="email" name="email" placeholder="Email" className="auth-input" required />
            <input type="password" name="password" placeholder="Password" className="auth-input" required />
            <button type="submit" className="auth-button">
                Sign Up
            </button>
        </form>
    );
};

export default RegisterForm;
