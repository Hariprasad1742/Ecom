import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminComponents.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingVariantsProduct, setEditingVariantsProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subCategory: '',
    brand: '',
    price: '',
    description: '',
    inStock: true
  });
  const [variantsData, setVariantsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const API_BASE = 'http://localhost:3000/api';

  useEffect(() => {
    fetchProducts();
    fetchSubCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/products`);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/subcategories`);
      setSubCategories(response.data.filter(sub => sub.isActive));
    } catch (err) {
      console.error('Failed to fetch subcategories:', err);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_BASE}/brands`);
      setBrands(response.data.filter(brand => brand.isActive));
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    }
  };

  const filterBrandsBySubCategory = (subCategoryId) => {
    if (!subCategoryId) {
      setFilteredBrands([]);
      return;
    }
    const filtered = brands.filter(brand => 
      brand.subCategory === subCategoryId || 
      (brand.subCategory && brand.subCategory._id === subCategoryId)
    );
    setFilteredBrands(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      if (editingProduct) {
        await axios.put(`${API_BASE}/products/${editingProduct._id}`, productData);
      } else {
        await axios.post(`${API_BASE}/products`, productData);
      }
      await fetchProducts();
      resetForm();
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const subCategoryId = product.subCategory._id || product.subCategory;
    setFormData({
      name: product.name,
      subCategory: subCategoryId,
      brand: product.brand?._id || product.brand || '',
      price: product.price.toString(),
      description: product.description || '',
      inStock: product.inStock
    });
    // Filter brands based on the product's subcategory
    filterBrandsBySubCategory(subCategoryId);
    setShowForm(true);
  };

  const handleEditVariants = (product) => {
    setEditingVariantsProduct(product);
    setVariantsData(product.variants || []);
    setShowVariantsModal(true);
  };

  const handleSaveVariants = async () => {
    try {
      setLoading(true);
      const productData = {
        ...editingVariantsProduct,
        variants: variantsData
      };
      await axios.put(`${API_BASE}/products/${editingVariantsProduct._id}`, productData);
      await fetchProducts();
      resetVariantsForm();
    } catch (err) {
      setError('Failed to save variants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE}/products/${id}`);
        await fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      subCategory: '', 
      brand: '', 
      price: '', 
      description: '', 
      inStock: true
    });
    setFilteredBrands([]);
    setEditingProduct(null);
    setShowForm(false);
    setError('');
  };

  const resetVariantsForm = () => {
    setVariantsData([]);
    setEditingVariantsProduct(null);
    setShowVariantsModal(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Filter brands when subcategory changes
    if (name === 'subCategory') {
      filterBrandsBySubCategory(newValue);
      // Reset brand selection when subcategory changes
      setFormData(prev => ({
        ...prev,
        brand: ''
      }));
    }
  };

  const addVariant = () => {
    setVariantsData(prev => [...prev, { name: '', values: [''] }]);
  };

  const removeVariant = (index) => {
    setVariantsData(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    setVariantsData(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  const addVariantValue = (variantIndex) => {
    setVariantsData(prev => prev.map((variant, i) => 
      i === variantIndex 
        ? { ...variant, values: [...variant.values, ''] }
        : variant
    ));
  };

  const removeVariantValue = (variantIndex, valueIndex) => {
    setVariantsData(prev => prev.map((variant, i) => 
      i === variantIndex 
        ? { ...variant, values: variant.values.filter((_, vi) => vi !== valueIndex) }
        : variant
    ));
  };

  const updateVariantValue = (variantIndex, valueIndex, value) => {
    setVariantsData(prev => prev.map((variant, i) => 
      i === variantIndex 
        ? { 
            ...variant, 
            values: variant.values.map((val, vi) => vi === valueIndex ? value : val)
          }
        : variant
    ));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Product Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-modal">
          <div className="form-container large">
            <div className="form-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="subCategory">SubCategory *</label>
                  <select
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subcategory</option>
                    {subCategories.map(subCategory => (
                      <option key={subCategory._id} value={subCategory._id}>
                        {subCategory.name} ({subCategory.category?.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="brand">Brand</label>
                  <select
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    disabled={!formData.subCategory}
                  >
                    <option value="">
                      {!formData.subCategory 
                        ? "Select a subcategory first" 
                        : filteredBrands.length === 0 
                        ? "No brands available for this subcategory" 
                        : "Select a brand"
                      }
                    </option>
                    {filteredBrands.map(brand => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                  />
                  In Stock
                </label>
              </div>



              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVariantsModal && (
        <div className="form-modal">
          <div className="form-container large">
            <div className="form-header">
              <h3>Edit Variants - {editingVariantsProduct?.name}</h3>
              <button className="close-btn" onClick={resetVariantsForm}>×</button>
            </div>
            <div style={{ padding: '30px' }}>
              <div className="variants-section">
                <div className="variants-header">
                  <h4>Product Variants</h4>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={addVariant}>
                    + Add Variant
                  </button>
                </div>
                {variantsData.map((variant, variantIndex) => (
                  <div key={variantIndex} className="variant-group">
                    <div className="variant-header">
                      <input
                        type="text"
                        placeholder="Variant name (e.g., Color, Size)"
                        value={variant.name}
                        onChange={(e) => updateVariant(variantIndex, 'name', e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="btn btn-sm btn-delete"
                        onClick={() => removeVariant(variantIndex)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="variant-values">
                      {variant.values.map((value, valueIndex) => (
                        <div key={valueIndex} className="variant-value">
                          <input
                            type="text"
                            placeholder="Value (e.g., Red, Large)"
                            value={value}
                            onChange={(e) => updateVariantValue(variantIndex, valueIndex, e.target.value)}
                          />
                          <button 
                            type="button" 
                            className="btn btn-sm btn-delete"
                            onClick={() => removeVariantValue(variantIndex, valueIndex)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        className="btn btn-sm btn-secondary"
                        onClick={() => addVariantValue(variantIndex)}
                      >
                        + Add Value
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetVariantsForm}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveVariants} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Variants'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="data-table">
        {loading && !showForm ? (
          <div className="loading">Loading products...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SubCategory</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map(product => (
                <tr key={product._id}>
                  <td className="product-name">{product.name}</td>
                  <td className="subcategory-name">
                    {product.subCategory?.name || 'N/A'}
                  </td>
                  <td className="brand-name">
                    {product.brand?.name || 'No Brand'}
                  </td>
                  <td className="product-price">${product.price}</td>
                  <td>
                    <span className={`status ${product.inStock ? 'active' : 'inactive'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      className="btn btn-sm btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEditVariants(product)}
                      title="Edit product variants"
                    >
                      Variants
                    </button>
                    <button 
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && products.length === 0 && (
          <div className="empty-state">
            <p>No products found. Create your first product!</p>
          </div>
        )}
        
        {/* Pagination */}
        {products.length > itemsPerPage && (
          <div className="pagination">
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className="pagination-info">
              <span>Page {currentPage} of {totalPages}</span>
              <span className="total-items">({products.length} total items)</span>
            </div>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  className={`btn btn-sm ${currentPage === number ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
