import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { ChevronLeft, ChevronRight, Instagram, Facebook } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productosAPI, bannersAPI } from '../services/api';
import { MARBLE_STYLES } from '../styles/marble';

const BASE = 'http://localhost:8080/api';

const landingStyles = `
  .eb-landing-nav {
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 48px;
    background: rgba(248,252,244,0.92);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(154,103,53,0.18);
  }
  .eb-landing-brand-wrap { display: flex; align-items: center; gap: 14px; }
  .eb-landing-logo-box {
    width: 44px; height: 44px; border-radius: 4px; overflow: hidden;
    background: #fff; border: 1px solid rgba(201,168,76,0.40);
    box-shadow: 0 4px 14px rgba(44,74,30,0.12);
    display: flex; align-items: center; justify-content: center;
  }
  .eb-landing-brand-text {
    display: flex; flex-direction: column; line-height: 1;
  }
  .eb-landing-brand {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.15rem; font-weight: 600; color: #2C4A1E;
    letter-spacing: 0.22em; text-transform: uppercase;
  }
  .eb-landing-tagline {
    font-family: 'Cormorant Garamond', serif; font-style: italic;
    font-size: 0.64rem; letter-spacing: 0.20em; color: rgba(85,136,59,0.70);
    margin-top: 4px;
  }
  .eb-landing-actions { display: flex; gap: 10px; }
  .eb-landing-btn-ghost {
    background: none; border: 1px solid rgba(85,136,59,0.40);
    border-radius: 2px; padding: 9px 18px; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 0.65rem;
    letter-spacing: 0.18em; text-transform: uppercase; color: #55883B;
    transition: all 0.2s;
  }
  .eb-landing-btn-ghost:hover { background: rgba(85,136,59,0.08); color: #2C4A1E; }
  .eb-landing-btn-primary {
    background: linear-gradient(135deg, #2C4A1E 0%, #55883B 50%, #9A6735 100%);
    color: #F8FAF6; border: none; border-radius: 2px; padding: 9px 22px; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.20em; text-transform: uppercase;
    box-shadow: 0 4px 18px rgba(85,136,59,0.32);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .eb-landing-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(85,136,59,0.45); }

  .eb-landing-hero-header { padding: 40px 48px 20px; position: relative; z-index: 1; }
  .eb-landing-kicker {
    font-family: 'Jost', sans-serif; font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.30em; text-transform: uppercase; color: rgba(85,136,59,0.80);
    margin-bottom: 8px;
  }
  .eb-landing-headline {
    font-family: 'Cormorant Garamond', serif; font-size: 2.6rem; font-weight: 600;
    color: #2C4A1E; line-height: 1.05; margin-bottom: 10px;
  }
  .eb-landing-headline em { color: #9A6735; font-style: italic; }
  .eb-landing-lead {
    font-family: 'Jost', sans-serif; font-size: 0.92rem; color: #55883B;
    max-width: 620px; line-height: 1.6;
  }

  .eb-landing-content { padding: 0 48px 56px; position: relative; z-index: 1; }

  .eb-carousel { position:relative; border-radius:2px; overflow:hidden; height:380px; margin-bottom:48px; }
  .eb-carousel img { width:100%; height:100%; object-fit:cover; display:block; }
  .eb-carousel-gradient { position:absolute; bottom:0; left:0; right:0; height:55%; background:linear-gradient(transparent, rgba(20,40,12,0.80)); }
  .eb-carousel-text { position:absolute; bottom:32px; left:36px; color:#E6F0DC; }
  .eb-carousel-title { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:600; line-height:1.1; margin-bottom:6px; text-shadow:0 2px 12px rgba(0,0,0,0.5); }
  .eb-carousel-desc { font-family:'Jost',sans-serif; font-size:0.82rem; letter-spacing:0.08em; color:rgba(230,240,220,0.85); }
  .eb-carousel-btn { position:absolute; top:50%; transform:translateY(-50%); width:40px; height:40px; border-radius:2px; background:rgba(44,74,30,0.35); border:1px solid rgba(193,232,153,0.30); color:#E6F0DC; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; backdrop-filter:blur(4px); }
  .eb-carousel-btn:hover { background:rgba(44,74,30,0.60); }
  .eb-carousel-btn.prev { left:16px; }
  .eb-carousel-btn.next { right:16px; }
  .eb-carousel-dots { position:absolute; bottom:16px; right:24px; display:flex; gap:6px; }
  .eb-carousel-dot { height:6px; border-radius:3px; cursor:pointer; transition:all 0.3s; background:rgba(230,240,220,0.45); }
  .eb-carousel-dot.active { width:20px; background:#C1E899; }
  .eb-carousel-dot:not(.active) { width:6px; }
  .eb-carousel-empty { height:300px; border-radius:2px; margin-bottom:48px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(230,240,220,0.40); border:1px dashed rgba(85,136,59,0.30); }

  .eb-section-header { display:flex; align-items:baseline; gap:16px; margin-bottom:24px; }
  .eb-section-title { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:600; color:#2C4A1E; }
  .eb-section-badge { font-family:'Jost',sans-serif; font-size:0.6rem; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:#55883B; background:rgba(85,136,59,0.12); padding:3px 10px; border-radius:2px; }
  .eb-section-line { flex:1; height:1px; background:rgba(85,136,59,0.15); }

  .eb-banners-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:24px; margin-bottom:56px; }
  .eb-banner-card-l { border-radius:2px; overflow:hidden; cursor:pointer; background:rgba(248,252,244,0.92); border:1px solid rgba(201,168,76,0.22); box-shadow:0 4px 20px rgba(44,74,30,0.08); transition:transform 0.25s, box-shadow 0.25s; }
  .eb-banner-card-l:hover { transform:translateY(-4px); box-shadow:0 12px 34px rgba(44,74,30,0.18); }
  .eb-banner-img-l { width:100%; height:180px; object-fit:cover; display:block; }
  .eb-banner-placeholder-l { width:100%; height:180px; background:rgba(85,136,59,0.10); display:flex; align-items:center; justify-content:center; font-size:2rem; color:#55883B; }
  .eb-banner-body-l { padding:18px 22px 20px; }
  .eb-banner-name-l { font-family:'Cormorant Garamond',serif; font-size:1.25rem; font-weight:600; color:#2C4A1E; margin-bottom:6px; }
  .eb-banner-desc-l { font-family:'Jost',sans-serif; font-size:0.82rem; color:#55883B; line-height:1.5; margin-bottom:12px; min-height:36px; }
  .eb-banner-foot-l { display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid rgba(85,136,59,0.12); }
  .eb-banner-pcount { font-family:'Jost',sans-serif; font-size:0.65rem; letter-spacing:0.14em; text-transform:uppercase; color:#9A6735; }
  .eb-banner-cta { font-family:'Jost',sans-serif; font-size:0.62rem; font-weight:600; letter-spacing:0.20em; text-transform:uppercase; color:#55883B; }

  .eb-products-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; }
  .eb-product-card { border-radius:2px; overflow:hidden; cursor:pointer; background:rgba(248,252,244,0.92); border:1px solid rgba(201,168,76,0.18); transition:transform 0.2s, box-shadow 0.2s; }
  .eb-product-card:hover { transform:translateY(-4px); box-shadow:0 10px 32px rgba(44,74,30,0.16); }
  .eb-product-img { width:100%; height:180px; object-fit:cover; display:block; }
  .eb-product-placeholder { width:100%; height:180px; background:rgba(85,136,59,0.10); display:flex; align-items:center; justify-content:center; font-size:2.5rem; color:#55883B; }
  .eb-product-body { padding:16px 18px; }
  .eb-product-name { font-family:'Jost',sans-serif; font-size:0.9rem; font-weight:500; color:#2C4A1E; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .eb-product-meta { font-family:'Jost',sans-serif; font-size:0.72rem; color:#55883B; letter-spacing:0.06em; margin-bottom:10px; }
  .eb-product-price { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:600; color:#9A6735; }

  .eb-landing-footer {
    text-align: center; padding: 28px 48px 36px; position: relative; z-index: 1;
    border-top: 1px solid rgba(154,103,53,0.18);
    background: rgba(248,252,244,0.80);
  }
  .eb-landing-footer p {
    font-family: 'Jost', sans-serif; font-size: 0.72rem;
    color: rgba(44,74,30,0.55); letter-spacing: 0.10em;
  }
  .eb-landing-social {
    display: flex; justify-content: center; gap: 14px; margin-bottom: 14px;
  }
  .eb-social-link {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(85,136,59,0.10); color: #55883B;
    border: 1px solid rgba(85,136,59,0.25);
    transition: all 0.25s;
  }
  .eb-social-link:hover {
    background: linear-gradient(135deg, #2C4A1E 0%, #55883B 50%, #9A6735 100%);
    color: #F8FAF6; border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(85,136,59,0.35);
  }
`;

export default function Landing() {
  const navigate = useNavigate();
  const [banners, setBanners]     = useState([]);
  const [productos, setProductos] = useState([]);
  const [slide, setSlide]         = useState(0);

  useEffect(() => {
    bannersAPI.listarActivos().then(r => setBanners(r.data)).catch(() => {});
    productosAPI.listarActivos().then(r => setProductos(r.data)).catch(() => {});
  }, []);

  const irALogin = () => navigate('/login');
  const irARegistro = () => navigate('/registro/cliente');

  const nuevos = [...productos].reverse().slice(0, 8);
  const anterior  = () => setSlide(s => (s - 1 + banners.length) % banners.length);
  const siguiente = () => setSlide(s => (s + 1) % banners.length);

  useEffect(() => {
    if (banners.length === 0) return;
    const t = setInterval(siguiente, 4500);
    return () => clearInterval(t);
  }, [banners.length]);

  const b = banners[slide];

  return (
    <Box sx={{ bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{landingStyles}</style>

      <nav className="eb-landing-nav">
        <div className="eb-landing-brand-wrap">
          <div className="eb-landing-logo-box">
            <img src="/logo_elite_beauty.png" alt="Elite Beauty"
              style={{ width:'85%', height:'85%', objectFit:'contain' }}
              onError={e => { e.target.style.display='none'; }} />
          </div>
          <div className="eb-landing-brand-text">
            <span className="eb-landing-brand">Elite Beauty</span>
            <span className="eb-landing-tagline">ventas & inventarios</span>
          </div>
        </div>
        <div className="eb-landing-actions">
          <button className="eb-landing-btn-ghost" onClick={irARegistro}>Registrarse</button>
          <button className="eb-landing-btn-primary" onClick={irALogin}>Iniciar sesión</button>
        </div>
      </nav>

      <header className="eb-landing-hero-header">
        <p className="eb-landing-kicker">Bienvenida</p>
        <h1 className="eb-landing-headline">
          Descubre la belleza que <em>te define</em>
        </h1>
        <p className="eb-landing-lead">
          Explora nuestras promociones y productos destacados. Inicia sesión para comprar,
          guardar tu carrito y acceder a tu historial de pedidos.
        </p>
      </header>

      <main className="eb-landing-content">
        {banners.length > 0 ? (
          <div className="eb-carousel" style={{ cursor:'pointer' }} onClick={irALogin}>
            <img src={`${BASE}${b.imagenPath}`} alt={b.titulo} />
            <div className="eb-carousel-gradient" />
            <div className="eb-carousel-text">
              {b.titulo      && <div className="eb-carousel-title">{b.titulo}</div>}
              {b.descripcion && <div className="eb-carousel-desc">{b.descripcion}</div>}
            </div>
            {banners.length > 1 && (
              <>
                <button className="eb-carousel-btn prev" onClick={e => { e.stopPropagation(); anterior(); }}><ChevronLeft /></button>
                <button className="eb-carousel-btn next" onClick={e => { e.stopPropagation(); siguiente(); }}><ChevronRight /></button>
                <div className="eb-carousel-dots">
                  {banners.map((_, i) => (
                    <div key={i} className={`eb-carousel-dot ${i===slide?'active':''}`}
                      onClick={e => { e.stopPropagation(); setSlide(i); }} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="eb-carousel-empty">
            <div style={{ fontSize:'2.5rem', marginBottom:12, color:'#55883B' }}>◈</div>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.3rem', fontWeight:600, color:'#55883B' }}>Elite Beauty</div>
            <div style={{ fontFamily:'Jost,sans-serif', fontSize:'0.7rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#9A6735', marginTop:4 }}>Próximamente nuevas colecciones</div>
          </div>
        )}

        {banners.length > 0 && (
          <>
            <div className="eb-section-header">
              <span className="eb-section-title">Publicaciones</span>
              <span className="eb-section-badge">Promociones activas</span>
              <div className="eb-section-line" />
            </div>
            <div className="eb-banners-grid">
              {banners.map(bn => (
                <div key={bn.id} className="eb-banner-card-l" onClick={irALogin}>
                  {bn.imagenPath
                    ? <img className="eb-banner-img-l" src={`${BASE}${bn.imagenPath}`} alt={bn.titulo} />
                    : <div className="eb-banner-placeholder-l">◈</div>
                  }
                  <div className="eb-banner-body-l">
                    <div className="eb-banner-name-l">{bn.titulo}</div>
                    <p className="eb-banner-desc-l">
                      {bn.descripcion || <em style={{ opacity:0.5 }}>Sin descripción</em>}
                    </p>
                    <div className="eb-banner-foot-l">
                      <span className="eb-banner-pcount">
                        {bn.productos?.length
                          ? `${bn.productos.length} producto${bn.productos.length > 1 ? 's' : ''}`
                          : 'Ver detalles'}
                      </span>
                      <span className="eb-banner-cta">Ver más →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {nuevos.length > 0 && (
          <>
            <div className="eb-section-header">
              <span className="eb-section-title">Nuevos productos</span>
              <span className="eb-section-badge">Recién agregados</span>
              <div className="eb-section-line" />
            </div>
            <div className="eb-products-grid">
              {nuevos.map(p => (
                <div className="eb-product-card" key={p.id} onClick={irALogin}>
                  {p.imagenPath
                    ? <img className="eb-product-img" src={`${BASE}${p.imagenPath}`} alt={p.nombre} />
                    : <div className="eb-product-placeholder">◈</div>
                  }
                  <div className="eb-product-body">
                    <div className="eb-product-name">{p.nombre}</div>
                    <div className="eb-product-meta">{p.marca} · {p.categoria}</div>
                    <div className="eb-product-price">${p.precio?.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="eb-landing-footer">
        <div className="eb-landing-social">
          <a className="eb-social-link" href="https://www.instagram.com/elite_beautytrc/?hl=es"
            target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram style={{ fontSize: 22 }} />
          </a>
          <a className="eb-social-link" href="https://www.facebook.com/profile.php?id=61583672861458&locale=es_LA"
            target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook style={{ fontSize: 22 }} />
          </a>
        </div>
        <p>© Elite Beauty — Inicia sesión para comprar y acceder a tu cuenta</p>
      </footer>
    </Box>
  );
}
