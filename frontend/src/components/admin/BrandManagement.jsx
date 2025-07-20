import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminComponents.css';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logo: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:3000/api';

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/brands`);
      setBrands(response.data);
    } catch (err) {
      setError('Failed to fetch brands');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingBrand) {
        await axios.put(`${API_BASE}/brands/${editingBrand._id}`, formData);
      } else {
        await axios.post(`${API_BASE}/brands`, formData);
      }
      await fetchBrands();
      resetForm();
    } catch (err) {
      setError('Failed to save brand');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      website: brand.website || '',
      logo: brand.logo || '',
      isActive: brand.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE}/brands/${id}`);
        await fetchBrands();
      } catch (err) {
        setError('Failed to delete brand');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', website: '', logo: '', isActive: true });
    setEditingBrand(null);
    setShowForm(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Brand Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add Brand
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Brand Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter brand name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter brand description"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="logo">Logo URL</label>
                  <input
                    type="url"
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingBrand ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="data-table">
        {loading && !showForm ? (
          <div className="loading">Loading brands...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Description</th>
                <th>Website</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(brand => (
                <tr key={brand._id}>
                  <td className="brand-logo">
                    {brand.logo ? (
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: '#f0f0f0', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#666'
                      }}>
                        No Logo
                      </div>
                    )}
                  </td>
                  <td className="brand-name">{brand.name}</td>
                  <td className="brand-description">
                    {brand.description || 'No description'}
                  </td>
                  <td className="brand-website">
                    {brand.website ? (
                      <a 
                        href={brand.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#007bff', textDecoration: 'none' }}
                      >
                        Visit Site
                      </a>
                    ) : (
                      'No website'
                    )}
                  </td>
                  <td>
                    <span className={`status ${brand.isActive ? 'active' : 'inactive'}`}>
                      {brand.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      className="btn btn-sm btn-edit"
                      onClick={() => handleEdit(brand)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDelete(brand._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && brands.length === 0 && (
          <div className="empty-state">
            <p>No brands found. Create your first brand!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandManagement;
