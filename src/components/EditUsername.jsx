import React, { useState } from 'react';
import axios from 'axios';

const EditUsername = () => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put('/api/auth/username', { username }, { headers: { Authorization: localStorage.getItem('token') } });
    alert('Updated');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="New Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditUsername;
