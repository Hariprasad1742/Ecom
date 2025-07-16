import { useState, useEffect } from 'react';

export default function SubCategoryForm({ onSubmit, initialData, categoryId }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
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
    onSubmit(categoryId, formData);
    setFormData({ name: '', description: '', isActive: true });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <label>
        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
        Active
      </label>
      <button type="submit">{initialData ? 'Update' : 'Add'} SubCategory</button>
    </form>
  );
}
