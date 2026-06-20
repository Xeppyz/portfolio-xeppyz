import useScrollReveal from '../lib/useScrollReveal';
import Glass from '../components/Glass';
import { contactMeta } from '../data/contact';
import SkillIcons from '../assets/vectors/skill-icons.svg?react';

const SKILLS = [
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'vite', label: 'Vite' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'css', label: 'CSS' },
  { id: 'framermotion', label: 'Framer Motion' },
  { id: 'svg', label: 'SVG' },
  { id: 'webgl', label: 'WebGL' },
  { id: 'accessibility', label: 'a11y' },
  { id: 'figma', label: 'Figma' },
  { id: 'node', label: 'Node.js' },
  { id: 'git', label: 'Git' },
];

export default function About() {
  const bioRef = useScrollReveal<HTMLDivElement>();
  const skillsRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="about" className="py-section px-4">
      {/* Inject SVG sprite symbols */}
      <SkillIcons aria-hidden="true" />

      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-text-100 mb-2">Sobre mí</h2>
          <p className="text-text-300 text-sm font-mono uppercase tracking-widest">About</p>
        </div>

        {/* Bio */}
        <div ref={bioRef} className="reveal">
          <Glass className="p-8 md:p-10">
            <p className="text-text-300 leading-relaxed text-lg">{contactMeta.bio}</p>
          </Glass>
        </div>

        {/* Skills grid */}
        <div ref={skillsRef} className="reveal grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {SKILLS.map((skill, i) => (
            <Glass
              key={skill.id}
              className="flex flex-col items-center gap-2 p-4 text-center hover:scale-105 transition-transform duration-150 cursor-default"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-accent"
                width="24"
                height="24"
              >
                <use href={`#icon-${skill.id}`} />
              </svg>
              <span className="text-text-300 text-xs font-mono">{skill.label}</span>
            </Glass>
          ))}
        </div>
      </div>
    </section>
  );
}
