import React, { useEffect, useState } from 'react';
import { Box, Chip } from '@mui/material';
import { Assessment, Inventory, People, Store, Notifications } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Sidebar from '../../components/shared/Sidebar';
import { solicitudesAPI } from '../../services/api';
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
  .eb-btn-approve { font-family:'Jost',sans-serif; font-size:0.65rem; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; background:transparent; color:#55883B; border:1px solid rgba(85,136,59,0.35); padding:7px 14px; border-radius:2px; cursor:pointer; transition:all 0.2s; }
  .eb-btn-approve:hover { background:rgba(85,136,59,0.08); border-color:#55883B; }
  .eb-btn-reject  { font-family:'Jost',sans-serif; font-size:0.65rem; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; background:transparent; color:#8B2E2E; border:1px solid rgba(139,46,46,0.30); padding:7px 14px; border-radius:2px; cursor:pointer; transition:all 0.2s; }
  .eb-btn-reject:hover { background:rgba(139,46,46,0.06); border-color:#8B2E2E; }
  .eb-chip-pending { background:rgba(154,103,53,0.15) !important; color:#5C3A1E !important; font-family:'Jost',sans-serif !important; font-size:0.6rem !important; letter-spacing:0.14em !important; border-radius:2px !important; height:22px !important; }
  .eb-actions { display:flex; gap:8px; }
  .eb-id { font-family:'Cormorant Garamond',serif; font-size:1rem; color:#9A6735; }
`;

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);

  const cargar = async () => {
    const res = await solicitudesAPI.listarPendientes();
    setSolicitudes(res.data);
  };
  useEffect(() => { cargar(); }, []);

  const aprobar  = async (id) => { try { await solicitudesAPI.aprobar(id);  toast.success('Solicitud aprobada');  cargar(); } catch { toast.error('Error al aprobar'); } };
  const rechazar = async (id) => { await solicitudesAPI.rechazar(id); toast.info('Solicitud rechazada'); cargar(); };

  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>

        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Abastecimiento</p>
            <h1 className="eb-title">Solicitudes de Entrada</h1>
          </div>
        </div>

        <div className="eb-content">
          <p className="eb-section-label">{solicitudes.length > 0 ? `${solicitudes.length} solicitud(es) pendiente(s)` : 'Sin solicitudes pendientes'}</p>
          <div className="eb-table-wrap">
            <table className="eb-table">
              <thead>
                <tr><th>#</th><th>Proveedor</th><th>Producto</th><th>Cantidad</th><th>Fecha</th><th>Motivo</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {solicitudes.length === 0 && (
                  <tr><td colSpan={8}>
                    <div className="eb-empty">
                      <div className="eb-empty-icon">✓</div>
                      <div className="eb-empty-title">Todo al dia</div>
                      <div className="eb-empty-sub">No hay solicitudes pendientes</div>
                    </div>
                  </td></tr>
                )}
                {solicitudes.map(s => (
                  <tr key={s.id}>
                    <td><span className="eb-id">{s.id}</span></td>
                    <td style={{ fontWeight:500 }}>{s.nombreProveedor}</td>
                    <td>{s.nombreProducto}</td>
                    <td style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.1rem', fontWeight:600, color:'#55883B' }}>{s.cantidad}</td>
                    <td style={{ color:'#55883B', fontSize:'0.82rem' }}>{new Date(s.fecha).toLocaleDateString('es-MX')}</td>
                    <td style={{ color:'#55883B', fontSize:'0.82rem', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.motivo}</td>
                    <td><Chip label="Pendiente" size="small" className="eb-chip-pending" /></td>
                    <td>
                      <div className="eb-actions">
                        <button className="eb-btn-approve" onClick={() => aprobar(s.id)}>✓ Aprobar</button>
                        <button className="eb-btn-reject"  onClick={() => rechazar(s.id)}>✕ Rechazar</button>
                      </div>
                    </td>
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