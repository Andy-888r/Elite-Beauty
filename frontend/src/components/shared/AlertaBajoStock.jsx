import { useState } from "react";
 
const AlertaBajoStock = ({ alertas }) => {
  const [visible, setVisible] = useState(true);
 
  if (!alertas || alertas.length === 0 || !visible) return null;
 
  const sinStock = alertas.filter(a => a.startsWith('[SIN STOCK]'));
  const bajo     = alertas.filter(a => a.startsWith('[BAJO]'));
 
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(26,50,16,0.55)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Jost', sans-serif",
    }}>
      <div style={{
        backgroundColor: "#EDF5E4",
        borderRadius: "4px",
        maxWidth: "480px",
        width: "90%",
        maxHeight: "78vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 24px 64px rgba(26,50,16,0.35)",
        border: "1px solid rgba(85,136,59,0.35)",
        overflow: "hidden",
      }}>
 
        {/* ── Header verde oscuro — sin botón X ── */}
        <div style={{
          background: "#2C4A1E",
          padding: "18px 22px",
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#E6F5D0",
            letterSpacing: "0.04em",
            marginBottom: "2px",
          }}>
            Alerta de Inventario
          </div>
          <div style={{
            fontSize: "0.62rem",
            fontWeight: 500,
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: "#C1E899",
          }}>
            {alertas.length} producto(s) requieren atención
          </div>
        </div>
 
        {/* ── Franja pistache ── */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #1A3210, #55883B, #C1E899)" }} />
 
        {/* ── Cuerpo scrollable ── */}
        <div style={{ overflowY: "auto", padding: "20px 22px", flex: 1 }}>
 
          {/* Grupo SIN STOCK */}
          {sinStock.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{
                fontSize: "0.58rem", fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "#8B2E2E", marginBottom: "8px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(139,46,46,0.20)" }} />
                ⚠ Sin stock ({sinStock.length})
                <div style={{ flex: 1, height: "1px", background: "rgba(139,46,46,0.20)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {sinStock.map((alerta, i) => {
                  const nombre = alerta.replace('[SIN STOCK]', '').replace(/- Stock: \d+/, '').trim();
                  const stock  = alerta.match(/Stock: (\d+)/)?.[1] ?? '0';
                  return (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: "rgba(139,46,46,0.07)", border: "1px solid rgba(139,46,46,0.18)",
                      borderRadius: "3px", padding: "9px 14px",
                    }}>
                      <span style={{ fontSize: "0.84rem", color: "#5C1A1A", fontWeight: 600 }}>{nombre}</span>
                      <span style={{
                        fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em",
                        textTransform: "uppercase", color: "#fff",
                        background: "#8B2E2E", padding: "3px 8px", borderRadius: "2px",
                      }}>Stock: {stock}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
 
          {/* Grupo BAJO */}
          {bajo.length > 0 && (
            <div>
              <div style={{
                fontSize: "0.58rem", fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "#9A6735", marginBottom: "8px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(154,103,53,0.20)" }} />
                ↓ Stock bajo ({bajo.length})
                <div style={{ flex: 1, height: "1px", background: "rgba(154,103,53,0.20)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {bajo.map((alerta, i) => {
                  const nombre = alerta.replace('[BAJO]', '').replace(/- Stock: \d+/, '').trim();
                  const stock  = alerta.match(/Stock: (\d+)/)?.[1] ?? '0';
                  return (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: "rgba(154,103,53,0.07)", border: "1px solid rgba(154,103,53,0.20)",
                      borderRadius: "3px", padding: "9px 14px",
                    }}>
                      <span style={{ fontSize: "0.84rem", color: "#5C3A1E", fontWeight: 500 }}>{nombre}</span>
                      <span style={{
                        fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em",
                        textTransform: "uppercase", color: "#fff",
                        background: "#9A6735", padding: "3px 8px", borderRadius: "2px",
                      }}>Stock: {stock}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
 
        {/* ── Footer — solo botón Entendido ── */}
        <div style={{
          padding: "12px 22px",
          borderTop: "1px solid rgba(85,136,59,0.15)",
          background: "rgba(193,232,153,0.12)",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontSize: "0.65rem", color: "#55883B", letterSpacing: "0.08em" }}>
            Revisa el módulo de Inventario para registrar entradas.
          </span>
          <button onClick={() => setVisible(false)} style={{
            background: "#2C4A1E",
            border: "none",
            borderRadius: "3px",
            padding: "7px 18px",
            cursor: "pointer",
            color: "#C1E899",
            fontSize: "0.62rem",
            fontFamily: "'Jost', sans-serif",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}>
            Entendido
          </button>
        </div>
 
      </div>
    </div>
  );
};
 
export default AlertaBajoStock;