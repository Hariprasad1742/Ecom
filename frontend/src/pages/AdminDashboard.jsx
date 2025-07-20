import React, { useState } from 'react';
import CategoryManagement from '../components/admin/CategoryManagement';
import SubCategoryManagement from '../components/admin/SubCategoryManagement';
import ProductManagement from '../components/admin/ProductManagement';
import BrandManagement from '../components/admin/BrandManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { id: 'categories', label: 'Categories', icon: '📁' },
    { id: 'subcategories', label: 'Sub Categories', icon: '📂' },
    { id: 'brands', label: 'Brands', icon: '🏷️' },
    { id: 'products', label: 'Products', icon: '📦' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoryManagement />;
      case 'subcategories':
        return <SubCategoryManagement />;
      case 'brands':
        return <BrandManagement />;
      case 'products':
        return <ProductManagement />;
      default:
        return <CategoryManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your e-commerce catalog</p>
      </div>

      <div className="dashboard-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
