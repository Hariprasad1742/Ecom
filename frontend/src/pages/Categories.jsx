import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import CategoryForm from '../components/CategoryForm';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleCreateOrUpdate = async (data) => {
    if (editData) {
      await updateCategory(editData._id, data);
      setEditData(null);
    } else {
      await createCategory(data);
    }
    await fetchCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      await deleteCategory(id);
      await fetchCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Category Management</h2>
      <CategoryForm onSubmit={handleCreateOrUpdate} initialData={editData} />
      <ul>
        {categories.map(cat => (
          <li key={cat._id}>
            {cat.name} - {cat.description} - {cat.isActive ? '✅' : '❌'}
            <button onClick={() => setEditData(cat)}>Edit</button>
            <button onClick={() => handleDelete(cat._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
