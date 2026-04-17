import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Switch, Checkbox } from '@mui/material';
import { Assessment, Inventory, People, Store } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Sidebar from '../../components/shared/Sidebar';
import { bannersAPI, productosAPI } from '../../services/api';
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

const EMPTY = { titulo:'', descripcion:'', orden:0, activo:true };
const BASE  = 'http://localhost:8080/api';

const extraStyles = `
  .eb-hint { font-family:'Jost',sans-serif; font-size:0.75rem; color:#55883B; letter-spacing:0.06em; margin-bottom:24px; margin-top:-12px; }
  .eb-banners-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }
  .eb-banner-card { border-radius:2px; overflow:hidden; transition:transform 0.2s, box-shadow 0.2s; }
  .eb-banner-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(44,74,30,0.15); }
  .eb-banner-img { width:100%; height:160px; object-fit:cover; display:block; }
  .eb-banner-placeholder { width:100%; height:160px; background:rgba(85,136,59,0.10); display:flex; align-items:center; justify-content:center; font-size:2rem; color:#55883B; }
  .eb-banner-body { padding:18px 20px; background:rgba(248,252,244,0.90); }
  .eb-banner-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; }
  .eb-banner-name { font-family:'Cormorant Garamond',serif; font-size:1.15rem; font-weight:600; color:#2C4A1E; }
  .eb-banner-orden { font-family:'Jost',sans-serif; font-size:0.65rem; letter-spacing:0.14em; text-transform:uppercase; color:#9A6735; }
  .eb-banner-desc { font-family:'Jost',sans-serif; font-size:0.82rem; color:#55883B; line-height:1.5; margin-bottom:14px; min-height:36px; }
  .eb-banner-footer { display:flex; justify-content:space-between; align-items:center; }
  .eb-chip-act   { display:inline-block; padding:3px 10px; border-radius:2px; background:rgba(85,136,59,0.15); color:#2C4A1E; font-family:'Jost',sans-serif; font-size:0.6rem; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; }
  .eb-chip-inact { display:inline-block; padding:3px 10px; border-radius:2px; background:rgba(100,100,100,0.10); color:#666; font-family:'Jost',sans-serif; font-size:0.6rem; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; }
  .eb-banner-actions { display:flex; gap:8px; }

  .eb-prod-selector { margin-top:16px; }
  .eb-prod-selector-label { font-family:'Jost',sans-serif; font-size:0.65rem; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:#55883B; margin-bottom:8px; }
  .eb-prod-selector-search { width:100%; box-sizing:border-box; border:1px solid rgba(85,136,59,0.30); border-radius:2px; padding:8px 12px; font-family:'Jost',sans-serif; font-size:0.8rem; color:#2C4A1E; background:rgba(248,252,244,0.80); margin-bottom:8px; outline:none; }
  .eb-prod-selector-search:focus { border-color:#55883B; }
  .eb-prod-list { max-height:200px; overflow-y:auto; border:1px solid rgba(85,136,59,0.20); border-radius:2px; background:rgba(248,252,244,0.60); flex:1; }
  .eb-prod-list::-webkit-scrollbar { display:none; }
  .eb-prod-list { scrollbar-width:none; }
  .eb-prod-item { display:flex; align-items:center; gap:10px; padding:8px 12px; border-bottom:1px solid rgba(85,136,59,0.08); cursor:pointer; transition:background 0.15s; }
  .eb-prod-item:last-child { border-bottom:none; }
  .eb-prod-item:hover { background:rgba(85,136,59,0.07); }
  .eb-prod-item-img { width:36px; height:36px; object-fit:cover; border-radius:2px; flex-shrink:0; }
  .eb-prod-item-placeholder { width:36px; height:36px; border-radius:2px; background:rgba(85,136,59,0.12); display:flex; align-items:center; justify-content:center; font-size:1rem; color:#55883B; flex-shrink:0; }
  .eb-prod-item-name { font-family:'Jost',sans-serif; font-size:0.80rem; color:#2C4A1E; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .eb-prod-item-price { font-family:'Cormorant Garamond',serif; font-size:0.95rem; font-weight:600; color:#9A6735; flex-shrink:0; }
  .eb-selected-count { font-family:'Jost',sans-serif; font-size:0.65rem; color:#9A6735; letter-spacing:0.10em; margin-top:6px; }

  #vslider-prod {
    writing-mode: vertical-lr;
    direction: rtl;
    width: 18px;
    height: 200px;
    cursor: pointer;
    flex-shrink: 0;
  }
`;

export default function AdminBanners() {
  const [banners, setBanners]               = useState([]);
  const [todosProductos, setTodosProductos] = useState([]);
  const [open, setOpen]                     = useState(false);
  const [form, setForm]                     = useState(EMPTY);
  const [imagen, setImagen]                 = useState(null);
  const [editId, setEditId]                 = useState(null);
  const [seleccionados, setSeleccionados]   = useState([]);
  const [busqueda, setBusqueda]             = useState('');

  const cargar = () => bannersAPI.listarTodos().then(r => setBanners(r.data));

  useEffect(() => {
    cargar();
    productosAPI.listarTodos().then(r => setTodosProductos(r.data)).catch(() => {});
  }, []);

  // Barra deslizadora vertical — se registra cada vez que el dialog abre
  useEffect(() => {
    if (!open) return;
    const area   = document.getElementById('eb-prod-list-scroll');
    const slider = document.getElementById('vslider-prod');
    if (!area || !slider) return;

    const onScroll = () => {
      const max = area.scrollHeight - area.clientHeight;
      slider.value = max ? Math.round(area.scrollTop / max * 100) : 0;
    };
    const onInput = () => {
      const max = area.scrollHeight - area.clientHeight;
      area.scrollTop = slider.value / 100 * max;
    };

    area.addEventListener('scroll', onScroll);
    slider.addEventListener('input', onInput);
    return () => {
      area.removeEventListener('scroll', onScroll);
      slider.removeEventListener('input', onInput);
    };
  }, [open]);

  const handleOpen = (b = null) => {
    setEditId(b?.id || null);
    setForm(b ? { titulo:b.titulo, descripcion:b.descripcion||'', orden:b.orden, activo:b.activo } : EMPTY);
    setSeleccionados(b?.productos?.map(p => p.id) || []);
    setBusqueda('');
    setImagen(null);
    setOpen(true);
  };

  const toggleProducto = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleGuardar = async () => {
    if (!form.titulo.trim()) { toast.error('El titulo es obligatorio'); return; }
    const fd = new FormData();
    fd.append('banner', JSON.stringify({ ...form, orden: parseInt(form.orden)||0 }));
    if (imagen) fd.append('imagen', imagen);
    try {
      let savedId = editId;
      if (editId) {
        await bannersAPI.actualizar(editId, fd);
      } else {
        const res = await bannersAPI.crear(fd);
        savedId = res.data.id;
      }
      await bannersAPI.asociarProductos(savedId, seleccionados);
      toast.success(editId ? 'Banner actualizado' : 'Banner creado');
      setOpen(false);
      cargar();
    } catch {
      toast.error('Error al guardar banner');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('Eliminar este banner?')) return;
    await bannersAPI.eliminar(id); toast.success('Banner eliminado'); cargar();
  };

  const productosFiltrados = todosProductos.filter(p =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.marca?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>

        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Vitrina</p>
            <h1 className="eb-title">Banners Promocionales</h1>
          </div>
          <button className="eb-btn-primary" onClick={() => handleOpen()}>
            <span style={{ fontSize:'1.1rem', lineHeight:1 }}>+</span> Nuevo Banner
          </button>
        </div>

        <div className="eb-content">
          <p className="eb-section-label">{banners.length} banner(s) — carrusel del inicio</p>
          <p className="eb-hint">Estas imagenes aparecen en el carrusel principal de la tienda.</p>

          {banners.length === 0 ? (
            <div className="eb-empty">
              <div className="eb-empty-icon">🖼</div>
              <div className="eb-empty-title">Sin banners aun</div>
              <div className="eb-empty-sub"><span className="eb-ornament" />Crea el primero<span className="eb-ornament" /></div>
            </div>
          ) : (
            <div className="eb-banners-grid">
              {banners.map(b => (
                <div className="eb-banner-card eb-card-wrap" key={b.id}>
                  {b.imagenPath
                    ? <img className="eb-banner-img" src={`${BASE}${b.imagenPath}`} alt={b.titulo} />
                    : <div className="eb-banner-placeholder">◈</div>
                  }
                  <div className="eb-banner-body">
                    <div className="eb-banner-top">
                      <span className="eb-banner-name">{b.titulo}</span>
                      <span className="eb-banner-orden">#{b.orden}</span>
                    </div>
                    <p className="eb-banner-desc">{b.descripcion || <em style={{ opacity:0.5 }}>Sin descripcion</em>}</p>
                    {b.productos?.length > 0 && (
                      <p style={{ fontFamily:'Jost,sans-serif', fontSize:'0.65rem', color:'#9A6735', letterSpacing:'0.10em', marginBottom:'10px' }}>
                        📦 {b.productos.length} producto{b.productos.length > 1 ? 's' : ''} en promoción
                      </p>
                    )}
                    <div className="eb-banner-footer">
                      <span className={b.activo ? 'eb-chip-act' : 'eb-chip-inact'}>{b.activo ? 'Activo' : 'Inactivo'}</span>
                      <div className="eb-banner-actions">
                        <button className="eb-btn-secondary" onClick={() => handleOpen(b)}>✎ Editar</button>
                        <button className="eb-btn-danger" onClick={() => handleEliminar(b.id)}>✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth className="eb-dialog">
          <DialogTitle className="eb-dialog-title">{editId ? 'Editar Banner' : 'Nuevo Banner'}</DialogTitle>
          <DialogContent className="eb-dialog-content">
            <TextField className="eb-field" label="Titulo *" value={form.titulo} onChange={e => setForm({...form, titulo:e.target.value})} fullWidth />
            <TextField className="eb-field" label="Descripcion" value={form.descripcion} onChange={e => setForm({...form, descripcion:e.target.value})} fullWidth multiline rows={2} />
            <TextField className="eb-field" label="Orden" type="number" value={form.orden} onChange={e => setForm({...form, orden:e.target.value})} helperText="Menor numero = aparece primero" fullWidth inputProps={{ min:0 }} />
            <FormControlLabel
              control={<Switch checked={form.activo} onChange={e => setForm({...form, activo:e.target.checked})}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked':{ color:'#55883B' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':{ bgcolor:'#C1E899' } }} />}
              label={<span style={{ fontFamily:'Jost,sans-serif', fontSize:'0.8rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'#2C4A1E' }}>Visible en la tienda</span>}
            />
            <button className="eb-btn-secondary" style={{ position:'relative', overflow:'hidden', width:'100%', justifyContent:'center', padding:'14px', marginTop:'8px' }}>
              ↑ Subir imagen
              <input style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer' }} type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} />
            </button>
            {imagen && <p style={{ fontFamily:'Jost,sans-serif', fontSize:'0.75rem', color:'#55883B', margin:'4px 0 0' }}>✓ {imagen.name}</p>}

            <div className="eb-prod-selector">
              <div className="eb-prod-selector-label">Productos en esta promoción</div>
              <input
                className="eb-prod-selector-search"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />

              {/* Lista + barra vertical */}
              <div style={{ display:'flex', gap:'6px', alignItems:'stretch' }}>
                <div id="eb-prod-list-scroll" className="eb-prod-list">
                  {productosFiltrados.length === 0 ? (
                    <div style={{ padding:'16px', textAlign:'center', fontFamily:'Jost,sans-serif', fontSize:'0.75rem', color:'#9A6735' }}>
                      Sin productos
                    </div>
                  ) : productosFiltrados.map(p => (
                    <div key={p.id} className="eb-prod-item" onClick={() => toggleProducto(p.id)}>
                      <Checkbox
                        checked={seleccionados.includes(p.id)}
                        size="small"
                        sx={{ padding:0, color:'rgba(85,136,59,0.40)', '&.Mui-checked':{ color:'#55883B' } }}
                        onChange={() => {}}
                      />
                      {p.imagenPath
                        ? <img className="eb-prod-item-img" src={`${BASE}${p.imagenPath}`} alt={p.nombre} />
                        : <div className="eb-prod-item-placeholder">◈</div>
                      }
                      <span className="eb-prod-item-name">{p.nombre}</span>
                      <span className="eb-prod-item-price">${p.precio?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Barra deslizadora vertical */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <input id="vslider-prod" type="range" min="0" max="100" value="0" step="1" readOnly />
                </div>
              </div>

              {seleccionados.length > 0 && (
                <div className="eb-selected-count">
                  ✓ {seleccionados.length} producto{seleccionados.length > 1 ? 's' : ''} seleccionado{seleccionados.length > 1 ? 's' : ''}
                </div>
              )}
            </div>

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