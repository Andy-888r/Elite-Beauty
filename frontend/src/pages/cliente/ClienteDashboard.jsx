import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { ShoppingCart, History, Person, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { productosAPI, bannersAPI } from '../../services/api';
import { MARBLE_STYLES } from '../../styles/marble';
 
const MENU = [
  { label:'Inicio',    icon:<ShoppingCart />, path:'/cliente' },
  { label:'Comprar',   icon:<ShoppingCart />, path:'/cliente/compras' },
  { label:'Historial', icon:<History />,      path:'/cliente/historial' },
  { label:'Mi Perfil', icon:<Person />,       path:'/cliente/perfil' },
];
const BASE = 'http://localhost:8080/api';
 
const extraStyles = `
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
  .eb-products-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; }
  .eb-product-card { border-radius:2px; overflow:hidden; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s; }
  .eb-product-card:hover { transform:translateY(-4px); box-shadow:0 10px 32px rgba(44,74,30,0.16); }
  .eb-product-img { width:100%; height:180px; object-fit:cover; display:block; }
  .eb-product-placeholder { width:100%; height:180px; background:rgba(85,136,59,0.10); display:flex; align-items:center; justify-content:center; font-size:2.5rem; color:#55883B; }
  .eb-product-body { padding:16px 18px; background:rgba(248,252,244,0.90); }
  .eb-product-name { font-family:'Jost',sans-serif; font-size:0.9rem; font-weight:500; color:#2C4A1E; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .eb-product-meta { font-family:'Jost',sans-serif; font-size:0.72rem; color:#55883B; letter-spacing:0.06em; margin-bottom:10px; }
  .eb-product-price { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:600; color:#9A6735; }
 
  /* Cards de productos en modal banner */
  .eb-banner-prods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    margin-top: 12px;
  }
  .eb-banner-prod-card {
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(85,136,59,0.15);
    transition: transform 0.2s, box-shadow 0.2s;
    background: rgba(248,252,244,0.95);
  }
  .eb-banner-prod-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(44,74,30,0.16);
    border-color: rgba(85,136,59,0.35);
  }
  .eb-banner-prod-img {
    width: 100%; height: 130px; object-fit: cover; display: block;
  }
  .eb-banner-prod-placeholder {
    width: 100%; height: 130px;
    background: rgba(85,136,59,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; color: rgba(85,136,59,0.50);
  }
  .eb-banner-prod-body { padding: 10px 12px; }
  .eb-banner-prod-name {
    font-family: 'Jost', sans-serif; font-size: 0.80rem; font-weight: 500;
    color: #2C4A1E; margin-bottom: 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .eb-banner-prod-meta {
    font-family: 'Jost', sans-serif; font-size: 0.65rem; color: #55883B;
    letter-spacing: 0.04em; margin-bottom: 6px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .eb-banner-prod-price {
    font-family: 'Cormorant Garamond', serif; font-size: 1.1rem;
    font-weight: 600; color: #9A6735;
  }
  .eb-banner-ver-tienda {
    display: inline-flex; align-items: center; gap: 4px;
    font-family: 'Jost', sans-serif; font-size: 0.58rem;
    font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: #55883B; float: right; padding-top: 2px;
  }
`;
 
export default function ClienteDashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [banners, setBanners]     = useState([]);
  const [productos, setProductos] = useState([]);
  const [slide, setSlide]         = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [bannerSeleccionado, setBannerSeleccionado]     = useState(null);
 
  useEffect(() => {
    bannersAPI.listarActivos().then(r => setBanners(r.data)).catch(() => {});
    productosAPI.listarActivos().then(r => setProductos(r.data)).catch(() => {});
  }, []);
 
  const nuevos   = [...productos].reverse().slice(0, 8);
  const anterior = () => setSlide(s => (s - 1 + banners.length) % banners.length);
  const siguiente= () => setSlide(s => (s + 1) % banners.length);
 
  useEffect(() => {
    if (banners.length === 0) return;
    const t = setInterval(siguiente, 4500);
    return () => clearInterval(t);
  }, [banners.length]);
 
  const b = banners[slide];
 
  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>
 
        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Bienvenida</p>
            <h1 className="eb-title">Hola, {user?.nombre}</h1>
          </div>
        </div>
 
        <div className="eb-content">
          {banners.length > 0 ? (
            <div className="eb-carousel" style={{ cursor:'pointer' }}
              onClick={() => {
                if (b?.productos?.length === 1) setProductoSeleccionado(b.productos[0]);
                else if (b?.productos?.length > 1) setBannerSeleccionado(b);
              }}>
              <img src={`${BASE}${b.imagenPath}`} alt={b.titulo} />
              <div className="eb-carousel-gradient" />
              <div className="eb-carousel-text">
                {b.titulo      && <div className="eb-carousel-title">{b.titulo}</div>}
                {b.descripcion && <div className="eb-carousel-desc">{b.descripcion}</div>}
              </div>
              {banners.length > 1 && (
                <>
                  <button className="eb-carousel-btn prev" onClick={e => { e.stopPropagation(); anterior(); }}>
                    <ChevronLeft />
                  </button>
                  <button className="eb-carousel-btn next" onClick={e => { e.stopPropagation(); siguiente(); }}>
                    <ChevronRight />
                  </button>
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
              <div style={{ fontFamily:'Jost,sans-serif', fontSize:'0.7rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#9A6735', marginTop:4 }}>Proximamente nuevas colecciones</div>
            </div>
          )}
 
          {nuevos.length > 0 && (
            <>
              <div className="eb-section-header">
                <span className="eb-section-title">Nuevos productos</span>
                <span className="eb-section-badge">Recien agregados</span>
                <div className="eb-section-line" />
              </div>
              <div className="eb-products-grid">
                {nuevos.map(p => (
                  <div className="eb-product-card eb-card-wrap" key={p.id} onClick={() => setProductoSeleccionado(p)}>
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
        </div>
      </Box>
 
      {/* ── Modal producto individual ── */}
      {productoSeleccionado && (
        <div style={{
          position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.55)',
          zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center',
        }} onClick={() => setProductoSeleccionado(null)}>
          <div style={{
            backgroundColor:'#F8FAF6', borderRadius:'4px',
            maxWidth:'480px', width:'90%',
            boxShadow:'0 20px 60px rgba(44,74,30,0.25)',
            border:'1px solid rgba(201,168,76,0.35)', overflow:'hidden',
          }} onClick={e => e.stopPropagation()}>
            {productoSeleccionado.imagenPath
              ? <img src={`${BASE}${productoSeleccionado.imagenPath}`} alt={productoSeleccionado.nombre}
                  style={{ width:'100%', height:'260px', objectFit:'cover' }} />
              : <div style={{ width:'100%', height:'260px', background:'rgba(85,136,59,0.10)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', color:'#55883B' }}>◈</div>
            }
            <div style={{ padding:'24px 28px' }}>
              <p style={{ fontFamily:'Jost,sans-serif', fontSize:'0.65rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'#55883B', margin:'0 0 6px' }}>
                {productoSeleccionado.marca} · {productoSeleccionado.categoria}
              </p>
              <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.6rem', fontWeight:600, color:'#2C4A1E', margin:'0 0 10px' }}>
                {productoSeleccionado.nombre}
              </h2>
              {productoSeleccionado.descripcion && (
                <p style={{ fontFamily:'Jost,sans-serif', fontSize:'0.82rem', color:'#55883B', lineHeight:1.6, margin:'0 0 16px' }}>
                  {productoSeleccionado.descripcion}
                </p>
              )}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'16px' }}>
                <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', fontWeight:600, color:'#9A6735' }}>
                  ${productoSeleccionado.precio?.toFixed(2)}
                </span>
                <div style={{ display:'flex', gap:'10px' }}>
                  <button style={{ background:'none', border:'1px solid rgba(85,136,59,0.40)', borderRadius:'2px', padding:'10px 18px', cursor:'pointer', fontFamily:'Jost,sans-serif', fontSize:'0.65rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'#55883B' }}
                    onClick={() => setProductoSeleccionado(null)}>
                    Cerrar
                  </button>
                  <button style={{ background:'linear-gradient(135deg,#2C4A1E,#55883B)', color:'#F4F9F0', border:'none', borderRadius:'2px', padding:'10px 20px', cursor:'pointer', fontFamily:'Jost,sans-serif', fontSize:'0.65rem', letterSpacing:'0.16em', textTransform:'uppercase' }}
                    onClick={() => { setProductoSeleccionado(null); navigate('/cliente/compras'); }}>
                    Ver en tienda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* ── Modal banner con productos como cards ── */}
      {bannerSeleccionado && (
        <div style={{
          position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.65)',
          zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center',
          padding:'20px',
        }} onClick={() => setBannerSeleccionado(null)}>
          <div style={{
            backgroundColor:'#F8FAF6', borderRadius:'4px',
            maxWidth:'720px', width:'100%',
            maxHeight:'88vh', overflowY:'auto',
            boxShadow:'0 20px 60px rgba(44,74,30,0.30)',
            border:'1px solid rgba(201,168,76,0.35)',
            overflow:'hidden',
          }} onClick={e => e.stopPropagation()}>
 
            {/* Imagen del banner */}
            <div style={{ position:'relative' }}>
              <img src={`${BASE}${bannerSeleccionado.imagenPath}`} alt={bannerSeleccionado.titulo}
                style={{ width:'100%', height:'220px', objectFit:'cover', display:'block' }} />
              {/* Overlay con título */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'60%', background:'linear-gradient(transparent, rgba(20,40,12,0.80))' }} />
              {bannerSeleccionado.titulo && (
                <div style={{ position:'absolute', bottom:20, left:24, color:'#E6F0DC' }}>
                  <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.8rem', fontWeight:600, margin:0, textShadow:'0 2px 12px rgba(0,0,0,0.5)' }}>
                    {bannerSeleccionado.titulo}
                  </h2>
                  {bannerSeleccionado.descripcion && (
                    <p style={{ fontFamily:'Jost,sans-serif', fontSize:'0.78rem', margin:'4px 0 0', color:'rgba(230,240,220,0.85)', letterSpacing:'0.06em' }}>
                      {bannerSeleccionado.descripcion}
                    </p>
                  )}
                </div>
              )}
            </div>
 
            {/* Cuerpo con productos */}
            <div style={{ padding:'24px 28px 28px' }}>
 
              {bannerSeleccionado.productos?.length > 0 ? (
                <>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                    <p style={{ fontFamily:'Jost,sans-serif', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.20em', textTransform:'uppercase', color:'#9A6735', margin:0 }}>
                      Productos en esta promoción
                    </p>
                    <span style={{ fontFamily:'Jost,sans-serif', fontSize:'0.60rem', background:'rgba(85,136,59,0.12)', color:'#55883B', padding:'2px 10px', borderRadius:'2px', letterSpacing:'0.12em' }}>
                      {bannerSeleccionado.productos.length} producto{bannerSeleccionado.productos.length > 1 ? 's' : ''}
                    </span>
                    <div style={{ flex:1, height:'1px', background:'rgba(85,136,59,0.15)' }} />
                  </div>
 
                  {/* Grid de cards con imagen */}
                  <div className="eb-banner-prods-grid">
                    {bannerSeleccionado.productos.map(p => (
                      <div key={p.id} className="eb-banner-prod-card"
                        onClick={() => { setBannerSeleccionado(null); setProductoSeleccionado(p); }}>
                        {p.imagenPath
                          ? <img className="eb-banner-prod-img" src={`${BASE}${p.imagenPath}`} alt={p.nombre} />
                          : <div className="eb-banner-prod-placeholder">◈</div>
                        }
                        <div className="eb-banner-prod-body">
                          <div className="eb-banner-prod-name">{p.nombre}</div>
                          {(p.marca || p.categoria) && (
                            <div className="eb-banner-prod-meta">
                              {[p.marca, p.categoria].filter(Boolean).join(' · ')}
                            </div>
                          )}
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <span className="eb-banner-prod-price">${p.precio?.toFixed(2)}</span>
                            <span className="eb-banner-ver-tienda">Ver →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ fontFamily:'Jost,sans-serif', fontSize:'0.78rem', color:'rgba(85,136,59,0.60)', textAlign:'center', padding:'20px 0' }}>
                  Sin productos registrados en esta promoción
                </p>
              )}
 
              {/* Acciones */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'20px', paddingTop:'16px', borderTop:'1px solid rgba(85,136,59,0.12)' }}>
                <button style={{ background:'none', border:'1px solid rgba(85,136,59,0.35)', borderRadius:'2px', padding:'10px 18px', cursor:'pointer', fontFamily:'Jost,sans-serif', fontSize:'0.65rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'#55883B' }}
                  onClick={() => setBannerSeleccionado(null)}>
                  Cerrar
                </button>
                <button style={{ background:'linear-gradient(135deg,#2C4A1E,#55883B)', color:'#F4F9F0', border:'none', borderRadius:'2px', padding:'10px 20px', cursor:'pointer', fontFamily:'Jost,sans-serif', fontSize:'0.65rem', letterSpacing:'0.16em', textTransform:'uppercase' }}
                  onClick={() => { setBannerSeleccionado(null); navigate('/cliente/compras'); }}>
                  Ir a la tienda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
 
    </Box>
  );
}