import React, { useState } from 'react';
import { FaTimes, FaTrash, FaArrowRight } from 'react-icons/fa';

function Cart({ cart, removeFromCart }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleCart = () => {
    setIsOpen(!isOpen);
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  
  return (
    <div className={`cart-container ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button className="cart-toggle" onClick={toggleCart}>
          {isOpen ? <FaTimes /> : <FaArrowRight />}
        </button>
      </div>
      
      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <div className="cart-item-meta">
                    <p>${item.price.toFixed(2)} × {item.quantity}</p>
                    <p className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
                <button 
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total">
            <p>Total:</p>
            <p>${calculateTotal()}</p>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}

export default Cart;