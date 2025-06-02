/* eslint-disable no-unused-vars */
import { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (idx) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== idx));
  };

  const clearCart = () => {
    setCart([]);
  };

  const contextValue = useMemo(() => ({ cart, addToCart, removeFromCart, clearCart }), [cart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// 🔹 Validation des props
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartContext;
