import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
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

const extraStyles = `
  .eb-avatar-sq { width:36px; height:36px; border-radius:2px; background:rgba(85,136,59,0.15); border:1px solid rgba(85,136,59,0.25); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:#2C4A1E; flex-shrink:0; }
  .eb-id { font-family:'Cormorant Garamond',serif; font-size:1rem; color:#9A6735; }
`;

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);

  const cargar = () => adminAPI.clientes().then(r => setClientes(r.data));
  useEffect(() => { cargar(); }, []);

  const eliminar = async (id) => {
    if (!window.confirm('Eliminar este cliente?')) return;
    await adminAPI.eliminarCliente(id); toast.success('Cliente eliminado'); cargar();
  };

  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>

        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Comunidad</p>
            <h1 className="eb-title">Clientes</h1>
          </div>
        </div>

        <div className="eb-content">
          <p className="eb-section-label">Clientes registrados — {clientes.length} en total</p>
          <div className="eb-table-wrap">
            <table className="eb-table">
              <thead>
                <tr>
                  <th>#</th><th>Cliente</th><th>Usuario</th>
                  <th>Telefono</th><th>Correo</th><th>Direccion</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 && (
                  <tr><td colSpan={7}>
                    <div className="eb-empty">
                      <div className="eb-empty-icon">◈</div>
                      <div className="eb-empty-title">Sin clientes registrados</div>
                    </div>
                  </td></tr>
                )}
                {clientes.map(c => (
                  <tr key={c.id}>
                    <td><span className="eb-id">{c.id}</span></td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div className="eb-avatar-sq">{c.nombreCompleto?.charAt(0).toUpperCase()}</div>
                        <span style={{ fontWeight:500 }}>{c.nombreCompleto}</span>
                      </div>
                    </td>
                    <td style={{ color:'#55883B', fontSize:'0.82rem' }}>{c.usuario}</td>
                    <td style={{ color:'#55883B', fontSize:'0.82rem' }}>{c.telefono || '—'}</td>
                    <td style={{ color:'#55883B', fontSize:'0.82rem' }}>{c.correo}</td>
                    <td style={{ color:'#55883B', fontSize:'0.82rem', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.direccion || '—'}</td>
                    <td><button className="eb-btn-danger" onClick={() => eliminar(c.id)}>✕ Eliminar</button></td>
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