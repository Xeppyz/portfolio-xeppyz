import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../data/projects';
import Glass from '../components/Glass';

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [slide, setSlide] = useState(0);
  const gallery = project?.gallery ?? [];

  // Focus the close button + reset carousel when modal opens
  useEffect(() => {
    if (project) {
      setSlide(0);
      // Small timeout to let AnimatePresence mount
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [project]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Detalles de ${project.title}`}
        >
          {/* Scrim */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <Glass className="p-6 md:p-8 flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-heading text-2xl font-bold text-text-100 leading-tight">
                  {project.title}
                </h2>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-text-300 hover:text-text-100 hover:bg-white/10 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Year */}
              <p className="text-text-300 text-sm font-mono">{project.year}</p>

              {/* Carrusel de mockups (proyectos sin enlace público) */}
              {gallery.length > 0 && (
                <div className="relative">
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-bg-800 border border-white/10">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.img
                        key={slide}
                        src={gallery[slide]}
                        alt={`Mockup ${slide + 1} de ${gallery.length} — ${project.title}`}
                        initial={{ opacity: 0, x: 32 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -32 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>
                  </div>

                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={() => setSlide(s => (s - 1 + gallery.length) % gallery.length)}
                        aria-label="Anterior"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-bg-900/70 text-text-100 backdrop-blur hover:bg-bg-900 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
                      </button>
                      <button
                        onClick={() => setSlide(s => (s + 1) % gallery.length)}
                        aria-label="Siguiente"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-bg-900/70 text-text-100 backdrop-blur hover:bg-bg-900 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                      <div className="flex justify-center gap-2 mt-3">
                        {gallery.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setSlide(i)}
                            aria-label={`Ir al mockup ${i + 1}`}
                            className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-accent' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs font-mono bg-accent/10 text-accent border border-accent/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-text-300 leading-relaxed">{project.description}</p>

              {/* Links */}
              <div className="flex gap-3 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-accent text-bg-900 text-sm font-semibold hover:bg-accent/90 transition-colors"
                  >
                    Ver sitio
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-white/10 text-text-300 text-sm hover:text-text-100 hover:border-white/20 transition-colors"
                  >
                    Ver código
                  </a>
                )}
              </div>
            </Glass>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
