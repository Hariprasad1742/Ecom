// App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Categories from './pages/Categories';
import SubCategories from './pages/SubCategories';
import Brands from './pages/Brands';
import Products from './pages/Products';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <nav style={{ marginBottom: '1rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
          <Link to="/categories" style={{ marginRight: '1rem' }}>Categories</Link>
          <Link to="/subcategories" style={{ marginRight: '1rem' }}>SubCategories</Link>
          <Link to="/brands" style={{ marginRight: '1rem' }}>Brands</Link>
          <Link to="/products">Products</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/subcategories" element={<SubCategories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
