import React, { createContext, useContext, useState, useEffect } from 'react';
 
const CartContext = createContext(null);
 
// Obtiene la clave del carrito según el usuario logueado
const getCartKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id ? `carrito_${user.id}` : 'carrito_guest';
  } catch {
    return 'carrito_guest';
  }
};
 
export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const key   = getCartKey();
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });
 
  // Cada vez que cambia el carrito lo guarda con la clave del usuario actual
  useEffect(() => {
    const key = getCartKey();
    localStorage.setItem(key, JSON.stringify(carrito));
  }, [carrito]);
 
  // Cuando el usuario cambia (login/logout), carga el carrito correcto
  useEffect(() => {
    const handleStorage = () => {
      const key   = getCartKey();
      const saved = localStorage.getItem(key);
      setCarrito(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
 
  const agregarAlCarrito = (p) => {
    setCarrito(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? {...i, cantidad: i.cantidad + 1} : i);
      return [...prev, {...p, cantidad: 1}];
    });
  };
 
  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(i => i.id !== id));
  };
 
  const actualizarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    setCarrito(prev => prev.map(i => i.id === id ? {...i, cantidad} : i));
  };
 
  const limpiarCarrito = () => {
    const key = getCartKey();
    setCarrito([]);
    localStorage.removeItem(key);
  };
 
  // Carga el carrito del cliente que acaba de iniciar sesión
  const cargarCarritoDeUsuario = (userId) => {
    const key   = `carrito_${userId}`;
    const saved = localStorage.getItem(key);
    setCarrito(saved ? JSON.parse(saved) : []);
  };
 
  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
 
  return (
    <CartContext.Provider value={{
      carrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      limpiarCarrito,
      actualizarCantidad,
      cargarCarritoDeUsuario,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};
 
export const useCart = () => useContext(CartContext);