import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { education } from '../data/education';
import Glass from '../components/Glass';
import WordsPullUp from '../components/WordsPullUp';

function Milestone({ item, index }: { item: typeof education[0]; index: number }) {
  return (
    <motion.div
      className="relative pl-16 md:pl-20"
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
    >
      {/* Node sobre la línea */}
      <motion.div
        className="absolute left-4 md:left-6 top-1 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-accent bg-bg-900 shadow-accent-glow"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18, delay: index * 0.05 + 0.1 }}
      />
      <Glass className="p-6 md:p-7 mb-10">
        <span className="font-heading text-2xl font-bold text-gradient-accent">{item.year}</span>
        <h3 className="font-heading font-semibold text-text-100 text-lg mt-1">{item.title}</h3>
        <p className="text-accent/80 font-mono text-sm mt-0.5">{item.institution}</p>
        <p className="text-text-300 text-sm mt-3 leading-relaxed">{item.description}</p>
      </Glass>
    </motion.div>
  );
}

export default function Education() {
  const trackRef = useRef<HTMLDivElement>(null);
  // El relleno de la línea sigue el scroll dentro de la sección.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 80%', 'end 60%'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="education" className="py-section px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        <div className="text-center">
          <WordsPullUp as="h2" text="Formación" className="font-heading text-3xl font-bold text-text-100 mb-2" />
          <p className="text-text-300 text-sm font-mono uppercase tracking-widest">Education</p>
        </div>

        <div ref={trackRef} className="relative">
          {/* Riel base */}
          <div className="absolute left-4 md:left-6 top-1 bottom-10 w-px bg-white/10" />
          {/* Relleno animado por scroll (el "tiempo" avanzando) */}
          <motion.div
            className="absolute left-4 md:left-6 top-1 bottom-10 w-px origin-top bg-gradient-to-b from-accent to-accent-2"
            style={{ scaleY: fill }}
          />

          {education.map((item, i) => (
            <Milestone key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
