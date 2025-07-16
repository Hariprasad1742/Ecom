// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Categories from './pages/Categories';
import SubCategories from './pages/SubCategories';
import Brands from './pages/Brands';

export default function App() {
  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <h1>Admin Panel</h1>

        <nav style={{ marginBottom: '1rem' }}>
          <Link to="/categories" style={{ marginRight: '1rem' }}>Categories</Link>
          <Link to="/subcategories">SubCategories</Link>
          <Link to="/brands">Brands</Link>
        </nav>

        <Routes>
          <Route path="/categories" element={<Categories />} />
          <Route path="/subcategories" element={<SubCategories />} />
          <Route path="/brands" element={<Brands />} />
        </Routes>
      </div>
    </Router>
  );
}
