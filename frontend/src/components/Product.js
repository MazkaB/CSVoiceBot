import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

function Product({ product, addToCart }) {
  const { name, price, description, image, stock, category } = product;
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  const getStockStatus = (stockLevel) => {
    if (stockLevel > 50) return 'In Stock';
    if (stockLevel > 0) return `Only ${stockLevel} left!`;
    return 'Out of Stock';
  };
  
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={`/assets/images/${image}`} alt={name} />
        <span className="product-category">{category}</span>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        
        <div className="product-details">
          <p className="product-price">${price.toFixed(2)}</p>
          <p className={`product-stock ${stock > 0 ? stock > 10 ? 'in-stock' : 'low-stock' : 'out-of-stock'}`}>
            {getStockStatus(stock)}
          </p>
        </div>
        
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          <FaShoppingCart />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

export default Product;