import type { Project } from '../data/projects';

export const allTags = (projects: Project[]): string[] =>
  [...new Set(projects.flatMap(p => p.tags))].sort();

export function filterProjects(
  projects: Project[],
  opts: { tag?: string | null; query?: string },
): Project[] {
  const q = (opts.query ?? '').trim().toLowerCase();
  return projects.filter(p => {
    const tagOk = !opts.tag || p.tags.includes(opts.tag);
    const queryOk =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q));
    return tagOk && queryOk;
  });
}
