import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddCategory from './components/AddCategory';
import AddSubCategory from './components/AddSubCategory';
import AddBrand from './components/AddBrand';
import AddProduct from './components/AddProduct';

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>CommerceDB Admin</h1>
        <nav>
          <Link to="/">Category</Link> | 
          <Link to="/subcategory">SubCategory</Link> | 
          <Link to="/brand">Brand</Link> | 
          <Link to="/product">Product</Link>
        </nav>
        <Routes>
          <Route path="/" element={<AddCategory />} />
          <Route path="/subcategory" element={<AddSubCategory />} />
          <Route path="/brand" element={<AddBrand />} />
          <Route path="/product" element={<AddProduct />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
