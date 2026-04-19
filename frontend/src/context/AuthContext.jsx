import React, { createContext, useContext, useState, useEffect } from 'react';
 
const AuthContext = createContext(null);
 
export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    // Cada apertura del proyecto fuerza el cierre de la sesión previa
    // para que el usuario siempre inicie en el landing público.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('alertas_stock');
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