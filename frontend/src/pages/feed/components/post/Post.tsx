const Post = ({ username, content }: any) => (
    <div className="post">
        <div className="post-header">
            <div className="username">{username}</div>
            <div className="post-timestamp">2 mins ago</div> {/* Mock timestamp */}
        </div>
        <p>{content}</p>
        <div className="post-actions">
            <button className="action-button">Like</button>
            <button className="action-button">Comment</button>
            <button className="action-button">Share</button>
        </div>
    </div>
);
export default Post;
