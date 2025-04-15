import React from 'react';
import Product from './Product';

function ProductList({ products, addToCart, currentCategory }) {
  if (products.length === 0) {
    return (
      <div className="product-list-empty">
        <h2>No products found</h2>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2 className="product-list-heading">
        {currentCategory === 'All' ? 'All Products' : `${currentCategory} Products`}
      </h2>
      <div className="product-list">
        {products.map(product => (
          <Product 
            key={product.id} 
            product={product} 
            addToCart={addToCart} 
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;