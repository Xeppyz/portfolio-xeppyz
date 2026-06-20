export type GlassSettings = {
  blur: number;    // 0-40 (px)
  opacity: number; // 0-1
  radius: number;  // 0-32 (px)
  angle: number;   // 0-360 (deg, for gradient)
};

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export function toGlassCss(s: GlassSettings): string {
  const blur = clamp(s.blur, 0, 40);
  const opacity = clamp(s.opacity, 0, 1);
  const radius = clamp(s.radius, 0, 32);
  const angle = ((s.angle % 360) + 360) % 360;

  return `.glass-custom {
  background: rgba(255, 255, 255, ${opacity.toFixed(2)});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border-radius: ${radius}px;
  border: 1px solid rgba(255, 255, 255, ${Math.min(opacity * 2, 1).toFixed(2)});
  background-image: linear-gradient(${angle}deg, rgba(255,255,255,${Math.min(opacity * 1.5, 1).toFixed(2)}), rgba(255,255,255,0));
}`;
}

export function toTailwind(s: GlassSettings): string {
  const blur = clamp(s.blur, 0, 40);
  const opacity = clamp(s.opacity, 0, 1);
  const radius = clamp(s.radius, 0, 32);

  // Map blur to nearest Tailwind class
  const blurClass =
    blur === 0 ? 'backdrop-blur-none' :
    blur <= 4 ? 'backdrop-blur-sm' :
    blur <= 8 ? 'backdrop-blur' :
    blur <= 12 ? 'backdrop-blur-md' :
    blur <= 16 ? 'backdrop-blur-lg' :
    blur <= 24 ? 'backdrop-blur-xl' :
    'backdrop-blur-2xl';

  // Map radius to nearest Tailwind class
  const radiusClass =
    radius === 0 ? 'rounded-none' :
    radius <= 4 ? 'rounded' :
    radius <= 8 ? 'rounded-lg' :
    radius <= 12 ? 'rounded-xl' :
    radius <= 16 ? 'rounded-2xl' :
    'rounded-3xl';

  // Map opacity to nearest /N
  const opacityPct = Math.round(opacity * 100 / 5) * 5;

  return `${blurClass} ${radiusClass} bg-white/${opacityPct} border border-white/${Math.min(opacityPct * 2, 100)}`;
}
