import React from 'react';

const Message = () => {
    return (
        <div>
            <h1>Messages</h1>
            <div className="message">
                <h3>Chat with User</h3>
                <p>Last message: Hello! How are you?</p>
            </div>
            <div className="message">
                <h3>Chat with Another User</h3>
                <p>Last message: Hey, what's up?</p>
            </div>
            {/* Add more chats */}
        </div>
    );
};

export default Message;
