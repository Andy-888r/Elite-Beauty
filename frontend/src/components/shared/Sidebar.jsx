import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, Tooltip } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
 
const DRAWER_OPEN   = 260;
const DRAWER_CLOSED = 64;
const BASE = 'http://localhost:8080/api';
 
const IconInicio = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V10.5z"/>
    <path d="M9 22V12h6v10"/>
  </svg>
);
const IconProductos = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <circle cx="7" cy="7" r="1.2" fill={color} stroke="none"/>
  </svg>
);
const IconBanners = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="13" rx="2"/>
    <path d="M8 20h8M12 17v3"/>
    <path d="M6 8.5l3 3 4-4 3 2.5"/>
    <circle cx="8.5" cy="7.5" r="1" fill={color} stroke="none"/>
  </svg>
);
const IconClientes = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3.5"/>
    <path d="M2 21c0-4 3.13-7 7-7s7 3 7 7"/>
    <circle cx="18" cy="8" r="2.5"/>
    <path d="M22 21c0-2.5-1.8-4.5-4-5"/>
  </svg>
);
const IconProveedores = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"/>
    <path d="M9 22V12h6v10M9 12h6"/>
    <circle cx="12" cy="7.5" r="1.2" fill={color} stroke="none"/>
  </svg>
);
const IconInventario = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1.5"/>
    <rect x="2" y="10" width="20" height="5" rx="1.5"/>
    <rect x="2" y="17" width="20" height="5" rx="1.5"/>
    <line x1="6" y1="5.5" x2="6" y2="5.5" strokeWidth="2"/>
    <line x1="6" y1="12.5" x2="6" y2="12.5" strokeWidth="2"/>
    <line x1="6" y1="19.5" x2="6" y2="19.5" strokeWidth="2"/>
  </svg>
);
const IconReportes = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="12" y2="17"/>
  </svg>
);
const IconInicioCliente = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8 2 4 5.5 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.5-4-8-8-8z"/>
    <circle cx="12" cy="10" r="2.5"/>
  </svg>
);
const IconComprar = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const IconHistorial = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <polyline points="12 7 12 12 15.5 15.5"/>
  </svg>
);
const IconPerfil = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <path d="M16 3.5c1.5.8 2.5 2.3 2.5 4S17.5 10.7 16 11.5"/>
  </svg>
);
 
const ICON_MAP = {
  '/admin':             (c) => <IconInicio        color={c} />,
  '/admin/productos':   (c) => <IconProductos     color={c} />,
  '/admin/banners':     (c) => <IconBanners       color={c} />,
  '/admin/clientes':    (c) => <IconClientes      color={c} />,
  '/admin/proveedores': (c) => <IconProveedores   color={c} />,
  '/admin/inventario':  (c) => <IconInventario    color={c} />,
  '/admin/reportes':    (c) => <IconReportes      color={c} />,
  '/cliente':           (c) => <IconInicioCliente color={c} />,
  '/cliente/compras':   (c) => <IconComprar       color={c} />,
  '/cliente/historial': (c) => <IconHistorial     color={c} />,
  '/cliente/perfil':    (c) => <IconPerfil        color={c} />,
};
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');
  .eb-sidebar * { box-sizing: border-box; }
 
  .eb-sb-logo-box {
    width: 38px; height: 38px; border-radius: 3px; overflow: hidden;
    background: #fff;
    border: 1px solid rgba(44,74,30,0.25);
    box-shadow: 0 2px 8px rgba(44,74,30,0.15);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .eb-sb-brand {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.85rem; font-weight: 600;
    color: #1A3210;
    letter-spacing: 0.20em; text-transform: uppercase;
    line-height: 1; white-space: nowrap;
  }
  .eb-sb-divider {
    height: 1px; background: rgba(44,74,30,0.18); margin: 0 14px;
  }
  .eb-sb-divider.light { background: rgba(44,74,30,0.10); }
 
  .eb-sb-nav { padding: 6px 8px; flex: 1; }
  .eb-sb-item {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 12px; border-radius: 6px; cursor: pointer;
    margin-bottom: 2px; transition: all 0.18s;
    border: none; background: transparent;
    width: 100%; text-align: left; position: relative; outline: none;
  }
  .eb-sb-item:hover { background: rgba(44,74,30,0.10); }
  .eb-sb-item.active { background: #2C4A1E; box-shadow: 0 2px 10px rgba(44,74,30,0.30); }
  .eb-sb-item-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 20px; transition: transform 0.18s; }
  .eb-sb-item:hover:not(.active) .eb-sb-item-icon { transform: scale(1.10); }
  .eb-sb-item-label { font-family: 'Jost', sans-serif; font-size: 0.88rem; font-weight: 500; color: #1A3210; white-space: nowrap; transition: all 0.18s; letter-spacing: 0.02em; }
  .eb-sb-item:hover:not(.active) .eb-sb-item-label { color: #0D1F08; }
  .eb-sb-item.active .eb-sb-item-label { color: #C1E899; font-weight: 600; }
  .eb-sb-item.active::after { content: ''; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 6px; height: 6px; border-radius: 50%; background: #C1E899; }
 
  .eb-sb-toggle {
    width: 26px; height: 26px; border-radius: 4px;
    background: rgba(44,74,30,0.12); border: 1px solid rgba(44,74,30,0.20);
    cursor: pointer; color: #2C4A1E;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .eb-sb-toggle:hover { background: #2C4A1E; color: #C1E899; border-color: #2C4A1E; }
 
  .eb-sb-logout {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 12px; border-radius: 6px; cursor: pointer;
    margin: 0 8px 10px; transition: all 0.18s;
    border: 1px solid transparent; background: transparent;
    width: calc(100% - 16px); text-align: left;
  }
  .eb-sb-logout:hover { background: rgba(139,46,46,0.12); border-color: rgba(139,46,46,0.20); }
  .eb-sb-logout-label { font-family: 'Jost', sans-serif; font-size: 0.80rem; font-weight: 400; color: rgba(44,74,30,0.55); white-space: nowrap; letter-spacing: 0.04em; transition: color 0.18s; }
  .eb-sb-logout:hover .eb-sb-logout-label { color: #8B2E2E; }
 
  /* Avatar foto */
  .eb-sb-avatar-foto {
    width: 100%; height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
`;
 
const esAdmin = (rol) => rol?.toLowerCase() === 'admin';
 
export default function Sidebar({ items }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(true);
  const rol     = user?.rol;
  const isAdmin = esAdmin(rol);
 
  const bg       = '#2C4A1E';
  const border   = 'rgba(44,74,30,0.80)';
  const franja   = 'linear-gradient(90deg, #1A3210, #2C4A1E, #55883B, #C1E899)';
  const avBg     = 'rgba(193,232,153,0.20)';
  const avBorder = 'rgba(193,232,153,0.50)';
  const avColor  = '#C1E899';
  const nombreClr = '#E6F5D0';
  const badgeBg  = 'rgba(193,232,153,0.15)';
  const badgeClr = '#C1E899';
 
  // Foto de perfil del contexto (se actualiza en tiempo real al subir)
  const fotoSrc = user?.fotoPerfil ? `${BASE}${user.fotoPerfil}` : null;
  const inicial = user?.nombre?.charAt(0).toUpperCase() || '?';
 
  return (
    <>
      <style>{styles}</style>
      <Drawer variant="permanent" className="eb-sidebar" sx={{
        width: open ? DRAWER_OPEN : DRAWER_CLOSED,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_OPEN : DRAWER_CLOSED,
          boxSizing: 'border-box',
          background: '#C8E6A0',
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
          borderRight: '1px solid rgba(44,74,30,0.25)',
          boxShadow: '4px 0 20px rgba(44,74,30,0.15)',
          display: 'flex',
          flexDirection: 'column',
        }
      }}>
 
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          padding: open ? '16px 14px 14px' : '16px 0 14px', gap: '10px',
        }}>
          {open ? (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', minWidth:0 }}>
                <div className="eb-sb-logo-box">
                  <img src="/logo_elite_beauty.png" alt="EB"
                    style={{ width:'85%', height:'85%', objectFit:'contain' }}
                    onError={e => { e.target.style.display='none'; }} />
                </div>
                <span className="eb-sb-brand">Elite Beauty</span>
              </div>
              <button className="eb-sb-toggle" onClick={() => setOpen(false)}>
                <ChevronLeft style={{ fontSize:15 }} />
              </button>
            </>
          ) : (
            <Tooltip title="Elite Beauty" placement="right" arrow>
              <button className="eb-sb-toggle" onClick={() => setOpen(true)} style={{ width:36, height:36 }}>
                <ChevronRight style={{ fontSize:15 }} />
              </button>
            </Tooltip>
          )}
        </div>
 
        <div className="eb-sb-divider" />
 
        {/* ══ IDENTIFICADOR DE USUARIO ══ */}
        {open ? (
          <div style={{
            margin: '10px 10px 6px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: `1px solid ${border}`,
            boxShadow: '0 3px 14px rgba(0,0,0,0.18)',
          }}>
            {/* Franja degradada */}
            <div style={{ height:'4px', background: franja }} />
 
            {/* Cuerpo del identificador — más alto para que la foto sea visible */}
            <div style={{
              background: bg,
              padding: '16px 14px',
              display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              {/* Avatar circular — más grande, muestra foto o inicial */}
              <div style={{
                width: '56px', height: '56px',   // ← más grande que antes (era 42px)
                borderRadius: '50%', flexShrink: 0,
                background: avBg,
                border: `2px solid ${avBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {fotoSrc
                  ? <img className="eb-sb-avatar-foto" src={fotoSrc} alt="Perfil" />
                  : <span style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '1.8rem', fontWeight: 600,
                      color: avColor, lineHeight: 1,
                    }}>
                      {inicial}
                    </span>
                }
                {/* Punto de estado online */}
                <div style={{
                  position: 'absolute', bottom: '2px', right: '2px',
                  width: '11px', height: '11px', borderRadius: '50%',
                  background: avColor,
                  border: `2px solid ${bg}`,
                  zIndex: 1,
                }} />
              </div>
 
              {/* Nombre + badge */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.88rem', fontWeight: 600,
                  color: nombreClr,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  lineHeight: 1.3, marginBottom: '7px',
                }}>
                  {user?.nombre}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: badgeBg,
                  border: `1px solid ${badgeClr}40`,
                  padding: '3px 9px', borderRadius: '20px',
                }}>
                  <div style={{ width:'5px', height:'5px', borderRadius:'50%', background: badgeClr, flexShrink:0 }} />
                  <span style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.58rem', fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: badgeClr,
                  }}>
                    {user?.rol}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Versión colapsada — también muestra foto */
          <Tooltip title={`${user?.nombre} — ${user?.rol}`} placement="right" arrow>
            <div style={{ display:'flex', justifyContent:'center', padding:'10px 0', cursor:'default' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: bg,
                border: `2px solid ${avBorder}`,
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
                overflow: 'hidden',
              }}>
                {fotoSrc
                  ? <img className="eb-sb-avatar-foto" src={fotoSrc} alt="Perfil" />
                  : <span style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '1.2rem', fontWeight: 600,
                      color: avColor, lineHeight: 1,
                    }}>
                      {inicial}
                    </span>
                }
                {/* Badge de rol en la esquina */}
                <div style={{
                  position: 'absolute', bottom: '-2px', right: '-2px',
                  width: '14px', height: '14px', borderRadius: '4px',
                  background: avColor,
                  border: `1.5px solid #C8E6A0`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1,
                }}>
                  <span style={{ fontFamily:'Jost,sans-serif', fontSize:'0.34rem', fontWeight:700, color: bg }}>
                    {user?.rol?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </Tooltip>
        )}
 
        <div className="eb-sb-divider light" style={{ margin:'6px 14px 0' }} />
 
        {/* Menú */}
        <div className="eb-sb-nav" style={{ flex:1 }}>
          {items.map(({ label, path }) => {
            const isActive  = location.pathname === path;
            const iconColor = isActive ? '#C1E899' : '#2C4A1E';
            const iconFn    = ICON_MAP[path];
            return (
              <Tooltip key={path} title={!open ? label : ''} placement="right" arrow>
                <button
                  className={`eb-sb-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(path)}
                  style={{
                    justifyContent: open ? 'flex-start' : 'center',
                    paddingLeft:  open ? '12px' : '0',
                    paddingRight: open ? '12px' : '0',
                  }}>
                  <span className="eb-sb-item-icon">
                    {iconFn ? iconFn(iconColor) : null}
                  </span>
                  {open && <span className="eb-sb-item-label">{label}</span>}
                </button>
              </Tooltip>
            );
          })}
        </div>
 
        <div className="eb-sb-divider light" />
 
        {/* Cerrar sesión */}
        <Tooltip title={!open ? 'Cerrar sesion' : ''} placement="right" arrow>
          <button className="eb-sb-logout" onClick={logout}
            style={{ justifyContent: open ? 'flex-start' : 'center' }}>
            <span style={{ display:'flex', alignItems:'center', justifyContent:'center', width:20 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="rgba(44,74,30,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            {open && <span className="eb-sb-logout-label">Cerrar sesion</span>}
          </button>
        </Tooltip>
 
      </Drawer>
    </>
  );
}