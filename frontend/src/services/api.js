//services/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Category APIs
export const getCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);


// SubCategory APIs
export const getSubCategories = () => API.get('/subcategories');
export const createSubCategory = (categoryId, data) =>
  API.post(`/subcategories/categories/${categoryId}/subcategories`, data);
export const updateSubCategory = (id, data) =>
  API.put(`/subcategories/${id}`, data);
export const deleteSubCategory = (id) =>
  API.delete(`/subcategories/${id}`);

// Brand APIs
export const getBrands = () => API.get('/brands');
export const createBrand = (data) => API.post('/brands', data);
export const updateBrand = (id, data) => API.put(`/brands/${id}`, data);
export const deleteBrand = (id) => API.delete(`/brands/${id}`);


/// Product APIs
export const getProducts = () => API.get('/products');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
