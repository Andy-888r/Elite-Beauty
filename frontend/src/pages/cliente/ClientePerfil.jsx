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
 
const PREFERENCIAS = ['Maquillaje','Cuidado de piel','Cabello','Fragancias','Unas','Tratamientos faciales'];
const CAMPOS = [
  ['nombreCompleto','Nombre completo','text'],
  ['telefono','Telefono','text'],
  ['correo','Correo','email'],
  ['direccion','Direccion','text'],
];
 
const BASE = 'http://localhost:8080/api';
 
const extraStyles = `
  .eb-card { max-width:540px; border-radius:2px; padding:36px 40px; }
  .eb-card-section { font-family:'Jost',sans-serif; font-size:0.62rem; font-weight:500; letter-spacing:0.24em; text-transform:uppercase; color:#55883B; margin-bottom:20px; }
  .eb-field-wrap { margin-bottom:16px; }
  .eb-field-label { font-family:'Jost',sans-serif; font-size:0.62rem; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:#55883B; display:block; margin-bottom:6px; }
  .eb-field-input { width:100%; background:rgba(230,240,220,0.50); border:1px solid rgba(85,136,59,0.22); border-radius:2px; padding:12px 16px; color:#2C4A1E; font-family:'Jost',sans-serif; font-size:0.9rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
  .eb-field-input:hover { border-color:rgba(85,136,59,0.45); }
  .eb-field-input:focus { border-color:#55883B; box-shadow:0 0 0 3px rgba(85,136,59,0.08); }
  .eb-divider { height:1px; background:rgba(85,136,59,0.12); margin:28px 0; }
  .eb-prefs-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .eb-pref-item { display:flex; align-items:center; gap:10px; cursor:pointer; padding:10px 14px; border-radius:2px; border:1px solid rgba(85,136,59,0.18); transition:all 0.2s; background:rgba(240,247,234,0.60); }
  .eb-pref-item:hover { border-color:rgba(85,136,59,0.40); }
  .eb-pref-item.checked { border-color:#55883B; background:rgba(85,136,59,0.10); }
  .eb-pref-box { width:16px; height:16px; border-radius:2px; border:1px solid rgba(85,136,59,0.40); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.2s; }
  .eb-pref-item.checked .eb-pref-box { background:#55883B; border-color:#55883B; }
  .eb-pref-label { font-family:'Jost',sans-serif; font-size:0.80rem; color:#2C4A1E; }
  .eb-btn-save { margin-top:28px; padding:13px 32px; background:linear-gradient(135deg,#2C4A1E,#55883B); color:#F4F9F0; border:none; border-radius:2px; cursor:pointer; font-family:'Jost',sans-serif; font-size:0.68rem; font-weight:500; letter-spacing:0.20em; text-transform:uppercase; transition:all 0.2s; box-shadow:0 2px 12px rgba(85,136,59,0.25); }
  .eb-btn-save:hover { box-shadow:0 4px 20px rgba(85,136,59,0.40); transform:translateY(-1px); }
 
  .eb-avatar-wrap { display:flex; flex-direction:column; align-items:center; margin-bottom:32px; gap:14px; }
  .eb-avatar-ring { width:110px; height:110px; border-radius:50%; border:2px solid rgba(85,136,59,0.30); padding:3px; background:rgba(248,252,244,0.90); position:relative; cursor:pointer; transition:border-color 0.2s; }
  .eb-avatar-ring:hover { border-color:#55883B; }
  .eb-avatar-img { width:100%; height:100%; border-radius:50%; object-fit:cover; display:block; }
  .eb-avatar-letter { width:100%; height:100%; border-radius:50%; background:rgba(85,136,59,0.10); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:2.6rem; font-weight:600; color:#55883B; }
  .eb-avatar-overlay { position:absolute; inset:0; border-radius:50%; background:rgba(44,74,30,0.0); display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
  .eb-avatar-ring:hover .eb-avatar-overlay { background:rgba(44,74,30,0.35); }
  .eb-avatar-overlay-icon { color:#F4F9F0; font-size:1.4rem; opacity:0; transition:opacity 0.2s; }
  .eb-avatar-ring:hover .eb-avatar-overlay-icon { opacity:1; }
  .eb-avatar-hint { font-family:'Jost',sans-serif; font-size:0.65rem; letter-spacing:0.14em; text-transform:uppercase; color:#55883B; opacity:0.7; }
  .eb-avatar-uploading { font-family:'Jost',sans-serif; font-size:0.72rem; color:#55883B; animation:pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
`;
 
export default function ClientePerfil() {
  const { user, actualizarFoto } = useAuth();
  const [form, setForm]           = useState({ nombreCompleto:'', telefono:'', correo:'', direccion:'', preferencias:[], fotoPerfil:'' });
  const [uploading, setUploading] = useState(false);
 
  useEffect(() => {
    clienteAPI.perfil(user.id).then(r => {
      const d = r.data;
      setForm({
        ...d,
        preferencias: Array.isArray(d.preferencias) ? d.preferencias : (d.preferencias ? d.preferencias.split(',') : [])
      });
    });
  }, [user.id]);
 
  const togglePref = (op) => {
    const arr = form.preferencias.includes(op)
      ? form.preferencias.filter(p => p !== op)
      : [...form.preferencias, op];
    setForm({ ...form, preferencias: arr });
  };
 
  const guardar = async () => {
    try { await clienteAPI.actualizar(user.id, form); toast.success('Perfil actualizado'); }
    catch { toast.error('Error al actualizar'); }
  };
 
  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('foto', file);
      const res = await clienteAPI.subirFoto(user.id, fd);
      setForm(f => ({ ...f, fotoPerfil: res.data }));
      actualizarFoto(res.data); // ← actualiza contexto → Sidebar se refresca solo
      toast.success('Foto actualizada');
    } catch {
      toast.error('Error al subir la foto');
    } finally {
      setUploading(false);
    }
  };
 
  const inicialLetra = form.nombreCompleto?.charAt(0).toUpperCase() || user?.usuario?.charAt(0).toUpperCase() || '?';
  const fotoSrc      = form.fotoPerfil ? `${BASE}${form.fotoPerfil}` : null;
 
  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>
 
        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Cuenta</p>
            <h1 className="eb-title">Mi Perfil</h1>
          </div>
        </div>
 
        <div className="eb-content">
          <div className="eb-card eb-card-wrap">
 
            {/* Foto de perfil */}
            <div className="eb-avatar-wrap">
              <label style={{ cursor:'pointer' }}>
                <div className="eb-avatar-ring">
                  {fotoSrc
                    ? <img className="eb-avatar-img" src={fotoSrc} alt="Foto de perfil" />
                    : <div className="eb-avatar-letter">{inicialLetra}</div>
                  }
                  <div className="eb-avatar-overlay">
                    <span className="eb-avatar-overlay-icon">✎</span>
                  </div>
                </div>
                <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleFoto} />
              </label>
              {uploading
                ? <span className="eb-avatar-uploading">Subiendo...</span>
                : <span className="eb-avatar-hint">Haz clic para cambiar foto</span>
              }
            </div>
 
            <div className="eb-divider" style={{ marginTop:0 }} />
 
            <p className="eb-card-section">Informacion personal</p>
            {CAMPOS.map(([name, label, type]) => (
              <div className="eb-field-wrap" key={name}>
                <label className="eb-field-label">{label}</label>
                <input className="eb-field-input" type={type} value={form[name] || ''} onChange={e => setForm({...form, [name]: e.target.value})} />
              </div>
            ))}
 
            <div className="eb-divider" />
 
            <p className="eb-card-section">Preferencias</p>
            <div className="eb-prefs-grid">
              {PREFERENCIAS.map(op => (
                <div key={op} className={`eb-pref-item ${form.preferencias?.includes(op) ? 'checked' : ''}`} onClick={() => togglePref(op)}>
                  <div className="eb-pref-box">
                    {form.preferencias?.includes(op) && <span style={{ color:'#F4F9F0', fontSize:10, lineHeight:1 }}>✓</span>}
                  </div>
                  <span className="eb-pref-label">{op}</span>
                </div>
              ))}
            </div>
 
            <button className="eb-btn-save" onClick={guardar}>Guardar cambios</button>
          </div>
        </div>
      </Box>
    </Box>
  );
}