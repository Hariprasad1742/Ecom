import React, { useState } from 'react';
import axios from 'axios';

export default function AddCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/categories', { name, description });
      alert('Category added');
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
      alert('Error adding category');
    }
  };

  return (
    <div>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required /><br/>
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br/>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
