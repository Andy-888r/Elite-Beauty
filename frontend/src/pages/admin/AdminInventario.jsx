import React, { useEffect, useState } from 'react';
import {
  Box, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { Assessment, Inventory, People, Store, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Sidebar from '../../components/shared/Sidebar';
import { inventarioAPI } from '../../services/api';
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

const extraStyles = `
  .eb-tabs { display:flex; gap:0; border-bottom:1px solid rgba(85,136,59,0.20); margin-bottom:28px; }
  .eb-tab { font-family:'Jost',sans-serif; font-size:0.68rem; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; color:#55883B; background:transparent; border:none; padding:14px 28px; cursor:pointer; position:relative; transition:color 0.2s; }
  .eb-tab:hover { color:#2C4A1E; }
  .eb-tab.active { color:#2C4A1E; }
  .eb-tab.active::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px; background:#55883B; }
  .eb-stock-num { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:600; }
  .eb-stock-num.ok      { color:#55883B; }
  .eb-stock-num.warning { color:#9A6735; }
  .eb-stock-num.error   { color:#8B2E2E; }
  .eb-cantidad-pos { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:600; color:#55883B; }
  .eb-cantidad-neg { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:600; color:#8B2E2E; }
  .eb-chip-entrada { background:rgba(85,136,59,0.15) !important; color:#2C4A1E !important; font-family:'Jost',sans-serif !important; font-size:0.6rem !important; letter-spacing:0.14em !important; border-radius:2px !important; height:22px !important; }
  .eb-chip-salida  { background:rgba(139,46,46,0.12) !important; color:#6B1E1E !important; font-family:'Jost',sans-serif !important; font-size:0.6rem !important; letter-spacing:0.14em !important; border-radius:2px !important; height:22px !important; }
  .eb-date { font-family:'Jost',sans-serif; font-size:0.8rem; color:#55883B; }
  .eb-edit-btn {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(85,136,59,0.10); border:1px solid rgba(44,74,30,0.35);
    color:#2C4A1E; font-family:'Jost',sans-serif; font-weight:500;
    font-size:0.68rem; letter-spacing:0.14em; text-transform:uppercase;
    padding:6px 12px; border-radius:2px; cursor:pointer; transition:all 0.2s;
  }
  .eb-edit-btn:hover { background:#2C4A1E; color:#F8FAF6; border-color:#2C4A1E; }
`;

export default function AdminInventario() {
  const [inventario, setInventario] = useState([]);
  const [historial,  setHistorial]  = useState([]);
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen]   = useState(false);
  const [itemEdit, setItemEdit]       = useState(null);
  const [tipoMov, setTipoMov]         = useState('entrada');
  const [cantidad, setCantidad]       = useState('');
  const [motivo, setMotivo]           = useState('');
  const [guardando, setGuardando]     = useState(false);

  const cargar = () => {
    inventarioAPI.listar().then(r => setInventario(r.data));
    inventarioAPI.historial().then(r => setHistorial(r.data));
  };

  useEffect(() => {
    cargar();
  }, []);

  const getStockClass = (e) => e === 'SIN STOCK' ? 'error' : e === 'BAJO' ? 'warning' : 'ok';
  const getChipClass  = (e) => e === 'SIN STOCK' ? 'eb-chip-sinstock' : e === 'BAJO' ? 'eb-chip-bajo' : 'eb-chip-ok';

  const abrirEditar = (item) => {
    setItemEdit(item);
    setTipoMov('entrada');
    setCantidad('');
    setMotivo('');
    setDialogOpen(true);
  };

  const cerrarDialog = () => {
    if (guardando) return;
    setDialogOpen(false);
    setItemEdit(null);
  };

  const handleGuardar = async () => {
    const cant = parseInt(cantidad, 10);
    if (!cant || cant <= 0) {
      toast.error('Ingresa una cantidad valida');
      return;
    }
    if (!motivo.trim()) {
      toast.error('Ingresa un motivo');
      return;
    }
    if (tipoMov === 'salida' && cant > (itemEdit?.stock || 0)) {
      toast.error(`Stock insuficiente (disponible: ${itemEdit?.stock || 0})`);
      return;
    }
    setGuardando(true);
    try {
      await inventarioAPI.movimiento({
        idProducto: itemEdit.producto.id,
        esEntrada: tipoMov === 'entrada',
        cantidad: cant,
        motivo: motivo.trim(),
      });
      toast.success(tipoMov === 'entrada' ? 'Entrada registrada' : 'Salida registrada');
      cargar();
      setDialogOpen(false);
      setItemEdit(null);
    } catch (err) {
      toast.error(err.response?.data || 'Error al registrar movimiento');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>

        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Control</p>
            <h1 className="eb-title">Inventario</h1>
          </div>
          <div style={{ fontFamily:'Jost,sans-serif', fontSize:'0.72rem', letterSpacing:'0.12em', color:'#9A6735', textTransform:'uppercase' }}>
            {new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </div>
        </div>

        <div className="eb-content">
          <div className="eb-tabs">
            <button className={`eb-tab ${tab===0?'active':''}`} onClick={() => setTab(0)}>Stock Actual</button>
            <button className={`eb-tab ${tab===1?'active':''}`} onClick={() => setTab(1)}>Historial de Movimientos</button>
          </div>

          {tab === 0 && (
            <>
              <p className="eb-section-label">{inventario.length} producto(s) en sistema</p>
              <div className="eb-table-wrap">
                <table className="eb-table">
                  <thead><tr><th>Producto</th><th>Stock actual</th><th>Minimo</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {inventario.length === 0 && (
                      <tr><td colSpan={5}><div className="eb-empty"><div className="eb-empty-icon">◈</div><div className="eb-empty-title">Sin registros</div></div></td></tr>
                    )}
                    {inventario.map((i, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight:500 }}>{i.producto?.nombre}</td>
                        <td><span className={`eb-stock-num ${getStockClass(i.estado)}`}>{i.stock}</span></td>
                        <td style={{ color:'#9A6735' }}>{i.minimo}</td>
                        <td><Chip label={i.estado} size="small" className={getChipClass(i.estado)} /></td>
                        <td>
                          <button className="eb-edit-btn" onClick={() => abrirEditar(i)}>
                            <Edit style={{ fontSize:14 }} /> Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 1 && (
            <>
              <p className="eb-section-label">{historial.length} movimiento(s) registrado(s)</p>
              <div className="eb-table-wrap">
                <table className="eb-table">
                  <thead><tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Motivo</th></tr></thead>
                  <tbody>
                    {historial.length === 0 && (
                      <tr><td colSpan={5}><div className="eb-empty"><div className="eb-empty-icon">◈</div><div className="eb-empty-title">Sin movimientos</div></div></td></tr>
                    )}
                    {historial.map((h, idx) => (
                      <tr key={idx}>
                        <td><span className="eb-date">{new Date(h.fecha).toLocaleString('es-MX')}</span></td>
                        <td style={{ fontWeight:500 }}>{h.producto?.nombre}</td>
                        <td><Chip label={h.tipo} size="small" className={h.tipo==='Entrada'?'eb-chip-entrada':'eb-chip-salida'} /></td>
                        <td><span className={h.tipo==='Entrada'?'eb-cantidad-pos':'eb-cantidad-neg'}>{h.tipo==='Entrada'?'+':'-'}{h.cantidad}</span></td>
                        <td style={{ color:'#55883B', fontSize:'0.82rem' }}>{h.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </Box>

      <Dialog open={dialogOpen} onClose={cerrarDialog} maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:'4px', border:'1px solid rgba(201,168,76,0.35)' } }}>
        <DialogTitle sx={{
          fontFamily:'Cormorant Garamond,serif', fontWeight:600, color:'#2C4A1E',
          borderBottom:'1px solid rgba(85,136,59,0.20)'
        }}>
          Editar stock — {itemEdit?.producto?.nombre}
        </DialogTitle>
        <DialogContent sx={{ pt:3 }}>
          <Box sx={{ mb:2, mt:1, fontFamily:'Jost,sans-serif', fontSize:'0.82rem', color:'#55883B' }}>
            Stock actual: <strong style={{ color:'#2C4A1E' }}>{itemEdit?.stock ?? 0}</strong>
          </Box>
          <ToggleButtonGroup
            exclusive
            value={tipoMov}
            onChange={(e, v) => v && setTipoMov(v)}
            fullWidth
            sx={{ mb:2 }}
          >
            <ToggleButton value="entrada" sx={{
              fontFamily:'Jost,sans-serif', fontSize:'0.72rem', letterSpacing:'0.14em',
              '&.Mui-selected':{ bgcolor:'rgba(85,136,59,0.18)', color:'#2C4A1E', fontWeight:600 }
            }}>
              + Agregar (Entrada)
            </ToggleButton>
            <ToggleButton value="salida" sx={{
              fontFamily:'Jost,sans-serif', fontSize:'0.72rem', letterSpacing:'0.14em',
              '&.Mui-selected':{ bgcolor:'rgba(139,46,46,0.12)', color:'#6B1E1E', fontWeight:600 }
            }}>
              − Retirar (Salida)
            </ToggleButton>
          </ToggleButtonGroup>
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            size="small"
            value={cantidad}
            onChange={e => setCantidad(e.target.value)}
            inputProps={{ min:1 }}
            sx={{ mb:2 }}
          />
          <TextField
            label="Motivo"
            fullWidth
            size="small"
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            placeholder={tipoMov === 'entrada' ? 'Ej: Reabastecimiento proveedor' : 'Ej: Producto dañado / venta manual'}
          />
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2 }}>
          <Button onClick={cerrarDialog} disabled={guardando}
            sx={{ color:'#55883B', fontFamily:'Jost,sans-serif', letterSpacing:'0.12em' }}>
            Cancelar
          </Button>
          <Button onClick={handleGuardar} disabled={guardando} variant="contained"
            sx={{
              bgcolor:'#2C4A1E', fontFamily:'Jost,sans-serif', letterSpacing:'0.14em',
              '&:hover':{ bgcolor:'#55883B' }
            }}>
            {guardando ? 'Guardando...' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}