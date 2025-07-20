// App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Categories from './pages/Categories';
import SubCategories from './pages/SubCategories';
import Brands from './pages/Brands';
import Products from './pages/Products';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="main-nav">
          <div className="nav-brand">
            <h2>E-Commerce Admin</h2>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/categories" className="nav-link">Categories</Link>
            <Link to="/subcategories" className="nav-link">SubCategories</Link>
            <Link to="/brands" className="nav-link">Brands</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/admin" className="nav-link admin-link">Admin Dashboard</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/subcategories" element={<SubCategories />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/products" element={<Products />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
