import { useRef } from 'react';
import {
  motion, useMotionValue, useSpring, useTransform, useAnimationFrame, type MotionValue,
} from 'framer-motion';
import Glass from './Glass';

const SKILLS = ['Flutter', 'Dart', 'C#', 'JavaScript', 'React', 'Angular', 'Java', 'Kotlin', 'Go', 'Python'];
const R_MIN = 150;      // banda de radios (px) — cerca del avatar, sin alejarse
const R_MAX = 186;
const INFLUENCE = 130;  // distancia a la que el cursor empuja
const PUSH = 46;        // cuánto se aleja como máximo
const PERIOD = 45;      // segundos por vuelta completa

function Particle({ label, a0, radius, rot, mouseX, mouseY }: {
  label: string;
  a0: number;
  radius: number;
  rot: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const baseX = useTransform(rot, r => Math.cos(a0 + r) * radius);
  const baseY = useTransform(rot, r => Math.sin(a0 + r) * radius);

  // Empuje radial: la partícula se aleja del cursor cuando está cerca.
  const repel = (axis: 0 | 1) =>
    useTransform<number, number>([mouseX, mouseY, rot], ([mx, my, r]) => {
      const bx = Math.cos(a0 + r) * radius;
      const by = Math.sin(a0 + r) * radius;
      const vx = bx - mx;
      const vy = by - my;
      const d = Math.hypot(vx, vy) || 0.0001;
      if (d >= INFLUENCE) return 0;
      const strength = (1 - d / INFLUENCE) * PUSH;
      return ((axis === 0 ? vx : vy) / d) * strength;
    });

  const spring = { stiffness: 180, damping: 14, mass: 0.4 };
  const dx = useSpring(repel(0), spring);
  const dy = useSpring(repel(1), spring);
  const x = useTransform([baseX, dx], ([b, d]: number[]) => b + d);
  const y = useTransform([baseY, dy], ([b, d]: number[]) => b + d);

  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x, y }}>
      <div className="-translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-bg-800/80 backdrop-blur border border-accent/30 text-accent text-xs font-mono whitespace-nowrap shadow-accent-glow select-none">
        {label}
      </div>
    </motion.div>
  );
}

export default function AvatarOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(9999);
  const mouseY = useMotionValue(9999);
  const rot = useMotionValue(0);

  // Posiciones "aleatorias" pero sin choques: slot angular + jitter, y radio
  // alternado en dos bandas para que las vecinas tampoco coincidan en distancia.
  const layout = useRef(
    SKILLS.map((label, i) => {
      const slot = (Math.PI * 2) / SKILLS.length;
      const a0 = i * slot + (Math.random() - 0.5) * slot * 0.6; // jitter ±30% del slot
      const radius = i % 2 === 0
        ? R_MIN + Math.random() * 12          // banda interior ~150–162
        : R_MAX - 14 + Math.random() * 14;    // banda exterior ~172–186
      return { label, a0, radius };
    })
  ).current;

  // Giro continuo del anillo (autoplay, pedido explícito).
  useAnimationFrame(t => rot.set((t / 1000) * (Math.PI * 2 / PERIOD)));

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mouseX.set(e.clientX - (r.left + r.width / 2));
    mouseY.set(e.clientY - (r.top + r.height / 2));
  };
  const onLeave = () => { mouseX.set(9999); mouseY.set(9999); };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex items-center justify-center"
      style={{ width: R_MAX * 2 + 100, height: R_MAX * 2 + 100 }}
    >
      {/* Partículas (detrás del avatar, no bloquean el puntero) */}
      <div className="absolute inset-0 pointer-events-none">
        {layout.map(p => (
          <Particle key={p.label} label={p.label} a0={p.a0} radius={p.radius} rot={rot} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>

      {/* Avatar */}
      <Glass className="relative z-10 p-2 rounded-full shadow-accent-glow">
        <img
          src="/avatar.svg"
          alt="Avatar de Allan Silva"
          width="320"
          height="320"
          loading="eager"
          className="rounded-full object-cover w-64 h-64 md:w-72 md:h-72"
        />
      </Glass>
    </div>
  );
}
