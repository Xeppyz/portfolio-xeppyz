// Hitos académicos — consumidos por la sección Education (timeline animado).
// Datos reales de Allan Silva.

export type EducationItem = {
  id: string;
  year: string;
  title: string;
  institution: string;
  description: string;
};

export const education: EducationItem[] = [
  {
    id: "uca-inicio",
    year: "2021",
    title: "Inicio de estudios universitarios",
    institution: "Universidad Centroamericana (UCA)",
    description:
      "Comienzo de mi formación universitaria en ingeniería, sentando las bases en programación, lógica y fundamentos de software.",
  },
  {
    id: "casimiro-sotelo",
    year: "2024",
    title: "Cambio de universidad",
    institution: "Universidad Casimiro Sotelo",
    description:
      "Continúo mi carrera en la Universidad Casimiro Sotelo, profundizando en desarrollo de software y proyectos aplicados.",
  },
  {
    id: "graduacion",
    year: "2025",
    title: "Graduación",
    institution: "Universidad Casimiro Sotelo",
    description:
      "Culminación de mis estudios universitarios, cerrando el ciclo de formación profesional.",
  },
];
