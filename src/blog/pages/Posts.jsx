function PostCard({ post, currentUser, onRefresh }) {
  const [liked, setLiked] = useState(post.likes.some(id => id === currentUser?.profile?.sub));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [commentText, setCommentText] = useState("");

  const toggleLike = async () => {
    await api.post(`/posts/${post._id}/like`);
    // Optimistic update
    setLiked(v => !v);
    setLikesCount(c => (liked ? c - 1 : c + 1));
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    await api.post(`/posts/${post._id}/comments`, { text: commentText });
    setCommentText("");
    onRefresh();
  };

  return (
    <div className="p-4 bg-white rounded">
      <div className="flex items-start gap-3">
        <img src={post.author.avatarUrl || "/default-avatar.png"} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="flex justify-between">
            <div>{post.author.username || post.author.phone}</div>
            <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
          </div>
          <h3 className="font-semibold">{post.title}</h3>
          <p className="text-gray-600">{post.body}</p>

          <div className="flex items-center gap-3 mt-3">
            <button onClick={toggleLike} className={`px-2 py-1 rounded ${liked ? "bg-blue-600 text-white":"bg-gray-100"}`}>♥ {likesCount}</button>
            <button onClick={() => { /* open comment UI */ }} className="px-2 py-1 rounded bg-gray-100">Comment</button>
          </div>

          <div className="mt-3">
            <input placeholder="Add comment..." value={commentText} onChange={(e)=>setCommentText(e.target.value)} />
            <button onClick={addComment} className="ml-2">Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
