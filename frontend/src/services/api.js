import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  registrarCliente: (data) => api.post('/auth/registro/cliente', data),
  registrarProveedor: (data) => api.post('/auth/registro/proveedor', data),
};

export const productosAPI = {
  listarActivos: () => api.get('/productos/activos'),
  listarTodos: () => api.get('/productos'),
  buscarPorId: (id) => api.get(`/productos/${id}`),
  crear: (formData) => api.post('/productos', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  actualizar: (id, formData) => api.put(`/productos/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  eliminar: (id) => api.delete(`/productos/${id}`),
};

export const inventarioAPI = {
  listar: () => api.get('/admin/inventario'),
  historial: () => api.get('/admin/inventario/historial'),
  movimiento: (data) => api.post('/admin/inventario/movimiento', data),
};

export const clienteAPI = {
  perfil: (id) => api.get(`/cliente/${id}`),
  actualizar: (id, data) => api.put(`/cliente/${id}`, data),
  subirFoto: (id, fd) => api.post(`/cliente/${id}/foto`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  historial: (id) => api.get(`/cliente/${id}/historial`),
  comprar: (data) => api.post('/cliente/compra', data, { responseType: 'blob' }),
  descargarTicket: (id, idOrden) =>
    api.get(`/cliente/${id}/ticket`, {
      params: { idOrden },
      responseType: 'blob'
    }),
};

export const adminAPI = {
  clientes: () => api.get('/admin/clientes'),
  eliminarCliente: (id) => api.delete(`/admin/clientes/${id}`),
  proveedores: () => api.get('/admin/proveedores'),
  crearProveedor: (fd) => api.post('/admin/proveedores', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  actualizarProveedor: (id, fd) => api.put(`/admin/proveedores/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  eliminarProveedor: (id) => api.delete(`/admin/proveedores/${id}`),
  admins: () => api.get('/admin/admins'),
  crearAdmin: (data) => api.post('/admin/admins', data),
};

export const proveedorAPI = {
  perfil: (id) => api.get(`/proveedor/${id}`),
  actualizar: (id, data) => api.put(`/proveedor/${id}`, data),
  productos: (id) => api.get(`/proveedor/${id}/productos`),
};


// =============================================
// RESET DE CONTRASEÑA
// =============================================
export const resetAPI = {
  solicitarCodigo: (data) => api.post('/auth/olvide-contrasena', data),
  verificarCodigo: (data) => api.post('/auth/verificar-codigo', data),
  nuevaContrasena: (data) => api.post('/auth/nueva-contrasena', data),
};

// =============================================
// REPORTES
// =============================================
export const reportesAPI = {
  topProductos:      () => api.get('/admin/reportes/top-productos'),
  ventasPorDia:      () => api.get('/admin/reportes/ventas-por-dia'),
  ventasPorCategoria:() => api.get('/admin/reportes/ventas-por-categoria'),
  totales:           () => api.get('/admin/reportes/totales'),
};

export default api;


export const bannersAPI = {
  listarActivos: () => api.get('/banners/activos'),
  listarTodos:   () => api.get('/banners'),
  crear: (fd)    => api.post('/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  actualizar: (id, fd) => api.put(`/banners/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  eliminar: (id) => api.delete(`/banners/${id}`),
  asociarProductos: (id, productoIds) => api.put(`/banners/${id}/productos`, productoIds),
};