import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [price, setPrice] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/subcategories')
      .then(res => setSubCategories(res.data))
      .catch(err => console.error(err));
    axios.get('http://localhost:5000/api/brands')
      .then(res => setBrands(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', { name, subCategory: subCategoryId, brand: brandId, price });
      alert('Product added');
      setName('');
      setPrice('');
      setSubCategoryId('');
      setBrandId('');
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required /><br/>
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required /><br/>
        <select value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)} required>
          <option value="">Select SubCategory</option>
          {subCategories.map(sub => (
            <option key={sub._id} value={sub._id}>{sub.name}</option>
          ))}
        </select><br/>
        <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
          <option value="">Select Brand</option>
          {brands.map(b => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select><br/>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
