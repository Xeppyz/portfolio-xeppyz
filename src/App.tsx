import NavBar from './components/NavBar';
import Hero from './sections/Hero';
import About from './sections/About';

export default function App() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <About />
      </main>
    </>
  );
}
