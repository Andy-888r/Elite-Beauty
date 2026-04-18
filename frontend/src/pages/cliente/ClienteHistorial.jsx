import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { ShoppingCart, History, Person } from '@mui/icons-material';
import { toast } from 'react-toastify';
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

  .eb-compra-grupo {
    margin-bottom: 24px; border-radius: 2px; overflow: hidden;
    border: 1px solid rgba(85,136,59,0.15);
  }
  .eb-compra-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px;
    background: rgba(85,136,59,0.10);
    border-bottom: 1px solid rgba(85,136,59,0.12);
  }
  .eb-compra-fecha {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 600; color: #2C4A1E;
  }
  .eb-compra-total {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; color: #9A6735;
  }
  .eb-download-btn {
    font-family: 'Jost', sans-serif; font-size: 0.62rem; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    background: #2C4A1E; color: #C1E899;
    border: none; border-radius: 2px; padding: 7px 14px;
    cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: all 0.2s;
  }
  .eb-download-btn:hover { background: #55883B; }
  .eb-download-btn:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// Agrupar por idOrden — si no tiene usa la fecha como fallback
function agruparPorCompra(historial) {
  const grupos = {};
  historial.forEach(h => {
    const key = h.idOrden || h.fecha;
    if (!grupos[key]) grupos[key] = { items: [], fecha: h.fecha, idOrden: h.idOrden };
    grupos[key].items.push(h);
  });
  return Object.entries(grupos)
    .sort((a, b) => new Date(b[1].fecha) - new Date(a[1].fecha));
}

export default function ClienteHistorial() {
  const { user } = useAuth();
  const [historial, setHistorial]   = useState([]);
  const [descargando, setDescargando] = useState(null);

  useEffect(() => {
    clienteAPI.historial(user.id).then(r => setHistorial(r.data));
  }, [user.id]);

  const handleDescargar = async (idOrden) => {
    setDescargando(idOrden);
    try {
      const res = await clienteAPI.descargarTicket(user.id, idOrden);
      const url  = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ticket-elite-beauty.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Error al descargar el ticket');
    } finally {
      setDescargando(null);
    }
  };

  const grupos = agruparPorCompra(historial);

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
            {grupos.length > 0
              ? `${grupos.length} compra(s) registrada(s)`
              : 'Sin compras aun'}
          </p>

          {grupos.length === 0 ? (
            <div className="eb-empty">
              <div className="eb-empty-icon">◈</div>
              <div className="eb-empty-title">Sin compras aun</div>
              <div className="eb-empty-sub">
                <span className="eb-ornament" />
                Explora nuestros productos
                <span className="eb-ornament" />
              </div>
            </div>
          ) : (
            grupos.map(([idOrden, grupo]) => {
              const items      = grupo.items;
              const totalGrupo = items.reduce((s, h) => s + (h.total ?? 0), 0);
              const fechaFormato = new Date(grupo.fecha).toLocaleString('es-MX', {
                year:'numeric', month:'long', day:'numeric',
                hour:'2-digit', minute:'2-digit'
              });

              return (
                <div className="eb-compra-grupo" key={idOrden}>

                  {/* Header */}
                  <div className="eb-compra-header">
                    <div>
                      <div className="eb-compra-fecha">{fechaFormato}</div>
                      <div style={{
                        fontFamily:'Jost,sans-serif', fontSize:'0.68rem',
                        color:'#55883B', marginTop:2
                      }}>
                        {items.length} producto(s)
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                      <span className="eb-compra-total">
                        ${totalGrupo.toFixed(2)}
                      </span>
                      <button
                        className="eb-download-btn"
                        onClick={() => handleDescargar(idOrden)}
                        disabled={descargando === idOrden}>
                        {descargando === idOrden ? '...' : '↓ Ticket'}
                      </button>
                    </div>
                  </div>

                  {/* Tabla de productos */}
                  <div className="eb-table-wrap" style={{ border:'none' }}>
                    <table className="eb-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((h, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight:500 }}>{h.producto?.nombre}</td>
                            <td><span className="eb-qty">{h.cantidad}</span></td>
                            <td><span className="eb-price">${h.total?.toFixed(2)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </Box>
    </Box>
  );
}