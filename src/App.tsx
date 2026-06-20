import { useState } from 'react';
import type { Project } from './data/projects';
import NavBar from './components/NavBar';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';

export default function App() {
  const [_selectedProject, setSelectedProject] = useState<Project | null>(null);
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <About />
        <Projects onOpen={setSelectedProject} />
      </main>
    </>
  );
}
