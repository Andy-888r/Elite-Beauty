import React, { createContext, useContext, useState, useEffect } from 'react';
 
const AuthContext = createContext(null);
 
export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser  = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
 
  const login = (data) => {
    // ← guarda fotoPerfil desde la respuesta del backend
    const userData = {
      id:         data.id,
      nombre:     data.nombre,
      rol:        data.rol,
      fotoPerfil: data.fotoPerfil || null,
    };
    setToken(data.token);
    setUser(userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };
 
  // Actualiza solo la foto sin cerrar sesión
  const actualizarFoto = (rutaFoto) => {
    setUser(prev => {
      const updated = { ...prev, fotoPerfil: rutaFoto };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };
 
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
 
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, actualizarFoto }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useAuth = () => useContext(AuthContext);