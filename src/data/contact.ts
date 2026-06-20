// Contact links — consumed by the Contact section.
// Replace these with real URLs before publishing.

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
    label: "alex@alexcampos.dev",
    href: "mailto:alex@alexcampos.dev",
    icon: "email",
    ariaLabel: "Enviar email a Alex Campos",
  },
  {
    id: "github",
    label: "github.com/alexcampos",
    href: "https://github.com/alexcampos",
    icon: "github",
    ariaLabel: "Perfil de GitHub de Alex Campos (abre en nueva pestaña)",
  },
  {
    id: "linkedin",
    label: "linkedin.com/in/alexcampos",
    href: "https://linkedin.com/in/alexcampos",
    icon: "linkedin",
    ariaLabel: "Perfil de LinkedIn de Alex Campos (abre en nueva pestaña)",
  },
];

export const contactMeta = {
  name: "Alex Campos",
  tagline: "Creative Frontend Developer",
  bio: "Construyo interfaces que combinan rigor técnico con intención estética. Especializado en sistemas de diseño, animaciones web y herramientas creativas para el navegador.",
  location: "Madrid, España",
  availableForWork: true,
};
