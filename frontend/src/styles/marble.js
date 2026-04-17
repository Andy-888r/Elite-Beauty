// ══════════════════════════════════════
// SISTEMA DE DISEÑO — ELITE BEAUTY VERDE
// Paleta: #C1E899 · #9A6735 · #E6F0DC · #55883B · #2C4A1E · #C9A84C
// ══════════════════════════════════════

export const MARBLE_BG = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

  /* ── Fondo mármol verde-dorado ── */
  .eb-page {
    position: relative;
  }
  .eb-page::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 70% 50% at 10% 15%, rgba(85,136,59,0.13) 0%, transparent 60%),
      radial-gradient(ellipse 50% 70% at 90% 80%, rgba(85,136,59,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 35% 35% at 55% 45%, rgba(201,168,76,0.06) 0%, transparent 50%),
      radial-gradient(ellipse 60% 40% at 25% 75%, rgba(44,74,30,0.08) 0%, transparent 55%),
      linear-gradient(150deg, #F4F9F0 0%, #EDF5E4 35%, #F0F7EA 65%, #F5FAF2 100%);
  }
  .eb-page::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      linear-gradient(108deg, transparent 28%, rgba(201,168,76,0.09) 29%, rgba(201,168,76,0.04) 30%, transparent 31%),
      linear-gradient(75deg,  transparent 48%, rgba(201,168,76,0.07) 49%, rgba(201,168,76,0.03) 50%, transparent 51%),
      linear-gradient(128deg, transparent 58%, rgba(201,168,76,0.06) 59%, transparent 60%),
      linear-gradient(118deg, transparent 18%, rgba(44,74,30,0.05) 19%, transparent 21%),
      linear-gradient(85deg,  transparent 62%, rgba(85,136,59,0.06) 63%, transparent 65%);
  }

  /* ── Header de cada página ── */
  .eb-header {
    padding: 36px 48px 24px;
    border-bottom: 1px solid rgba(154,103,53,0.18);
    background: rgba(248,252,244,0.85);
    backdrop-filter: blur(8px);
    display: flex; align-items: flex-end; justify-content: space-between;
    position: relative; z-index: 1;
  }
  .eb-subtitle {
    font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 300;
    letter-spacing: 0.22em; text-transform: uppercase; color: #55883B; margin: 0 0 6px;
  }
  .eb-title {
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2.2rem;
    font-weight: 600; color: #2C4A1E; letter-spacing: 0.04em; line-height: 1; margin: 0;
  }
  .eb-content { padding: 36px 48px; position: relative; z-index: 1; }
  .eb-section-label {
    font-family: 'Jost', sans-serif; font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.24em; text-transform: uppercase; color: #55883B; margin-bottom: 14px;
  }
  .eb-ornament {
    display: inline-block; width: 32px; height: 1px;
    background: linear-gradient(90deg, transparent, #C9A84C, transparent);
    vertical-align: middle; margin: 0 10px; opacity: 0.7;
  }

  /* ── Tabla ── */
  .eb-table-wrap { border-radius: 2px; overflow: hidden; border: 1px solid rgba(154,103,53,0.18); }
  .eb-table { width: 100%; border-collapse: collapse; }
  .eb-table thead tr { background: rgba(85,136,59,0.12); }
  .eb-table th {
    font-family: 'Jost', sans-serif; font-size: 0.62rem; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase; color: #2C4A1E;
    padding: 14px 20px; text-align: left; border-bottom: 1px solid rgba(154,103,53,0.18);
  }
  .eb-table td {
    font-family: 'Jost', sans-serif; font-size: 0.88rem; color: #2C4A1E;
    padding: 16px 20px; border-bottom: 1px solid rgba(85,136,59,0.08);
    background: rgba(248,252,244,0.70);
  }
  .eb-table tbody tr:last-child td { border-bottom: none; }
  .eb-table tbody tr:hover td { background: rgba(193,232,153,0.15); }

  /* ── Botones ── */
  .eb-btn-primary {
    font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    background: linear-gradient(135deg, #2C4A1E, #55883B);
    color: #F4F9F0; border: none; padding: 12px 24px; border-radius: 2px;
    cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;
    box-shadow: 0 2px 12px rgba(85,136,59,0.25);
  }
  .eb-btn-primary:hover { box-shadow: 0 4px 20px rgba(85,136,59,0.40); transform: translateY(-1px); }
  .eb-btn-secondary {
    font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase; background: transparent;
    color: #55883B; border: 1px solid rgba(85,136,59,0.40); padding: 8px 16px;
    border-radius: 2px; cursor: pointer; display: inline-flex; align-items: center;
    gap: 6px; transition: all 0.2s;
  }
  .eb-btn-secondary:hover { border-color: #55883B; background: rgba(85,136,59,0.07); }
  .eb-btn-danger {
    font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase; background: transparent;
    color: #8B2E2E; border: 1px solid rgba(139,46,46,0.30); padding: 8px 16px;
    border-radius: 2px; cursor: pointer; display: inline-flex; align-items: center;
    gap: 6px; transition: all 0.2s;
  }
  .eb-btn-danger:hover { background: rgba(139,46,46,0.06); border-color: #8B2E2E; }

  /* ── Chips ── */
  .eb-chip-ok {
  background: rgba(85,136,59,0.22) !important;
  color: #1A3A0E !important;
  border: 1px solid rgba(85,136,59,0.50) !important;
  font-family:'Jost',sans-serif !important; font-size:0.6rem !important;
  letter-spacing:0.14em !important; border-radius:2px !important; height:22px !important;
}
.eb-chip-bajo {
  background: rgba(154,103,53,0.22) !important;
  color: #3A1E00 !important;
  border: 1px solid rgba(201,168,76,0.60) !important;
  font-family:'Jost',sans-serif !important; font-size:0.6rem !important;
  letter-spacing:0.14em !important; border-radius:2px !important; height:22px !important;
}
.eb-chip-sinstock {
  background: rgba(139,46,46,0.18) !important;
  color: #5A0A0A !important;
  border: 1px solid rgba(192,57,43,0.55) !important;
  font-family:'Jost',sans-serif !important; font-size:0.6rem !important;
  font-weight:600 !important;
  letter-spacing:0.14em !important; border-radius:2px !important; height:22px !important;
}
.eb-chip-active {
  background: rgba(85,136,59,0.22) !important;
  color: #1A3A0E !important;
  border: 1px solid rgba(85,136,59,0.50) !important;
  font-family:'Jost',sans-serif !important; font-size:0.6rem !important;
  letter-spacing:0.14em !important; border-radius:2px !important; height:22px !important;
}
.eb-chip-inactive {
  background: rgba(100,100,100,0.12) !important;
  color: #444 !important;
  border: 1px solid rgba(100,100,100,0.30) !important;
  font-family:'Jost',sans-serif !important; font-size:0.6rem !important;
  letter-spacing:0.14em !important; border-radius:2px !important; height:22px !important;
}
  
  /* ── Cards ── */
  .eb-card-wrap {
    background: rgba(248,252,244,0.80); backdrop-filter: blur(6px);
    border: 1px solid rgba(154,103,53,0.15); border-radius: 2px;
    box-shadow: 0 2px 16px rgba(44,74,30,0.08);
  }

  /* ── Dialog ── */
  .eb-dialog .MuiDialog-paper { border-radius: 2px !important; background: #F4F9F0 !important; }
  .eb-dialog-title {
    font-family: 'Cormorant Garamond', Georgia, serif !important; font-size: 1.6rem !important;
    font-weight: 600 !important; color: #2C4A1E !important; padding: 28px 32px 12px !important;
    border-bottom: 1px solid rgba(85,136,59,0.15) !important;
  }
  .eb-dialog-content { padding: 24px 32px !important; display: flex; flex-direction: column; gap: 16px; }
  .eb-dialog-actions { padding: 16px 32px 24px !important; border-top: 1px solid rgba(85,136,59,0.15) !important; gap: 8px !important; }
  .eb-field label { font-family: 'Jost', sans-serif !important; font-size: 0.72rem !important; letter-spacing: 0.12em !important; text-transform: uppercase !important; color: #55883B !important; }
  .eb-field input, .eb-field textarea { font-family: 'Jost', sans-serif !important; font-size: 0.9rem !important; color: #2C4A1E !important; }
  .eb-field .MuiOutlinedInput-notchedOutline { border-color: rgba(85,136,59,0.25) !important; border-radius: 2px !important; }
  .eb-field:hover .MuiOutlinedInput-notchedOutline { border-color: rgba(85,136,59,0.50) !important; }
  .eb-field .Mui-focused .MuiOutlinedInput-notchedOutline { border-color: #55883B !important; }

  /* ── Empty states ── */
  .eb-empty { text-align: center; padding: 80px 20px; }
  .eb-empty-icon { font-size: 2rem; margin-bottom: 12px; color: #9A6735; }
  .eb-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: #55883B; margin-bottom: 6px; }
  .eb-empty-sub { font-family: 'Jost', sans-serif; font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; color: #9A6735; }

  /* ── Summary cards ── */
  .eb-summary-card { flex: 1; border-radius: 2px; padding: 24px 28px; display: flex; align-items: center; gap: 20px; position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; background: rgba(248,252,244,0.85); backdrop-filter: blur(6px); }
  .eb-summary-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(44,74,30,0.12); }
  .eb-summary-card.error   { border-left: 3px solid #8B2E2E; }
  .eb-summary-card.warning { border-left: 3px solid #9A6735; }
  .eb-summary-card.success { border-left: 3px solid #55883B; }
  .eb-summary-card.neutral { border-left: 3px solid #2C4A1E; }
  .eb-card-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 600; line-height: 1; }
  .eb-summary-card.error .eb-card-num   { color: #8B2E2E; }
  .eb-summary-card.warning .eb-card-num { color: #9A6735; }
  .eb-summary-card.success .eb-card-num { color: #55883B; }
  .eb-summary-card.neutral .eb-card-num { color: #2C4A1E; }
  .eb-card-label { font-family: 'Jost', sans-serif; font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 4px; }
  .eb-summary-card.error .eb-card-label   { color: #6B1E1E; }
  .eb-summary-card.warning .eb-card-label { color: #5C3A1E; }
  .eb-summary-card.success .eb-card-label { color: #2C4A1E; }
  .eb-summary-card.neutral .eb-card-label { color: #3A5A28; }
  .eb-card-icon { font-size: 1.6rem; opacity: 0.12; position: absolute; right: 24px; bottom: 16px; }
`;

export const MARBLE_STYLES = MARBLE_BG;