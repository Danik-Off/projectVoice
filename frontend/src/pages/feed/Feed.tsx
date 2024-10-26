// Feed.js

import React, { useState } from 'react';
import './Feed.css';
import Post from './components/post/Post';

// Mock data for posts
const mockPosts = [
    {
        id: 1,
        username: 'user1',
        content: 'This is the first post!',
    },
    {
        id: 2,
        username: 'user2',
        content: 'Hello, world! This is my second post.',
    },
    {
        id: 3,
        username: 'user3',
        content: 'Loving this platform! Can’t wait to share more.',
    },
];

const Feed = () => {
    const [posts] = useState(mockPosts);//, setPosts
    
    return (
        <div className="feed">
            <div className="feed-header">
                <h2>Новое</h2>
            </div>
            <div className="post-list">
                {posts.map((post) => (
                    <Post key={post.id} username={post.username} content={post.content} />
                ))}
            </div>
        </div>
    );
};

export default Feed;
