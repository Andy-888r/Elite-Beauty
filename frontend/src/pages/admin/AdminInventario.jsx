import React, { useEffect, useState } from 'react';
import { Box, Chip } from '@mui/material';
import { Assessment, Inventory, People, Store, Notifications } from '@mui/icons-material';
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
`;

export default function AdminInventario() {
  const [inventario, setInventario] = useState([]);
  const [historial,  setHistorial]  = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    inventarioAPI.listar().then(r => setInventario(r.data));
    inventarioAPI.historial().then(r => setHistorial(r.data));
  }, []);

  const getStockClass = (e) => e === 'SIN STOCK' ? 'error' : e === 'BAJO' ? 'warning' : 'ok';
  const getChipClass  = (e) => e === 'SIN STOCK' ? 'eb-chip-sinstock' : e === 'BAJO' ? 'eb-chip-bajo' : 'eb-chip-ok';

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
                  <thead><tr><th>Producto</th><th>Stock actual</th><th>Minimo</th><th>Estado</th></tr></thead>
                  <tbody>
                    {inventario.length === 0 && (
                      <tr><td colSpan={4}><div className="eb-empty"><div className="eb-empty-icon">◈</div><div className="eb-empty-title">Sin registros</div></div></td></tr>
                    )}
                    {inventario.map((i, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight:500 }}>{i.producto?.nombre}</td>
                        <td><span className={`eb-stock-num ${getStockClass(i.estado)}`}>{i.stock}</span></td>
                        <td style={{ color:'#9A6735' }}>{i.minimo}</td>
                        <td><Chip label={i.estado} size="small" className={getChipClass(i.estado)} /></td>
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
    </Box>
  );
}