// components/BrandForm.js
import { useState, useEffect } from 'react';

export default function BrandForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    subCategory: '',
    logo_url: '',
    website_url: '',
    is_active: true,
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        subCategory: initialData.subCategory?._id || initialData.subCategory || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      subCategory: typeof formData.subCategory === 'object' ? formData.subCategory._id : formData.subCategory
    };
    onSubmit(data);
    setFormData({
      name: '', slug: '', description: '', subCategory: '',
      logo_url: '', website_url: '', is_active: true,
      meta_title: '', meta_description: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Brand Name" required />
      <input name="slug" value={formData.slug} onChange={handleChange} placeholder="Slug" required />
      <input name="subCategory" value={formData.subCategory} onChange={handleChange} placeholder="SubCategory ID" required />
      <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <input name="logo_url" value={formData.logo_url} onChange={handleChange} placeholder="Logo URL" />
      <input name="website_url" value={formData.website_url} onChange={handleChange} placeholder="Website URL" />
      <input name="meta_title" value={formData.meta_title} onChange={handleChange} placeholder="Meta Title" />
      <input name="meta_description" value={formData.meta_description} onChange={handleChange} placeholder="Meta Description" />
      <label>
        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
        Active
      </label>
      <button type="submit">{initialData ? 'Update' : 'Add'} Brand</button>
    </form>
  );
}
