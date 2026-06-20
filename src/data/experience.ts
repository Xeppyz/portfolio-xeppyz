export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string | "present";
  summary: string;
  highlights: string[];
  tech: string[];
};

export const experience: ExperienceItem[] = [
  {
    id: "casavision-senior",
    role: "Senior Frontend Engineer",
    company: "CasaVision",
    start: "2024-01",
    end: "present",
    summary:
      "Lidero el rediseño del producto principal: migración de una SPA legacy a una arquitectura Vite + React 18 con TypeScript estricto. Responsable de la UI system, el design tokens pipeline y los estándares de accesibilidad del equipo.",
    highlights: [
      "Diseñé e implementé el sistema de diseño interno (60+ componentes, tokens semánticos, dark/light mode) adoptado por 4 equipos de producto.",
      "Reduje el bundle inicial en un 62% mediante code splitting por ruta y tree shaking agresivo, bajando el LCP de 4.1 s a 1.4 s.",
      "Establecí el pipeline de pruebas de UI (Vitest + Testing Library + Playwright) con cobertura del 85% en componentes críticos.",
      "Mentoricé a 3 devs junior en arquitectura de componentes, patrones de estado y performance del navegador.",
      "Integré un sistema de feature flags (LaunchDarkly) que permitió A/B testing sin redeploys.",
    ],
    tech: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Vitest", "Playwright", "Figma", "LaunchDarkly"],
  },
  {
    id: "freelance-creative",
    role: "Creative Developer (Freelance)",
    company: "Proyectos independientes",
    start: "2022-06",
    end: "2023-12",
    summary:
      "Desarrollo de experiencias web interactivas para estudios de diseño, artistas y startups de tecnología creativa. Especialización en animaciones CSS/JS, shaders WebGL y herramientas internas de diseño.",
    highlights: [
      "Construí un editor de ilustraciones SVG interactivo para un estudio de diseño de Barcelona (3 000 usuarios activos mensuales).",
      "Desarrollé un micro-site con shaders WebGL para el lanzamiento de un álbum musical, con 50 000 visitas en la primera semana.",
      "Creé una librería de animaciones CSS + Framer Motion para 3 startups SaaS, reduciendo su tiempo de implementación de UI en un 40%.",
      "Entregué todos los proyectos con Lighthouse Performance ≥ 95 y Accessibility ≥ 90.",
    ],
    tech: ["TypeScript", "React", "WebGL", "GLSL", "Framer Motion", "SVG", "GSAP", "Three.js"],
  },
  {
    id: "acme-mid",
    role: "Frontend Developer",
    company: "Acme Labs",
    start: "2020-09",
    end: "2022-05",
    summary:
      "Desarrollo de la UI de una plataforma de datos B2B (dashboards, tablas de datos complejas, filtros avanzados). Colaboración estrecha con el equipo de diseño para implementar un sistema de componentes coherente desde Figma.",
    highlights: [
      "Implementé un sistema de tablas con sorting, paginación y filtros combinables que maneja 100 000+ registros con virtualización (react-virtual).",
      "Migré la hoja de estilos global (1 200 líneas de CSS especulativo) a un sistema de tokens con CSS custom properties, eliminando el 35% del CSS sin uso.",
      "Reduje de 0 a 12% la cobertura de tests en componentes de UI críticos en el primer trimestre.",
      "Colaboré con diseño para documentar el primer handoff sistemático Figma → código, reduciendo rework post-implementación en un 50%.",
    ],
    tech: ["React", "JavaScript", "CSS Custom Properties", "React Query", "Storybook", "Figma"],
  },
  {
    id: "pixel-junior",
    role: "Junior Web Developer",
    company: "Pixel Studio",
    start: "2019-03",
    end: "2020-08",
    summary:
      "Primer rol profesional en un estudio de 8 personas centrado en webs de marketing y e-commerce. Implementación de diseños, optimización de performance y mantenimiento de sitios en producción.",
    highlights: [
      "Entregué 15+ sitios de marketing con HTML/CSS/JS vanilla, aprendiendo a optimizar imágenes, fuentes y scripts sin herramientas de build.",
      "Introduje la adopción de Sass y PostCSS en el workflow del equipo, mejorando la mantenibilidad del CSS.",
      "Implementé animaciones de scroll con IntersectionObserver (nativo) que reemplazaron una dependencia de 30 kB.",
      "Primer contacto con React: migré un componente de carrito de compras de jQuery a React funcional con hooks.",
    ],
    tech: ["HTML", "CSS", "JavaScript", "Sass", "React", "WordPress", "Shopify"],
  },
];
