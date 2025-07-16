import { useState, useEffect } from 'react';
import { getSubCategories, getBrands } from '../services/api';

export default function ProductForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    subCategory: '',
    brand: '',
    price: '',
    description: '',
    inStock: true,
    variants: []
  });

  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    if (initialData) setFormData(initialData);

    const fetchOptions = async () => {
      const [subs, brs] = await Promise.all([getSubCategories(), getBrands()]);
      setSubCategories(subs.data);
      setBrands(brs.data);
    };
    fetchOptions();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVariantChange = (index, key, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][key] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: '', values: '' }]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedVariants = formData.variants.map(v => ({
      name: v.name,
      values: v.values.split(',').map(val => val.trim())
    }));
    onSubmit({ ...formData, variants: formattedVariants });
    setFormData({
      name: '',
      subCategory: '',
      brand: '',
      price: '',
      description: '',
      inStock: true,
      variants: []
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required />
      
      <select name="subCategory" value={formData.subCategory} onChange={handleChange} required>
        <option value="">Select SubCategory</option>
        {subCategories.map(sub => (
          <option key={sub._id} value={sub._id}>{sub.name}</option>
        ))}
      </select>

      <select name="brand" value={formData.brand} onChange={handleChange} required>
        <option value="">Select Brand</option>
        {brands.map(brand => (
          <option key={brand._id} value={brand._id}>{brand.name}</option>
        ))}
      </select>

      <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />

      <label>
        <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} />
        In Stock
      </label>

      <h4>Variants</h4>
      {formData.variants.map((variant, idx) => (
        <div key={idx}>
          <input
            placeholder="Variant Name"
            value={variant.name}
            onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
          />
          <input
            placeholder="Values (comma separated)"
            value={variant.values}
            onChange={(e) => handleVariantChange(idx, 'values', e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addVariant}>+ Add Variant</button>

      <button type="submit">{initialData ? 'Update' : 'Add'} Product</button>
    </form>
  );
}
