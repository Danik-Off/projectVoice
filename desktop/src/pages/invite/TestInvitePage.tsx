import React from 'react';
import { useParams } from 'react-router-dom';

const TestInvitePage: React.FC = () => {
    const { token } = useParams<{ token: string }>();

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <h1>Test Invite Page</h1>
            <p>Token: {token}</p>
            <p>This is a test page to verify routing works.</p>
        </div>
    );
};

export default TestInvitePage; 