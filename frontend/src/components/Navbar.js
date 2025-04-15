import React, { useState } from 'react';
import { FaShoppingCart, FaMicrophone, FaSearch } from 'react-icons/fa';

function Navbar({ cartCount, toggleVoiceBot, onSearch, onCategorySelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  
  // Categories available in the store
  const categories = ['All', 'Electronics', 'Clothing', 'Furniture', 'Kitchen', 'Outdoors', 'Home'];
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    setShowCategories(false);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Shop Smart</h1>
      </div>
      
      <div className="navbar-menu">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button className="nav-link">Home</button>
          </li>
          <li className="nav-item categories-dropdown">
            <button 
              className="nav-link"
              onClick={() => { 
                setShowCategories(!showCategories); 
              }}
            >
              Categories
            </button>
            {showCategories && (
              <div className="dropdown-menu">
                {categories.map(category => (
                  <button 
                    key={category} 
                    className="dropdown-item"
                    onClick={() => {
                      handleCategoryClick(category);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </li>
          <li className="nav-item">
            <button className="nav-link">Deals</button>
          </li>
          <li className="nav-item">
            <button className="nav-link">Contact</button>
          </li>
        </ul>
      </div>
      
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </div>
      </form>
      
      <div className="navbar-actions">
        <button 
          className="voice-bot-btn"
          onClick={toggleVoiceBot}
          aria-label="Voice Assistant"
        >
          <FaMicrophone />
          <span>Assistant</span>
        </button>
        
        <button className="cart-btn">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;