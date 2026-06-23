import type { Project } from '../data/projects';
import Glass from '../components/Glass';

type Props = { project: Project; onOpen: (p: Project) => void };

export default function ProjectCard({ project, onOpen }: Props) {
  return (
    <Glass
      as="article"
      className="flex flex-col overflow-hidden hover:scale-[1.02] hover:shadow-glass-hover transition-all duration-200 cursor-pointer group"
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
      aria-label={`Ver detalles de ${project.title}`}
    >
      {/* Image (or year placeholder if none) */}
      {project.image ? (
        <img
          src={project.image}
          alt={`Vista previa de ${project.title}`}
          loading="lazy"
          className="aspect-video w-full object-cover bg-bg-800"
        />
      ) : (
        <div className="aspect-video bg-bg-800 flex items-center justify-center text-text-500">
          <span className="text-xs font-mono text-text-300/50">{project.year}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="font-heading font-semibold text-text-100 text-lg leading-tight">
          {project.title}
        </h3>
        <p className="text-text-300 text-sm leading-relaxed flex-1">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs font-mono bg-accent/10 text-accent border border-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Glass>
  );
}
