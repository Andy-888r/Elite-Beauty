import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
 
// Ladas más comunes primero, luego el resto
const LADAS = [
  { code: 'MX', dial: '+52',  flag: '🇲🇽', name: 'México' },
  { code: 'US', dial: '+1',   flag: '🇺🇸', name: 'Estados Unidos' },
  { code: 'CA', dial: '+1',   flag: '🇨🇦', name: 'Canadá' },
  { code: 'ES', dial: '+34',  flag: '🇪🇸', name: 'España' },
  { code: 'AR', dial: '+54',  flag: '🇦🇷', name: 'Argentina' },
  { code: 'CO', dial: '+57',  flag: '🇨🇴', name: 'Colombia' },
  { code: 'CL', dial: '+56',  flag: '🇨🇱', name: 'Chile' },
  { code: 'PE', dial: '+51',  flag: '🇵🇪', name: 'Perú' },
  { code: 'VE', dial: '+58',  flag: '🇻🇪', name: 'Venezuela' },
  { code: 'EC', dial: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: 'BO', dial: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: 'UY', dial: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: 'PY', dial: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: 'GT', dial: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: 'HN', dial: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: 'SV', dial: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: 'CR', dial: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: 'PA', dial: '+507', flag: '🇵🇦', name: 'Panamá' },
  { code: 'DO', dial: '+1',   flag: '🇩🇴', name: 'Rep. Dominicana' },
  { code: 'CU', dial: '+53',  flag: '🇨🇺', name: 'Cuba' },
  { code: 'BR', dial: '+55',  flag: '🇧🇷', name: 'Brasil' },
  { code: 'GB', dial: '+44',  flag: '🇬🇧', name: 'Reino Unido' },
  { code: 'FR', dial: '+33',  flag: '🇫🇷', name: 'Francia' },
  { code: 'DE', dial: '+49',  flag: '🇩🇪', name: 'Alemania' },
  { code: 'IT', dial: '+39',  flag: '🇮🇹', name: 'Italia' },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'JP', dial: '+81',  flag: '🇯🇵', name: 'Japón' },
  { code: 'CN', dial: '+86',  flag: '🇨🇳', name: 'China' },
];
 
export default function RegistroCliente() {
  const [form, setForm] = useState({
    usuario:'', contrasena:'', nombreCompleto:'', telefono:'', correo:'', direccion:''
  });
  const [lada, setLada]           = useState('+52');
  const [verPass, setVerPass]     = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const navigate  = useNavigate();
 
  const handleTelefono = (e) => {
    // Solo acepta dígitos, máximo 10
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm({ ...form, telefono: val });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.telefono.length !== 10) {
      setError('El teléfono debe tener exactamente 10 dígitos');
      return;
    }
    setLoading(true); setError('');
    try {
      const payload = { ...form, telefono: `${lada} ${form.telefono}` };
      await authAPI.registrarCliente(payload);
      toast.success('Cuenta creada correctamente. Inicia sesion con tus credenciales.');
      navigate('/login');
    } catch (err) { setError(err.response?.data || 'Error al registrarse'); }
    finally { setLoading(false); }
  };
 
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');
    * { box-sizing: border-box; }
    .eb-reg-bg {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden; padding: 40px 20px;
      background: #E8F2E0;
    }
    .eb-marble {
      position: absolute; inset: 0; z-index: 0;
      background:
        radial-gradient(ellipse 80% 60% at 15% 20%, rgba(85,136,59,0.18) 0%, transparent 60%),
        radial-gradient(ellipse 60% 80% at 85% 75%, rgba(85,136,59,0.14) 0%, transparent 55%),
        radial-gradient(ellipse 40% 40% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
        linear-gradient(135deg, #F0F7EA 0%, #E8F2E0 40%, #EDF5E4 70%, #F2F8EE 100%);
    }
    .eb-marble::before {
      content: ''; position: absolute; inset: 0;
      background:
        linear-gradient(105deg, transparent 30%, rgba(201,168,76,0.12) 31%, rgba(201,168,76,0.06) 32%, transparent 33%),
        linear-gradient(78deg,  transparent 50%, rgba(201,168,76,0.10) 51%, rgba(201,168,76,0.04) 52%, transparent 53%),
        linear-gradient(125deg, transparent 60%, rgba(201,168,76,0.08) 61%, transparent 62%);
    }
    .eb-reg-card {
      position: relative; z-index: 1; width: 100%; max-width: 460px;
      background: rgba(248,250,246,0.88); backdrop-filter: blur(20px);
      border: 1px solid rgba(201,168,76,0.35);
      box-shadow: 0 20px 60px rgba(44,74,30,0.18), inset 0 1px 0 rgba(255,255,255,0.80);
      border-radius: 4px; padding: 44px 44px 40px;
    }
    .eb-reg-header { text-align: center; margin-bottom: 32px; }
    .eb-reg-logo-box {
      width: 56px; height: 56px; border-radius: 4px; background: #fff;
      margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(44,74,30,0.15); border: 1px solid rgba(201,168,76,0.35);
    }
    .eb-reg-brand {
      font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600;
      color: #2C4A1E; letter-spacing: 0.22em; text-transform: uppercase; display: block;
    }
    .eb-reg-divider {
      width: 60px; height: 1px; margin: 10px auto;
      background: linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent);
    }
    .eb-reg-heading {
      font-family: 'Jost', sans-serif; font-size: 0.62rem; font-weight: 500;
      letter-spacing: 0.26em; text-transform: uppercase; color: rgba(44,74,30,0.45);
    }
    .eb-grid-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
    .eb-field-full { grid-column: 1 / -1; }
    .eb-field-label {
      font-family: 'Jost', sans-serif; font-size: 0.60rem; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase; color: rgba(44,74,30,0.55);
      display: block; margin-bottom: 5px;
    }
    .eb-field-input {
      width: 100%; background: rgba(230,240,220,0.50);
      border: 1px solid rgba(154,103,53,0.22); border-radius: 2px;
      padding: 11px 14px; color: #2C4A1E;
      font-family: 'Jost', sans-serif; font-size: 0.88rem; outline: none; transition: border-color 0.2s;
    }
    .eb-field-input:hover { border-color: rgba(154,103,53,0.42); }
    .eb-field-input:focus { border-color: rgba(154,103,53,0.65); box-shadow: 0 0 0 3px rgba(154,103,53,0.08); }
    .eb-field-input::placeholder { color: rgba(44,74,30,0.25); }
 
    /* Contraseña con ojo */
    .eb-field-pass { position: relative; }
    .eb-field-pass input { padding-right: 40px; }
    .eb-field-pass .eb-eye {
      position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: rgba(44,74,30,0.40); padding: 0; display: flex; transition: color 0.2s;
    }
    .eb-field-pass .eb-eye:hover { color: #55883B; }
 
    /* Teléfono con lada */
    .eb-tel-wrap { display: flex; gap: 0; }
    .eb-lada-select {
      background: rgba(230,240,220,0.70);
      border: 1px solid rgba(154,103,53,0.22); border-right: none;
      border-radius: 2px 0 0 2px;
      padding: 11px 8px; color: #2C4A1E;
      font-family: 'Jost', sans-serif; font-size: 0.82rem;
      outline: none; cursor: pointer; flex-shrink: 0;
      transition: border-color 0.2s;
      max-width: 110px;
    }
    .eb-lada-select:focus { border-color: rgba(154,103,53,0.65); }
    .eb-tel-input {
      flex: 1; background: rgba(230,240,220,0.50);
      border: 1px solid rgba(154,103,53,0.22); border-radius: 0 2px 2px 0;
      padding: 11px 14px; color: #2C4A1E;
      font-family: 'Jost', sans-serif; font-size: 0.88rem; outline: none;
      transition: border-color 0.2s;
    }
    .eb-tel-input:hover { border-color: rgba(154,103,53,0.42); }
    .eb-tel-input:focus { border-color: rgba(154,103,53,0.65); box-shadow: 0 0 0 3px rgba(154,103,53,0.08); }
    .eb-tel-input::placeholder { color: rgba(44,74,30,0.25); }
    .eb-tel-hint {
      font-family: 'Jost', sans-serif; font-size: 0.58rem;
      color: rgba(44,74,30,0.40); letter-spacing: 0.08em;
      margin-top: 4px; display: block;
    }
 
    .eb-btn-submit {
      width: 100%; margin-top: 24px; padding: 14px;
      background: linear-gradient(135deg, #2C4A1E 0%, #55883B 50%, #9A6735 100%);
      color: #F8FAF6; border: none; border-radius: 2px; cursor: pointer;
      font-family: 'Jost', sans-serif; font-size: 0.68rem; font-weight: 500;
      letter-spacing: 0.24em; text-transform: uppercase;
      box-shadow: 0 4px 20px rgba(85,136,59,0.30); transition: all 0.25s;
    }
    .eb-btn-submit:hover { box-shadow: 0 6px 28px rgba(85,136,59,0.48); transform: translateY(-1px); }
    .eb-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .eb-reg-footer {
      margin-top: 20px; text-align: center;
      font-family: 'Jost', sans-serif; font-size: 0.70rem;
      color: rgba(44,74,30,0.40); letter-spacing: 0.06em;
    }
    .eb-reg-footer a { color: #55883B; font-style: italic; text-decoration: none; }
    .eb-reg-footer a:hover { color: #2C4A1E; }
  `;
 
  return (
    <div className="eb-reg-bg">
      <style>{styles}</style>
      <div className="eb-marble" />
      <div className="eb-reg-card">
 
        <div className="eb-reg-header">
          <div className="eb-reg-logo-box">
            <img src="/logo_elite_beauty.png" alt="Elite Beauty"
              style={{ width:'80%', height:'80%', objectFit:'contain' }}
              onError={e => { e.target.style.display='none'; }} />
          </div>
          <span className="eb-reg-brand">Elite Beauty</span>
          <div className="eb-reg-divider" />
          <span className="eb-reg-heading">Crear cuenta nueva</span>
        </div>
 
        {error && <Alert severity="error" sx={{ mb:2, borderRadius:'2px', fontSize:'0.8rem' }}>{error}</Alert>}
 
        <form onSubmit={handleSubmit}>
          <div className="eb-grid-fields">
 
            {/* Usuario */}
            <div>
              <label className="eb-field-label">Usuario</label>
              <input className="eb-field-input" type="text" placeholder="Tu nombre de usuario"
                value={form.usuario} onChange={e => setForm({...form, usuario: e.target.value})} required />
            </div>
 
            {/* Contraseña con visibilidad */}
            <div>
              <label className="eb-field-label">Contrasena</label>
              <div className="eb-field-pass">
                <input className="eb-field-input"
                  type={verPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.contrasena}
                  onChange={e => setForm({...form, contrasena: e.target.value})} required />
                <button type="button" className="eb-eye" onClick={() => setVerPass(!verPass)}>
                  {verPass
                    ? <VisibilityOff style={{ fontSize:16 }} />
                    : <Visibility   style={{ fontSize:16 }} />}
                </button>
              </div>
            </div>
 
            {/* Nombre completo */}
            <div className="eb-field-full">
              <label className="eb-field-label">Nombre completo</label>
              <input className="eb-field-input" type="text" placeholder="Como aparecera en tu cuenta"
                value={form.nombreCompleto} onChange={e => setForm({...form, nombreCompleto: e.target.value})} required />
            </div>
 
            {/* Teléfono con lada */}
            <div className="eb-field-full">
              <label className="eb-field-label">Teléfono</label>
              <div className="eb-tel-wrap">
                <select className="eb-lada-select" value={lada} onChange={e => setLada(e.target.value)}>
                  {LADAS.map(l => (
                    <option key={`${l.code}-${l.dial}`} value={l.dial}>
                      {l.flag} {l.dial}
                    </option>
                  ))}
                </select>
                <input
                  className="eb-tel-input"
                  type="tel"
                  placeholder="10 dígitos"
                  value={form.telefono}
                  onChange={handleTelefono}
                  maxLength={10}
                  required
                />
              </div>
              <span className="eb-tel-hint">
                {form.telefono.length}/10 dígitos
                {form.telefono.length === 10 && ' ✓'}
              </span>
            </div>
 
            {/* Correo */}
            <div className="eb-field-full">
              <label className="eb-field-label">Correo</label>
              <input className="eb-field-input" type="email" placeholder="correo@ejemplo.com"
                value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} required />
            </div>
 
            {/* Dirección */}
            <div className="eb-field-full">
              <label className="eb-field-label">Direccion</label>
              <input className="eb-field-input" type="text" placeholder="Tu direccion de entrega"
                value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} required />
            </div>
 
          </div>
 
          <button className="eb-btn-submit" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={18} sx={{ color:'#F8FAF6' }} /> : 'Crear cuenta'}
          </button>
        </form>
 
        <p className="eb-reg-footer">
          Ya tienes cuenta? <Link to="/login">Inicia sesion aqui</Link>
        </p>
      </div>
    </div>
  );
}