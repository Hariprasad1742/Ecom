import { useEffect, useState } from 'react';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../services/api';
import BrandForm from '../components/BrandForm';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchBrands = async () => {
    try {
      const res = await getBrands();
      setBrands(res.data);
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    }
  };

  const handleCreateOrUpdate = async (data) => {
  const payload = {
    ...data,
    subCategory: typeof data.subCategory === 'object' ? data.subCategory._id : data.subCategory
  };

  if (editData) {
    await updateBrand(editData._id, payload);
    setEditData(null);
  } else {
    await createBrand(payload);
  }
  fetchBrands();
};


  const handleDelete = async (id) => {
    if (window.confirm('Delete this brand?')) {
      try {
        await deleteBrand(id);
        fetchBrands();
      } catch (err) {
        console.error('Failed to delete brand:', err);
      }
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div>
      <h2>Brand Management</h2>
      <BrandForm onSubmit={handleCreateOrUpdate} initialData={editData} />
      <ul>
        {brands.map(brand => (
          <li key={brand._id}>
            <strong>{brand.name}</strong> ({brand.slug}) — {brand.is_active ? '✅' : '❌'}<br />
            SubCategory: {brand.subCategory?.name || brand.subCategory}<br />
            <button onClick={() => setEditData(brand)}>Edit</button>
            <button onClick={() => handleDelete(brand._id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
