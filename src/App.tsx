import Glass from './components/Glass';

export default function App() {
  return (
    <main className="min-h-screen bg-bg-900 p-8">
      <Glass as="section" className="p-8 text-text-100">
        <h1 className="font-heading text-3xl">Portfolio</h1>
      </Glass>
    </main>
  );
}
