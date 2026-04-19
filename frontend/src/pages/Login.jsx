import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { authAPI } from '../services/api';
 
export default function Login() {
  const [form, setForm] = useState({ usuario: '', contrasena: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verContrasena, setVerContrasena] = useState(false);
  const { login } = useAuth();
  const { cargarCarritoDeUsuario } = useCart(); // ← carrito por usuario
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await authAPI.login(form);
      login(res.data);
 
      // Cargar el carrito del cliente que acaba de entrar
      if (res.data.rol?.toLowerCase() === 'cliente') {
        cargarCarritoDeUsuario(res.data.id);
      }
 
      if (res.data.rol?.toLowerCase() === 'admin' && res.data.alertas?.length > 0) {
        localStorage.setItem('alertas_stock', JSON.stringify(res.data.alertas));
      } else {
        localStorage.removeItem('alertas_stock');
      }
      navigate(res.data.rol?.toLowerCase() === 'admin' ? '/admin' : '/cliente');
    } catch (err) {
      setError(err.response?.data || 'Error al iniciar sesion');
    } finally { setLoading(false); }
  };
 
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
 
    .eb-login-bg {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
      background: #E8F2E0;
    }
    .eb-marble {
      position: absolute; inset: 0; z-index: 0;
      background:
        radial-gradient(ellipse 80% 60% at 15% 20%, rgba(85,136,59,0.18) 0%, transparent 60%),
        radial-gradient(ellipse 60% 80% at 85% 75%, rgba(85,136,59,0.14) 0%, transparent 55%),
        radial-gradient(ellipse 40% 40% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
        radial-gradient(ellipse 70% 50% at 30% 80%, rgba(44,74,30,0.12) 0%, transparent 60%),
        linear-gradient(135deg, #F0F7EA 0%, #E8F2E0 40%, #EDF5E4 70%, #F2F8EE 100%);
    }
    .eb-marble::before {
      content: '';
      position: absolute; inset: 0;
      background:
        linear-gradient(105deg, transparent 30%, rgba(201,168,76,0.12) 31%, rgba(201,168,76,0.06) 32%, transparent 33%),
        linear-gradient(78deg,  transparent 50%, rgba(201,168,76,0.10) 51%, rgba(201,168,76,0.04) 52%, transparent 53%),
        linear-gradient(125deg, transparent 60%, rgba(201,168,76,0.08) 61%, transparent 62%);
    }
    .eb-marble::after {
      content: '';
      position: absolute; inset: 0;
      background:
        linear-gradient(115deg, transparent 20%, rgba(44,74,30,0.07) 21%, transparent 23%),
        linear-gradient(88deg,  transparent 65%, rgba(85,136,59,0.08) 66%, transparent 68%);
    }
    .eb-login-card {
      position: relative; z-index: 1; width: 420px;
      background: rgba(248,250,246,0.88);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(201,168,76,0.35);
      box-shadow: 0 20px 60px rgba(44,74,30,0.18), 0 4px 20px rgba(201,168,76,0.15), inset 0 1px 0 rgba(255,255,255,0.80);
      border-radius: 4px; padding: 48px 44px;
    }
    .eb-back-btn {
      position: absolute; top: 16px; left: 16px;
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: 1px solid rgba(85,136,59,0.35);
      border-radius: 2px; padding: 6px 12px 6px 10px; cursor: pointer;
      font-family: 'Jost', sans-serif; font-size: 0.6rem; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: #55883B; transition: all 0.2s;
    }
    .eb-back-btn:hover { background: rgba(85,136,59,0.08); color: #2C4A1E; border-color: rgba(85,136,59,0.55); }
    .eb-login-logo-wrap {
      display: flex; flex-direction: column; align-items: center; margin-bottom: 36px;
    }
    .eb-login-logo-box {
      width: 80px; height: 80px; border-radius: 4px; overflow: hidden;
      background: #fff; border: 1px solid rgba(201,168,76,0.40);
      box-shadow: 0 6px 24px rgba(44,74,30,0.15); margin-bottom: 16px;
      display: flex; align-items: center; justify-content: center;
    }
    .eb-login-brand {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.4rem; font-weight: 600; color: #2C4A1E;
      letter-spacing: 0.24em; text-transform: uppercase; line-height: 1;
    }
    .eb-login-divider {
      width: 80px; height: 1px; margin: 10px 0;
      background: linear-gradient(90deg, transparent, rgba(201,168,76,0.8), transparent);
    }
    .eb-login-tagline {
      font-family: 'Cormorant Garamond', serif; font-style: italic;
      font-size: 0.72rem; letter-spacing: 0.22em; color: rgba(85,136,59,0.70);
    }
    .eb-login-heading {
      font-family: 'Jost', sans-serif; font-size: 0.65rem; font-weight: 500;
      letter-spacing: 0.28em; text-transform: uppercase; color: rgba(44,74,30,0.50);
      text-align: center; margin-bottom: 28px;
    }
    .eb-field-wrap { margin-bottom: 14px; }
    .eb-field-label {
      font-family: 'Jost', sans-serif; font-size: 0.62rem; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase; color: rgba(44,74,30,0.60);
      display: block; margin-bottom: 6px;
    }
    .eb-field-input {
      width: 100%; background: rgba(230,240,220,0.50);
      border: 1px solid rgba(154,103,53,0.25);
      border-radius: 2px; padding: 12px 16px; color: #2C4A1E;
      font-family: 'Jost', sans-serif; font-size: 0.9rem; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .eb-field-input:hover { border-color: rgba(154,103,53,0.45); }
    .eb-field-input:focus { border-color: rgba(154,103,53,0.70); box-shadow: 0 0 0 3px rgba(154,103,53,0.08); }
    .eb-field-input::placeholder { color: rgba(44,74,30,0.30); }
    .eb-field-pass { position: relative; }
    .eb-field-pass input { padding-right: 44px; }
    .eb-field-pass button {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: rgba(44,74,30,0.40); padding: 0; display: flex; transition: color 0.2s;
    }
    .eb-field-pass button:hover { color: #55883B; }
    .eb-btn-submit {
      width: 100%; margin-top: 20px; padding: 14px;
      background: linear-gradient(135deg, #2C4A1E 0%, #55883B 50%, #9A6735 100%);
      color: #F8FAF6; border: none; border-radius: 2px; cursor: pointer;
      font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 500;
      letter-spacing: 0.24em; text-transform: uppercase;
      box-shadow: 0 4px 20px rgba(85,136,59,0.35); transition: all 0.25s;
    }
    .eb-btn-submit:hover { box-shadow: 0 6px 28px rgba(85,136,59,0.50); transform: translateY(-1px); }
    .eb-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
 
    .eb-olvide {
      display: block; text-align: right; margin-top: 8px;
      font-family: 'Jost', sans-serif; font-size: 0.68rem;
      color: rgba(44,74,30,0.50); text-decoration: none;
      letter-spacing: 0.04em; transition: color 0.2s;
    }
    .eb-olvide:hover { color: #55883B; }
 
    .eb-login-footer {
      margin-top: 20px; text-align: center;
      font-family: 'Jost', sans-serif; font-size: 0.72rem;
      color: rgba(44,74,30,0.45); letter-spacing: 0.06em;
    }
    .eb-login-footer a { color: #55883B; font-style: italic; text-decoration: none; }
    .eb-login-footer a:hover { color: #2C4A1E; }
 
    .eb-divider-footer {
      width: 100%; height: 1px; margin: 18px 0 0;
      background: linear-gradient(90deg, transparent, rgba(154,103,53,0.20), transparent);
    }
  `;
 
  return (
    <div className="eb-login-bg">
      <style>{styles}</style>
      <div className="eb-marble" />
      <div className="eb-login-card">
        <button type="button" className="eb-back-btn" onClick={() => navigate('/')}>
          <ArrowBack style={{ fontSize: 14 }} /> Regresar
        </button>
        <div className="eb-login-logo-wrap">
          <div className="eb-login-logo-box">
            <img src="/logo_elite_beauty.png" alt="Elite Beauty"
              style={{ width:'85%', height:'85%', objectFit:'contain' }}
              onError={e => { e.target.style.display='none'; }} />
          </div>
          <span className="eb-login-brand">Elite Beauty</span>
          <div className="eb-login-divider" />
          <span className="eb-login-tagline">ventas & inventarios</span>
        </div>
 
        <p className="eb-login-heading">Iniciar sesion</p>
 
        {error && <Alert severity="error" sx={{ mb:2, borderRadius:'2px', fontSize:'0.8rem' }}>{error}</Alert>}
 
        <form onSubmit={handleSubmit}>
          <div className="eb-field-wrap">
            <label className="eb-field-label">Usuario</label>
            <input className="eb-field-input" type="text" placeholder="Tu usuario"
              value={form.usuario} onChange={e => setForm({...form, usuario: e.target.value})}
              required autoFocus />
          </div>
          <div className="eb-field-wrap">
            <label className="eb-field-label">Contrasena</label>
            <div className="eb-field-pass">
              <input className="eb-field-input"
                type={verContrasena ? 'text' : 'password'} placeholder="••••••••"
                value={form.contrasena}
                onChange={e => setForm({...form, contrasena: e.target.value})} required />
              <button type="button" onClick={() => setVerContrasena(!verContrasena)}>
                {verContrasena
                  ? <VisibilityOff style={{ fontSize:18 }} />
                  : <Visibility style={{ fontSize:18 }} />}
              </button>
            </div>
          </div>
 
          <Link to="/olvide-contrasena" className="eb-olvide">
            Olvidaste tu contrasena?
          </Link>
 
          <button className="eb-btn-submit" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={18} sx={{ color:'#F8FAF6' }} /> : 'Entrar'}
          </button>
        </form>
 
        <div className="eb-divider-footer" />
 
        <p className="eb-login-footer">
          Nuevo cliente?{' '}
          <Link to="/registro/cliente">Registrate aqui</Link>
        </p>
      </div>
    </div>
  );
}