import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import ProductForm from '../components/ProductForm';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const handleCreateOrUpdate = async (data) => {
    if (editData) {
      await updateProduct(editData._id, data);
      setEditData(null);
    } else {
      await createProduct(data);
    }
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Product Management</h2>
      <ProductForm onSubmit={handleCreateOrUpdate} initialData={editData} />
      <ul>
        {products.map(prod => (
          <li key={prod._id}>
            <b>{prod.name}</b> — ₹{prod.price} — {prod.inStock ? '✅' : '❌'}
            <br />
            SubCategory: {prod.subCategory?.name || prod.subCategory} <br />
            Brand: {prod.brand?.name || prod.brand}
            <br />
            Variants: {prod.variants.map(v => `${v.name}: ${v.values.join(', ')}`).join(' | ')}
            <br />
            <button onClick={() => setEditData(prod)}>Edit</button>
            <button onClick={() => handleDelete(prod._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
