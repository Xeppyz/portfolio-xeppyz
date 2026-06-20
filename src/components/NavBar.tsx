import Glass from './Glass';

const NAV_LINKS = [
  { href: '#hero', label: 'Inicio' },
  { href: '#about', label: 'Sobre mí' },
  { href: '#projects', label: 'Proyectos' },
  { href: '#experience', label: 'Experiencia' },
  { href: '#playground', label: 'Lab' },
  { href: '#contact', label: 'Contacto' },
];

export default function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <Glass as="nav" aria-label="Navegación principal" className="px-6 py-3 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-heading font-bold text-lg text-text-100">AC</span>
        <ul className="flex gap-6 list-none m-0 p-0">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-text-300 hover:text-text-100 text-sm font-medium transition-colors duration-150 focus-visible:outline-accent"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </Glass>
    </header>
  );
}
