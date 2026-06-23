// Certificaciones de Allan Silva — consumidas por la sección About.
// `file` (opcional) apunta a un PDF en /public/certs/ que se abre en el visor.

export type Certification = {
  id: string;
  name: string;
  file?: string;
};

export const certifications: Certification[] = [
  { id: "titulo-ingenieria", name: "Ingeniero en Sistema de Información", file: "/certs/titulo-ingenieria.pdf" },
  { id: "excelencia-uca", name: "Reconocimiento a la Excelencia — UCA", file: "/certs/excelencia-uca.pdf" },
  { id: "cybersecurity-capc", name: "Cybersecurity Awareness — CAPC", file: "/certs/cybersecurity-capc.jpg" },
  { id: "fundamentos-web", name: "Fundamentos de Programación y Desarrollo Web" },
  { id: "scrum-sfpc", name: "Scrum Foundation Professional Certificate (SFPC)", file: "/certs/scrum-sfpc.jpg" },
  { id: "curso-go", name: "Curso de Go" },
];
