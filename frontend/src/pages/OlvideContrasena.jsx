import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { resetAPI } from '../services/api';
 
const PASOS = { CORREO: 1, CODIGO: 2, NUEVA: 3, LISTO: 4 };
 
export default function OlvideContrasena() {
  const [paso, setPaso]         = useState(PASOS.CORREO);
  const [correo, setCorreo]     = useState('');
  const [codigo, setCodigo]     = useState('');
  const [nueva, setNueva]       = useState('');
  const [confirma, setConfirma] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [verNueva, setVerNueva]         = useState(false);
  const [verConfirma, setVerConfirma]   = useState(false);
  const navigate = useNavigate();
 
  const limpiarError = () => setError('');
 
  const handleEnviarCorreo = async (e) => {
    e.preventDefault(); setLoading(true); limpiarError();
    try {
      await resetAPI.solicitarCodigo({ correo });
      setPaso(PASOS.CODIGO);
    } catch (err) {
      setError(err.response?.data || 'Error al enviar el codigo');
    } finally { setLoading(false); }
  };
 
  const handleVerificarCodigo = async (e) => {
    e.preventDefault(); setLoading(true); limpiarError();
    try {
      await resetAPI.verificarCodigo({ correo, codigo });
      setPaso(PASOS.NUEVA);
    } catch (err) {
      setError(err.response?.data || 'Codigo invalido o expirado');
    } finally { setLoading(false); }
  };
 
  const handleNuevaContrasena = async (e) => {
    e.preventDefault(); limpiarError();
    if (nueva !== confirma) { setError('Las contrasenas no coinciden'); return; }
    if (nueva.length < 6)   { setError('La contrasena debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    try {
      await resetAPI.nuevaContrasena({ correo, codigo, nuevaContrasena: nueva });
      setPaso(PASOS.LISTO);
    } catch (err) {
      setError(err.response?.data || 'Error al cambiar la contrasena');
    } finally { setLoading(false); }
  };
 
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
 
    .eb-bg {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden; background: #E8F2E0;
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
        linear-gradient(78deg,  transparent 50%, rgba(201,168,76,0.10) 51%, rgba(201,168,76,0.04) 52%, transparent 53%);
    }
    .eb-marble::after {
      content: ''; position: absolute; inset: 0;
      background:
        linear-gradient(115deg, transparent 20%, rgba(44,74,30,0.07) 21%, transparent 23%),
        linear-gradient(88deg,  transparent 65%, rgba(85,136,59,0.08) 66%, transparent 68%);
    }
 
    .eb-card {
      position: relative; z-index: 1; width: 420px;
      background: rgba(248,250,246,0.90); backdrop-filter: blur(20px);
      border: 1px solid rgba(201,168,76,0.35);
      box-shadow: 0 20px 60px rgba(44,74,30,0.18), inset 0 1px 0 rgba(255,255,255,0.80);
      border-radius: 4px; padding: 44px 44px 40px;
    }
 
    /* Botón regresar */
    .eb-back-btn {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: none; cursor: pointer;
      color: rgba(44,74,30,0.50); font-family: 'Jost', sans-serif;
      font-size: 0.68rem; letter-spacing: 0.08em;
      padding: 0; margin-bottom: 20px;
      transition: color 0.2s;
    }
    .eb-back-btn:hover { color: #55883B; }
 
    .eb-card-header { text-align: center; margin-bottom: 24px; }
    .eb-logo-box {
      width: 60px; height: 60px; border-radius: 4px; background: #fff;
      border: 1px solid rgba(201,168,76,0.35); margin: 0 auto 14px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(44,74,30,0.12);
    }
    .eb-brand {
      font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600;
      color: #2C4A1E; letter-spacing: 0.22em; text-transform: uppercase; display: block;
    }
    .eb-divider {
      width: 60px; height: 1px; margin: 8px auto;
      background: linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent);
    }
 
    .eb-steps { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 24px; }
    .eb-step {
      display: flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: 50%;
      font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 600;
      border: 1.5px solid rgba(85,136,59,0.30); color: rgba(44,74,30,0.40);
      background: transparent; transition: all 0.3s;
    }
    .eb-step.active { background: #55883B; border-color: #55883B; color: #fff; }
    .eb-step.done   { background: #2C4A1E; border-color: #2C4A1E; color: #C1E899; }
    .eb-step-line { width: 32px; height: 1px; background: rgba(85,136,59,0.25); }
 
    .eb-step-title {
      font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600;
      color: #2C4A1E; text-align: center; margin-bottom: 6px;
    }
    .eb-step-desc {
      font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.06em;
      color: rgba(44,74,30,0.55); text-align: center; margin-bottom: 24px; line-height: 1.6;
    }
    .eb-step-desc strong { color: #2C4A1E; font-weight: 500; }
 
    .eb-field-wrap { margin-bottom: 14px; }
    .eb-field-label {
      font-family: 'Jost', sans-serif; font-size: 0.62rem; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase; color: rgba(44,74,30,0.60);
      display: block; margin-bottom: 6px;
    }
    .eb-field-input {
      width: 100%; background: rgba(230,240,220,0.50);
      border: 1px solid rgba(154,103,53,0.25); border-radius: 2px;
      padding: 12px 16px; color: #2C4A1E;
      font-family: 'Jost', sans-serif; font-size: 0.9rem; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .eb-field-input:hover { border-color: rgba(154,103,53,0.45); }
    .eb-field-input:focus { border-color: rgba(154,103,53,0.70); box-shadow: 0 0 0 3px rgba(154,103,53,0.08); }
    .eb-field-input::placeholder { color: rgba(44,74,30,0.30); }
 
    /* Campo contraseña con ojo */
    .eb-field-pass { position: relative; }
    .eb-field-pass input { padding-right: 44px; }
    .eb-field-pass button {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: rgba(44,74,30,0.40); padding: 0; display: flex; transition: color 0.2s;
    }
    .eb-field-pass button:hover { color: #55883B; }
 
    .eb-codigo-input {
      width: 100%; text-align: center; letter-spacing: 0.5em;
      font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 600;
      color: #2C4A1E; background: rgba(230,240,220,0.50);
      border: 1.5px solid rgba(154,103,53,0.30); border-radius: 2px;
      padding: 14px 16px; outline: none; transition: all 0.2s;
    }
    .eb-codigo-input:focus { border-color: #55883B; box-shadow: 0 0 0 3px rgba(85,136,59,0.10); }
 
    .eb-btn {
      width: 100%; margin-top: 20px; padding: 14px; border: none; border-radius: 2px;
      cursor: pointer; font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 500;
      letter-spacing: 0.24em; text-transform: uppercase; transition: all 0.25s;
      background: linear-gradient(135deg, #2C4A1E 0%, #55883B 50%, #9A6735 100%);
      color: #F8FAF6; box-shadow: 0 4px 20px rgba(85,136,59,0.30);
    }
    .eb-btn:hover { box-shadow: 0 6px 28px rgba(85,136,59,0.48); transform: translateY(-1px); }
    .eb-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
 
    .eb-link-row {
      margin-top: 16px; text-align: center;
      font-family: 'Jost', sans-serif; font-size: 0.70rem;
      color: rgba(44,74,30,0.45); letter-spacing: 0.04em;
    }
    .eb-link-row a { color: #55883B; text-decoration: none; font-style: italic; }
    .eb-link-row a:hover { color: #2C4A1E; }
    .eb-link-row button {
      background: none; border: none; cursor: pointer;
      color: #55883B; font-style: italic; font-size: 0.70rem;
      font-family: 'Jost', sans-serif; padding: 0; letter-spacing: 0.04em;
    }
    .eb-link-row button:hover { color: #2C4A1E; }
 
    .eb-success { text-align: center; padding: 20px 0; }
    .eb-success-icon {
      width: 64px; height: 64px; border-radius: 50%;
      background: rgba(85,136,59,0.12); border: 2px solid rgba(85,136,59,0.40);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px; font-size: 1.8rem;
    }
    .eb-success-title {
      font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600;
      color: #2C4A1E; margin-bottom: 8px;
    }
    .eb-success-sub {
      font-family: 'Jost', sans-serif; font-size: 0.75rem;
      color: rgba(44,74,30,0.55); letter-spacing: 0.06em; line-height: 1.6;
      margin-bottom: 28px;
    }
    .eb-divider-h { height: 1px; margin: 18px 0 0; background: linear-gradient(90deg, transparent, rgba(154,103,53,0.20), transparent); }
  `;
 
  const StepIndicator = () => (
    <div className="eb-steps">
      {[1, 2, 3].map((n, i) => (
        <React.Fragment key={n}>
          {i > 0 && <div className="eb-step-line" />}
          <div className={`eb-step ${paso > n ? 'done' : paso === n ? 'active' : ''}`}>
            {paso > n ? '✓' : n}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
 
  return (
    <div className="eb-bg">
      <style>{styles}</style>
      <div className="eb-marble" />
      <div className="eb-card">
 
        {/* Header */}
        <div className="eb-card-header">
          <div className="eb-logo-box">
            <img src="/logo_elite_beauty.png" alt="Elite Beauty"
              style={{ width:'80%', height:'80%', objectFit:'contain' }}
              onError={e => { e.target.style.display='none'; }} />
          </div>
          <span className="eb-brand">Elite Beauty</span>
          <div className="eb-divider" />
        </div>
 
        {/* ── PASO 1: Correo ── */}
        {paso === PASOS.CORREO && (
          <>
            {/* Botón regresar al login */}
            <button className="eb-back-btn" onClick={() => navigate('/login')}>
              ← Regresar al inicio de sesión
            </button>
            <StepIndicator />
            <h2 className="eb-step-title">Olvide mi contrasena</h2>
            <p className="eb-step-desc">
              Ingresa el correo con el que te registraste y te enviaremos un codigo de verificacion.
            </p>
            {error && <Alert severity="error" sx={{ mb:2, borderRadius:'2px', fontSize:'0.8rem' }}>{error}</Alert>}
            <form onSubmit={handleEnviarCorreo}>
              <div className="eb-field-wrap">
                <label className="eb-field-label">Correo electronico</label>
                <input className="eb-field-input" type="email" placeholder="tucorreo@ejemplo.com"
                  value={correo} onChange={e => setCorreo(e.target.value)} required autoFocus />
              </div>
              <button className="eb-btn" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={18} sx={{ color:'#F8FAF6' }} /> : 'Enviar codigo'}
              </button>
            </form>
          </>
        )}
 
        {/* ── PASO 2: Código ── */}
        {paso === PASOS.CODIGO && (
          <>
            {/* Botón regresar al paso anterior */}
            <button className="eb-back-btn" onClick={() => { limpiarError(); setPaso(PASOS.CORREO); }}>
              ← Cambiar correo
            </button>
            <StepIndicator />
            <h2 className="eb-step-title">Ingresa el codigo</h2>
            <p className="eb-step-desc">
              Enviamos un codigo de 6 digitos a <strong>{correo}</strong>.
              Revisa tu bandeja de entrada.
            </p>
            {error && <Alert severity="error" sx={{ mb:2, borderRadius:'2px', fontSize:'0.8rem' }}>{error}</Alert>}
            <form onSubmit={handleVerificarCodigo}>
              <input
                className="eb-codigo-input"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={codigo}
                onChange={e => setCodigo(e.target.value.replace(/\D/g, ''))}
                required autoFocus
              />
              <button className="eb-btn" type="submit" disabled={loading || codigo.length !== 6}>
                {loading ? <CircularProgress size={18} sx={{ color:'#F8FAF6' }} /> : 'Verificar codigo'}
              </button>
            </form>
            <p className="eb-link-row" style={{ marginTop:14 }}>
              No recibiste el correo?{' '}
              <button onClick={() => { limpiarError(); setPaso(PASOS.CORREO); }}>Reenviar</button>
            </p>
          </>
        )}
 
        {/* ── PASO 3: Nueva contraseña ── */}
        {paso === PASOS.NUEVA && (
          <>
            {/* Botón regresar al paso anterior */}
            <button className="eb-back-btn" onClick={() => { limpiarError(); setPaso(PASOS.CODIGO); }}>
              ← Volver al codigo
            </button>
            <StepIndicator />
            <h2 className="eb-step-title">Nueva contrasena</h2>
            <p className="eb-step-desc">Crea una nueva contrasena segura para tu cuenta.</p>
            {error && <Alert severity="error" sx={{ mb:2, borderRadius:'2px', fontSize:'0.8rem' }}>{error}</Alert>}
            <form onSubmit={handleNuevaContrasena}>
              <div className="eb-field-wrap">
                <label className="eb-field-label">Nueva contrasena</label>
                <div className="eb-field-pass">
                  <input className="eb-field-input"
                    type={verNueva ? 'text' : 'password'}
                    placeholder="Minimo 6 caracteres"
                    value={nueva} onChange={e => setNueva(e.target.value)} required autoFocus />
                  <button type="button" onClick={() => setVerNueva(!verNueva)}>
                    {verNueva
                      ? <VisibilityOff style={{ fontSize:18 }} />
                      : <Visibility   style={{ fontSize:18 }} />}
                  </button>
                </div>
              </div>
              <div className="eb-field-wrap">
                <label className="eb-field-label">Confirmar contrasena</label>
                <div className="eb-field-pass">
                  <input className="eb-field-input"
                    type={verConfirma ? 'text' : 'password'}
                    placeholder="Repite la contrasena"
                    value={confirma} onChange={e => setConfirma(e.target.value)} required />
                  <button type="button" onClick={() => setVerConfirma(!verConfirma)}>
                    {verConfirma
                      ? <VisibilityOff style={{ fontSize:18 }} />
                      : <Visibility   style={{ fontSize:18 }} />}
                  </button>
                </div>
              </div>
              <button className="eb-btn" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={18} sx={{ color:'#F8FAF6' }} /> : 'Guardar contrasena'}
              </button>
            </form>
          </>
        )}
 
        {/* ── PASO 4: Éxito ── */}
        {paso === PASOS.LISTO && (
          <div className="eb-success">
            <div className="eb-success-icon">✓</div>
            <h2 className="eb-success-title">Contrasena actualizada</h2>
            <p className="eb-success-sub">
              Tu contrasena se cambio correctamente.<br />
              Ya puedes iniciar sesion con tu nueva contrasena.
            </p>
            <button className="eb-btn" onClick={() => navigate('/login')}>
              Ir al inicio de sesion
            </button>
          </div>
        )}
 
      </div>
    </div>
  );
}