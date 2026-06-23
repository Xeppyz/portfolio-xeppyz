import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import WordsPullUp from '../components/WordsPullUp';

// "Conecta los Cables" — match de colores contra cronómetro, por niveles.
const COLORS = ['#ff6b6b', '#6ea8fe', '#3ddc97', '#ffd27a', '#b58cff', '#ff8cc8', '#4dd6e8'];
const MAX_LEVEL = 5;
const pairsOf = (lvl: number) => 2 + lvl;        // L1=3 … L5=7
const timeOf = (lvl: number) => Math.max(8, 20 - lvl * 2); // L1=18 … L5=10

const LX = 168;
const RX = 312;
const TOP = 72;
const BOTTOM = 296;
const portY = (i: number, n: number) => (n <= 1 ? (TOP + BOTTOM) / 2 : TOP + (i * (BOTTOM - TOP)) / (n - 1));

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Status = 'playing' | 'levelup' | 'over' | 'win';

export default function Playground() {
  const reduce = useReducedMotion();
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState<Status>('playing');
  const [rightOrder, setRightOrder] = useState<string[]>(() => shuffle(COLORS.slice(0, pairsOf(1))));
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [errorColor, setErrorColor] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeOf(1));

  const n = pairsOf(level);
  const leftOrder = COLORS.slice(0, n);
  const total = timeOf(level);

  const startLevel = useCallback((lvl: number) => {
    const count = pairsOf(lvl);
    setLevel(lvl);
    setRightOrder(shuffle(COLORS.slice(0, count)));
    setConnected(new Set());
    setSelected(null);
    setErrorColor(null);
    setTimeLeft(timeOf(lvl));
    setStatus('playing');
  }, []);

  // Cronómetro
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) { setStatus('over'); return 0; }
        return Math.round((t - 0.1) * 10) / 10;
      });
    }, 100);
    return () => clearInterval(id);
  }, [status]);

  // Nivel completado → marca el estado (sin timeout, para no auto-cancelarse)
  useEffect(() => {
    if (status === 'playing' && connected.size === n && n > 0) {
      setStatus(level >= MAX_LEVEL ? 'win' : 'levelup');
    }
  }, [connected, status, level, n]);

  // Tras "levelup", agenda el arranque del siguiente nivel
  useEffect(() => {
    if (status !== 'levelup') return;
    const id = setTimeout(() => startLevel(level + 1), reduce ? 250 : 1100);
    return () => clearTimeout(id);
  }, [status, level, reduce, startLevel]);

  // Limpia el flash de error
  useEffect(() => {
    if (!errorColor) return;
    const id = setTimeout(() => setErrorColor(null), 400);
    return () => clearTimeout(id);
  }, [errorColor]);

  const clickLeft = (color: string) => {
    if (status !== 'playing' || connected.has(color)) return;
    setSelected(color);
  };
  const clickRight = (color: string) => {
    if (status !== 'playing' || connected.has(color) || selected == null) return;
    if (color === selected) {
      setConnected(s => new Set(s).add(color));
      setSelected(null);
    } else {
      setSelected(null);
      setErrorColor(color);
      setTimeLeft(t => Math.max(0, Math.round((t - 2) * 10) / 10));
    }
  };

  const pct = Math.max(0, (timeLeft / total) * 100);
  const low = timeLeft <= 5;

  return (
    <section id="playground" className="py-section px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="text-center">
          <WordsPullUp as="h2" text="Conecta los Cables" className="font-heading text-3xl font-bold text-text-100 mb-2" />
          <p className="text-text-300 text-sm font-mono uppercase tracking-widest">Mini-game</p>
        </div>

        {/* HUD */}
        <div className="flex items-center gap-4 font-mono text-sm">
          <span className="text-text-100 font-semibold shrink-0">Nivel {level}<span className="text-text-300">/{MAX_LEVEL}</span></span>
          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-100 ease-linear ${low ? 'bg-red-400' : 'bg-gradient-to-r from-accent to-accent-2'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className={`tabular-nums shrink-0 ${low ? 'text-red-400' : 'text-text-300'}`}>{timeLeft.toFixed(1)}s</span>
          <span className="text-text-300 tabular-nums shrink-0">{n - connected.size} ⚡</span>
        </div>

        {/* Escena */}
        <div className="relative rounded-2xl bg-bg-800 border border-white/10 overflow-hidden">
          <svg viewBox="0 0 480 360" className="w-full" role="img" aria-label="Poste de empalme: conectá cada cable con su color">
            <defs>
              <linearGradient id="poleg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2c3350" /><stop offset="100%" stopColor="#1a2034" />
              </linearGradient>
            </defs>

            {/* Poste + caja de empalme */}
            <rect x="30" y="16" width="16" height="330" rx="4" fill="url(#poleg)" />
            <rect x="14" y="60" width="64" height="10" rx="3" fill="url(#poleg)" />
            <rect x="120" y="40" width="240" height="280" rx="18" fill="#0b0d12" stroke="rgba(255,255,255,0.08)" />
            <text x="240" y="34" textAnchor="middle" fill="#5d677e" fontFamily="monospace" fontSize="11">CAJA DE EMPALME</text>

            {/* Cables conectados */}
            {[...connected].map(color => {
              const ly = portY(leftOrder.indexOf(color), n);
              const ry = portY(rightOrder.indexOf(color), n);
              const midX = (LX + RX) / 2;
              return (
                <motion.path
                  key={color}
                  d={`M ${LX} ${ly} C ${midX} ${ly}, ${midX} ${ry}, ${RX} ${ry}`}
                  fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: 'easeOut' }}
                  style={{ filter: `drop-shadow(0 0 4px ${color}aa)` }}
                />
              );
            })}

            {/* Puertos izquierda */}
            {leftOrder.map((color, i) => {
              const y = portY(i, n);
              const isConn = connected.has(color);
              const isSel = selected === color;
              return (
                <g key={`l-${color}`} role="button" tabIndex={0}
                   aria-label={`Cable izquierdo color ${i + 1}${isConn ? ', conectado' : ''}`}
                   onClick={() => clickLeft(color)}
                   onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickLeft(color); } }}
                   style={{ cursor: isConn ? 'default' : 'pointer', outline: 'none' }}>
                  {isSel && <circle cx={LX} cy={y} r="18" fill="none" stroke="#fff" strokeWidth="2" />}
                  <circle cx={LX} cy={y} r="13" fill={color} opacity={isConn ? 0.35 : 1} />
                  <circle cx={LX} cy={y} r="5" fill="#0b0d12" opacity={isConn ? 0.35 : 1} />
                </g>
              );
            })}

            {/* Puertos derecha */}
            {rightOrder.map((color, i) => {
              const y = portY(i, n);
              const isConn = connected.has(color);
              const isErr = errorColor === color;
              return (
                <motion.g key={`r-${color}`} role="button" tabIndex={0}
                   aria-label={`Puerto derecho color ${i + 1}${isConn ? ', conectado' : ''}`}
                   onClick={() => clickRight(color)}
                   onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickRight(color); } }}
                   style={{ cursor: isConn ? 'default' : 'pointer', outline: 'none' }}
                   animate={isErr && !reduce ? { x: [0, -5, 5, -4, 4, 0] } : { x: 0 }}
                   transition={{ duration: 0.4 }}>
                  {isErr && <circle cx={RX} cy={y} r="18" fill="none" stroke="#ff6b6b" strokeWidth="2" />}
                  <circle cx={RX} cy={y} r="13" fill={color} opacity={isConn ? 0.35 : 1} />
                  <circle cx={RX} cy={y} r="5" fill="#0b0d12" opacity={isConn ? 0.35 : 1} />
                </motion.g>
              );
            })}
          </svg>

          {/* Overlays */}
          <AnimatePresence>
            {status === 'levelup' && (
              <Overlay key="levelup" reduce={reduce}>
                <p className="font-heading font-bold text-text-100">Nivel {level} superado</p>
                <p className="font-mono text-sm text-gradient-accent">Siguiente…</p>
              </Overlay>
            )}
            {status === 'over' && (
              <Overlay key="over" reduce={reduce}>
                <p className="font-heading font-bold text-text-100">Tiempo agotado</p>
                <p className="font-mono text-sm text-text-300 mb-3">Llegaste al nivel {level}</p>
                <button onClick={() => startLevel(1)} className="pointer-events-auto px-4 py-2 rounded-lg bg-accent text-bg-900 text-sm font-semibold font-heading hover:bg-accent-hover transition-colors">
                  Reintentar
                </button>
              </Overlay>
            )}
            {status === 'win' && (
              <Overlay key="win" reduce={reduce}>
                <p className="font-heading font-bold text-text-100">¡Todos los niveles!</p>
                <p className="font-mono text-sm text-gradient-accent mb-3">Red completa ✦</p>
                <button onClick={() => startLevel(1)} className="pointer-events-auto px-4 py-2 rounded-lg bg-accent text-bg-900 text-sm font-semibold font-heading hover:bg-accent-hover transition-colors">
                  Jugar de nuevo
                </button>
              </Overlay>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-text-300 text-sm">
          Clic en un cable de la izquierda y luego en el puerto del <strong className="text-text-100">mismo color</strong>. Fallar resta 2s.
        </p>
      </div>
    </section>
  );
}

function Overlay({ children, reduce }: { children: React.ReactNode; reduce: boolean | null }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center bg-bg-900/70 backdrop-blur-sm pointer-events-none"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: reduce ? 1 : 0.9, y: reduce ? 0 : 8 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="rounded-xl bg-bg-900/80 border border-accent/30 px-6 py-4"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
