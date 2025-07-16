import { useEffect, useState } from 'react';
import {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getCategories,
} from '../services/api';
import SubCategoryForm from '../components/SubCategoryForm';

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editData, setEditData] = useState(null);

  const fetchSubCategories = async () => {
    const res = await getSubCategories();
    setSubCategories(res.data);
  };

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
    if (res.data.length) setSelectedCategory(res.data[0]._id);
  };

  const handleCreateOrUpdate = async (categoryId, data) => {
    if (editData) {
      await updateSubCategory(editData._id, data);
      setEditData(null);
    } else {
      await createSubCategory(categoryId, data);
    }
    fetchSubCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this subcategory?')) {
      await deleteSubCategory(id);
      fetchSubCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  return (
    <div>
      <h2>SubCategory Management</h2>

      <label>
        Select Category:
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </label>

      <SubCategoryForm
        categoryId={selectedCategory}
        onSubmit={handleCreateOrUpdate}
        initialData={editData}
      />

      <ul>
        {subCategories.map(sub => (
          <li key={sub._id}>
            {sub.name} - {sub.description} - {sub.isActive ? '✅' : '❌'} - ({sub.category?.name})
            <button onClick={() => setEditData(sub)}>Edit</button>
            <button onClick={() => handleDelete(sub._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
