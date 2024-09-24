import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
export const CartContext = createContext();

// Hook para usar el contexto del carrito
export const useCartContext = () => {
  return useContext(CartContext);
};

// Proveedor del contexto del carrito
export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Estado del carrito

  // Función para añadir productos al carrito
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Función para eliminar productos del carrito por ID
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  // Función para vaciar el carrito completo
  const clearCart = () => {
    setCart([]);
  };

  // Cantidad total de productos en el carrito
  const cartItemCount = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,           // El carrito completo
        addToCart,      // Función para agregar productos
        removeFromCart, // Función para eliminar productos
        clearCart,      // Función para vaciar el carrito
        cartItemCount,  // Cantidad total de productos
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
