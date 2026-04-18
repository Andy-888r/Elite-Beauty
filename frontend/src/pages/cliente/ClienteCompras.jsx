import React, { useEffect, useState, useRef } from 'react';
import { Box, Drawer } from '@mui/material';
import { ShoppingCart, History, Person, Add, Remove, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import { productosAPI, clienteAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MARBLE_STYLES } from '../../styles/marble';
import StripeCheckout from '../../components/shared/StripeCheckout';
 
const MENU = [
  { label:'Inicio',    icon:<ShoppingCart />, path:'/cliente' },
  { label:'Comprar',   icon:<ShoppingCart />, path:'/cliente/compras' },
  { label:'Historial', icon:<History />,      path:'/cliente/historial' },
  { label:'Mi Perfil', icon:<Person />,       path:'/cliente/perfil' },
];
const BASE = 'http://localhost:8080/api';
 
const extraStyles = `
  .eb-cart-btn { display:flex; align-items:center; gap:10px; background:linear-gradient(135deg,#2C4A1E,#55883B); color:#F4F9F0; border:none; border-radius:2px; padding:12px 20px; cursor:pointer; font-family:'Jost',sans-serif; font-size:0.68rem; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; transition:all 0.2s; position:relative; box-shadow:0 2px 12px rgba(85,136,59,0.25); }
  .eb-cart-btn:hover { box-shadow:0 4px 20px rgba(85,136,59,0.40); transform:translateY(-1px); }
  .eb-cart-badge { position:absolute; top:-6px; right:-6px; width:20px; height:20px; border-radius:50%; background:#8B2E2E; color:#fff; font-family:'Jost',sans-serif; font-size:0.65rem; font-weight:500; display:flex; align-items:center; justify-content:center; }
  .eb-products-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:20px; }
 
  .eb-product-card { border-radius:2px; overflow:hidden; display:flex; flex-direction:column; transition:transform 0.2s, box-shadow 0.2s; }
  .eb-product-card:hover { transform:translateY(-4px); box-shadow:0 10px 32px rgba(44,74,30,0.14); }
  .eb-product-card.agotado { opacity:0.65; filter:grayscale(20%); }
  .eb-product-card.agotado:hover { transform:none; box-shadow:none; }
 
  /* Efecto highlight — producto iluminado desde banner */
  @keyframes eb-highlight-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(85,136,59,0.70), 0 0 0 0 rgba(193,232,153,0.50); transform: scale(1); }
    30%  { box-shadow: 0 0 0 12px rgba(85,136,59,0.30), 0 0 0 24px rgba(193,232,153,0.20); transform: scale(1.03); }
    60%  { box-shadow: 0 0 0 6px rgba(85,136,59,0.20), 0 0 0 14px rgba(193,232,153,0.10); transform: scale(1.01); }
    100% { box-shadow: 0 0 0 0 rgba(85,136,59,0), 0 0 0 0 rgba(193,232,153,0); transform: scale(1); }
  }
  .eb-product-card.highlight {
    animation: eb-highlight-pulse 1.6s ease-out;
    border: 2px solid #55883B !important;
    z-index: 1;
    position: relative;
  }
 
  .eb-product-img { width:100%; height:190px; object-fit:cover; display:block; }
  .eb-product-placeholder { width:100%; height:190px; background:rgba(85,136,59,0.10); display:flex; align-items:center; justify-content:center; font-size:2.5rem; color:#55883B; }
  .eb-img-wrap { position:relative; }
  .eb-badge-agotado { position:absolute; top:10px; left:10px; background:#8B2E2E; color:#fff; font-family:'Jost',sans-serif; font-size:0.55rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; padding:4px 10px; border-radius:2px; }
 
  .eb-product-body { padding:18px 20px; flex:1; display:flex; flex-direction:column; background:rgba(248,252,244,0.90); }
  .eb-product-name { font-family:'Jost',sans-serif; font-size:0.92rem; font-weight:500; color:#2C4A1E; margin-bottom:4px; }
  .eb-product-meta { font-family:'Jost',sans-serif; font-size:0.72rem; color:#55883B; letter-spacing:0.06em; margin-bottom:12px; flex:1; }
  .eb-product-footer { display:flex; align-items:center; justify-content:space-between; margin-top:auto; }
  .eb-product-price { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:600; color:#9A6735; }
  .eb-add-btn { background:linear-gradient(135deg,#2C4A1E,#55883B); color:#F4F9F0; border:none; border-radius:2px; padding:8px 16px; cursor:pointer; font-family:'Jost',sans-serif; font-size:0.62rem; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; display:flex; align-items:center; gap:6px; transition:all 0.2s; }
  .eb-add-btn:hover { box-shadow:0 3px 12px rgba(85,136,59,0.30); }
  .eb-agotado-btn { background:rgba(139,46,46,0.10); color:#8B2E2E; border:1px solid rgba(139,46,46,0.25); border-radius:2px; padding:8px 16px; font-family:'Jost',sans-serif; font-size:0.60rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; cursor:not-allowed; }
 
  .eb-drawer-header { padding:32px 28px 20px; border-bottom:1px solid rgba(85,136,59,0.15); background:rgba(240,247,234,0.95); }
  .eb-drawer-subtitle { font-family:'Jost',sans-serif; font-size:0.62rem; font-weight:300; letter-spacing:0.22em; text-transform:uppercase; color:#55883B; margin:0 0 4px; }
  .eb-drawer-title { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:600; color:#2C4A1E; margin:0; }
  .eb-cart-item { padding:16px 28px; border-bottom:1px solid rgba(85,136,59,0.08); background:rgba(248,252,244,0.80); }
  .eb-cart-item-name { font-family:'Jost',sans-serif; font-size:0.88rem; font-weight:500; color:#2C4A1E; margin-bottom:10px; }
  .eb-cart-item-row { display:flex; align-items:center; justify-content:space-between; }
  .eb-qty-control { display:flex; align-items:center; gap:0; border:1px solid rgba(85,136,59,0.30); border-radius:2px; overflow:hidden; }
  .eb-qty-btn { width:30px; height:30px; background:transparent; border:none; cursor:pointer; color:#55883B; font-size:1rem; display:flex; align-items:center; justify-content:center; transition:background 0.15s; }
  .eb-qty-btn:hover { background:rgba(85,136,59,0.10); }
  .eb-qty-num { width:32px; text-align:center; font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:#2C4A1E; border-left:1px solid rgba(85,136,59,0.15); border-right:1px solid rgba(85,136,59,0.15); line-height:30px; }
  .eb-cart-item-subtotal { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:#9A6735; }
  .eb-delete-btn { width:30px; height:30px; background:transparent; border:none; cursor:pointer; color:rgba(139,46,46,0.60); display:flex; align-items:center; justify-content:center; border-radius:2px; transition:all 0.15s; }
  .eb-delete-btn:hover { color:#8B2E2E; background:rgba(139,46,46,0.07); }
  .eb-drawer-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px; text-align:center; background:rgba(240,247,234,0.60); }
  .eb-drawer-footer { padding:20px 28px 28px; border-top:1px solid rgba(85,136,59,0.12); background:rgba(240,247,234,0.95); }
  .eb-sub-row { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; }
  .eb-sub-label { font-family:'Jost',sans-serif; font-size:0.62rem; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:#55883B; }
  .eb-sub-val   { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:#2C4A1E; }
  .eb-total-row { display:flex; justify-content:space-between; align-items:baseline; margin:10px 0 16px; padding-top:10px; border-top:1px solid rgba(85,136,59,0.15); }
  .eb-total-label { font-family:'Jost',sans-serif; font-size:0.7rem; font-weight:600; letter-spacing:0.22em; text-transform:uppercase; color:#2C4A1E; }
  .eb-total-amount { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:600; color:#2C4A1E; }
  .eb-buy-btn { width:100%; padding:14px; background:linear-gradient(135deg,#2C4A1E 0%,#55883B 50%,#9A6735 100%); color:#F4F9F0; border:none; border-radius:2px; cursor:pointer; font-family:'Jost',sans-serif; font-size:0.68rem; font-weight:500; letter-spacing:0.22em; text-transform:uppercase; box-shadow:0 4px 20px rgba(85,136,59,0.30); transition:all 0.25s; }
  .eb-buy-btn:hover { box-shadow:0 6px 28px rgba(85,136,59,0.48); transform:translateY(-1px); }
  .eb-clear-btn { width:100%; margin-top:10px; padding:10px; background:transparent; color:#8B2E2E; border:1px solid rgba(139,46,46,0.35); border-radius:2px; cursor:pointer; font-family:'Jost',sans-serif; font-size:0.62rem; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:6px; }
  .eb-clear-btn:hover { background:rgba(139,46,46,0.08); border-color:#8B2E2E; }
  .eb-qty-btn:disabled { cursor:not-allowed; color:rgba(85,136,59,0.30); }
`;

const IVA_RATE = 0.16;
 
export default function ClienteCompras() {
  const [productos, setProductos]     = useState([]);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const { user } = useAuth();
  const { carrito, agregarAlCarrito, eliminarDelCarrito, limpiarCarrito, actualizarCantidad, total } = useCart();
  const location   = useLocation();
  const cardRefs   = useRef({});
 
  useEffect(() => { productosAPI.listarActivos().then(r => setProductos(r.data)); }, []);
 
  // Cuando llega desde el banner con highlightId
  useEffect(() => {
    if (!location.state?.highlightId) return;
    const id = location.state.highlightId;
 
    // Esperar a que los productos carguen y el DOM esté listo
    const timer = setTimeout(() => {
      setHighlightId(id);
      const el = cardRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Quitar el highlight después de la animación
      setTimeout(() => setHighlightId(null), 2200);
    }, 600);
 
    return () => clearTimeout(timer);
  }, [location.state, productos]);
 
  const handleAgregar = (p) => {
    if (p.stock === 0 || p.estadoStock === 'SIN STOCK') {
      toast.error('Ya no hay productos en existencia');
      return;
    }
    const enCarrito = carrito.find(i => i.id === p.id)?.cantidad || 0;
    if (enCarrito >= p.stock) {
      toast.warning(`Solo quedan ${p.stock} unidad(es) de ${p.nombre}`);
      return;
    }
    agregarAlCarrito(p);
    toast.success(`${p.nombre} agregado al carrito`);
  };

  const handleIncrementar = (item) => {
    const prod = productos.find(p => p.id === item.id);
    const stockMax = prod?.stock ?? Infinity;
    if (item.cantidad >= stockMax) {
      toast.warning(`Stock disponible: ${stockMax}`);
      return;
    }
    actualizarCantidad(item.id, item.cantidad + 1);
  };

  const handleVaciar = () => {
    if (carrito.length === 0) return;
      limpiarCarrito();
      toast.info('Carrito vaciado');
  };

  const iva      = total * IVA_RATE;
  const totalFin = total + iva;

  const handleComprar = () => {
    if (carrito.length === 0) { toast.warning('El carrito esta vacio'); return; }
    setMostrarPago(true);
  };
 
  const handleCerrarDrawer = () => {
    setDrawerOpen(false);
    setMostrarPago(false);
  };
 
  const handlePagoExitoso = async () => {
    try {
      const items = carrito.map(i => ({
        idProducto: i.id,
        cantidad:   i.cantidad,
        precio:     i.precio,
      }));
      const res = await clienteAPI.comprar({ idCliente: user.id, items });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'ticket_elite_beauty.pdf';
      document.body.appendChild(link); link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      limpiarCarrito(); setDrawerOpen(false); setMostrarPago(false);
      toast.success('¡Compra realizada! Tu ticket se descargó.');
    } catch {
      toast.error('El pago se procesó pero hubo un error al generar el ticket.');
    }
  };
 
  const agotado = (p) => p.stock === 0 || p.estadoStock === 'SIN STOCK';
 
  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>
 
        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Tienda</p>
            <h1 className="eb-title">Productos Disponibles</h1>
          </div>
          <button className="eb-cart-btn" onClick={() => setDrawerOpen(true)}>
            <ShoppingCart style={{ fontSize:16 }} />
            Carrito — ${totalFin.toFixed(2)}
            {carrito.length > 0 && <span className="eb-cart-badge">{carrito.length}</span>}
          </button>
        </div>
 
        <div className="eb-content">
          <p className="eb-section-label">{productos.length} producto(s) disponible(s)</p>
          <div className="eb-products-grid">
            {productos.map(p => (
              <div
                key={p.id}
                ref={el => { cardRefs.current[p.id] = el; }}
                className={`eb-product-card eb-card-wrap ${agotado(p) ? 'agotado' : ''} ${highlightId === p.id ? 'highlight' : ''}`}
              >
                <div className="eb-img-wrap">
                  {p.imagenPath
                    ? <img className="eb-product-img" src={`${BASE}${p.imagenPath}`} alt={p.nombre} />
                    : <div className="eb-product-placeholder">◈</div>
                  }
                  {agotado(p) && <span className="eb-badge-agotado">Agotado</span>}
                </div>
                <div className="eb-product-body">
                  <div className="eb-product-name">{p.nombre}</div>
                  <div className="eb-product-meta">{p.marca} · {p.categoria}</div>
                  <div className="eb-product-footer">
                    <span className="eb-product-price">${p.precio?.toFixed(2)}</span>
                    {agotado(p)
                      ? <span className="eb-agotado-btn">Sin stock</span>
                      : <button className="eb-add-btn" onClick={() => handleAgregar(p)}>
                          <Add style={{ fontSize:14 }} /> Agregar
                        </button>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        <Drawer anchor="right" open={drawerOpen} onClose={handleCerrarDrawer}
          PaperProps={{ sx:{ bgcolor:'#EDF5E4', boxShadow:'-8px 0 40px rgba(44,74,30,0.12)' } }}>
          <div style={{ width:360, height:'100%', display:'flex', flexDirection:'column' }}>
            {!mostrarPago ? (
              <>
                <div className="eb-drawer-header">
                  <p className="eb-drawer-subtitle">Elite Beauty</p>
                  <h2 className="eb-drawer-title">Tu Carrito</h2>
                </div>
                {carrito.length === 0 ? (
                  <div className="eb-drawer-empty">
                    <div style={{ fontSize:'2rem', marginBottom:12, color:'#55883B' }}>◈</div>
                    <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.2rem', fontWeight:600, color:'#55883B', marginBottom:6 }}>Carrito vacio</div>
                    <div style={{ fontFamily:'Jost,sans-serif', fontSize:'0.7rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#9A6735' }}>
                      <span className="eb-ornament" />Agrega productos<span className="eb-ornament" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ flex:1, overflowY:'auto' }}>
                      {carrito.map(item => {
                        const prod = productos.find(p => p.id === item.id);
                        const stockMax = prod?.stock ?? Infinity;
                        return (
                          <div className="eb-cart-item" key={item.id}>
                            <div className="eb-cart-item-name">{item.nombre}</div>
                            <div className="eb-cart-item-row">
                              <div className="eb-qty-control">
                                <button className="eb-qty-btn" onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}><Remove style={{ fontSize:14 }} /></button>
                                <span className="eb-qty-num">{item.cantidad}</span>
                                <button className="eb-qty-btn" onClick={() => handleIncrementar(item)} disabled={item.cantidad >= stockMax}><Add style={{ fontSize:14 }} /></button>
                              </div>
                              <span className="eb-cart-item-subtotal">${(item.precio * item.cantidad).toFixed(2)}</span>
                              <button className="eb-delete-btn" onClick={() => eliminarDelCarrito(item.id)}><Delete style={{ fontSize:16 }} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="eb-drawer-footer">
                      <div className="eb-sub-row">
                        <span className="eb-sub-label">Subtotal</span>
                        <span className="eb-sub-val">${total.toFixed(2)}</span>
                      </div>
                      <div className="eb-sub-row">
                        <span className="eb-sub-label">IVA (16%)</span>
                        <span className="eb-sub-val">${iva.toFixed(2)}</span>
                      </div>
                      <div className="eb-total-row">
                        <span className="eb-total-label">Total</span>
                        <span className="eb-total-amount">${totalFin.toFixed(2)}</span>
                      </div>
                      <button className="eb-buy-btn" onClick={handleComprar}>
                        Comprar y descargar ticket
                      </button>
                      <button className="eb-clear-btn" onClick={handleVaciar}>
                        <Delete style={{ fontSize:14 }} /> Vaciar carrito
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ flex:1, overflowY:'auto', padding:'16px 0' }}>
                <StripeCheckout
                  monto={Math.round(totalFin * 100)}
                  descripcion="Compra Elite Beauty (incluye IVA)"
                  onRegresar={() => setMostrarPago(false)}
                  onSuccess={handlePagoExitoso}
                  onError={() => toast.error('Error al procesar el pago')}
                />
              </div>
            )}
          </div>
        </Drawer>
      </Box>
    </Box>
  );
}