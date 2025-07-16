import { useEffect, useState } from 'react';
import { getProducts, getCategories, getSubCategories, getBrands } from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    brand: ''
  });

  useEffect(() => {
    getProducts().then(res => {
      setProducts(res.data);
      setAllProducts(res.data);
    });
    getCategories().then(res => setCategories(res.data));
    getSubCategories().then(res => setSubCategories(res.data));
    getBrands().then(res => setBrands(res.data));
  }, []);

  useEffect(() => {
  let filtered = allProducts;

  if (filters.brand) {
    filtered = filtered.filter(p => p.brand?._id === filters.brand);
  }

  if (filters.subCategory) {
    filtered = filtered.filter(p => p.subCategory?._id === filters.subCategory);
  }

  if (filters.category) {
    // Get all subcategory IDs that belong to this category
    const matchedSubCatIds = subCategories
      .filter(sc => sc.category === filters.category)
      .map(sc => sc._id);

    filtered = filtered.filter(p =>
      matchedSubCatIds.includes(p.subCategory?._id || p.subCategory)
    );
  }

  setProducts(filtered);
}, [filters, allProducts, subCategories]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>All Products</h2>

      <div style={{ marginBottom: '1rem' }}>
        <select name="category" onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <select name="subCategory" onChange={handleFilterChange}>
          <option value="">All SubCategories</option>
          {subCategories.map(sub => (
            <option key={sub._id} value={sub._id}>{sub.name}</option>
          ))}
        </select>

        <select name="brand" onChange={handleFilterChange}>
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand._id} value={brand._id}>{brand.name}</option>
          ))}
        </select>
      </div>

      {products.length === 0 ? <p>No products match filters.</p> : (
        <ul>
          {products.map(p => (
            <li key={p._id}>
              <strong>{p.name}</strong> - ₹{p.price}<br />
              Brand: {p.brand?.name || 'N/A'}<br />
              SubCategory: {p.subCategory?.name || 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
