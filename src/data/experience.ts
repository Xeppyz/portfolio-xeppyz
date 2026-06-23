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
    id: "invercasa-analista",
    role: "Analista de Programación",
    company: "Grupo Invercasa",
    start: "2024-02",
    end: "present",
    summary:
      "Desarrollo de aplicaciones móviles y web para la operación del proveedor de internet: administración de órdenes y aprovisionamiento (provisioning) de servicios sobre redes FTTH y HFC.",
    highlights: [
      "Aplicaciones móviles para la administración de órdenes de servicio.",
      "Sistema de aprovisionamiento (provisioning) de internet con manejo de redes FTTH y HFC.",
      "Desarrollo web con Next.js, React y Vite sobre base de datos SQL Server.",
    ],
    tech: ["Flutter", "Next.js", "React", "Vite", "SQL Server", "REST APIs", "Go", "Servidores"],
  },
  {
    id: "uca-software-dev",
    // TODO(Allan): confirmá fechas reales de este rol (en el PDF están vacías).
    role: "Desarrollador de Software",
    company: "Universidad Centroamericana (UCA)",
    start: "2023",
    end: "2024",
    summary:
      "Desarrollo de software para el Departamento de Educación de la UCA. Además, un año de experiencia como Analista Programador Junior.",
    highlights: [
      'Desarrollé el sistema "Teacher Record Management" y la plataforma "Faculty Announcements" usando C#, JavaScript y ASP.NET.',
      "Colaboré con el equipo para optimizar el registro de información y la comunicación del personal docente.",
      "Contribuí al diseño de funcionalidades, mejoras de UI y optimización de rendimiento de la aplicación.",
    ],
    tech: ["C#", "JavaScript", "ASP.NET", "SQL Server"],
  },
];
