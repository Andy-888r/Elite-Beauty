import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { ShoppingCart, History, Person } from '@mui/icons-material';
import Sidebar from '../../components/shared/Sidebar';
import { clienteAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MARBLE_STYLES } from '../../styles/marble';

const MENU = [
  { label:'Inicio',    icon:<ShoppingCart />, path:'/cliente' },
  { label:'Comprar',   icon:<ShoppingCart />, path:'/cliente/compras' },
  { label:'Historial', icon:<History />,      path:'/cliente/historial' },
  { label:'Mi Perfil', icon:<Person />,       path:'/cliente/perfil' },
];

const extraStyles = `
  .eb-price { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:600; color:#9A6735; }
  .eb-date  { font-family:'Jost',sans-serif; font-size:0.8rem; color:#55883B; }
  .eb-qty   { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:#2C4A1E; }
`;

export default function ClienteHistorial() {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);

  useEffect(() => { clienteAPI.historial(user.id).then(r => setHistorial(r.data)); }, [user.id]);

  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>

        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Cuenta</p>
            <h1 className="eb-title">Historial de Compras</h1>
          </div>
        </div>

        <div className="eb-content">
          <p className="eb-section-label">
            {historial.length > 0 ? `${historial.length} compra(s) registrada(s)` : 'Sin compras aun'}
          </p>
          <div className="eb-table-wrap">
            <table className="eb-table">
              <thead>
                <tr><th>Fecha</th><th>Producto</th><th>Cantidad</th><th>Total</th></tr>
              </thead>
              <tbody>
                {historial.length === 0 && (
                  <tr><td colSpan={4}>
                    <div className="eb-empty">
                      <div className="eb-empty-icon">◈</div>
                      <div className="eb-empty-title">Sin compras aun</div>
                      <div className="eb-empty-sub"><span className="eb-ornament" />Explora nuestros productos<span className="eb-ornament" /></div>
                    </div>
                  </td></tr>
                )}
                {historial.map((h, idx) => (
                  <tr key={idx}>
                    <td><span className="eb-date">{new Date(h.fecha).toLocaleString('es-MX')}</span></td>
                    <td style={{ fontWeight:500 }}>{h.producto?.nombre}</td>
                    <td><span className="eb-qty">{h.cantidad}</span></td>
                    <td><span className="eb-price">${h.total?.toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Box>
    </Box>
  );
}