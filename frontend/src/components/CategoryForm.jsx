import { useState, useEffect } from 'react';

export default function CategoryForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', description: '', isActive: true });
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <label>
        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
        Active
      </label>
      <button type="submit">{initialData ? 'Update' : 'Add'} Category</button>
    </form>
  );
}
