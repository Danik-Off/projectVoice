import React, { useState } from 'react';
import './Feed.css';

const Feed = () => {
    // Пример данных твитов
    const [tweets, setTweets] = useState([
        {
            id: 1,
            userName: 'User One',
            content: 'This is a tweet content...',
            likes: 5,
            avatar: '/path/to/avatar1.jpg',
            comments: [
                { id: 1, userName: 'Commenter One', text: 'Great tweet!', avatar: '/path/to/commenter1.jpg' },
                {
                    id: 2,
                    userName: 'Commenter Two',
                    text: 'Thanks for sharing!',
                    avatar: '/path/to/commenter2.jpg',
                },
            ],
        },
        {
            id: 2,
            userName: 'User Two',
            content: 'This is another tweet content...',
            likes: 8,
            avatar: '/path/to/avatar2.jpg',
            comments: [
                {
                    id: 1,
                    userName: 'Commenter Three',
                    text: 'Interesting point of view!',
                    avatar: '/path/to/commenter3.jpg',
                },
            ],
        },
    ]);

    const [newComment, setNewComment] = useState('');
    const [newTweet, setNewTweet] = useState(''); // Состояние для нового твита
    const [expandedTweets, setExpandedTweets] = useState<{ [key: number]: boolean }>({}); // Состояние для отслеживания открытых твитов

    const handleLike = (id: number) => {
        setTweets((prevTweets) =>
            prevTweets.map((tweet) => (tweet.id === id ? { ...tweet, likes: tweet.likes + 1 } : tweet))
        );
    };

    const handleCommentChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setNewComment(event.target.value);
    };

    const handleTweetChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setNewTweet(event.target.value);
    };

    const handleCommentSubmit = (tweetId: number) => {
        if (newComment.trim()) {
            setTweets((prevTweets) =>
                prevTweets.map((tweet) =>
                    tweet.id === tweetId
                        ? {
                              ...tweet,
                              comments: [
                                  ...tweet.comments,
                                  {
                                      id: Date.now(),
                                      userName: 'Current User',
                                      text: newComment,
                                      avatar: '/path/to/current_user_avatar.jpg',
                                  },
                              ],
                          }
                        : tweet
                )
            );
            setNewComment(''); // Сброс поля ввода
        }
    };

    const handleTweetSubmit = () => {
        if (newTweet.trim()) {
            setTweets((prevTweets) => [
                ...prevTweets,
                {
                    id: Date.now(),
                    userName: 'Current User',
                    content: newTweet,
                    likes: 0,
                    avatar: '/path/to/current_user_avatar.jpg',
                    comments: [],
                },
            ]);
            setNewTweet(''); // Сброс поля ввода
        }
    };

    const handleShare = (id: number) => {
        alert(`Share tweet ID: ${id}`); // Здесь можно добавить логику для дележа
    };

    const toggleComments = (tweetId: number) => {
        setExpandedTweets((prev) => ({
            ...prev,
            [tweetId]: !prev[tweetId],
        }));
    };

    return (
        <div className="feed-container">
            <h1>Home Feed</h1>

            {/* Форма для создания нового твита */}
            <div className="new-tweet-container">
                <textarea
                    value={newTweet}
                    onChange={handleTweetChange}
                    placeholder="What's happening?"
                    className="new-tweet-input"
                />
                <button className="tweet-button" onClick={handleTweetSubmit}>
                    Post Tweet
                </button>
            </div>

            {tweets.map((tweet) => (
                <div key={tweet.id} className="tweet">
                    <div className="tweet-header">
                        <img alt={tweet.userName} src={tweet.avatar} className="tweet-avatar" />
                        <div className="tweet-content">
                            <h2 className="tweet-title">{tweet.userName}</h2>
                            <p className="tweet-text">{tweet.content}</p>
                            <div className="tweet-actions">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <button onClick={() => handleLike(tweet.id)} style={{ marginRight: '5px' }}>
                                        👍
                                    </button>
                                    <span>{tweet.likes}</span>
                                </div>
                                <button onClick={() => toggleComments(tweet.id)}>
                                    {expandedTweets[tweet.id] ? 'Hide comments' : 'Show comments'}
                                </button>
                                <button onClick={() => handleShare(tweet.id)}>🔗</button>
                            </div>
                            {/* Комментарии */}
                            <div className="comment-section">
                                <h3>Comments:</h3>
                                {tweet.comments.length > 0 && (
                                    <div>
                                        {tweet.comments.slice(-1).map((comment) => ( // Отображение только последнего комментария
                                            <div key={comment.id} className="comment">
                                                <img
                                                    alt={comment.userName}
                                                    src={comment.avatar}
                                                    className="comment-avatar"
                                                />
                                                <div>
                                                    <strong>{comment.userName}</strong>
                                                    <p>{comment.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {expandedTweets[tweet.id] && (
                                            <div>
                                                {tweet.comments.slice(0, tweet.comments.length - 1).map((comment) => ( // Отображение остальных комментариев при открытии
                                                    <div key={comment.id} className="comment">
                                                        <img
                                                            alt={comment.userName}
                                                            src={comment.avatar}
                                                            className="comment-avatar"
                                                        />
                                                        <div>
                                                            <strong>{comment.userName}</strong>
                                                            <p>{comment.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="comment-input-container">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={handleCommentChange}
                                    placeholder="Add a comment..."
                                    className="comment-input"
                                />
                                <button className="comment-button" onClick={() => handleCommentSubmit(tweet.id)}>
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Feed;
