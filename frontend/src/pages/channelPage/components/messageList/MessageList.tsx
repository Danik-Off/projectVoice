import './MessageList.css'; // Assuming you have a separate CSS file for styling

const MessageList = () => {
    return (
        <main className="content">
            <div className="message-list">
                <p className="message"><strong>User1:</strong> Hello everyone!</p>
                <p className="message"><strong>User2:</strong> How's it going?</p>
                {/* Add more messages as needed */}
            </div>
        </main>
    );
};

export default MessageList;
