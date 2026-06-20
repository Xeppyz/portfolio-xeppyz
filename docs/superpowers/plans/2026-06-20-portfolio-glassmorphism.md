# Portfolio Glassmorphism Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un portfolio personal de una sola página (one-page, scroll) para un desarrollador creativo, con estética glassmorphism, animaciones, vectores SVG animados, foto destacada, proyectos navegables, experiencia navegable y **al menos una feature interactiva con lógica real y estado** (no un sitio estático). El usuario quiere "cosas interactivas, archivos visualizables desde la web": piezas manipulables en el navegador, no solo contenido que se hace scroll.

**Architecture:** SPA estática Vite + React + TypeScript. Una sola ruta; las secciones son anclas con scroll suave nativo. Datos en arrays tipados en TS (sin backend, sin CMS). **Estilos con Tailwind CSS** (decisión D1 cerrada): glassmorphism vía `theme.extend` (tokens) + una clase de componente `.glass` en `@layer components`; el resto, utilidades Tailwind directas. Scroll reveals con IntersectionObserver nativo envuelto en un hook. Framer Motion SOLO para lo que CSS/Tailwind no cubre bien: modal de proyecto, expansión del timeline y orquestación de stagger puntual. SVG animados inline (CSS/SMIL) importados como componentes vía vite-plugin-svgr. La lógica interactiva vive en módulos puros testeables (`src/lib/`), separada de la presentación.

**Tech Stack:** Vite, React 18, TypeScript, **Tailwind CSS** (+ `@tailwindcss/postcss` / PostCSS + autoprefixer), framer-motion (acotado), vite-plugin-svgr, **Vitest + @testing-library/react + jsdom** (D2 cerrada: se incluye porque las features interactivas aportan lógica real que justifica el runner). Gestor: pnpm. SO: Windows 11 / PowerShell.

## Global Constraints

- Gestor de paquetes: **pnpm** obligatorio. Todos los comandos usan `pnpm`. No usar npm/yarn.
- Node >= 18 (entorno actual: Node 22.18, pnpm 10.14).
- Plataforma de desarrollo: Windows 11, PowerShell. Comandos compatibles.
- Una sola dependencia de animación permitida (framer-motion). No añadir GSAP, AOS, react-spring, lottie ni librerías de UI (MUI/Chakra) salvo que el usuario lo pida.
- **Estilos con Tailwind.** Glassmorphism con CSS nativo (`backdrop-filter`) expresado a través de Tailwind (utilidad `backdrop-blur` + tokens en `theme.extend` + clase `.glass`), nunca con una librería de glass externa. No usar CSS Modules.
- Datos de proyectos/experiencia en archivos TS tipados bajo `src/data/`. Sin backend.
- **Lógica interactiva en módulos puros** bajo `src/lib/` (funciones sin React/DOM), para poder testearla con Vitest sin montar componentes. Los componentes solo conectan estado a esas funciones.
- Accesibilidad mínima obligatoria (no negociable): contraste texto >= 4.5:1, foco visible, alt en imágenes, aria-label en botones de solo icono, respetar `prefers-reduced-motion`.
- Diseño mobile-first. Breakpoints Tailwind por defecto (sm 640 / md 768 / lg 1024 / xl 1280); validar además a 375 y 1440. Sin scroll horizontal.
- Type scale vía Tailwind (text-xs…text-5xl mapeado al scale 12 14 16 18 24 32 48). Body 16px, line-height 1.5-1.6.
- Animaciones: 150-300ms microinteracciones, <=400ms transiciones. Animar solo `transform`/`opacity`. Easing ease-out al entrar.
- Iconos y vectores: SVG, nunca emoji como icono estructural.
- Lo visual fino (paleta exacta en hex, ilustraciones SVG concretas, foto recortada, **mocks de contenido**) lo entrega el agente `disenador`; este plan fija la estructura y los tokens placeholder.

---

## Paleta y tipografía (decisiones de diseño base)

Aplicadas reglas UI/UX (estilo Motion-Driven + patrón Portfolio Grid; dark mode full; §6 tipografía/color, §7 animación). El glassmorphism luce mejor sobre fondo oscuro con profundidad. El `disenador` ajusta los hex finales y valida contraste; estos son el default accionable que el dev-senior puede usar de inmediato.

- **Modo base:** dark. Fondo profundo con blobs/gradiente detrás de los paneles glass.
- **Tokens de color placeholder** (se definen en `tailwind.config` → `theme.extend.colors`):
  - `bg.900: #0b0d12` (fondo base)
  - `bg.800: #11141b` (capas)
  - `text.100: #f4f6fb` (texto primario, contraste AA sobre bg)
  - `text.300: #aab2c5` (texto secundario, verificar >=3:1)
  - `accent.DEFAULT: #6ea8fe` (acento frío)
  - `accent.2: #b58cff` (acento secundario para gradientes/vectores)
  - Glass (no son `colors`, ver sección Tailwind): `--glass-bg: rgba(255,255,255,0.06)`, `--glass-border: rgba(255,255,255,0.12)`, blur 14px.
- **Tipografía** (Google Fonts, `font-display: swap`; declaradas en `theme.extend.fontFamily`):
  - Headings: **Space Grotesk** (técnico + con carácter) → `font-heading`.
  - Body: **Inter** (legible, neutral) → `font-sans` (default).
  - Mono / detalles de código: **JetBrains Mono** (acentos "developer") → `font-mono`.
  - El `disenador` puede proponer un par alternativo (p.ej. Archivo + Space Grotesk, sugerido por UI/UX); estos son el default.

---

## Estrategia Tailwind + glassmorphism (D1 cerrada)

Decisión ponytail: no instalar plugins de glass ni reinventar utilidades. Tailwind ya da `backdrop-blur`, `bg-*/opacity`, `border`, `shadow`, `rounded`. Solo se extiende lo mínimo y se encapsula el patrón repetido en **una** clase de componente.

- **`tailwind.config.{js,ts}`** → `theme.extend`:
  - `colors`: tokens `bg`, `text`, `accent` de arriba (semánticos, no hex sueltos en componentes).
  - `fontFamily`: `sans: ['Inter', ...]`, `heading: ['"Space Grotesk"', ...]`, `mono: ['"JetBrains Mono"', ...]`.
  - `backdropBlur`: `glass: '14px'` (si se quiere token nombrado; si no, usar `backdrop-blur-md` nativo).
  - `boxShadow`: `glass: '0 8px 32px rgba(0,0,0,0.25)'`.
  - `keyframes` + `animation`: `float` y `reveal` (para el blob del hero y el reveal por si se prefiere a CSS plano). Las microinteracciones de hover van con utilidades `transition`/`scale` directas.
- **`src/index.css`** (entrada Tailwind):
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    html { scroll-behavior: smooth; }
    body { @apply bg-bg-900 text-text-100 font-sans antialiased; }
  }

  @layer components {
    .glass {
      @apply rounded-2xl border shadow-glass;
      background: var(--glass-bg);
      border-color: var(--glass-border);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
  }

  /* Fallback sin backdrop-filter */
  @supports not (backdrop-filter: blur(1px)) {
    .glass { background: rgba(20,24,33,0.85); }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
  ```
  Las variables `--glass-bg`/`--glass-border` se definen en `:root` dentro de `@layer base` (un valor, un sitio; el `disenador` las ajusta).
- **Componente `Glass`**: wrapper finísimo que solo aplica la clase `.glass` + `as`/`className`. No es estilo nuevo, es azúcar para no repetir `className="glass ..."` y para variar la etiqueta semántica.
- **Reveal**: la clase utilitaria `reveal` / `is-visible` se expresa con utilidades Tailwind aplicadas por el hook (toggle de clases), o con dos clases en `@layer utilities`. Ponytail: el hook hace `el.classList.toggle('is-visible')`; las clases `reveal`/`is-visible` viven en `@layer utilities` con `opacity`/`translate-y`.

---

## File Structure

```
C:\portfolio\
  index.html
  package.json
  pnpm-lock.yaml
  tsconfig.json
  tsconfig.node.json
  vite.config.ts                     # plugins react + svgr; test.environment jsdom
  postcss.config.js                  # tailwindcss + autoprefixer
  tailwind.config.ts                 # theme.extend (colors, fonts, blur, shadow, keyframes)
  vite-env.d.ts                      # tipos para svgr y assets
  public\
    photo.jpg                        # foto del usuario (la genera/coloca el disenador como mock)
  src\
    main.tsx                         # bootstrap React
    index.css                        # entrada Tailwind + @layer base/components/utilities
    App.tsx                          # orquesta secciones (orden de scroll)
    lib\
      useScrollReveal.ts             # hook IntersectionObserver (reveal on scroll)
      filterProjects.ts              # LÓGICA PURA: filtrado/búsqueda de proyectos (testeable)
      filterProjects.test.ts         # Vitest
      <feature interactiva>.ts       # LÓGICA PURA de la feature elegida (testeable)
      <feature interactiva>.test.ts  # Vitest
    data\
      projects.ts                    # array tipado de proyectos + tipo Project (mock: disenador)
      experience.ts                  # array tipado de experiencia + tipo ExperienceItem (mock: disenador)
    components\
      Glass.tsx                      # wrapper de la clase .glass
      NavBar.tsx                     # nav fija con anclas + estado activo
    sections\
      Hero.tsx                       # foto + nombre + vector animado
      About.tsx                      # bio + skills
      Projects.tsx                   # grid de cards + filtros/búsqueda con estado + modal
      ProjectCard.tsx                # card individual con hover
      ProjectModal.tsx               # modal detalle (framer-motion)
      Experience.tsx                 # timeline interactiva
      Playground.tsx                 # FEATURE INTERACTIVA (sección dedicada)
      Contact.tsx                    # enlaces / CTA
    assets\
      vectors\                       # SVGs animados (los genera el disenador)
        hero-blob.svg
        skill-icons.svg (o individuales)
```

Regla de colocación: presentación en `src/sections` y `src/components`; **lógica pura y testeable en `src/lib`** junto a su `.test.ts`. Sin CSS Modules: todo el estilo es Tailwind (utilidades + clase `.glass`).

---

## Modelo de datos

`src/data/projects.ts`:
```ts
export type Project = {
  id: string;
  title: string;
  summary: string;          // 1-2 frases para la card
  description: string;      // texto largo para el modal
  tags: string[];           // usados por los filtros (ej: "React", "UI", "API")
  image: string;            // ruta en /public o import
  liveUrl?: string;
  repoUrl?: string;
  year: number;
};

export const projects: Project[] = [/* MOCKS los aporta el disenador */];
```

`src/data/experience.ts`:
```ts
export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  start: string;            // "2022" o "2022-03"
  end: string | "present";
  summary: string;
  highlights: string[];     // bullets mostrados al expandir
  tech: string[];
};

export const experience: ExperienceItem[] = [/* MOCKS los aporta el disenador */];
```

`src/lib/filterProjects.ts` (lógica pura, sin React — testeable):
```ts
import type { Project } from '../data/projects';

export const allTags = (projects: Project[]): string[] =>
  [...new Set(projects.flatMap(p => p.tags))].sort();

// Filtra por tag activo (null = todos) y texto de búsqueda (case-insensitive sobre title/summary/tags).
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
```

---

## Features interactivas (D2 cerrada — el "check no trivial" que justifica Vitest)

El usuario pidió lógica interactiva real, manipulable en el navegador. Ponytail manda: **se ENVÍA una feature bien hecha**, no dos a medias. Se proponen dos ideas; se implementa la **Feature A** (recomendada) y la **Feature B** queda como add-on opcional, claramente marcado, solo si A queda redonda y sobra tiempo. Ambas reutilizan datos/mocks que ya produce el `disenador`: cero pipeline de assets nuevo.

### Feature A (recomendada) — Buscador/filtro de proyectos con estado real

Eleva la sección Projects de "grid estático" a herramienta interactiva: **búsqueda en vivo + filtros por tag combinables**, con conteo de resultados y empty state. No es decorativo: es estado (`useState`) sobre lógica pura (`filterProjects`).

- **Lógica (testeable):** `filterProjects(projects, { tag, query })` y `allTags(projects)` en `src/lib/filterProjects.ts`. Funciones puras → fáciles de cubrir con Vitest sin DOM.
- **UI:** input de búsqueda (`aria-label`, `type="search"`) + chips de tag (toggle) + texto "N proyectos". El grid se re-renderiza con el resultado. Reveal/stagger se mantiene.
- **Por qué A:** reutiliza al 100% el modelo de datos y la sección Projects ya planificada; añade lógica genuina con el mínimo diff; es lo que un reclutador realmente toca.

### Feature B (add-on opcional) — Mini-playground embebido: "Glass Lab"

Una sección `Playground` con un **panel glass configurable en vivo**: sliders/inputs que ajustan blur, opacidad del fondo, radio del borde y ángulo del gradiente, y muestran el resultado sobre un panel de ejemplo **junto al snippet CSS/Tailwind correspondiente** (el "archivo visualizable desde la web"). Es a la vez juguete interactivo y demostración de skill (entiende glassmorphism y lo expone).

- **Lógica (testeable):** `src/lib/glassSnippet.ts` con una función pura `toGlassCss(settings): string` (y/o `toTailwind(settings)`) que transforma el estado de los controles en el string de CSS/clases mostrado. Pura → testeable: dado un settings, produce el snippet esperado; clamping de rangos comprobable.
- **UI:** controles (range inputs accesibles, con label y valor numérico tabular) + preview en tiempo real + bloque de código con botón "copiar". Estado en `useState`.
- **Por qué B y no otra cosa:** un mini-juego o visor de archivos arbitrarios exigiría assets/lógica desproporcionados (YAGNI). "Glass Lab" reaprovecha el sistema de tokens que ya existe, encaja con la temática (dev creativo + glassmorphism) y su núcleo es una función pura trivial de testear.

**Regla de corte:** B es opcional. Si A cumple los criterios de aceptación y el tiempo aprieta, NO se implementa B; se anota como mejora futura. No se añaden dependencias para ninguna de las dos.

---

## Secciones / componentes y qué requisito cubre

| Componente | Qué hace | Requisito |
|---|---|---|
| `NavBar` | Nav fija translúcida (glass) con anclas; resalta sección activa vía IntersectionObserver | 2, 3 |
| `Hero` | Foto destacada del usuario + nombre/título + vector SVG animado de fondo | 5, 4, 2 |
| `About` | Bio + grid de skills con iconos SVG; reveal on scroll | 1, 3 |
| `Projects` | Grid de `ProjectCard` con **búsqueda + filtros por tag (Feature A)**; abre `ProjectModal` | 6, **8 (interactiva)** |
| `ProjectCard` | Card glass con hover (scale/elevación), tags, links | 6, 2 |
| `ProjectModal` | Modal con detalle, animado desde la card (framer-motion) | 6, 3 |
| `Experience` | Timeline vertical navegable; cada item expande highlights | 7, 3 |
| `Playground` (opcional) | **Glass Lab (Feature B):** controles en vivo + preview + snippet | **8 (interactiva)** |
| `Contact` | CTA + enlaces (email, GitHub, LinkedIn) en panel glass | 1 |
| `Glass` | Wrapper que aplica la clase `.glass` | (base) 2 |
| `useScrollReveal` | Hook IntersectionObserver para reveals; respeta reduced-motion | 3 |
| `filterProjects` / `glassSnippet` (lib) | Lógica pura testeable de las features interactivas | **8** |

---

## Estrategia glassmorphism + animaciones

- **Glass:** clase `.glass` (`@layer components`) aplicada vía el componente `Glass`. Fallback `@supports`.
- **Profundidad:** fondo con 1-2 blobs en gradiente (`accent`/`accent.2`) detrás de los paneles, para que el blur tenga algo que difuminar.
- **Scroll reveals:** `useScrollReveal` togglea `is-visible`; las clases `reveal`/`is-visible` (`@layer utilities`) hacen `opacity 0->1` + `translateY`. Stagger por delay incremental (utilidades `delay-*` o style inline por índice).
- **Microinteracciones:** hover de cards y botones con utilidades Tailwind (`transition`, `hover:scale-[1.02]`, `hover:border-...`).
- **Framer Motion (acotado):** `ProjectModal` (entrada/salida + layoutId desde card) y la expansión de items del timeline. No envolver toda la app. La Feature B no necesita framer-motion (los controles son estado puro).
- **Vectores animados:** SVG inline (importados con svgr `?react`) animados con CSS `@keyframes`/utilidad `animate-float`. SMIL solo si un trazo lo requiere.
- **prefers-reduced-motion:** media query global desactiva transforms/animaciones; el hook también lo comprueba y revela sin animar.

---

## Assets / contenido — quién produce qué

El `disenador` produce TODOS los mocks (D3 cerrada). El dev-senior los consume tal cual.

**Diseñador (`disenador`) genera y deja en disco:**
- **Foto mock** del usuario: `public/photo.jpg` (recorte cuadrado/retrato, con tratamiento glow/máscara si aplica).
- **Datos mock de proyectos:** contenido completo de `src/data/projects.ts` (3-6 entradas: título, summary, description, tags, image, links, year). Tags variados para que los filtros (Feature A) tengan sentido.
- **Datos mock de experiencia:** contenido completo de `src/data/experience.ts` (3-5 entradas con highlights y tech).
- **SVGs animados:** blob del hero (`hero-blob.svg`) e iconos de skills en `src/assets/vectors/`.
- **Paleta final en hex** validada por contraste (ajusta los tokens de `tailwind.config` y las vars `--glass-*`).
- **Confirmación del par tipográfico** (default Space Grotesk + Inter + JetBrains Mono, o alternativa Archivo + Space Grotesk).
- **Enlaces de contacto mock** (email, GitHub, LinkedIn) para la sección Contact.

**Dev-senior NO inventa contenido:** consume los archivos del `disenador`. Si arranca antes de que existan, usa placeholders mínimos marcados con `// TODO: reemplazar por mock del disenador` y la sección queda funcional pero no presentable.

---

## Comandos pnpm de setup (Windows / PowerShell)

```powershell
# 1. Scaffold Vite (React + TS) en el directorio actual ya creado
pnpm create vite . --template react-ts

# 2. Instalar dependencias base
pnpm install

# 3. Dependencias del proyecto
pnpm add framer-motion
pnpm add -D vite-plugin-svgr
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom

# 4. Inicializar Tailwind (genera tailwind.config + postcss.config)
pnpm exec tailwindcss init -p

# 5. Dev server
pnpm dev

# 6. Tests
pnpm test            # vitest (watch) ; pnpm test -- --run para una pasada CI

# 7. Build de producción + preview
pnpm build
pnpm preview
```

Scripts en `package.json`: `"test": "vitest"`, `"test:ci": "vitest run"`.

Nota: `pnpm create vite . --template react-ts` puede pedir confirmar scaffolding en carpeta no vacía (existe `.claude/` y `docs/`); responder que sí. Si falla por no-vacío, scaffolding en subcarpeta temporal y mover archivos, o usar `--overwrite` según la versión. Verificar que NO pisa `.claude/` ni `docs/`.

---

## Orden de implementación en fases

Cada fase deja software ejecutable (`pnpm dev` arranca y se ve algo) y, desde Fase 1, `pnpm test` verde.

### Fase 0 — Scaffold y configuración
- Tareas 1-3. Vite arranca; svgr, Tailwind, PostCSS y Vitest configurados.

### Fase 1 — Base visual (tokens Tailwind + glass + reveals)
- Tareas 4-6. `tailwind.config` con tokens, `index.css` con `.glass`, `Glass`, `useScrollReveal` (+ su test), `NavBar`.

### Fase 2 — Contenido (consume mocks del disenador)
- Tareas 7-9. Datos tipados, Hero (foto + vector), About.

### Fase 3 — Interactividad
- Tareas 10-13. Projects + **Feature A (búsqueda/filtros, con tests)**, ProjectModal, Experience timeline.

### Fase 4 — Feature interactiva dedicada (opcional) + cierre
- Tarea 14 (opcional): Playground / Glass Lab (Feature B, con tests).
- Tarea 15: Contact, ensamblaje, pase responsive, reduced-motion, `pnpm test:ci`, build, QA.

---

## Tasks

### Task 1: Scaffold del proyecto Vite + React + TS

**Files:** Create: scaffold de Vite (`package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/App.tsx`).
**Interfaces:** Produces: proyecto ejecutable con `pnpm dev`.

- [ ] **Step 1: Scaffold** — `pnpm create vite . --template react-ts` ; `pnpm install`.
- [ ] **Step 2: Verificar arranque** — `pnpm dev` ; página default de Vite en `http://localhost:5173`.
- [ ] **Step 3: Limpiar boilerplate** — `App.tsx` mínimo (`export default function App(){ return <main>Portfolio</main> }`); borrar `App.css` y logos demo.
- [ ] **Step 4: Commit** — `git init; git add -A; git commit -m "chore: scaffold vite react-ts portfolio"`

---

### Task 2: Configurar svgr + tipos de assets

**Files:** Modify `vite.config.ts`; Create/Modify `src/vite-env.d.ts`.
**Interfaces:** Produces: `import Logo from './x.svg?react'` devuelve un componente React.

- [ ] **Step 1: Plugin** — en `vite.config.ts` añadir `svgr()` a `plugins` junto a `react()`.
- [ ] **Step 2: Tipos svgr** — `src/vite-env.d.ts`: `/// <reference types="vite/client" />` y `/// <reference types="vite-plugin-svgr/client" />`.
- [ ] **Step 3: Verificar** — `pnpm build` sin errores de TS.
- [ ] **Step 4: Commit** — `git commit -m "chore: configure svgr for svg-as-component"`

---

### Task 3: Configurar Tailwind + PostCSS + Vitest

**Files:** Create `tailwind.config.ts`, `postcss.config.js`, `src/index.css`; Modify `vite.config.ts` (bloque `test`), `src/main.tsx` (importar `index.css`).
**Interfaces:** Produces: utilidades Tailwind + clase `.glass` disponibles; `pnpm test` ejecuta Vitest en jsdom.

- [ ] **Step 1: Tailwind/PostCSS** — `pnpm add -D tailwindcss postcss autoprefixer && pnpm exec tailwindcss init -p`. En `tailwind.config.ts`: `content: ['./index.html','./src/**/*.{ts,tsx}']` y `theme.extend` con `colors` (bg/text/accent), `fontFamily` (sans/heading/mono), `boxShadow.glass`, `backdropBlur.glass`, `keyframes`/`animation` (`float`, opcional `reveal`).
- [ ] **Step 2: index.css** — contenido de la sección "Estrategia Tailwind + glassmorphism" (directivas `@tailwind`, `:root` con `--glass-*`, `@layer base/components/utilities`, fallback `@supports`, media `prefers-reduced-motion`, clases `reveal`/`is-visible`). Importar en `main.tsx`.
- [ ] **Step 3: Vitest** — `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom`. En `vite.config.ts` añadir `test: { environment: 'jsdom', globals: true, setupFiles: './src/setupTests.ts' }` (setup importa `@testing-library/jest-dom`). Scripts `test` / `test:ci` en `package.json`.
- [ ] **Step 4: Verificar** — `pnpm dev` (fondo oscuro, fuentes cargan); `pnpm test:ci` corre sin tests aún (o un test trivial) y sale 0.
- [ ] **Step 5: Commit** — `git commit -m "chore: tailwind, postcss and vitest setup"`

---

### Task 4: Componente Glass

**Files:** Create `src/components/Glass.tsx`.
**Interfaces:** Produces: `<Glass as="section" className?>...</Glass>` aplica la clase `.glass`.

- [ ] **Step 1: Glass.tsx** — wrapper que compone `glass` + `className` y acepta `as` (ElementType) y `...rest`. Sin estilos propios nuevos (todo viene de `.glass`).
- [ ] **Step 2: Verificar** — renderizar un `<Glass>` de prueba en App; panel translúcido visible sobre un blob de fondo.
- [ ] **Step 3: Commit** — `git commit -m "feat: reusable glass panel component"`

---

### Task 5: Hook useScrollReveal (+ test) + NavBar

**Files:** Create `src/lib/useScrollReveal.ts`, `src/lib/useScrollReveal.test.ts`, `src/components/NavBar.tsx`.
**Interfaces:** `const ref = useScrollReveal<HTMLDivElement>()` añade `is-visible` al entrar en viewport (respeta reduced-motion). NavBar con anclas `#hero #about #projects #experience #playground #contact`.

- [ ] **Step 1: useScrollReveal.ts** — IntersectionObserver; si `prefers-reduced-motion`, añade `is-visible` directo. `unobserve` tras revelar; `disconnect` en cleanup.
- [ ] **Step 2: Test** — `renderHook(() => useScrollReveal())` → `expect(result.current).toHaveProperty('current')`. (IntersectionObserver mock en setup si hace falta.)
- [ ] **Step 3: NavBar** — nav fija usando `Glass`, links a las anclas, `aria-label="Navegación principal"`, resaltado de activo vía IntersectionObserver. Touch targets >=44px.
- [ ] **Step 4: Verificar** — `pnpm test:ci` verde; links hacen scroll suave a cada sección placeholder.
- [ ] **Step 5: Commit** — `git commit -m "feat: scroll reveal hook (tested) and sticky nav"`

---

### Task 6: Datos tipados (projects + experience)

**Files:** Create `src/data/projects.ts`, `src/data/experience.ts`.
**Interfaces:** Produces: `projects: Project[]`, `experience: ExperienceItem[]` y los tipos (firmas en "Modelo de datos").

- [ ] **Step 1** — definir tipos `Project` / `ExperienceItem`. Rellenar con los **mocks del `disenador`** si existen; si no, 2-3 placeholders marcados `// TODO: mock disenador`.
- [ ] **Step 2: Verificar** — `pnpm build` compila.
- [ ] **Step 3: Commit** — `git commit -m "feat: typed projects and experience data"`

---

### Task 7: Sección Hero (foto + vector animado)

**Files:** Create `src/sections/Hero.tsx`. Usa `public/photo.jpg` (mock disenador) y `src/assets/vectors/hero-blob.svg` (disenador).
**Interfaces:** Consumes `Glass`. Produces `<section id="hero">`.

- [ ] **Step 1** — layout hero (Tailwind grid/flex): columna texto (nombre, título, CTA a proyectos) + foto en `Glass` con `rounded`/glow. `<img alt="Foto de [nombre]" width height loading="eager">` (evitar CLS).
- [ ] **Step 2** — vector SVG de fondo importado `?react`, `animate-float`, `aria-hidden`. Placeholder si el disenador aún no lo entregó.
- [ ] **Step 3: Verificar** — hero a pantalla completa, responsive a 375px, sin scroll horizontal.
- [ ] **Step 4: Commit** — `git commit -m "feat: hero section with photo and animated vector"`

---

### Task 8: Sección About

**Files:** Create `src/sections/About.tsx`.
**Interfaces:** Consumes `Glass`, `useScrollReveal`. Produces `<section id="about">`.

- [ ] **Step 1** — bio en `Glass` + grid de skills (iconos SVG + label). Clase `reveal` + ref del hook; stagger por índice (delay).
- [ ] **Step 2: Verificar** — al hacer scroll, bloques aparecen con fade/translate; reduced-motion los muestra sin animar.
- [ ] **Step 3: Commit** — `git commit -m "feat: about section with skills"`

---

### Task 9: Lógica de filtrado (lib + tests)

**Files:** Create `src/lib/filterProjects.ts`, `src/lib/filterProjects.test.ts`.
**Interfaces:** Produces `filterProjects(projects, { tag, query })` y `allTags(projects)` (firmas en "Modelo de datos"). TDD: tests primero.

- [ ] **Step 1: Tests (rojo)** — cubrir: sin filtros devuelve todo; tag filtra por inclusión; query case-insensitive sobre title/summary/tags; tag + query combinan (AND); query vacía/espacios = sin filtro; `allTags` deduplica y ordena.
- [ ] **Step 2: Implementación (verde)** — escribir `filterProjects`/`allTags` hasta pasar.
- [ ] **Step 3: Verificar** — `pnpm test:ci` verde.
- [ ] **Step 4: Commit** — `git commit -m "feat: pure project filter/search logic with tests"`

---

### Task 10: Projects — grid + cards + Feature A (búsqueda/filtros con estado)

**Files:** Create `src/sections/Projects.tsx`, `src/sections/ProjectCard.tsx`.
**Interfaces:** Consumes `projects`, `filterProjects`, `allTags`, `Project`, `Glass`, `useScrollReveal`. Produces `<section id="projects">`; `ProjectCard` recibe `{ project; onOpen }`.

- [ ] **Step 1: ProjectCard** — card `Glass` con imagen (aspect-ratio reservado), título, summary, tags. Hover Tailwind (`hover:scale-[1.02]`, cambio de borde). Es `<button>`/accesible por teclado; `onClick` llama `onOpen(project)`.
- [ ] **Step 2: Feature A — estado** — `useState` para `activeTag: string|null` y `query: string`. Input `type="search"` con `aria-label="Buscar proyectos"`; chips de tag (toggle) desde `allTags(projects)` + "Todos". Derivar `const shown = filterProjects(projects, { tag: activeTag, query })`. Mostrar conteo "N proyectos" y **empty state** ("Sin resultados") cuando `shown.length === 0`.
- [ ] **Step 3: Grid** — CSS grid responsive Tailwind (`grid` + `minmax` vía `grid-cols`/`auto-fill` utility o arbitrary). Reveal con stagger por card.
- [ ] **Step 4: Verificar** — buscar y filtrar actualiza el grid en vivo; empty state aparece; hover anima; foco navegable por teclado; `pnpm test:ci` verde.
- [ ] **Step 5: Commit** — `git commit -m "feat: interactive projects grid with live search and tag filters"`

---

### Task 11: ProjectModal (framer-motion)

**Files:** Create `src/sections/ProjectModal.tsx`; Modify `src/sections/Projects.tsx`.
**Interfaces:** Consumes `Project`, `framer-motion` (`motion`, `AnimatePresence`). `ProjectModal` recibe `{ project: Project | null; onClose }`.

- [ ] **Step 1** — `AnimatePresence` + `motion.div` overlay (scrim 50% negro, `role="dialog"`, `aria-modal`). Panel `Glass` con título, descripción larga, tags, links. Entrada scale+fade.
- [ ] **Step 2: Accesibilidad** — cierra con `Esc`, click en scrim cierra, foco al modal al abrir, botón cerrar con `aria-label="Cerrar"`.
- [ ] **Step 3** — en `Projects.tsx`: `const [selected, setSelected] = useState<Project|null>(null)`, `onOpen={setSelected}`, render del modal.
- [ ] **Step 4: Verificar** — abrir/cerrar anima; Esc y scrim cierran; reduced-motion no rompe.
- [ ] **Step 5: Commit** — `git commit -m "feat: animated project detail modal"`

---

### Task 12: Experience — timeline interactiva

**Files:** Create `src/sections/Experience.tsx`.
**Interfaces:** Consumes `experience`, `ExperienceItem`, `Glass`, `framer-motion`, `useScrollReveal`. Produces `<section id="experience">`.

- [ ] **Step 1** — timeline vertical (línea + nodos), cada item en `Glass` con rol, empresa, fechas, summary. Reveal por item.
- [ ] **Step 2: Interactividad** — expand/collapse de `highlights` + `tech` al click. `useState<string|null>` para `expandedId`. Botón cabecera con `aria-expanded`. Animar altura con `motion`/`AnimatePresence`.
- [ ] **Step 3: Verificar** — expandir/colapsar anima; teclado y `aria-expanded` correctos; responsive a una columna en móvil.
- [ ] **Step 4: Commit** — `git commit -m "feat: interactive experience timeline"`

---

### Task 13: (Opcional) Feature B — Glass Lab (lógica lib + tests)

> OPCIONAL. Solo si Task 10 cumple sus criterios y queda margen. Si no, anotar como mejora futura y saltar a Task 14.

**Files:** Create `src/lib/glassSnippet.ts`, `src/lib/glassSnippet.test.ts`.
**Interfaces:** Produces `toGlassCss(settings)` y/o `toTailwind(settings)` (puras). `settings = { blur: number; opacity: number; radius: number; angle: number }`.

- [ ] **Step 1: Tests (rojo)** — dado un `settings` conocido, el snippet contiene los valores esperados; clamping de rangos (blur 0-40, opacity 0-1, radius 0-32) recorta fuera de rango.
- [ ] **Step 2: Implementación (verde)** — funciones puras que componen el string.
- [ ] **Step 3: Verificar** — `pnpm test:ci` verde.
- [ ] **Step 4: Commit** — `git commit -m "feat: glass-lab snippet generator with tests"`

---

### Task 14: (Opcional) Feature B — Playground (UI)

> OPCIONAL, depende de Task 13.

**Files:** Create `src/sections/Playground.tsx`; Modify `src/App.tsx` y `NavBar` (ancla `#playground`).
**Interfaces:** Consumes `toGlassCss`/`toTailwind`, `Glass`. Produces `<section id="playground">`.

- [ ] **Step 1** — controles range accesibles (label + valor tabular) que setean `settings` (`useState`). Preview en vivo de un panel `.glass` con los valores.
- [ ] **Step 2** — bloque de código con el snippet (de la lib) y botón "Copiar" (`navigator.clipboard`), con feedback breve.
- [ ] **Step 3: Verificar** — mover controles cambia el preview y el snippet en tiempo real; teclado opera los sliders; reduced-motion respetado.
- [ ] **Step 4: Commit** — `git commit -m "feat: interactive glass-lab playground section"`

---

### Task 15: Contact + ensamblaje + pase final

**Files:** Create `src/sections/Contact.tsx`; Modify `src/App.tsx`.
**Interfaces:** Consumes todas las secciones + `NavBar`.

- [ ] **Step 1: Contact** — panel `Glass` con CTA y enlaces mock (mailto, GitHub, LinkedIn), iconos SVG con `aria-label`.
- [ ] **Step 2: App.tsx** — montar en orden: `NavBar`, `Hero`, `About`, `Projects`, `Experience`, `Playground` (si existe), `Contact`.
- [ ] **Step 3: Pase responsive** — 375 / 768 / 1024 / 1440; sin scroll horizontal; touch targets >=44px.
- [ ] **Step 4: Pase reduced-motion** — activar preferencia del SO; nada se anima y todo es legible.
- [ ] **Step 5: Verificación** — `pnpm test:ci` verde; `pnpm build` sin errores; `pnpm preview` revisa el bundle.
- [ ] **Step 6: Commit** — `git commit -m "feat: contact section and final assembly"`

---

## Criterios de aceptación (para qa-optimizer)

1. `pnpm dev`, `pnpm build` y `pnpm test:ci` corren sin errores ni warnings de TS.
2. Las secciones existen y son alcanzables por la nav (anclas funcionan, scroll suave): Hero, About, Projects, Experience, (Playground si se implementó), Contact.
3. Glassmorphism visible (paneles translúcidos con blur) vía clase `.glass`, con fallback `@supports`. No hay CSS Modules; el estilo es Tailwind.
4. Foto del usuario destacada en el hero, con `alt` y sin CLS.
5. Al menos un vector SVG animado, `aria-hidden`, que respeta reduced-motion.
6. Proyectos: grid responsive, modal abre/cierra con animación (Esc y scrim cierran, foco gestionado).
7. Experiencia: timeline navegable, items expanden/colapsan con `aria-expanded`, animación suave.
8. **Feature interactiva con lógica real:** Feature A (búsqueda en vivo + filtros por tag con estado, conteo y empty state) funciona en el navegador; su lógica pura (`filterProjects`/`allTags`) tiene tests Vitest que pasan. Si se implementó Feature B (Glass Lab), sus controles ajustan el preview y el snippet en vivo y `glassSnippet` tiene tests que pasan.
9. Scroll reveals funcionan y se desactivan con `prefers-reduced-motion`.
10. Accesibilidad: contraste texto >=4.5:1, foco visible, botones de solo icono con `aria-label`, input de búsqueda con label, navegación por teclado completa (incluidos chips y sliders).
11. Responsive en 375/768/1024/1440 sin scroll horizontal; touch targets >=44px.
12. Solo dependencias permitidas: `framer-motion`, `vite-plugin-svgr`, `tailwindcss`/`postcss`/`autoprefixer`, `vitest`/`@testing-library`/`jsdom`. Sin librerías de UI ni segunda lib de animación.

---

## Lo que se omite deliberadamente (estilo ponytail)

- **Feature B (Glass Lab):** opcional. Se envía Feature A bien hecha antes que dos features a medias. B solo si A queda redonda. Una buena supera a dos regulares.
- **Router (react-router):** one-page, anclas nativas bastan. Añadir cuando haya páginas reales separadas (ej. blog).
- **Plugins de glassmorphism para Tailwind:** innecesarios; `backdrop-blur` + tokens + una clase `.glass` lo cubren. No instalar.
- **Backend / CMS:** datos en TS (mocks del disenador). Migrar a CMS solo si el usuario va a editar contenido sin tocar código.
- **Librería de animación extra (GSAP/AOS/lottie):** IntersectionObserver + CSS/Tailwind + framer-motion acotado cubren todo.
- **Tests de UI/DOM exhaustivos:** Vitest cubre la **lógica pura** de las features (`filterProjects`, `glassSnippet`) y un smoke del hook. No se testean animaciones ni se hace render-testing extensivo: desproporcionado para un portfolio. Ese es el "único check no trivial" que justifica el runner.
- **Mini-juego / visor de archivos arbitrario:** descartado por YAGNI; exige assets y lógica desproporcionados frente al valor. Glass Lab da interactividad real reaprovechando lo que ya existe.
- **i18n, analytics, dark/light toggle:** no pedidos. El sitio nace en dark.

---

## Decisiones cerradas

- **D1 — Styling: TAILWIND (cerrado).** CSS Modules descartado. Glass vía `theme.extend` + clase `.glass` en `@layer components`; resto, utilidades Tailwind.
- **D2 — Test runner: VITEST, SÍ (cerrado).** Justificado porque las features interactivas aportan lógica pura real (`filterProjects`, `glassSnippet`) con cobertura de tests. Es el check no trivial del proyecto.
- **D3 — Mocks: los genera el DISENADOR (cerrado).** Foto, datos de proyectos/experiencia, SVGs, paleta final y enlaces de contacto los produce `disenador`; `dev-senior` los consume.
- **D4 — Alcance de framer-motion:** solo modal + timeline. Feature B no lo usa.
- **D5 — Scaffold en carpeta no vacía:** existen `.claude/` y `docs/`. Ejecutar `pnpm create vite .` aceptando carpeta no vacía; verificar que no pisa esos directorios.
- **D6 — Deploy:** no incluido. Vite produce estático; destino (GitHub Pages / Netlify / Vercel) a decidir; puede requerir ajustar `base` en `vite.config.ts`.

---

## Handoff

1. **`disenador`** primero (o en paralelo a Fase 0/1): produce los mocks de D3 — `public/photo.jpg`, `src/data/projects.ts`, `src/data/experience.ts`, SVGs en `src/assets/vectors/`, paleta final (ajusta `tailwind.config` + vars `--glass-*`) y enlaces de contacto.
2. **`dev-senior`** ejecuta este plan task-by-task (superpowers:subagent-driven-development), consumiendo los mocks del `disenador`.
3. **`qa-optimizer`** valida contra los Criterios de aceptación.
