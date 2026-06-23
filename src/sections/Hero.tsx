import { contactMeta } from '../data/contact';
import HeroBlob from '../assets/vectors/hero-blob.svg?react';
import WordsPullUp from '../components/WordsPullUp';
import { motion, useScroll, useTransform } from 'framer-motion';
import FiberBurst from '../components/FiberBurst';
import AvatarOrbit from '../components/AvatarOrbit';

export default function Hero() {
  const { scrollY } = useScroll();
  // Parallax ligado al scroll (lo controla el usuario → activo aun con reduced-motion).
  const blobY = useTransform(scrollY, [0, 700], [0, 220]);
  const photoY = useTransform(scrollY, [0, 700], [0, -60]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden px-4 pt-20 pb-12"
    >
      {/* Decorative blob — parallax en scroll + float CSS independiente */}
      <motion.div
        className="absolute -top-32 -right-32 pointer-events-none"
        style={{ y: blobY }}
        aria-hidden="true"
      >
        <HeroBlob className="w-[600px] h-[600px] opacity-30 animate-float" />
      </motion.div>

      {/* Estallido de fibra — se expande al hacer scroll (parallax Hero→About) */}
      <FiberBurst />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="flex flex-col gap-6">
          <p className="text-accent font-mono text-sm tracking-widest uppercase">
            Portfolio
          </p>
          <WordsPullUp
            as="h1"
            text={contactMeta.name}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text-100 leading-tight"
          />
          <p className="text-xl text-text-300 font-medium">
            {contactMeta.tagline}
          </p>
          <p className="text-text-300 leading-relaxed max-w-lg">
            {contactMeta.bio}
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 hover:gap-3 transition-all duration-150 pl-6 pr-2 py-2 rounded-full bg-accent text-bg-900 font-semibold font-heading shadow-accent-glow hover:shadow-accent-glow-hover focus-visible:outline-offset-2"
            >
              Ver proyectos
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-bg-900 text-accent transition-transform duration-150 group-hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl border border-text-300/30 text-text-300 hover:text-text-100 hover:border-text-300/60 transition-colors duration-150"
            >
              Contacto
            </a>
          </div>
        </div>

        {/* Avatar con partículas de skills reactivas al mouse */}
        <motion.div className="flex justify-center lg:justify-end" style={{ y: photoY }}>
          <AvatarOrbit />
        </motion.div>
      </div>
    </section>
  );
}
