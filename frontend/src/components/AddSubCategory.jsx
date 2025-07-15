import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddSubCategory() {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/subcategories', { name, category: categoryId });
      alert('SubCategory added');
      setName('');
      setCategoryId('');
    } catch (err) {
      console.error(err);
      alert('Error adding subcategory');
    }
  };

  return (
    <div>
      <h2>Add SubCategory</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required /><br/>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select><br/>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
