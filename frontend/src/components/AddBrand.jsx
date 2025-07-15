 import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddBrand() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/subcategories')
      .then(res => setSubCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/brands', { name, slug, subCategory: subCategoryId });
      alert('Brand added');
      setName('');
      setSlug('');
      setSubCategoryId('');
    } catch (err) {
      console.error(err);
      alert('Error adding brand');
    }
  };

  return (
    <div>
      <h2>Add Brand</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required /><br/>
        <input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required /><br/>
        <select value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)} required>
          <option value="">Select SubCategory</option>
          {subCategories.map(sub => (
            <option key={sub._id} value={sub._id}>{sub.name}</option>
          ))}
        </select><br/>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
