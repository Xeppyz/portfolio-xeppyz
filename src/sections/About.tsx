import { useState } from 'react';
import useScrollReveal from '../lib/useScrollReveal';
import Glass from '../components/Glass';
import { contactMeta } from '../data/contact';
import { certifications, type Certification } from '../data/certifications';
import WordsPullUp from '../components/WordsPullUp';
import RevealText from '../components/RevealText';
import CertModal from '../components/CertModal';

const SKILLS = [
  'Flutter', 'C#', 'ASP.NET MVC', 'JavaScript', 'React', 'Angular',
  'Java', 'Kotlin', 'PHP', 'SQL Server', 'REST APIs', 'Go', 'Git',
];

export default function About() {
  const bioRef = useScrollReveal<HTMLDivElement>();
  const skillsRef = useScrollReveal<HTMLDivElement>();
  const [openCert, setOpenCert] = useState<Certification | null>(null);

  return (
    <section id="about" className="py-section px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <div className="text-center">
          <WordsPullUp as="h2" text="Sobre mí" className="font-heading text-3xl font-bold text-text-100 mb-2" />
          <p className="text-text-300 text-sm font-mono uppercase tracking-widest">About</p>
        </div>

        {/* Bio */}
        <div ref={bioRef} className="reveal">
          <Glass className="p-8 md:p-10">
            <RevealText
              text={contactMeta.bio}
              className="text-text-300 leading-relaxed text-lg"
            />
          </Glass>
        </div>

        {/* Skills */}
        <div ref={skillsRef} className="reveal flex flex-col gap-8 md:flex-row md:gap-6">
          <Glass className="flex-1 p-6 md:p-7">
            <h3 className="font-heading font-semibold text-text-100 mb-4">Stack</h3>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(s => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full text-sm font-mono bg-accent/10 text-accent border border-accent/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </Glass>

          <Glass className="flex-1 p-6 md:p-7">
            <h3 className="font-heading font-semibold text-text-100 mb-4">Certificaciones</h3>
            <ul className="flex flex-col gap-2">
              {certifications.map(c => (
                <li key={c.id} className="text-text-300 text-sm leading-relaxed flex gap-2">
                  <span className="text-accent mt-0.5 shrink-0">▸</span>
                  {c.file ? (
                    <button
                      onClick={() => setOpenCert(c)}
                      className="text-left text-text-100 underline decoration-accent/40 underline-offset-4 hover:decoration-accent hover:text-accent transition-colors"
                    >
                      {c.name}
                      <span className="ml-1 text-accent/70 text-xs font-mono">↗ ver</span>
                    </button>
                  ) : (
                    <span>{c.name}</span>
                  )}
                </li>
              ))}
            </ul>
            <h3 className="font-heading font-semibold text-text-100 mt-6 mb-2">Idiomas</h3>
            <p className="text-text-300 text-sm">Español (nativo) · Inglés B2 — certificado Versant</p>
          </Glass>
        </div>
      </div>

      <CertModal cert={openCert} onClose={() => setOpenCert(null)} />
    </section>
  );
}
