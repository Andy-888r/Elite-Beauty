import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * EliteLogo — Componente de logo para Elite Beauty
 *
 * Props:
 *   variant: 'full' | 'compact' | 'icon'
 *     - full:    imagen + nombre + subtítulo (para sidebar abierto, login, portada)
 *     - compact: solo imagen (para sidebar colapsado)
 *     - icon:    solo las iniciales EB en un badge elegante (fallback sin imagen)
 *   size: 'sm' | 'md' | 'lg'
 *   light: boolean — versión clara sobre fondo oscuro
 */
const EliteLogo = ({
  variant = 'full',
  size = 'md',
  light = false,
  sx = {}
}) => {

  const sizes = {
    sm: { img: 36, title: '0.80rem', sub: '0.55rem', gap: 1   },
    md: { img: 48, title: '0.95rem', sub: '0.62rem', gap: 1.2 },
    lg: { img: 72, title: '1.25rem', sub: '0.78rem', gap: 1.5 },
  };

  const s = sizes[size] || sizes.md;

  const textColor     = light ? '#FFFFFF' : '#2C2C2C';
  const subColor      = light ? 'rgba(255,255,255,0.65)' : '#8A7D74';
  const dividerColor  = light ? 'rgba(255,255,255,0.30)' : 'rgba(139,119,108,0.35)';

  // ── Solo ícono: badge con iniciales EB ──────────────────────────────────
  if (variant === 'icon') {
    return (
      <Box
        sx={{
          width:  s.img,
          height: s.img,
          borderRadius: '12px',
          background: light
            ? 'rgba(255,255,255,0.15)'
            : 'linear-gradient(135deg, #2C2C2C 0%, #4A3F3A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${dividerColor}`,
          backdropFilter: 'blur(8px)',
          flexShrink: 0,
          ...sx
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Didact Gothic", "Cormorant Garamond", Georgia, serif',
            fontSize: s.img * 0.38,
            fontWeight: 400,
            color: light ? '#FFFFFF' : '#F5EDE8',
            letterSpacing: '0.05em',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          EB
        </Typography>
      </Box>
    );
  }

  // ── Solo imagen compacta ─────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Box
        sx={{
          width:  s.img,
          height: s.img,
          borderRadius: '10px',
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: light ? 'rgba(255,255,255,0.12)' : '#FAFAFA',
          border: `1px solid ${dividerColor}`,
          ...sx
        }}
      >
        <img
          src="/logo_elite_beauty.png"
          alt="Elite Beauty"
          style={{ width: '88%', height: '88%', objectFit: 'contain' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </Box>
    );
  }

  // ── Full: imagen + nombre + subtítulo ────────────────────────────────────
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: s.gap,
        userSelect: 'none',
        ...sx
      }}
    >
      {/* Imagen */}
      <Box
        sx={{
          width:  s.img,
          height: s.img,
          borderRadius: size === 'lg' ? '16px' : '10px',
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: light ? 'rgba(255,255,255,0.12)' : '#FAFAFA',
          border: `1px solid ${dividerColor}`,
          boxShadow: light
            ? '0 2px 12px rgba(0,0,0,0.25)'
            : '0 2px 10px rgba(44,44,44,0.10)',
        }}
      >
        <img
          src="/logo_elite_beauty.png"
          alt="Elite Beauty"
          style={{ width: '90%', height: '90%', objectFit: 'contain' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </Box>

      {/* Texto */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>

        {/* Nombre */}
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: s.title,
            fontWeight: 600,
            color: textColor,
            letterSpacing: '0.18em',
            lineHeight: 1.1,
            textTransform: 'uppercase',
          }}
        >
          Elite Beauty
        </Typography>

        {/* Separador decorativo */}
        <Box
          sx={{
            width: '100%',
            height: '1px',
            background: `linear-gradient(90deg, ${dividerColor}, transparent)`,
            my: '2px',
          }}
        />

        {/* Subtítulo */}
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: s.sub,
            fontWeight: 400,
            fontStyle: 'italic',
            color: subColor,
            letterSpacing: '0.22em',
            lineHeight: 1,
            textTransform: 'lowercase',
          }}
        >
          ventas y inventarios
        </Typography>

      </Box>
    </Box>
  );
};

export default EliteLogo;




















