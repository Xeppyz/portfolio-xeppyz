export type Project = {
  id: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  image: string;
  gallery?: string[]; // mockups para el carrusel del modal (proyectos sin enlace público)
  liveUrl?: string;
  repoUrl?: string;
  year: number;
};

export const projects: Project[] = [
  {
    id: "allison-silva-landing",
    title: "Allison Silva Corp — Landing",
    summary: "Landing page de contacto construida con React + Vite y desplegada en Vercel.",
    description:
      "Landing page de contacto para Allison Silva Corp: una sola página enfocada en presentar la marca y facilitar el contacto. Construida con React sobre Vite para un build rápido y ligero, y desplegada en Vercel con despliegue continuo.",
    tags: ["React", "Vite", "Vercel", "Landing Page"],
    image: "/projects/allison-silva-landing.svg",
    liveUrl: "https://www.allisonsilvacorp.com/",
    year: 2025,
  },
  {
    id: "tecno-smart-learning",
    title: "Tecno Smart Learning — Ciberseguridad",
    summary: "Web educativa sobre fundamentos de ciberseguridad con contenido interactivo, desarrollada con Next.js.",
    description:
      "Plataforma educativa desarrollada como servicio profesional para un proyecto universitario: un curso sobre fundamentos de ciberseguridad. Presenta el contenido de forma interactiva, con dinámicas para reforzar el aprendizaje. Construida con Next.js y desplegada en Vercel.",
    tags: ["Next.js", "Vercel", "Educación", "Ciberseguridad"],
    image: "/projects/tecno-smart-learning.svg",
    liveUrl: "https://tecno-smart-learning.vercel.app/",
    year: 2025,
  },
  {
    id: "clik-awards-voting",
    title: "Clik Awards 2026 — Votación Online",
    summary: "Sistema de votación online para premiar a influencers del país, con auth de Google, roles y reportes en tiempo real.",
    description:
      "Sistema de votación en línea para los Clik Awards, premiando a los influencers más influyentes del país. Incluye autenticación con Google, roles de administrador y reportes de votación en tiempo real. Construido con Next.js y Supabase (base de datos, auth y realtime), desplegado en Vercel.",
    tags: ["Next.js", "Supabase", "Google Auth", "Tiempo Real", "Vercel"],
    image: "/projects/clik-awards-voting.svg",
    liveUrl: "https://online-voting-system-three-chi.vercel.app/",
    year: 2026,
  },
  {
    id: "invercasa-vacaciones",
    title: "Sistema de Vacaciones — Grupo Invercasa",
    summary: "App de gestión de vacaciones (web y móvil) integrada al ERP: agendado individual y masivo, reportes por departamento y cálculo vacacional.",
    description:
      "Aplicación interna de Grupo Invercasa, desarrollada con Flutter para web y móvil, integrada al ERP de la empresa. Permite agendar vacaciones de forma individual o masiva, generar reportes por departamento y realizar el cálculo vacacional automáticamente. Proyecto privado: por ser de uso interno no hay enlace público, por eso se muestran mockups de la interfaz.",
    tags: ["Flutter", "Web & Móvil", "ERP", "Dart"],
    image: "/projects/invercasa-vacaciones.svg",
    gallery: [
      "/projects/vacaciones-agendar.svg",
      "/projects/vacaciones-reportes.svg",
      "/projects/vacaciones-calculo.svg",
    ],
    year: 2025,
  },
  {
    id: "casavision-tecnicos",
    title: "CasaVision — App de Técnicos",
    summary: "App móvil para técnicos de campo: atención de órdenes técnicas, aprovisionamiento de internet y TV, e inventario.",
    description:
      "Aplicación móvil para los técnicos de campo de CasaVision. Permite gestionar la atención de órdenes técnicas, el aprovisionamiento de servicios de internet y TV, y el control de inventario de equipos. Proyecto interno: por ser privado se muestran mockups de la interfaz.",
    tags: ["Flutter", "Móvil", "Field Service", "Dart"],
    image: "/projects/casavision-tecnicos.svg",
    gallery: [
      "/projects/tecnicos-ordenes.svg",
      "/projects/tecnicos-aprovisionamiento.svg",
      "/projects/tecnicos-inventario.svg",
    ],
    year: 2025,
  },
  {
    id: "casavision-go-backend",
    title: "Backend en Go — Aprovisionamiento",
    summary: "Servicios backend en Go para la operación de técnicos y el aprovisionamiento de servicios.",
    description:
      "Servicios backend escritos en Go que dan soporte al sistema de órdenes técnicas y aprovisionamiento. Enfocado en rendimiento y concurrencia para procesar las operaciones de campo. Proyecto interno (sin enlace público).",
    // TODO(Allan): confirmá detalles reales (qué expone, base de datos, etc.).
    tags: ["Go", "Backend", "APIs", "Concurrencia"],
    image: "/projects/go-backend.svg",
    year: 2025,
  },
  {
    id: "csharp-rest-apis",
    title: "APIs REST en C#",
    summary: "Desarrollo de APIs REST con C# / ASP.NET para integrar sistemas internos.",
    description:
      "Conjunto de APIs REST construidas con C# y ASP.NET para exponer e integrar datos entre sistemas internos. Proyecto interno (sin enlace público).",
    // TODO(Allan): confirmá detalles reales (qué dominios, autenticación, base de datos).
    tags: ["C#", "ASP.NET", "REST APIs", "SQL Server"],
    image: "/projects/csharp-apis.svg",
    year: 2024,
  },
  {
    id: "python-chatbot",
    title: "Chatbot en Python",
    summary: "Chatbot desarrollado en Python para automatizar atención y consultas.",
    description:
      "Chatbot construido en Python para automatizar atención y responder consultas de los usuarios.",
    // TODO(Allan): confirmá detalles reales (framework, canal — web/WhatsApp/Telegram, si usa IA/LLM, público o privado, link).
    tags: ["Python", "Chatbot", "Automatización"],
    image: "/projects/python-chatbot.svg",
    year: 2024,
  },
];
