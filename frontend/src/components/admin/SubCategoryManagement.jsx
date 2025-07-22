import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminComponents.css';

const SubCategoryManagement = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const API_BASE = 'http://localhost:3000/api';

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/subcategories`);
      setSubCategories(response.data);
    } catch (err) {
      setError('Failed to fetch subcategories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/categories`);
      setCategories(response.data.filter(cat => cat.isActive));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingSubCategory) {
        await axios.put(`${API_BASE}/subcategories/${editingSubCategory._id}`, formData);
      } else {
        await axios.post(`${API_BASE}/subcategories`, formData);
      }
      await fetchSubCategories();
      resetForm();
    } catch (err) {
      setError('Failed to save subcategory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      name: subCategory.name,
      category: subCategory.category._id || subCategory.category,
      description: subCategory.description || '',
      isActive: subCategory.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE}/subcategories/${id}`);
        await fetchSubCategories();
      } catch (err) {
        setError('Failed to delete subcategory');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', description: '', isActive: true });
    setEditingSubCategory(null);
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubCategories = subCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subCategories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>SubCategory Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add SubCategory
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingSubCategory ? 'Edit SubCategory' : 'Add New SubCategory'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">SubCategory Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter subcategory name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Parent Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter subcategory description"
                  rows="3"
                />
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
                  {loading ? 'Saving...' : (editingSubCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="data-table">
        {loading && !showForm ? (
          <div className="loading">Loading subcategories...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Parent Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSubCategories.map(subCategory => (
                <tr key={subCategory._id}>
                  <td className="subcategory-name">{subCategory.name}</td>
                  <td className="category-name">
                    {subCategory.category?.name || 'N/A'}
                  </td>
                  <td className="subcategory-description">
                    {subCategory.description || 'No description'}
                  </td>
                  <td>
                    <span className={`status ${subCategory.isActive ? 'active' : 'inactive'}`}>
                      {subCategory.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(subCategory.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      className="btn btn-icon btn-edit"
                      onClick={() => handleEdit(subCategory)}
                      title="Edit Sub Category"
                    >
                      <img src="https://e7.pngegg.com/pngimages/461/1024/png-clipart-computer-icons-editing-edit-icon-cdr-angle-thumbnail.png" alt="Edit" />
                    </button>
                    <button 
                      className="btn btn-icon btn-delete"
                      onClick={() => handleDelete(subCategory._id)}
                      title="Delete Sub Category"
                    >
                      <img src="https://cdn-icons-png.flaticon.com/512/1828/1828945.png" alt="Delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && subCategories.length === 0 && (
          <div className="empty-state">
            <p>No subcategories found. Create your first subcategory!</p>
          </div>
        )}
        
        {/* Pagination */}
        {subCategories.length > itemsPerPage && (
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
              <span className="total-items">({subCategories.length} total items)</span>
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

export default SubCategoryManagement;
