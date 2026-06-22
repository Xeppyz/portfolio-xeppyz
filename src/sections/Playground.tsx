import { useState } from 'react';
import Glass from '../components/Glass';
import { toGlassCss, toTailwind, type GlassSettings } from '../lib/glassSnippet';
import WordsPullUp from '../components/WordsPullUp';

const DEFAULT: GlassSettings = { blur: 14, opacity: 0.06, radius: 16, angle: 135 };

function Slider({
  label, value, min, max, step, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  const id = label.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between">
        <label htmlFor={id} className="text-text-300 text-sm font-mono">{label}</label>
        <span className="text-accent text-sm font-mono tabular-nums">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </div>
  );
}

export default function Playground() {
  const [settings, setSettings] = useState<GlassSettings>(DEFAULT);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'css' | 'tailwind'>('css');

  const snippet = activeTab === 'css' ? toGlassCss(settings) : toTailwind(settings);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const set = (key: keyof GlassSettings) => (v: number) =>
    setSettings(s => ({ ...s, [key]: v }));

  return (
    <section id="playground" className="py-section px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="text-center">
          <WordsPullUp as="h2" text="Glass Lab" className="font-heading text-3xl font-bold text-text-100 mb-2" />
          <p className="text-text-300 text-sm font-mono uppercase tracking-widest">Playground</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <Glass className="p-6 flex flex-col gap-6">
            <h3 className="font-heading text-lg font-semibold text-text-100">Controles</h3>
            <Slider label="Blur (px)" value={settings.blur} min={0} max={40} step={1} onChange={set('blur')} />
            <Slider label="Opacity" value={Math.round(settings.opacity * 100) / 100} min={0} max={1} step={0.01} onChange={set('opacity')} />
            <Slider label="Radius (px)" value={settings.radius} min={0} max={32} step={1} onChange={set('radius')} />
            <Slider label="Gradient angle" value={settings.angle} min={0} max={360} step={5} onChange={set('angle')} />
          </Glass>

          {/* Preview */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-lg font-semibold text-text-100">Preview</h3>
            <div
              className="aspect-video rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6ea8fe22, #b58cff22)' }}
            >
              {/* Blobs behind panel */}
              <div className="absolute w-40 h-40 rounded-full bg-accent/30 blur-2xl -top-10 -left-10" />
              <div className="absolute w-32 h-32 rounded-full bg-accent-2/30 blur-2xl -bottom-8 -right-8" />
              <div
                style={{
                  background: `rgba(255, 255, 255, ${settings.opacity})`,
                  backdropFilter: `blur(${settings.blur}px)`,
                  WebkitBackdropFilter: `blur(${settings.blur}px)`,
                  borderRadius: `${settings.radius}px`,
                  border: `1px solid rgba(255,255,255,${Math.min(settings.opacity * 2, 1)})`,
                  backgroundImage: `linear-gradient(${settings.angle}deg, rgba(255,255,255,${settings.opacity * 1.5}), rgba(255,255,255,0))`,
                }}
                className="relative z-10 px-8 py-6 text-text-100 font-heading font-semibold text-lg shadow-glass"
              >
                Glass Panel
              </div>
            </div>
          </div>
        </div>

        {/* Code snippet */}
        <Glass className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('css')}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-colors ${activeTab === 'css' ? 'bg-accent text-bg-900' : 'text-text-300 hover:text-text-100'}`}
              >CSS</button>
              <button
                onClick={() => setActiveTab('tailwind')}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-colors ${activeTab === 'tailwind' ? 'bg-accent text-bg-900' : 'text-text-300 hover:text-text-100'}`}
              >Tailwind</button>
            </div>
            <button
              onClick={handleCopy}
              aria-label="Copiar código"
              className="px-3 py-1.5 rounded-lg text-sm font-mono border border-white/10 text-text-300 hover:text-text-100 hover:border-white/20 transition-colors"
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>
          <pre className="text-text-300 text-sm font-mono overflow-x-auto bg-bg-800 p-4 rounded-xl">
            <code>{snippet}</code>
          </pre>
        </Glass>
      </div>
    </section>
  );
}
