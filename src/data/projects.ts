export type Project = {
  id: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  year: number;
};

export const projects: Project[] = [
  {
    id: "glassmorphism-ui-kit",
    title: "Glass UI Kit",
    summary: "Sistema de componentes glassmorphism para React con tokens CSS, modo oscuro y 20+ componentes accesibles.",
    description:
      "Un kit de componentes React construido desde cero con la filosofía de que el glassmorphism debe ser un sistema de diseño completo, no solo un efecto visual. Incluye tokens CSS versionados, contraste WCAG AA garantizado en modo oscuro, 20+ componentes (modales, tooltips, cards, navbars) y Storybook integrado para documentación interactiva. El árbol de dependencias es deliberadamente mínimo: sin Radix, sin Headless UI; los primitivos de accesibilidad se implementan a mano para mantener el bundle bajo 8 kB gzip.",
    tags: ["React", "TypeScript", "CSS", "UI Kit", "Accesibilidad"],
    image: "/projects/glass-ui-kit.jpg",
    liveUrl: "https://glass-ui.dev",
    repoUrl: "https://github.com/alexcampos/glass-ui-kit",
    year: 2025,
  },
  {
    id: "motion-canvas-editor",
    title: "Motion Canvas Editor",
    summary: "Editor visual de animaciones programáticas basado en canvas con exportación a video y código TypeScript.",
    description:
      "Herramienta web que combina un timeline de animación con un editor de código TypeScript. Las animaciones se describen como funciones puras sobre un canvas 2D; el timeline las ejecuta fotograma a fotograma con un scheduler de Web Workers para no bloquear el hilo principal. El panel de propiedades genera código TypeScript sincronizado con el estado del timeline, permitiendo exportar la animación como módulo reutilizable. Exportación a WebM vía MediaRecorder API. Sin dependencias de animación externas: el runtime propio es de 4 kB.",
    tags: ["TypeScript", "Canvas API", "Web Workers", "Animation", "Editor"],
    image: "/projects/motion-canvas.jpg",
    liveUrl: "https://motioncanvas.alexcampos.dev",
    repoUrl: "https://github.com/alexcampos/motion-canvas-editor",
    year: 2025,
  },
  {
    id: "devboard",
    title: "DevBoard",
    summary: "Dashboard personal de productividad para devs: métricas de GitHub, tiempo de foco y notas de código rápidas.",
    description:
      "SPA que agrega métricas de la API de GitHub (commits, PRs, streak de contribuciones), un timer Pomodoro con notificaciones nativas y un editor de notas con syntax highlighting para fragmentos de código. El estado global se sincroniza con localStorage vía un patrón pub/sub mínimo (sin Zustand/Redux). La UI usa CSS Container Queries para adaptarse a cualquier viewport sin breakpoints manuales. Puntuación Lighthouse 99/100 en Performance.",
    tags: ["React", "API", "Dashboard", "TypeScript", "CSS"],
    image: "/projects/devboard.jpg",
    liveUrl: "https://devboard.alexcampos.dev",
    repoUrl: "https://github.com/alexcampos/devboard",
    year: 2024,
  },
  {
    id: "svg-path-lab",
    title: "SVG Path Lab",
    summary: "Editor interactivo de paths SVG con preview en vivo, optimización automática y exportación lista para producción.",
    description:
      "Playground web para explorar y editar paths SVG de forma visual. Dibuja con un editor de nodos arrastrable (implementado con Pointer Events API, sin librerías de drag), visualiza la curva bezier resultante y el path comprimido, y optimiza automáticamente los puntos redundantes usando el algoritmo Ramer–Douglas–Peucker. El output incluye el path como string listo para usar en HTML/React, con variantes para `stroke-dasharray` animado. Especialmente útil para crear ilustraciones SVG que se animan con CSS.",
    tags: ["SVG", "TypeScript", "Editor", "Algoritmos", "UI"],
    image: "/projects/svg-path-lab.jpg",
    liveUrl: "https://svgpathlab.dev",
    repoUrl: "https://github.com/alexcampos/svg-path-lab",
    year: 2024,
  },
  {
    id: "shader-playground",
    title: "Shader Playground",
    summary: "Editor de fragment shaders WebGL con live reload, uniforms editables en vivo y galería de efectos.",
    description:
      "Entorno de desarrollo para GLSL fragment shaders directamente en el navegador. El editor (basado en CodeMirror 6 con un minimal setup) compila el shader en tiempo real y muestra el resultado en un canvas WebGL 2. Los uniforms (tiempo, resolución, mouse, valores personalizados) se exponen como controles interactivos. Incluye una galería de 30+ shaders de efectos de ruido, distorsión y procedurales, cada uno navegable y editable. El canvas soporta exportación de frames como PNG.",
    tags: ["WebGL", "GLSL", "Canvas", "Editor", "Creative Coding"],
    image: "/projects/shader-playground.jpg",
    liveUrl: "https://shaderplay.alexcampos.dev",
    repoUrl: "https://github.com/alexcampos/shader-playground",
    year: 2023,
  },
  {
    id: "type-scale-tool",
    title: "Type Scale Tool",
    summary: "Generador de escalas tipográficas con previsualización en vivo, exportación a CSS custom properties y Tailwind config.",
    description:
      "Herramienta de diseño que genera escalas tipográficas modulares (Perfect Fourth, Major Third, Golden Ratio y ratios personalizados) con previsualización inmediata. Permite combinar cualquier par de fuentes de Google Fonts, ajustar el tamaño base y el peso de cada nivel, y ver cómo la escala se comporta en tres viewports simulados. El output exportable incluye CSS custom properties, un objeto Tailwind `theme.extend.fontSize` listo para pegar, y un snippet de SCSS. Los valores hex de los tokens de color se validan contra WCAG en tiempo real.",
    tags: ["React", "Typography", "Design Tools", "CSS", "Tailwind"],
    image: "/projects/type-scale.jpg",
    liveUrl: "https://typescale.alexcampos.dev",
    repoUrl: "https://github.com/alexcampos/type-scale-tool",
    year: 2023,
  },
];
