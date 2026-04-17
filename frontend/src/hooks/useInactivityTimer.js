import { useEffect, useRef, useCallback } from 'react';
 
const TIEMPO_INACTIVIDAD = 3 * 60 * 1000; // 3 minutos de inactividad
const TIEMPO_AVISO       = 30 * 1000;     // 30 segundos para responder
 
const EVENTOS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
 
export const useInactivityTimer = ({ onWarning, onLogout }) => {
  const timerInactividad = useRef(null);
  const timerAviso       = useRef(null);
 
  const limpiarTimers = useCallback(() => {
    if (timerInactividad.current) clearTimeout(timerInactividad.current);
    if (timerAviso.current)       clearTimeout(timerAviso.current);
  }, []);
 
  const reiniciarTimer = useCallback(() => {
    limpiarTimers();
 
    // A los 3 minutos → mostrar aviso
    timerInactividad.current = setTimeout(() => {
      onWarning();
      // 30 segundos después → cerrar sesión automáticamente
      timerAviso.current = setTimeout(() => {
        onLogout();
      }, TIEMPO_AVISO);
    }, TIEMPO_INACTIVIDAD);
  }, [limpiarTimers, onWarning, onLogout]);
 
  useEffect(() => {
    reiniciarTimer();
    EVENTOS.forEach(e => window.addEventListener(e, reiniciarTimer));
 
    return () => {
      limpiarTimers();
      EVENTOS.forEach(e => window.removeEventListener(e, reiniciarTimer));
    };
  }, [reiniciarTimer, limpiarTimers]);
 
  return { reiniciarTimer };
};