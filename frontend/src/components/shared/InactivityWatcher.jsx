import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useInactivityTimer } from '../../hooks/useInactivityTimer';
 
const SEGUNDOS_AVISO = 30;
 
const styles = `
  @keyframes eb-countdown-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.85; transform: scale(1.04); }
  }
  @keyframes eb-fade-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .eb-inactivity-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26, 50, 16, 0.55);
    backdrop-filter: blur(2px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Jost', sans-serif;
  }
  .eb-inactivity-card {
    background: #EDF5E4;
    border-radius: 6px;
    border: 1px solid rgba(85,136,59,0.30);
    box-shadow: 0 24px 64px rgba(26,50,16,0.30);
    width: 320px;
    overflow: hidden;
    animation: eb-fade-in 0.25s ease;
  }
 
  /* Header */
  .eb-inact-header {
    background: #2C4A1E;
    padding: 22px 24px 18px;
    text-align: center;
    position: relative;
  }
  .eb-inact-header::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1A3210, #55883B, #C1E899);
  }
  .eb-inact-icon {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(193,232,153,0.15);
    border: 1.5px solid rgba(193,232,153,0.35);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 12px;
  }
  .eb-inact-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: #E6F5D0;
    margin: 0;
    letter-spacing: 0.04em;
  }
  .eb-inact-subtitle {
    font-size: 0.70rem;
    color: rgba(193,232,153,0.75);
    letter-spacing: 0.10em;
    text-transform: uppercase;
    margin-top: 4px;
  }
 
  /* Cuerpo */
  .eb-inact-body {
    padding: 24px 28px 20px;
    text-align: center;
  }
  .eb-inact-desc {
    font-size: 0.80rem;
    color: #55883B;
    letter-spacing: 0.04em;
    margin-bottom: 16px;
  }
 
  /* Contador circular */
  .eb-inact-counter-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  .eb-inact-counter {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: #2C4A1E;
    border: 3px solid #C1E899;
    display: flex; align-items: center; justify-content: center;
    animation: eb-countdown-pulse 1s ease-in-out infinite;
    flex-direction: column;
  }
  .eb-inact-num {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-weight: 700;
    color: #C1E899;
    line-height: 1;
  }
  .eb-inact-seg {
    font-size: 0.55rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(193,232,153,0.70);
    margin-top: 1px;
  }
 
  /* Barra de progreso */
  .eb-inact-bar-wrap {
    height: 5px;
    background: rgba(85,136,59,0.18);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .eb-inact-bar {
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(90deg, #55883B, #C1E899);
    transition: width 1s linear;
  }
  .eb-inact-hint {
    font-size: 0.65rem;
    color: rgba(85,136,59,0.65);
    letter-spacing: 0.08em;
  }
 
  /* Botón */
  .eb-inact-footer {
    padding: 0 24px 22px;
  }
  .eb-inact-btn {
    width: 100%;
    background: linear-gradient(135deg, #2C4A1E, #55883B);
    color: #C1E899;
    border: none;
    border-radius: 3px;
    padding: 13px;
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 3px 14px rgba(44,74,30,0.30);
  }
  .eb-inact-btn:hover {
    box-shadow: 0 5px 20px rgba(44,74,30,0.45);
    transform: translateY(-1px);
  }
`;
 
export default function InactivityWatcher() {
  const [open, setOpen]         = useState(false);
  const [segundos, setSegundos] = useState(SEGUNDOS_AVISO);
  const { logout }  = useAuth();
  const navigate    = useNavigate();
  const intervalo   = React.useRef(null);
 
  const cerrarSesion = useCallback(() => {
    clearInterval(intervalo.current);
    setOpen(false);
    logout();
    navigate('/login');
  }, [logout, navigate]);
 
  const onWarning = useCallback(() => {
    setSegundos(SEGUNDOS_AVISO);
    setOpen(true);
    intervalo.current = setInterval(() => {
      setSegundos(prev => {
        if (prev <= 1) { clearInterval(intervalo.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);
 
  const onLogout = useCallback(() => {
    cerrarSesion();
  }, [cerrarSesion]);
 
  const { reiniciarTimer } = useInactivityTimer({ onWarning, onLogout });
 
  const handleSeguirActivo = () => {
    clearInterval(intervalo.current);
    setOpen(false);
    setSegundos(SEGUNDOS_AVISO);
    reiniciarTimer();
  };
 
  if (!open) return <style>{styles}</style>;
 
  const progreso = (segundos / SEGUNDOS_AVISO) * 100;
 
  return (
    <>
      <style>{styles}</style>
      <div className="eb-inactivity-overlay">
        <div className="eb-inactivity-card">
 
          {/* Header */}
          <div className="eb-inact-header">
            <div className="eb-inact-icon">
              {/* Ícono reloj SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#C1E899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <polyline points="12 7 12 12 15 15"/>
              </svg>
            </div>
            <p className="eb-inact-title">¿Sigues ahí?</p>
            <p className="eb-inact-subtitle">Se detectó inactividad — 3 minutos</p>
          </div>
 
          {/* Cuerpo */}
          <div className="eb-inact-body">
            <p className="eb-inact-desc">
              Tu sesión se cerrará automáticamente en:
            </p>
 
            {/* Contador circular */}
            <div className="eb-inact-counter-wrap">
              <div className="eb-inact-counter">
                <span className="eb-inact-num">{segundos}</span>
                <span className="eb-inact-seg">seg</span>
              </div>
            </div>
 
            {/* Barra de progreso */}
            <div className="eb-inact-bar-wrap">
              <div className="eb-inact-bar" style={{ width: `${progreso}%` }} />
            </div>
 
            <p className="eb-inact-hint">
              Haz clic en el botón para continuar tu sesión
            </p>
          </div>
 
          {/* Botón único */}
          <div className="eb-inact-footer">
            <button className="eb-inact-btn" onClick={handleSeguirActivo}>
              ✓ &nbsp; Seguir activo
            </button>
          </div>
 
        </div>
      </div>
    </>
  );
}