import { contactMeta } from '../data/contact';
import Glass from '../components/Glass';
import HeroBlob from '../assets/vectors/hero-blob.svg?react';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden px-4 pt-20 pb-12"
    >
      {/* Decorative blob — aria-hidden, no motion issue as CSS animation handles it */}
      <HeroBlob
        className="absolute -top-32 -right-32 w-[600px] h-[600px] opacity-30 animate-float pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="flex flex-col gap-6">
          <p className="text-accent font-mono text-sm tracking-widest uppercase">
            Portfolio
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text-100 leading-tight">
            {contactMeta.name}
          </h1>
          <p className="text-xl text-text-300 font-medium">
            {contactMeta.tagline}
          </p>
          <p className="text-text-300 leading-relaxed max-w-lg">
            {contactMeta.bio}
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="#projects"
              className="px-6 py-3 rounded-xl bg-accent text-bg-900 font-semibold font-heading hover:bg-accent/90 transition-colors duration-150 focus-visible:outline-offset-2"
            >
              Ver proyectos
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl border border-text-300/30 text-text-300 hover:text-text-100 hover:border-text-300/60 transition-colors duration-150"
            >
              Contacto
            </a>
          </div>
        </div>

        {/* Photo */}
        <div className="flex justify-center lg:justify-end">
          <Glass className="p-2 rounded-full shadow-accent-glow">
            <img
              src="/photo.svg"
              alt="Foto de Alex Campos"
              width="320"
              height="320"
              loading="eager"
              className="rounded-full object-cover w-64 h-64 md:w-80 md:h-80"
            />
          </Glass>
        </div>
      </div>
    </section>
  );
}
