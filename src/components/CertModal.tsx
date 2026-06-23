import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Certification } from '../data/certifications';
import Glass from './Glass';

type Props = {
  cert: Certification | null;
  onClose: () => void;
};

export default function CertModal({ cert, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (cert) {
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [cert]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {cert && cert.file && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Certificado: ${cert.name}`}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-4xl h-[88vh]"
            onClick={e => e.stopPropagation()}
          >
            <Glass className="p-4 md:p-5 flex flex-col gap-4 h-full">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-heading text-lg md:text-xl font-bold text-text-100 leading-tight">
                  {cert.name}
                </h2>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-text-300 text-xs hover:text-text-100 hover:border-white/20 transition-colors"
                  >
                    Abrir en pestaña
                  </a>
                  <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-300 hover:text-text-100 hover:bg-white/10 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/\.(jpe?g|png|webp|gif|avif)$/i.test(cert.file) ? (
                <img
                  src={cert.file}
                  alt={cert.name}
                  className="flex-1 min-h-0 w-full rounded-lg border border-white/10 bg-white object-contain"
                />
              ) : (
                <iframe
                  src={cert.file}
                  title={cert.name}
                  className="flex-1 w-full rounded-lg border border-white/10 bg-white"
                />
              )}
            </Glass>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
