import { useState } from 'react';
import type { Project } from './data/projects';
import NavBar from './components/NavBar';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import ProjectModal from './sections/ProjectModal';
import Experience from './sections/Experience';
import Playground from './sections/Playground';
import Contact from './sections/Contact';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <About />
        <Projects onOpen={setSelectedProject} />
        <Experience />
        <Playground />
        <Contact />
      </main>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}
