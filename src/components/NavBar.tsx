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
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100%-1rem)]">
      <Glass
        as="nav"
        aria-label="Navegación principal"
        className="flex items-center gap-4 md:gap-6 rounded-t-none rounded-b-glass-lg px-6 py-2 md:px-8 shadow-glass"
      >
        <span className="font-heading font-bold text-lg text-text-100 shrink-0">AC</span>
        <ul className="flex gap-4 md:gap-6 list-none m-0 p-0 overflow-x-auto">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href} className="shrink-0">
              <a
                href={href}
                className="text-text-300 hover:text-text-100 text-xs md:text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-accent"
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
