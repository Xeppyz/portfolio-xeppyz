import Glass from '../components/Glass';
import { contactLinks, contactMeta } from '../data/contact';
import ContactIcons from '../assets/vectors/contact-icons.svg?react';

export default function Contact() {
  return (
    <section id="contact" className="py-section px-4 pb-24">
      {/* Inject SVG sprite */}
      <ContactIcons aria-hidden="true" />

      <div className="max-w-2xl mx-auto flex flex-col gap-10 text-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-text-100 mb-2">Contacto</h2>
          <p className="text-text-300 text-sm font-mono uppercase tracking-widest">Contact</p>
        </div>

        <Glass className="p-8 flex flex-col gap-6">
          {contactMeta.availableForWork && (
            <p className="inline-flex items-center gap-2 text-accent font-mono text-sm justify-center">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              Disponible para proyectos
            </p>
          )}

          <p className="text-text-300 text-lg leading-relaxed">
            ¿Tienes un proyecto interesante? Hablemos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {contactLinks.map(link => (
              <a
                key={link.id}
                href={link.href}
                aria-label={link.ariaLabel}
                target={link.id !== 'email' ? '_blank' : undefined}
                rel={link.id !== 'email' ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-text-300 hover:text-text-100 hover:border-accent/40 hover:bg-accent/5 transition-all duration-150 font-mono text-sm"
              >
                <svg aria-hidden="true" width="18" height="18" className="shrink-0">
                  <use href={`#icon-${link.icon}`} />
                </svg>
                {link.label}
              </a>
            ))}
          </div>
        </Glass>

        <p className="text-text-300/50 text-xs font-mono">
          {contactMeta.name} · {contactMeta.location} · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
