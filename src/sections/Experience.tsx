import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experience } from '../data/experience';
import Glass from '../components/Glass';
import useScrollReveal from '../lib/useScrollReveal';

function formatDate(dateStr: string): string {
  if (dateStr === 'present') return 'Presente';
  const [year, month] = dateStr.split('-');
  if (!month) return year;
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function ExperienceEntry({ item, index }: { item: typeof experience[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="reveal flex gap-6" style={{ transitionDelay: `${index * 100}ms` }}>
      {/* Timeline line + dot */}
      <div className="hidden md:flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-accent mt-5 shrink-0" />
        <div className="w-px bg-white/10 flex-1 mt-2" />
      </div>

      {/* Card */}
      <Glass className="flex-1 mb-6 p-6 md:p-7">
        <button
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          aria-controls={`exp-details-${item.id}`}
          className="w-full text-left flex items-start justify-between gap-4 group"
        >
          <div className="flex flex-col gap-1">
            <h3 className="font-heading font-semibold text-text-100 text-lg group-hover:text-accent transition-colors duration-150">
              {item.role}
            </h3>
            <p className="text-accent/80 font-mono text-sm">{item.company}</p>
            <p className="text-text-300 text-xs font-mono">
              {formatDate(item.start)} — {formatDate(item.end)}
            </p>
          </div>
          <svg
            className={`w-5 h-5 text-text-300 shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20" fill="none" aria-hidden="true"
          >
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p className="text-text-300 text-sm mt-3 leading-relaxed">{item.summary}</p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              id={`exp-details-${item.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 flex flex-col gap-4">
                {/* Highlights */}
                <ul className="flex flex-col gap-2">
                  {item.highlights.map((h, i) => (
                    <li key={i} className="text-text-300 text-sm leading-relaxed flex gap-2">
                      <span className="text-accent mt-0.5 shrink-0">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {item.tech.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-xs font-mono bg-accent/10 text-accent border border-accent/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Glass>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-section px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-text-100 mb-2">Experiencia</h2>
          <p className="text-text-300 text-sm font-mono uppercase tracking-widest">Experience</p>
        </div>

        <div>
          {experience.map((item, i) => (
            <ExperienceEntry key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
