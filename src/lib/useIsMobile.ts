import { useState, useEffect } from 'react';

// Móvil o dispositivo táctil / pantalla chica: ahí desactivamos animaciones
// por-frame (orbita, parallax, estallido) para evitar lag.
const QUERY = '(max-width: 1024px), (hover: none)';

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
