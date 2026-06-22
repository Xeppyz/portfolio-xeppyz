import { useState } from 'react';
import { projects } from '../data/projects';
import { filterProjects, allTags } from '../lib/filterProjects';
import ProjectCard from './ProjectCard';
import type { Project } from '../data/projects';
import WordsPullUp from '../components/WordsPullUp';

type Props = { onOpen: (p: Project) => void };

export default function Projects({ onOpen }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const tags = allTags(projects);
  const shown = filterProjects(projects, { tag: activeTag, query });

  return (
    <section id="projects" className="py-section px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="text-center">
          <WordsPullUp as="h2" text="Proyectos" className="font-heading text-3xl font-bold text-text-100 mb-2" />
          <p className="text-text-300 text-sm font-mono uppercase tracking-widest">Projects</p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col gap-4">
          <input
            type="search"
            aria-label="Buscar proyectos"
            placeholder="Buscar proyectos..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full md:max-w-md mx-auto block bg-bg-800 border border-white/10 rounded-xl px-4 py-3 text-text-100 placeholder-text-300/50 focus:outline-none focus:border-accent/50 transition-colors"
          />

          {/* Tag chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-mono transition-colors duration-150 border ${
                activeTag === null
                  ? 'bg-accent text-bg-900 border-accent'
                  : 'bg-transparent text-text-300 border-white/10 hover:border-accent/50 hover:text-text-100'
              }`}
            >
              Todos
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-mono transition-colors duration-150 border ${
                  activeTag === tag
                    ? 'bg-accent text-bg-900 border-accent'
                    : 'bg-transparent text-text-300 border-white/10 hover:border-accent/50 hover:text-text-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Result count */}
          <p className="text-center text-text-300 text-sm font-mono">
            {shown.length} proyecto{shown.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid */}
        {shown.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((project) => (
              <div
                key={project.id}
              >
                <ProjectCard project={project} onOpen={onOpen} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-300 font-mono">
              Sin resultados para "{query || activeTag}"
            </p>
            <button
              onClick={() => {
                setQuery('');
                setActiveTag(null);
              }}
              className="mt-4 text-accent text-sm hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
