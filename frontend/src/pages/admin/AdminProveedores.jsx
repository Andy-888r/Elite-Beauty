import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Assessment, Inventory, People, Store, Notifications } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Sidebar from '../../components/shared/Sidebar';
import { adminAPI } from '../../services/api';
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
 
// ← quitamos telefono, correo, descripcion; agregamos url
const EMPTY = { nombre:'', empresa:'', url:'', activo:true };
const BASE   = 'http://localhost:8080/api';
 
const extraStyles = `
  .eb-hint { font-family:'Jost',sans-serif; font-size:0.75rem; color:#55883B; letter-spacing:0.06em; margin-bottom:24px; margin-top:-12px; }
 
  /* Grid de cards */
  .eb-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:20px; }
 
  /* Card clickeable */
  .eb-prov-card {
    border-radius:4px;
    display:flex;
    flex-direction:column;
    cursor:pointer;
    transition:transform 0.2s, box-shadow 0.2s;
    overflow:hidden;
    text-decoration:none;
  }
  .eb-prov-card:hover { transform:translateY(-4px); box-shadow:0 10px 32px rgba(44,74,30,0.18); }
 
  /* Zona del logo — como un banner */
  .eb-prov-banner {
    width:100%;
    height:160px;
    background:rgba(248,252,244,0.95);
    display:flex;
    align-items:center;
    justify-content:center;
    border-bottom:1px solid rgba(85,136,59,0.12);
    position:relative;
    overflow:hidden;
  }
  .eb-prov-banner img {
    max-width:80%;
    max-height:120px;
    object-fit:contain;
  }
  .eb-prov-avatar {
    font-family:'Cormorant Garamond',serif;
    font-size:3.5rem;
    font-weight:600;
    color:#55883B;
    opacity:0.6;
  }
 
  /* Overlay al hover para indicar que es clickeable */
  .eb-prov-overlay {
    position:absolute;
    inset:0;
    background:rgba(85,136,59,0.0);
    display:flex;
    align-items:center;
    justify-content:center;
    transition:background 0.2s;
  }
  .eb-prov-card:hover .eb-prov-overlay { background:rgba(85,136,59,0.08); }
  .eb-prov-overlay-label {
    font-family:'Jost',sans-serif;
    font-size:0.65rem;
    letter-spacing:0.18em;
    text-transform:uppercase;
    color:#2C4A1E;
    background:rgba(255,255,255,0.88);
    padding:6px 14px;
    border-radius:2px;
    opacity:0;
    transform:translateY(4px);
    transition:opacity 0.2s, transform 0.2s;
  }
  .eb-prov-card:hover .eb-prov-overlay-label { opacity:1; transform:translateY(0); }
 
  /* Cuerpo de la card */
  .eb-prov-body { padding:16px 18px; background:rgba(248,252,244,0.85); flex:1; display:flex; flex-direction:column; }
  .eb-prov-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; }
  .eb-prov-name { font-family:'Cormorant Garamond',serif; font-size:1.15rem; font-weight:600; color:#2C4A1E; }
  .eb-chip-act   { display:inline-block; padding:3px 10px; border-radius:2px; background:rgba(85,136,59,0.15); color:#2C4A1E; font-family:'Jost',sans-serif; font-size:0.6rem; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; }
  .eb-chip-inact { display:inline-block; padding:3px 10px; border-radius:2px; background:rgba(100,100,100,0.10); color:#666; font-family:'Jost',sans-serif; font-size:0.6rem; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; }
  .eb-prov-empresa { font-family:'Jost',sans-serif; font-size:0.78rem; color:#55883B; margin-bottom:10px; }
  .eb-prov-url {
    font-family:'Jost',sans-serif;
    font-size:0.72rem;
    color:#55883B;
    opacity:0.7;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    margin-bottom:14px;
  }
  .eb-prov-footer { display:flex; gap:8px; padding-top:12px; border-top:1px solid rgba(85,136,59,0.12); }
`;
 
export default function AdminProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [open, setOpen]     = useState(false);
  const [form, setForm]     = useState(EMPTY);
  const [logo, setLogo]     = useState(null);
  const [editId, setEditId] = useState(null);
 
  const cargar = () => adminAPI.proveedores().then(r => setProveedores(r.data));
  useEffect(() => { cargar(); }, []);
 
  const handleOpen = (p = null) => {
    setEditId(p?.id || null);
    setForm(p
      ? { nombre:p.nombre||'', empresa:p.empresa||'', url:p.url||'', activo:p.activo??true }
      : EMPTY
    );
    setLogo(null);
    setOpen(true);
  };
 
  const handleGuardar = async () => {
    if (!form.nombre.trim()) { toast.error('El nombre es obligatorio'); return; }
    const fd = new FormData();
    fd.append('proveedor', JSON.stringify(form));
    if (logo) fd.append('logo', logo);
    try {
      if (editId) { await adminAPI.actualizarProveedor(editId, fd); toast.success('Proveedor actualizado'); }
      else        { await adminAPI.crearProveedor(fd);              toast.success('Proveedor creado'); }
      setOpen(false); cargar();
    } catch { toast.error('Error al guardar proveedor'); }
  };
 
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return;
    await adminAPI.eliminarProveedor(id); toast.success('Proveedor eliminado'); cargar();
  };
 
  // Abre la URL del proveedor en nueva pestaña
  const handleCardClick = (url) => {
    if (!url) { toast.info('Este proveedor no tiene URL registrada'); return; }
    const href = url.startsWith('http') ? url : `https://${url}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  };
 
  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>
 
        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Alianzas</p>
            <h1 className="eb-title">Proveedores</h1>
          </div>
          <button className="eb-btn-primary" onClick={() => handleOpen()}>
            <span style={{ fontSize:'1.1rem', lineHeight:1 }}>+</span> Nuevo Proveedor
          </button>
        </div>
 
        <div className="eb-content">
          <p className="eb-section-label">{proveedores.length} proveedor(es) registrado(s)</p>
          <p className="eb-hint">Haz clic en cualquier card para visitar el sitio del proveedor.</p>
 
          <div className="eb-grid">
            {proveedores.length === 0 && (
              <div className="eb-empty" style={{ gridColumn:'1/-1' }}>
                <div className="eb-empty-icon">◈</div>
                <div className="eb-empty-title">Sin proveedores aún</div>
                <div className="eb-empty-sub"><span className="eb-ornament" />Agrega el primero<span className="eb-ornament" /></div>
              </div>
            )}
 
            {proveedores.map(p => (
              <div className="eb-prov-card eb-card-wrap" key={p.id}>
 
                {/* Banner/logo clickeable */}
                <div className="eb-prov-banner" onClick={() => handleCardClick(p.url)} title={p.url || 'Sin URL'}>
                  {p.logoPath
                    ? <img src={`${BASE}${p.logoPath}`} alt={p.nombre} />
                    : <div className="eb-prov-avatar">{p.nombre?.charAt(0).toUpperCase()}</div>
                  }
                  <div className="eb-prov-overlay">
                    <span className="eb-prov-overlay-label">↗ Visitar sitio</span>
                  </div>
                </div>
 
                {/* Info */}
                <div className="eb-prov-body">
                  <div className="eb-prov-top">
                    <span className="eb-prov-name">{p.nombre}</span>
                    <span className={p.activo ? 'eb-chip-act' : 'eb-chip-inact'}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {p.empresa && <div className="eb-prov-empresa">◈ {p.empresa}</div>}
                  {p.url     && <div className="eb-prov-url">🔗 {p.url}</div>}
 
                  <div className="eb-prov-footer">
                    <button className="eb-btn-secondary" style={{ flex:1, justifyContent:'center' }}
                      onClick={(e) => { e.stopPropagation(); handleOpen(p); }}>
                      ✎ Editar
                    </button>
                    <button className="eb-btn-danger"
                      onClick={(e) => { e.stopPropagation(); handleEliminar(p.id); }}>
                      ✕
                    </button>
                  </div>
                </div>
 
              </div>
            ))}
          </div>
        </div>
 
        {/* Modal */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth className="eb-dialog">
          <DialogTitle className="eb-dialog-title">
            {editId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </DialogTitle>
          <DialogContent className="eb-dialog-content">
 
            <TextField
              className="eb-field"
              label="Nombre *"
              value={form.nombre}
              onChange={e => setForm({...form, nombre:e.target.value})}
              fullWidth
            />
            <TextField
              className="eb-field"
              label="Empresa / Marca"
              value={form.empresa}
              onChange={e => setForm({...form, empresa:e.target.value})}
              fullWidth
            />
            <TextField
              className="eb-field"
              label="Sitio web / URL"
              placeholder="https://www.ejemplo.com"
              value={form.url}
              onChange={e => setForm({...form, url:e.target.value})}
              fullWidth
              helperText="Al hacer clic en la card se abrirá este enlace"
            />
 
            {/* Subir logo */}
            <button className="eb-btn-secondary"
              style={{ position:'relative', overflow:'hidden', width:'100%', justifyContent:'center', padding:'14px', marginTop:'8px' }}>
              ↑ Subir logo
              <input
                style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer' }}
                type="file"
                accept="image/*"
                onChange={e => setLogo(e.target.files[0])}
              />
            </button>
            {logo && <p style={{ fontFamily:'Jost,sans-serif', fontSize:'0.75rem', color:'#55883B', margin:'6px 0 0' }}>✓ {logo.name}</p>}
 
          </DialogContent>
          <DialogActions className="eb-dialog-actions">
            <button className="eb-btn-secondary" onClick={() => setOpen(false)}>Cancelar</button>
            <button className="eb-btn-primary"   onClick={handleGuardar}>Guardar</button>
          </DialogActions>
        </Dialog>
 
      </Box>
    </Box>
  );
}