import React, { useEffect, useState } from 'react';
import { Box, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Switch } from '@mui/material';
import { Assessment, Inventory, People, Store, Notifications } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Sidebar from '../../components/shared/Sidebar';
import { productosAPI } from '../../services/api';
import { MARBLE_STYLES } from '../../styles/marble';

const MENU = [
  { label:'Inicio',      icon:<Assessment />,    path:'/admin' },
  { label:'Productos',   icon:<Inventory />,     path:'/admin/productos' },
  { label:'Banners',     icon:<Assessment />,    path:'/admin/banners' },
  { label:'Clientes',    icon:<People />,        path:'/admin/clientes' },
  { label:'Proveedores', icon:<Store />,         path:'/admin/proveedores' },
  { label:'Inventario',  icon:<Inventory />,     path:'/admin/inventario' },
  { label:'Reportes',    icon:<Assessment />,    path:'/admin/reportes' },
];

const EMPTY = { nombre:'', marca:'', categoria:'', descripcion:'', precio:'', activo:false };

const extraStyles = `
  .eb-img { width:44px; height:44px; object-fit:cover; border-radius:2px; border:1px solid rgba(85,136,59,0.20); }
  .eb-img-placeholder { width:44px; height:44px; background:rgba(85,136,59,0.10); border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; color:#55883B; }
  .eb-price { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:600; color:#55883B; }
  .eb-actions { display:flex; gap:8px; }
`;

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [open, setOpen]     = useState(false);
  const [form, setForm]     = useState(EMPTY);
  const [imagen, setImagen] = useState(null);
  const [editId, setEditId] = useState(null);

  const cargar = () => productosAPI.listarTodos().then(r => setProductos(r.data));
  useEffect(() => { cargar(); }, []);

  const handleOpen = (p = null) => {
    setEditId(p?.id || null);
    setForm(p ? { nombre:p.nombre, marca:p.marca, categoria:p.categoria, descripcion:p.descripcion, precio:p.precio, activo:p.activo } : EMPTY);
    setImagen(null); setOpen(true);
  };

  const handleGuardar = async () => {
    const fd = new FormData();
    fd.append('producto', JSON.stringify({ ...form, precio: parseFloat(form.precio) }));
    if (imagen) fd.append('imagen', imagen);
    try {
      if (editId) { await productosAPI.actualizar(editId, fd); toast.success('Producto actualizado'); }
      else { await productosAPI.crear(fd); toast.success('Producto creado'); }
      setOpen(false); cargar();
    } catch { toast.error('Error al guardar producto'); }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('Eliminar este producto?')) return;
    await productosAPI.eliminar(id); toast.success('Eliminado'); cargar();
  };

  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>

        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Catalogo</p>
            <h1 className="eb-title">Productos</h1>
          </div>
          <button className="eb-btn-primary" onClick={() => handleOpen()}>
            <span style={{ fontSize:'1.1rem', lineHeight:1 }}>+</span> Nuevo Producto
          </button>
        </div>

        <div className="eb-content">
          <p className="eb-section-label">Catalogo completo — {productos.length} producto(s)</p>
          <div className="eb-table-wrap">
            <table className="eb-table">
              <thead>
                <tr>
                  <th>Imagen</th><th>Nombre</th><th>Marca</th>
                  <th>Categoria</th><th>Precio</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 && (
                  <tr><td colSpan={7}>
                    <div className="eb-empty">
                      <div className="eb-empty-icon">◈</div>
                      <div className="eb-empty-title">Sin productos registrados</div>
                    </div>
                  </td></tr>
                )}
                {productos.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.imagenPath
                        ? <img className="eb-img" src={`http://localhost:8080/api${p.imagenPath}`} alt={p.nombre} />
                        : <div className="eb-img-placeholder">◈</div>
                      }
                    </td>
                    <td style={{ fontWeight:500 }}>{p.nombre}</td>
                    <td style={{ color:'#55883B', fontSize:'0.82rem' }}>{p.marca}</td>
                    <td style={{ color:'#55883B', fontSize:'0.82rem' }}>{p.categoria}</td>
                    <td><span className="eb-price">${p.precio?.toFixed(2)}</span></td>
                    <td>
                      <Chip label={p.activo ? 'Activo' : 'Inactivo'} size="small"
                        className={p.activo ? 'eb-chip-active' : 'eb-chip-inactive'} />
                    </td>
                    <td>
                      <div className="eb-actions">
                        <button className="eb-btn-secondary" onClick={() => handleOpen(p)}>✎ Editar</button>
                        <button className="eb-btn-danger" onClick={() => handleEliminar(p.id)}>✕ Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth className="eb-dialog">
          <DialogTitle className="eb-dialog-title">{editId ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          <DialogContent className="eb-dialog-content">
            <TextField className="eb-field" label="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre:e.target.value})} fullWidth />
            <TextField className="eb-field" label="Marca" value={form.marca} onChange={e => setForm({...form, marca:e.target.value})} fullWidth />
            <TextField className="eb-field" label="Categoria" value={form.categoria} onChange={e => setForm({...form, categoria:e.target.value})} fullWidth />
            <TextField className="eb-field" label="Descripcion" value={form.descripcion} onChange={e => setForm({...form, descripcion:e.target.value})} fullWidth multiline rows={2} />
            <TextField className="eb-field" label="Precio" type="number" value={form.precio}
              onChange={e => { const v=e.target.value; if(v===''||(Number.isInteger(Number(v))&&parseInt(v)>=1)) setForm({...form,precio:v}); }}
              inputProps={{ min:1, step:1 }} fullWidth />
            <FormControlLabel
              control={<Switch checked={form.activo} onChange={e => setForm({...form, activo:e.target.checked})}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked':{ color:'#55883B' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':{ bgcolor:'#C1E899' } }} />}
              label={<span style={{ fontFamily:'Jost,sans-serif', fontSize:'0.8rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'#2C4A1E' }}>Activo</span>}
            />
            <button className="eb-btn-secondary" style={{ position:'relative', overflow:'hidden', width:'100%', justifyContent:'center', padding:'14px' }}>
              ↑ Subir imagen
              <input style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer' }} type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} />
            </button>
            {imagen && <p style={{ fontFamily:'Jost,sans-serif', fontSize:'0.75rem', color:'#55883B', margin:0, letterSpacing:'0.08em' }}>✓ {imagen.name}</p>}
          </DialogContent>
          <DialogActions className="eb-dialog-actions">
            <button className="eb-btn-secondary" onClick={() => setOpen(false)}>Cancelar</button>
            <button className="eb-btn-primary" onClick={handleGuardar}>Guardar</button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
}