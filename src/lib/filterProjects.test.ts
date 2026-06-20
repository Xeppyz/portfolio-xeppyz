import { describe, it, expect } from 'vitest';
import { filterProjects, allTags } from './filterProjects';
import type { Project } from '../data/projects';

const projects: Project[] = [
  {
    id: '1', title: 'React App', summary: 'A cool react app', description: 'desc',
    tags: ['React', 'TypeScript'], image: '/img.jpg', year: 2024,
  },
  {
    id: '2', title: 'WebGL Demo', summary: 'Shader experiments', description: 'desc',
    tags: ['WebGL', 'Canvas'], image: '/img.jpg', year: 2023,
  },
  {
    id: '3', title: 'CSS Tool', summary: 'Typography scale generator', description: 'desc',
    tags: ['CSS', 'React'], image: '/img.jpg', year: 2023,
  },
];

describe('filterProjects', () => {
  it('returns all projects when no filters applied', () => {
    expect(filterProjects(projects, {})).toHaveLength(3);
  });

  it('filters by exact tag', () => {
    const result = filterProjects(projects, { tag: 'React' });
    expect(result).toHaveLength(2);
    expect(result.every(p => p.tags.includes('React'))).toBe(true);
  });

  it('returns empty array when no tag match', () => {
    const result = filterProjects(projects, { tag: 'Nonexistent' });
    expect(result).toHaveLength(0);
  });

  it('filters by query case-insensitively on title', () => {
    const result = filterProjects(projects, { query: 'webgl' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by query on summary', () => {
    const result = filterProjects(projects, { query: 'typography' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('filters by query on tags', () => {
    const result = filterProjects(projects, { query: 'canvas' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('combines tag AND query (both must match)', () => {
    // React + query "app" — only project 1 has React AND "app" in title/summary
    const result = filterProjects(projects, { tag: 'React', query: 'app' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('treats whitespace-only query as no query', () => {
    const result = filterProjects(projects, { query: '   ' });
    expect(result).toHaveLength(3);
  });

  it('treats null tag as no tag filter', () => {
    const result = filterProjects(projects, { tag: null });
    expect(result).toHaveLength(3);
  });

  it('returns empty array for query with no matches', () => {
    const result = filterProjects(projects, { query: 'xyznotfound' });
    expect(result).toHaveLength(0);
  });
});

describe('allTags', () => {
  it('returns deduplicated sorted tags from all projects', () => {
    const tags = allTags(projects);
    expect(tags).toEqual(['CSS', 'Canvas', 'React', 'TypeScript', 'WebGL']);
  });

  it('returns empty array for empty projects', () => {
    expect(allTags([])).toEqual([]);
  });
});
