// Contact links — consumed by the Contact section. Datos reales de Allan Silva.

export type ContactLink = {
  id: string;
  label: string;
  href: string;
  icon: string; // references #icon-* in the SVG sprite or a named icon
  ariaLabel: string;
};

export const contactLinks: ContactLink[] = [
  {
    id: "email",
    label: "alexander.xampos10@gmail.com",
    href: "mailto:alexander.xampos10@gmail.com",
    icon: "email",
    ariaLabel: "Enviar email a Allan Silva",
  },
  {
    id: "linkedin",
    label: "linkedin.com/in/acampo5",
    href: "https://linkedin.com/in/acampo5",
    icon: "linkedin",
    ariaLabel: "Perfil de LinkedIn de Allan Silva (abre en nueva pestaña)",
  },
];

export const contactMeta = {
  name: "Allan Silva",
  tagline: "Analista Programador · Mobile & Full-Stack",
  bio: "Analista programador con 3 años de experiencia en aplicaciones móviles y desarrollo web. Construyo interfaces con JavaScript, React y Flutter, y sistemas backend con C#, Java, Kotlin y PHP. Desarrollo apps Android e iOS con Flutter y sitios responsivos, con foco en aprender rápido y adaptarme a nuevas tecnologías.",
  location: "Managua, Nicaragua",
  availableForWork: true,
};
