import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get('/api/posts');
    setPosts(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);
    await axios.post('/api/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: localStorage.getItem('token') },
    });
    fetchPosts();
  };

  const handleEdit = async (id) => {
    await axios.put(`/api/posts/${id}`, { content: editContent }, { headers: { Authorization: localStorage.getItem('token') } });
    fetchPosts();
    setEditId(null);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/posts/${id}`, { headers: { Authorization: localStorage.getItem('token') } });
    fetchPosts();
  };

  const handleLike = async (id) => {
    await axios.post(`/api/posts/${id}/like`, {}, { headers: { Authorization: localStorage.getItem('token') } });
    fetchPosts();
  };

  const handleComment = async (id, text) => {
    await axios.post(`/api/posts/${id}/comment`, { text }, { headers: { Authorization: localStorage.getItem('token') } });
    fetchPosts();
  };

  return (
    <div>
      <form onSubmit={handleCreate}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Post</button>
      </form>
      {posts.map(post => (
        <div key={post._id}>
          <p>{post.user.username}: {post.content}</p>
          {post.image && <img src={post.image} alt="post" />}
          <button onClick={() => handleLike(post._id)}>Like ({post.likes.length})</button>
          {editId === post._id ? (
            <>
              <input value={editContent} onChange={(e) => setEditContent(e.target.value)} />
              <button onClick={() => handleEdit(post._id)}>Save</button>
            </>
          ) : (
            <button onClick={() => { setEditId(post._id); setEditContent(post.content); }}>Edit</button>
          )}
          <button onClick={() => handleDelete(post._id)}>Delete</button>
          <div>Comments:</div>
          {post.comments.map((c, i) => (
            <p key={i}>{c.user.username}: {c.text}</p>
          ))}
          <input id={`comment-${post._id}`} placeholder="Comment" />
          <button onClick={() => handleComment(post._id, document.getElementById(`comment-${post._id}`).value)}>Add Comment</button>
        </div>
      ))}
    </div>
  );
};

export default Posts;
