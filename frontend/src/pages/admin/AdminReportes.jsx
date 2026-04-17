import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Assessment, Inventory, People, Store, Notifications } from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import Sidebar from '../../components/shared/Sidebar';
import { reportesAPI, inventarioAPI } from '../../services/api';
import { MARBLE_STYLES } from '../../styles/marble';

const MENU = [
  { label:'Inicio',      icon:<Assessment />, path:'/admin' },
  { label:'Productos',   icon:<Inventory />,  path:'/admin/productos' },
  { label:'Banners',     icon:<Assessment />, path:'/admin/banners' },
  { label:'Clientes',    icon:<People />,     path:'/admin/clientes' },
  { label:'Proveedores', icon:<Store />,      path:'/admin/proveedores' },
  { label:'Inventario',  icon:<Inventory />,  path:'/admin/inventario' },
  { label:'Solicitudes', icon:<Notifications />, path:'/admin/solicitudes' },
  { label:'Reportes',    icon:<Assessment />, path:'/admin/reportes' },
];

// Paleta de colores para gráficas
const COLORES = ['#2C4A1E', '#55883B', '#9A6735', '#C1E899', '#C9A84C', '#8B2E2E', '#4A7A6A', '#7A4A2E'];

const extraStyles = `
  .eb-tabs-row { display:flex; gap:0; border-bottom:1px solid rgba(85,136,59,0.20); margin-bottom:28px; }
  .eb-tab {
    font-family:'Jost',sans-serif; font-size:0.68rem; font-weight:500;
    letter-spacing:0.18em; text-transform:uppercase; color:#55883B;
    background:transparent; border:none; padding:12px 24px; cursor:pointer;
    position:relative; transition:color 0.2s;
  }
  .eb-tab:hover { color:#2C4A1E; }
  .eb-tab.active { color:#2C4A1E; }
  .eb-tab.active::after {
    content:''; position:absolute; bottom:-1px; left:0; right:0;
    height:2px; background:#55883B;
  }

  .eb-kpi-row { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:32px; }
  .eb-kpi-card {
    border-radius:2px; padding:22px 24px;
    background:rgba(248,252,244,0.85); border:1px solid rgba(85,136,59,0.15);
    display:flex; align-items:center; gap:16px;
    transition:transform 0.2s, box-shadow 0.2s;
  }
  .eb-kpi-card:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(44,74,30,0.10); }
  .eb-kpi-icon {
    width:46px; height:46px; border-radius:4px; display:flex;
    align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0;
  }
  .eb-kpi-icon.green  { background:rgba(85,136,59,0.12); }
  .eb-kpi-icon.gold   { background:rgba(154,103,53,0.12); }
  .eb-kpi-icon.dark   { background:rgba(44,74,30,0.10); }
  .eb-kpi-num {
    font-family:'Cormorant Garamond',serif; font-size:1.8rem;
    font-weight:600; color:#2C4A1E; line-height:1;
  }
  .eb-kpi-label {
    font-family:'Jost',sans-serif; font-size:0.62rem; font-weight:500;
    letter-spacing:0.16em; text-transform:uppercase; color:#55883B; margin-top:4px;
  }

  .eb-chart-card {
    border-radius:2px; background:rgba(248,252,244,0.85);
    border:1px solid rgba(85,136,59,0.15); padding:24px 28px; margin-bottom:20px;
  }
  .eb-chart-title {
    font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:600;
    color:#2C4A1E; margin-bottom:4px;
  }
  .eb-chart-sub {
    font-family:'Jost',sans-serif; font-size:0.68rem; letter-spacing:0.10em;
    color:#55883B; margin-bottom:20px; text-transform:uppercase;
  }
  .eb-charts-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }

  .eb-top-item {
    display:flex; align-items:center; gap:12px; padding:10px 0;
    border-bottom:1px solid rgba(85,136,59,0.08);
  }
  .eb-top-item:last-child { border-bottom:none; }
  .eb-top-rank {
    font-family:'Cormorant Garamond',serif; font-size:1.2rem;
    font-weight:600; color:#C9A84C; width:24px; flex-shrink:0; text-align:center;
  }
  .eb-top-name {
    font-family:'Jost',sans-serif; font-size:0.84rem; font-weight:500;
    color:#2C4A1E; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .eb-top-val {
    font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:600; color:#55883B;
  }
  .eb-top-bar-wrap { width:100%; background:rgba(85,136,59,0.10); border-radius:2px; height:4px; margin-top:4px; }
  .eb-top-bar-fill { height:4px; border-radius:2px; background:linear-gradient(90deg,#2C4A1E,#55883B); }

  .eb-empty-chart {
    height:200px; display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    color:#9A6735; font-family:'Jost',sans-serif;
    font-size:0.75rem; letter-spacing:0.12em; text-transform:uppercase; gap:8px;
  }

  /* Tooltip custom */
  .eb-tooltip {
    background:rgba(44,74,30,0.92); border:none; border-radius:4px;
    padding:10px 14px; font-family:'Jost',sans-serif;
  }
  .eb-tooltip-label { color:#C1E899; font-size:0.7rem; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:4px; }
  .eb-tooltip-val   { color:#fff; font-size:0.9rem; font-weight:500; }
`;

// Tooltip personalizado para recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="eb-tooltip">
      <div className="eb-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="eb-tooltip-val">
          {p.name}: {typeof p.value === 'number' && p.name?.includes('$')
            ? `$${p.value.toFixed(2)}`
            : p.value}
        </div>
      ))}
    </div>
  );
};

export default function AdminReportes() {
  const [tab, setTab]               = useState(0);
  const [totales, setTotales]       = useState(null);
  const [topProductos, setTop]      = useState([]);
  const [ventasDia, setVentasDia]   = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [bajoStock, setBajoStock]   = useState([]);
  const [cargando, setCargando]     = useState(true);

  useEffect(() => {
    Promise.all([
      reportesAPI.totales(),
      reportesAPI.topProductos(),
      reportesAPI.ventasPorDia(),
      reportesAPI.ventasPorCategoria(),
      inventarioAPI.listar(),
    ]).then(([tot, top, dias, cats, inv]) => {
      setTotales(tot.data);
      setTop(top.data.slice(0, 8));
      setVentasDia(dias.data.map(d => ({
        fecha:    d.fecha?.slice(5) ?? '',
        ingresos: Number(d.total ?? 0),
        unidades: Number(d.cantidad ?? 0),
      })));
      setCategorias(cats.data.map(c => ({
        name:  c.categoria ?? 'Sin categoría',
        value: Number(c.total ?? 0),
        qty:   Number(c.cantidad ?? 0),
      })));
      setBajoStock(inv.data.filter(i => i.estado !== 'OK'));
    }).finally(() => setCargando(false));
  }, []);

  const maxQty = topProductos.length > 0
    ? Math.max(...topProductos.map(p => Number(p.cantidad))) : 1;

  const sinStock = bajoStock.filter(i => i.estado === 'SIN STOCK').length;
  const bajo     = bajoStock.filter(i => i.estado === 'BAJO').length;

  return (
    <Box sx={{ display:'flex', bgcolor:'#EDF5E4', minHeight:'100vh' }} className="eb-page">
      <style>{MARBLE_STYLES}</style>
      <style>{extraStyles}</style>
      <Sidebar items={MENU} />
      <Box component="main" sx={{ flexGrow:1 }}>

        {/* Header */}
        <div className="eb-header">
          <div>
            <p className="eb-subtitle">Elite Beauty — Analisis</p>
            <h1 className="eb-title">Reportes</h1>
          </div>
          <div style={{ fontFamily:'Jost,sans-serif', fontSize:'0.72rem', letterSpacing:'0.12em', color:'#9A6735', textTransform:'uppercase' }}>
            {new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </div>
        </div>

        <div className="eb-content">

          {cargando ? (
            <div style={{ textAlign:'center', padding:'80px', fontFamily:'Jost,sans-serif', fontSize:'0.75rem', letterSpacing:'0.2em', color:'#55883B', textTransform:'uppercase' }}>
              Cargando reportes...
            </div>
          ) : (
            <>
              {/* KPIs */}
              <div className="eb-kpi-row">
                <div className="eb-kpi-card">
                  <div className="eb-kpi-icon green">💰</div>
                  <div>
                    <div className="eb-kpi-num">
                      ${totales?.ingresos != null ? Number(totales.ingresos).toFixed(2) : '0.00'}
                    </div>
                    <div className="eb-kpi-label">Ingresos totales</div>
                  </div>
                </div>
                <div className="eb-kpi-card">
                  <div className="eb-kpi-icon gold">📦</div>
                  <div>
                    <div className="eb-kpi-num">{totales?.unidades ?? 0}</div>
                    <div className="eb-kpi-label">Unidades vendidas</div>
                  </div>
                </div>
                <div className="eb-kpi-card">
                  <div className="eb-kpi-icon dark">👥</div>
                  <div>
                    <div className="eb-kpi-num">{totales?.clientes ?? 0}</div>
                    <div className="eb-kpi-label">Clientes con compras</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="eb-tabs-row">
                {['Ventas', 'Productos', 'Inventario'].map((t, i) => (
                  <button key={i} className={`eb-tab ${tab === i ? 'active' : ''}`}
                    onClick={() => setTab(i)}>{t}</button>
                ))}
              </div>

              {/* ── TAB 0: VENTAS ── */}
              {tab === 0 && (
                <>
                  {/* Gráfica de línea — ventas por día */}
                  <div className="eb-chart-card">
                    <div className="eb-chart-title">Ingresos por dia</div>
                    <div className="eb-chart-sub">Ultimos 30 dias</div>
                    {ventasDia.length === 0 ? (
                      <div className="eb-empty-chart">
                        <span style={{ fontSize:'1.5rem' }}>◈</span>
                        Sin ventas registradas aun
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={ventasDia} margin={{ top:5, right:20, left:0, bottom:5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(85,136,59,0.15)" />
                          <XAxis dataKey="fecha" tick={{ fontFamily:'Jost,sans-serif', fontSize:11, fill:'#55883B' }} />
                          <YAxis tick={{ fontFamily:'Jost,sans-serif', fontSize:11, fill:'#55883B' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontFamily:'Jost,sans-serif', fontSize:11 }} />
                          <Line type="monotone" dataKey="ingresos" name="$ Ingresos"
                            stroke="#2C4A1E" strokeWidth={2.5} dot={{ fill:'#55883B', r:4 }}
                            activeDot={{ r:6, fill:'#C9A84C' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Gráfica de barras — unidades por día */}
                  <div className="eb-chart-card">
                    <div className="eb-chart-title">Unidades vendidas por dia</div>
                    <div className="eb-chart-sub">Ultimos 30 dias</div>
                    {ventasDia.length === 0 ? (
                      <div className="eb-empty-chart">
                        <span style={{ fontSize:'1.5rem' }}>◈</span>
                        Sin ventas registradas aun
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={ventasDia} margin={{ top:5, right:20, left:0, bottom:5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(85,136,59,0.15)" />
                          <XAxis dataKey="fecha" tick={{ fontFamily:'Jost,sans-serif', fontSize:11, fill:'#55883B' }} />
                          <YAxis tick={{ fontFamily:'Jost,sans-serif', fontSize:11, fill:'#55883B' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="unidades" name="Unidades" fill="#55883B" radius={[2,2,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </>
              )}

              {/* ── TAB 1: PRODUCTOS ── */}
              {tab === 1 && (
                <div className="eb-charts-grid">
                  {/* Top productos */}
                  <div className="eb-chart-card" style={{ marginBottom:0 }}>
                    <div className="eb-chart-title">Top productos vendidos</div>
                    <div className="eb-chart-sub">Por unidades</div>
                    {topProductos.length === 0 ? (
                      <div className="eb-empty-chart">
                        <span style={{ fontSize:'1.5rem' }}>◈</span>
                        Sin ventas registradas
                      </div>
                    ) : (
                      <div>
                        {topProductos.map((p, i) => {
                          const pct = Math.round((Number(p.cantidad) / maxQty) * 100);
                          return (
                            <div key={i} className="eb-top-item">
                              <span className="eb-top-rank">{i + 1}</span>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div className="eb-top-name">{p.nombre}</div>
                                <div className="eb-top-bar-wrap">
                                  <div className="eb-top-bar-fill" style={{ width:`${pct}%` }} />
                                </div>
                              </div>
                              <span className="eb-top-val">{p.cantidad} uds</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Pie por categoría */}
                  <div className="eb-chart-card" style={{ marginBottom:0 }}>
                    <div className="eb-chart-title">Ventas por categoria</div>
                    <div className="eb-chart-sub">Distribucion de ingresos</div>
                    {categorias.length === 0 ? (
                      <div className="eb-empty-chart">
                        <span style={{ fontSize:'1.5rem' }}>◈</span>
                        Sin ventas registradas
                      </div>
                    ) : (
                      <>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie data={categorias} dataKey="value" nameKey="name"
                              cx="50%" cy="50%" outerRadius={80} innerRadius={40}
                              paddingAngle={3}>
                              {categorias.map((_, i) => (
                                <Cell key={i} fill={COLORES[i % COLORES.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
                          </PieChart>
                        </ResponsiveContainer>
                        {/* Leyenda */}
                        <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
                          {categorias.map((c, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <div style={{ width:10, height:10, borderRadius:2, background:COLORES[i % COLORES.length], flexShrink:0 }} />
                              <span style={{ fontFamily:'Jost,sans-serif', fontSize:'0.75rem', color:'#2C4A1E', flex:1 }}>{c.name}</span>
                              <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'0.9rem', fontWeight:600, color:'#55883B' }}>
                                ${Number(c.value).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB 2: INVENTARIO ── */}
              {tab === 2 && (
                <>
                  {bajoStock.length > 0 && (
                    <div className="eb-summary-row" style={{ display:'flex', gap:16, marginBottom:28 }}>
                      {sinStock > 0 && (
                        <div className="eb-summary-card error">
                          <div><div className="eb-card-num">{sinStock}</div><div className="eb-card-label">Sin stock</div></div>
                          <span className="eb-card-icon">⚠</span>
                        </div>
                      )}
                      {bajo > 0 && (
                        <div className="eb-summary-card warning">
                          <div><div className="eb-card-num">{bajo}</div><div className="eb-card-label">Stock bajo</div></div>
                          <span className="eb-card-icon">↓</span>
                        </div>
                      )}
                      <div className="eb-summary-card neutral">
                        <div><div className="eb-card-num">{bajoStock.length}</div><div className="eb-card-label">Total alertas</div></div>
                        <span className="eb-card-icon">◈</span>
                      </div>
                    </div>
                  )}

                  {bajoStock.length === 0 ? (
                    <div className="eb-empty">
                      <div className="eb-empty-icon">✓</div>
                      <div className="eb-empty-title">Inventario en orden</div>
                      <div className="eb-empty-sub">
                        <span className="eb-ornament" />Todos los productos tienen stock suficiente<span className="eb-ornament" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="eb-section-label">Productos que requieren atencion</p>
                      {/* Gráfica de barras de stock */}
                      <div className="eb-chart-card" style={{ marginBottom:20 }}>
                        <div className="eb-chart-title">Stock actual vs Minimo</div>
                        <div className="eb-chart-sub">Productos con alertas</div>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart
                            data={bajoStock.map(i => ({
                              name:   i.producto?.nombre?.split(' ')[0] ?? '',
                              stock:  i.stock,
                              minimo: i.minimo,
                            }))}
                            margin={{ top:5, right:20, left:0, bottom:5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(85,136,59,0.15)" />
                            <XAxis dataKey="name" tick={{ fontFamily:'Jost,sans-serif', fontSize:10, fill:'#55883B' }} />
                            <YAxis tick={{ fontFamily:'Jost,sans-serif', fontSize:11, fill:'#55883B' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontFamily:'Jost,sans-serif', fontSize:11 }} />
                            <Bar dataKey="stock"  name="Stock actual" fill="#55883B" radius={[2,2,0,0]} />
                            <Bar dataKey="minimo" name="Minimo"       fill="#C9A84C" radius={[2,2,0,0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Tabla de alertas */}
                      <div className="eb-table-wrap">
                        <table className="eb-table">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Marca</th>
                              <th>Stock</th>
                              <th>Minimo</th>
                              <th>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bajoStock.map((i, idx) => (
                              <tr key={idx}>
                                <td style={{ fontWeight:500 }}>{i.producto?.nombre}</td>
                                <td style={{ color:'#55883B', fontSize:'0.82rem' }}>{i.producto?.marca ?? '—'}</td>
                                <td style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.1rem', fontWeight:600, color: i.estado==='SIN STOCK' ? '#8B2E2E' : '#9A6735' }}>
                                  {i.stock}
                                </td>
                                <td style={{ color:'#9A6735' }}>{i.minimo}</td>
                                <td>
                                  <span style={{
                                    display:'inline-block', padding:'3px 10px', borderRadius:'2px',
                                    fontFamily:'Jost,sans-serif', fontSize:'0.6rem', fontWeight:500,
                                    letterSpacing:'0.14em', textTransform:'uppercase',
                                    background: i.estado==='SIN STOCK' ? 'rgba(139,46,46,0.12)' : 'rgba(154,103,53,0.15)',
                                    color: i.estado==='SIN STOCK' ? '#6B1E1E' : '#5C3A1E',
                                  }}>
                                    {i.estado}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </Box>
    </Box>
  );
}