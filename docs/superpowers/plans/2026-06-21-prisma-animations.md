# Animaciones estilo Prisma — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir reveal de texto (palabras y caracteres) y dos detalles de layout (navbar pastilla, CTA círculo+flecha) al portfolio, sin cambiar la paleta ni añadir dependencias.

**Architecture:** Dos componentes reutilizables con `framer-motion` (`WordsPullUp`, `RevealText`) que se consumen desde Hero/About/títulos de sección; ediciones puntuales de layout en `NavBar` y `Hero`. Ambos componentes respetan `prefers-reduced-motion`.

**Tech Stack:** React 18, TypeScript, framer-motion (ya instalado), Tailwind, vitest + @testing-library/react (jsdom, globals).

## Global Constraints

- Cero dependencias nuevas. Solo `framer-motion` y SVG inline. NO `lucide-react`.
- No tocar `tailwind.config.ts` ni los tokens de color/contraste WCAG.
- Todo texto animado debe estar en el DOM como contenido real (accesible/SEO).
- Ambos componentes respetan `prefers-reduced-motion` vía `useReducedMotion()`.
- Ease estándar del proyecto: `[0.16, 1, 0.3, 1]`.
- Comandos: tests `pnpm test:ci`, build `pnpm build`. Test único: `pnpm vitest run <archivo>`.

---

### Task 1: Mock de matchMedia + componente `WordsPullUp`

**Files:**
- Modify: `src/setupTests.ts`
- Create: `src/components/WordsPullUp.tsx`
- Test: `src/components/WordsPullUp.test.tsx`

**Interfaces:**
- Consumes: nada.
- Produces: `export default function WordsPullUp(props: { text: string; className?: string; as?: 'h1' | 'h2' | 'span' })`. Default `as='span'`.

- [ ] **Step 1: Añadir mock de matchMedia a setupTests**

`useReducedMotion` lee `window.matchMedia`, ausente en jsdom. Añadir al final de `src/setupTests.ts`:

```ts
import '@testing-library/jest-dom'

// jsdom no implementa matchMedia; framer-motion useReducedMotion lo necesita.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
```

- [ ] **Step 2: Escribir el test que falla**

`src/components/WordsPullUp.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import WordsPullUp from './WordsPullUp';

describe('WordsPullUp', () => {
  it('renderiza todas las palabras en el DOM', () => {
    render(<WordsPullUp text="Hola Mundo Cruel" />);
    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.getByText('Mundo')).toBeInTheDocument();
    expect(screen.getByText('Cruel')).toBeInTheDocument();
  });

  it('con reduced-motion renderiza el texto completo sin dividir', () => {
    window.matchMedia = (q: string) =>
      ({ matches: true, media: q, onchange: null,
         addEventListener() {}, removeEventListener() {},
         addListener() {}, removeListener() {}, dispatchEvent: () => false,
       }) as unknown as MediaQueryList;
    render(<WordsPullUp text="Texto Completo" as="h1" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Texto Completo' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Verificar que falla**

Run: `pnpm vitest run src/components/WordsPullUp.test.tsx`
Expected: FAIL — no se puede resolver `./WordsPullUp`.

- [ ] **Step 4: Implementar `WordsPullUp`**

`src/components/WordsPullUp.tsx`:

```tsx
import { motion, useReducedMotion, type Variants } from 'framer-motion';

interface WordsPullUpProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'span';
}

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const word: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export default function WordsPullUp({ text, className, as = 'span' }: WordsPullUpProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {text.split(' ').map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={word}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {w}
        </motion.span>
      ))}
    </MotionTag>
  );
}
```

Nota: las palabras son `inline-block` con `marginRight`, así el wrapping responsive y el `text-align` del contenedor (p. ej. `text-center`) se preservan sin usar flex.

- [ ] **Step 5: Verificar que pasa**

Run: `pnpm vitest run src/components/WordsPullUp.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/setupTests.ts src/components/WordsPullUp.tsx src/components/WordsPullUp.test.tsx
git commit -m "feat: componente WordsPullUp con reveal por palabra"
```

---

### Task 2: Componente `RevealText`

**Files:**
- Create: `src/components/RevealText.tsx`
- Test: `src/components/RevealText.test.tsx`

**Interfaces:**
- Consumes: el mock de matchMedia de Task 1 (ya en setupTests).
- Produces: `export default function RevealText(props: { text: string; className?: string })`. Renderiza un `<p>`.

- [ ] **Step 1: Escribir el test que falla**

`src/components/RevealText.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import RevealText from './RevealText';

describe('RevealText', () => {
  it('el texto accesible coincide con el input', () => {
    const { container } = render(<RevealText text="hola mundo" />);
    const got = container.textContent?.replace(/ /g, ' ');
    expect(got).toBe('hola mundo');
  });

  it('con reduced-motion renderiza el texto plano', () => {
    window.matchMedia = (q: string) =>
      ({ matches: true, media: q, onchange: null,
         addEventListener() {}, removeEventListener() {},
         addListener() {}, removeListener() {}, dispatchEvent: () => false,
       }) as unknown as MediaQueryList;
    render(<RevealText text="texto plano" />);
    expect(screen.getByText('texto plano')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verificar que falla**

Run: `pnpm vitest run src/components/RevealText.test.tsx`
Expected: FAIL — no se puede resolver `./RevealText`.

- [ ] **Step 3: Implementar `RevealText`**

`src/components/RevealText.tsx`:

```tsx
import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

interface RevealTextProps {
  text: string;
  className?: string;
}

function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span style={{ opacity, display: 'inline-block' }}>
      {char === ' ' ? ' ' : char}
    </motion.span>
  );
}

export default function RevealText({ text, className }: RevealTextProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.4'],
  });

  if (reduce) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  const chars = [...text];
  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => {
        const start = i / chars.length;
        return (
          <Char
            key={i}
            char={char}
            progress={scrollYProgress}
            range={[start - 0.1, start + 0.05]}
          />
        );
      })}
    </p>
  );
}
```

Nota: `useScroll` se llama incondicionalmente antes del early-return, manteniendo el orden de hooks estable.

- [ ] **Step 4: Verificar que pasa**

Run: `pnpm vitest run src/components/RevealText.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/RevealText.tsx src/components/RevealText.test.tsx
git commit -m "feat: componente RevealText con reveal por caracter ligado al scroll"
```

---

### Task 3: Integrar `WordsPullUp` en Hero y títulos de sección

**Files:**
- Modify: `src/sections/Hero.tsx` (h1)
- Modify: `src/sections/About.tsx` (h2 "Sobre mí")
- Modify: `src/sections/Projects.tsx`, `src/sections/Experience.tsx`, `src/sections/Contact.tsx`, `src/sections/Playground.tsx` (cada `<h2>` de título)

**Interfaces:**
- Consumes: `WordsPullUp` de Task 1.

- [ ] **Step 1: Reemplazar el h1 del Hero**

En `src/sections/Hero.tsx`, añadir el import y cambiar el `<h1>` (líneas 23-25):

```tsx
import WordsPullUp from '../components/WordsPullUp';
```

```tsx
<WordsPullUp
  as="h1"
  text={contactMeta.name}
  className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text-100 leading-tight"
/>
```

- [ ] **Step 2: Reemplazar los `<h2>` de título en cada sección**

Para cada archivo, añadir `import WordsPullUp from '../components/WordsPullUp';` y reemplazar el `<h2>...</h2>` del encabezado por `WordsPullUp as="h2"` conservando exactamente la misma `className` y el mismo texto. Ejemplo en `About.tsx` (línea 32):

```tsx
<WordsPullUp
  as="h2"
  text="Sobre mí"
  className="font-heading text-3xl font-bold text-text-100 mb-2"
/>
```

Repetir el patrón en `Projects.tsx`, `Experience.tsx`, `Contact.tsx`, `Playground.tsx`: localizar el `<h2 className="...">Texto</h2>` del título de sección y sustituirlo por `<WordsPullUp as="h2" text="Texto" className="..." />` con sus valores actuales. No tocar otros `<h2>`/`<h3>` internos.

- [ ] **Step 3: Verificar tests + build**

Run: `pnpm test:ci && pnpm build`
Expected: tests PASS, build sin errores de TypeScript.

- [ ] **Step 4: Commit**

```bash
git add src/sections/
git commit -m "feat: aplicar WordsPullUp en Hero y titulos de seccion"
```

---

### Task 4: CTA del Hero con círculo + flecha

**Files:**
- Modify: `src/sections/Hero.tsx` (botón "Ver proyectos", líneas 33-38)

**Interfaces:**
- Consumes: nada nuevo. Flecha en SVG inline (sin lucide).

- [ ] **Step 1: Reemplazar el enlace "Ver proyectos"**

```tsx
<a
  href="#projects"
  className="group inline-flex items-center gap-2 hover:gap-3 transition-all duration-150 pl-6 pr-2 py-2 rounded-full bg-accent text-bg-900 font-semibold font-heading shadow-accent-glow hover:shadow-accent-glow-hover focus-visible:outline-offset-2"
>
  Ver proyectos
  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-bg-900 text-accent transition-transform duration-150 group-hover:scale-110">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  </span>
</a>
```

El botón "Contacto" (líneas 39-44) no cambia.

- [ ] **Step 2: Verificar build**

Run: `pnpm build`
Expected: build sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Hero.tsx
git commit -m "feat: CTA del Hero con circulo y flecha animados"
```

---

### Task 5: NavBar pastilla colgante

**Files:**
- Modify: `src/components/NavBar.tsx`

**Interfaces:**
- Consumes: nada nuevo.

El NavBar actual es una barra full-width: `<header>` fijo con un `Glass as="nav"` (`px-6 py-3 flex justify-between max-w-6xl mx-auto`), marca "AC" + `<ul>` de links. Se convierte en pastilla centrada que cuelga del borde superior.

- [ ] **Step 1: Reemplazar el contenido de `NavBar.tsx`**

```tsx
import Glass from './Glass';

const NAV_LINKS = [
  { href: '#hero', label: 'Inicio' },
  { href: '#about', label: 'Sobre mí' },
  { href: '#projects', label: 'Proyectos' },
  { href: '#experience', label: 'Experiencia' },
  { href: '#playground', label: 'Lab' },
  { href: '#contact', label: 'Contacto' },
];

export default function NavBar() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100%-1rem)]">
      <Glass
        as="nav"
        aria-label="Navegación principal"
        className="flex items-center gap-4 md:gap-6 rounded-t-none rounded-b-glass-lg px-6 py-2 md:px-8 shadow-glass"
      >
        <span className="font-heading font-bold text-lg text-text-100 shrink-0">AC</span>
        <ul className="flex gap-4 md:gap-6 list-none m-0 p-0 overflow-x-auto">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href} className="shrink-0">
              <a
                href={href}
                className="text-text-300 hover:text-text-100 text-xs md:text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-accent"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </Glass>
    </header>
  );
}
```

Cambios: el `<header>` ya no es full-width sino centrado (`left-1/2 -translate-x-1/2`, ancho según contenido, con tope `max-w-[calc(100%-1rem)]` para no desbordar en móvil); la pastilla pierde el redondeo superior (`rounded-t-none rounded-b-glass-lg`) para que parezca colgar del borde. Links, textos, destinos, colores y `focus-visible` intactos.

- [ ] **Step 2: Verificar build**

Run: `pnpm build`
Expected: build sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "feat: navbar como pastilla colgante del borde superior"
```

---

### Task 6: Bio del About con `RevealText`

**Files:**
- Modify: `src/sections/About.tsx` (línea 39)

**Interfaces:**
- Consumes: `RevealText` de Task 2.

- [ ] **Step 1: Reemplazar el párrafo de bio**

Añadir `import RevealText from '../components/RevealText';` y cambiar el `<p>` dentro del `Glass` (línea 39):

```tsx
<RevealText
  text={contactMeta.bio}
  className="text-text-300 leading-relaxed text-lg"
/>
```

- [ ] **Step 2: Verificar tests + build**

Run: `pnpm test:ci && pnpm build`
Expected: tests PASS, build sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/sections/About.tsx
git commit -m "feat: bio del About con reveal por caracter"
```

---

## Verificación final

- [ ] `pnpm test:ci` — todos los tests pasan.
- [ ] `pnpm build` — sin errores de TypeScript.
- [ ] `pnpm dev` + revisión visual: word pull-up al cargar/scrollear, letter reveal en bio, navbar pastilla, CTA con flecha que crece en hover.
- [ ] DevTools → emular `prefers-reduced-motion: reduce` → textos estáticos legibles, sin animación.
