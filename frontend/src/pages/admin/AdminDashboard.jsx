import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Assessment, Inventory, People, Store } from '@mui/icons-material';
import Sidebar from '../../components/shared/Sidebar';
import { inventarioAPI } from '../../services/api';
import { MARBLE_STYLES } from '../../styles/marble';
import AlertaBajoStock from '../../components/shared/AlertaBajoStock';
 
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
  .eb-loading { text-align:center; padding:80px 20px; font-family:'Jost',sans-serif; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; color:#55883B; animation:pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
 
  /* Recuadros de resumen */
  .eb-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 8px;
  }
  .eb-summary-tile {
    border-radius: 4px;
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid transparent;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .eb-summary-tile:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(44,74,30,0.12); }
 
  .eb-summary-tile.error   { background: rgba(139,46,46,0.06);  border-color: rgba(139,46,46,0.18); }
  .eb-summary-tile.warning { background: rgba(154,103,53,0.07); border-color: rgba(154,103,53,0.20); }
  .eb-summary-tile.neutral { background: rgba(85,136,59,0.07);  border-color: rgba(85,136,59,0.20); }
 
  .eb-tile-icon {
    font-size: 1.4rem;
    line-height: 1;
    margin-bottom: 4px;
  }
  .eb-tile-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 600;
    line-height: 1;
  }
  .eb-tile-num.error   { color: #8B2E2E; }
  .eb-tile-num.warning { color: #9A6735; }
  .eb-tile-num.neutral { color: #55883B; }
 
  .eb-tile-label {
    font-family: 'Jost', sans-serif;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    color: #2C4A1E;
  }
  .eb-tile-sub {
    font-family: 'Jost', sans-serif;
    font-size: 0.72rem;
    color: #55883B;
    opacity: 0.75;
    margin-top: 2px;
  }
`;
 
export default function AdminDashboard() {
  const [alertas, setAlertas]   = useState([]);
  const [cargando, setCargando] = useState(true);
 
  useEffect(() => {
    inventarioAPI.listar()
      .then(r => {
        const criticos = r.data.filter(i => i.estado === 'BAJO' || i.estado === 'SIN STOCK');
        criticos.sort((a, b) => {
          if (a.estado === 'SIN STOCK' && b.estado !== 'SIN STOCK') return -1;
          if (b.estado === 'SIN STOCK' && a.estado !== 'SIN STOCK') return 1;
          return 0;
        });
        setAlertas(criticos);
      })
      .finally(() => setCargando(false));
  }, []);
 
  const sinStock = alertas.filter(i => i.estado === 'SIN STOCK').length;
  const bajo     = alertas.filter(i => i.estado === 'BAJO').length;
 
  const alertasLogin = JSON.parse(localStorage.getItem('alertas_stock') || '[]');
 
  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1, position:'relative' }}>
        <AlertaBajoStock alertas={alertasLogin} />
 
        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Panel</p>
            <h1 className="eb-title">Alertas de Inventario</h1>
          </div>
          <div style={{ fontFamily:'Jost,sans-serif', fontSize:'0.72rem', letterSpacing:'0.12em', color:'#9A6735', textTransform:'uppercase' }}>
            {new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </div>
        </div>
 
        <div className="eb-content">
          {cargando ? (
            <div className="eb-loading">Verificando inventario...</div>
          ) : alertas.length === 0 ? (
            <div className="eb-empty">
              <div className="eb-empty-icon">✓</div>
              <div className="eb-empty-title">Inventario en orden</div>
              <div className="eb-empty-sub">
                <span className="eb-ornament" />
                Todos los productos tienen stock suficiente
                <span className="eb-ornament" />
              </div>
            </div>
          ) : (
            <>
              <p className="eb-section-label">Resumen de alertas</p>
 
              {/* ── Solo recuadros, sin tabla ── */}
              <div className="eb-summary-grid">
 
                {sinStock > 0 && (
                  <div className="eb-summary-tile error">
                    <span className="eb-tile-icon">⚠</span>
                    <div className={`eb-tile-num error`}>{sinStock}</div>
                    <div className="eb-tile-label">Sin stock</div>
                    <div className="eb-tile-sub">Productos agotados</div>
                  </div>
                )}
 
                {bajo > 0 && (
                  <div className="eb-summary-tile warning">
                    <span className="eb-tile-icon">↓</span>
                    <div className={`eb-tile-num warning`}>{bajo}</div>
                    <div className="eb-tile-label">Stock bajo</div>
                    <div className="eb-tile-sub">Por debajo del mínimo</div>
                  </div>
                )}
 
                <div className="eb-summary-tile neutral">
                  <span className="eb-tile-icon">◈</span>
                  <div className={`eb-tile-num neutral`}>{alertas.length}</div>
                  <div className="eb-tile-label">Total alertas</div>
                  <div className="eb-tile-sub">Requieren atención</div>
                </div>
 
              </div>
            </>
          )}
        </div>
      </Box>
    </Box>
  );
}