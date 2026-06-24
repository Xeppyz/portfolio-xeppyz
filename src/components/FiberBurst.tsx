import { motion, useScroll, useTransform } from 'framer-motion';
import useIsMobile from '../lib/useIsMobile';

// "Estallido de Fibra" — capa decorativa que se expande al hacer scroll (Hero→About).
// 3 anillos a distinta velocidad para un parallax marcado.

type Ring = { r: number; count: number; offset: number; width: number };
const RINGS: Ring[] = [
  { r: 60, count: 6, offset: 0, width: 3 },
  { r: 112, count: 8, offset: 0.4, width: 2.5 },
  { r: 172, count: 10, offset: 0.2, width: 2 },
];

function spokes({ r, count, offset, width }: Ring) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + offset;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, width };
  });
}

export default function FiberBurst() {
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();

  // Cada anillo se expande, gira y se desvanece a su propio ritmo.
  const inner = {
    scale: useTransform(scrollY, [0, 650], [1, 1.6]),
    rotate: useTransform(scrollY, [0, 650], [0, 8]),
    opacity: useTransform(scrollY, [0, 500], [0.9, 0.15]),
  };
  const mid = {
    scale: useTransform(scrollY, [0, 650], [1, 2.1]),
    rotate: useTransform(scrollY, [0, 650], [0, -10]),
    opacity: useTransform(scrollY, [0, 520], [0.8, 0.1]),
  };
  const outer = {
    scale: useTransform(scrollY, [0, 650], [1, 2.7]),
    rotate: useTransform(scrollY, [0, 650], [0, 14]),
    opacity: useTransform(scrollY, [0, 480], [0.7, 0]),
  };
  const layers = [inner, mid, outer];

  return (
    <div
      className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/4 w-[680px] max-w-[140vw] pointer-events-none"
      aria-hidden="true"
    >
      <svg viewBox="-200 -200 400 400" className="w-full">
        <defs>
          <linearGradient id="fb-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6ea8fe" />
            <stop offset="100%" stopColor="#b58cff" />
          </linearGradient>
          <radialGradient id="fb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6ea8fe" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6ea8fe" stopOpacity="0" />
          </radialGradient>
        </defs>

        {RINGS.map((ring, ri) => {
          const layer = layers[ri];
          return (
            <motion.g
              key={ri}
              style={isMobile ? { opacity: 0.28 } : { scale: layer.scale, rotate: layer.rotate, opacity: layer.opacity }}
            >
              {spokes(ring).map((s, i) => (
                <g key={i}>
                  <line
                    x1={0} y1={0} x2={s.x} y2={s.y}
                    stroke="url(#fb-grad)" strokeWidth={s.width} strokeLinecap="round"
                  />
                  <circle cx={s.x} cy={s.y} r={ri === 0 ? 5 : 4} fill="url(#fb-grad)" />
                </g>
              ))}
            </motion.g>
          );
        })}

        {/* Núcleo */}
        <circle cx={0} cy={0} r={40} fill="url(#fb-core)" />
        <circle cx={0} cy={0} r={9} fill="url(#fb-grad)" />
      </svg>
    </div>
  );
}
