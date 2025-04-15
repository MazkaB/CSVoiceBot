import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import VoiceBot from './components/VoiceBot';
import { fetchProducts } from './services/api';

function App() {
  // State management
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVoiceBot, setShowVoiceBot] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch products on component mount
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts(categoryFilter, searchTerm);
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    getProducts();
  }, [categoryFilter, searchTerm]);
  
  // Cart operations
  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
      setCart(
        cart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (productId) => {
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct.quantity === 1) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(
        cart.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        )
      );
    }
  };
  
  // Voice bot toggle
  const toggleVoiceBot = () => {
    setShowVoiceBot(!showVoiceBot);
  };
  
  // Filter handlers
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category === 'All' ? null : category);
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  return (
    <div className="app">
      <Navbar 
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)} 
        toggleVoiceBot={toggleVoiceBot}
        onSearch={handleSearch}
        onCategorySelect={handleCategoryFilter}
      />
      
      <main className="main-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <ProductList 
            products={products} 
            addToCart={addToCart} 
            currentCategory={categoryFilter || 'All'} 
          />
        )}
        
        <Cart cart={cart} removeFromCart={removeFromCart} />
      </main>
      
      {showVoiceBot && <VoiceBot onClose={toggleVoiceBot} />}
    </div>
  );
}

export default App;