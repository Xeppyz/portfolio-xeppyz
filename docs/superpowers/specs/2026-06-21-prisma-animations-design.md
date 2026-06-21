# Diseño: Animaciones y detalles de layout estilo Prisma

**Fecha:** 2026-06-21
**Estado:** Aprobado (diseño)

## Objetivo

Incorporar técnicas de animación y dos detalles de layout del prompt "Prisma" al
portfolio, **manteniendo el sistema de diseño actual** (glassmorphism azul, tokens
de `tailwind.config.ts`, fuentes Inter/Space Grotesk). Cero dependencias nuevas:
todo con `framer-motion` (ya instalado) y SVG inline.

## Alcance

Incluido:
1. `WordsPullUp` — reveal de títulos palabra por palabra.
2. `RevealText` — reveal de la bio carácter por carácter ligado al scroll.
3. NavBar como pastilla colgante del borde superior.
4. CTA del Hero con círculo + flecha (hover animado).

Excluido (decisión explícita): paleta cream de Prisma, `lucide-react`, video de
fondo, heading gigante `text-[20vw]`, noise overlay.

## Componentes

### 1. `WordsPullUp` — `src/components/WordsPullUp.tsx`

**Qué hace:** renderiza un texto donde cada palabra entra subiendo y apareciendo,
de forma escalonada, al entrar en viewport.

**Interfaz:**
```ts
interface WordsPullUpProps {
  text: string;
  className?: string;   // clases del contenedor (tamaño/fuente/color del heading)
  as?: 'h1' | 'h2' | 'span';  // elemento semántico, default 'span'
}
```

**Comportamiento:**
- Divide `text` por espacios. Cada palabra → `motion.span` con `display:inline-block`.
- Animación: `y: 16 → 0`, `opacity: 0 → 1`. Stagger 0.08s entre palabras.
- Ease `[0.16, 1, 0.3, 1]` (mismo cubic-bezier que el keyframe `reveal` existente).
- Disparo: `useInView(ref, { once: true, margin: '-80px' })`.
- Contenedor: `flex flex-wrap` (gap horizontal vía `mr` por palabra) para no romper
  el wrapping responsive de títulos largos.
- **A11y:** si `useReducedMotion()` es true → render estático (sin `initial`/`animate`,
  opacity 1, y 0). No negociable.

**Dónde se usa:**
- `Hero.tsx`: `<h1>` con `contactMeta.name` (`as="h1"`).
- Títulos de sección que hoy son `<h2>` estáticos (Projects, Experience, About,
  Contact, Playground) → migrados a `WordsPullUp as="h2"` conservando sus clases.

### 2. `RevealText` — `src/components/RevealText.tsx`

**Qué hace:** revela un párrafo carácter por carácter, con la opacidad de cada
letra ligada a la posición de scroll (de 0.2 a 1).

**Interfaz:**
```ts
interface RevealTextProps {
  text: string;
  className?: string;
}
```

**Comportamiento:**
- Cada carácter → `motion.span` (`display:inline-block`). Espacios renderizados
  como ` ` para no colapsar.
- `useScroll({ target: ref, offset: ['start 0.8', 'end 0.4'] })`.
- Por carácter `i` de `total`: `charProgress = i / total`; la opacity se interpola
  con `useTransform(scrollYProgress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1])`.
- **A11y:** si `useReducedMotion()` es true → opacity fija en 1, sin scroll hooks.

**Dónde se usa:**
- `About.tsx` línea 39: reemplaza el `<p>{contactMeta.bio}</p>` dentro del `Glass`.
  Mantiene las clases `text-text-300 leading-relaxed text-lg`.
- La bio corta del Hero (línea 29-31) queda **estática** (es de una línea, no aplica).

### 3. NavBar pastilla colgante — editar `src/components/NavBar.tsx`

**Qué hace:** la barra se presenta como una pastilla centrada que cuelga del borde
superior de la ventana.

**Comportamiento:**
- Contenedor: posición fija/sticky arriba, centrado horizontalmente.
- Pastilla: fondo `bg-bg-900` (o glass existente), `rounded-b-glass-lg`,
  padding `px-6 py-2 md:px-8`, sombra `shadow-glass`.
- Mantiene los links actuales, sus colores (`text-text-300` → hover `text-text-100`)
  y `focus-visible`. No se cambian destinos ni textos.

### 4. CTA círculo + flecha — editar `Hero.tsx`

**Qué hace:** el botón "Ver proyectos" gana un círculo con flecha que reacciona al hover.

**Comportamiento:**
- Pill `bg-accent`, texto `text-bg-900 font-semibold font-heading` (igual que hoy).
- A la derecha, círculo `bg-bg-900 rounded-full w-9 h-9` con una flecha → en **SVG
  inline** (path simple, sin `lucide-react`), color `text-accent`.
- Grupo `group`: hover → `gap` crece (`group-hover:gap-3`) y círculo `group-hover:scale-110`.
- Conserva `shadow-accent-glow` y `focus-visible`.
- El botón secundario "Contacto" no cambia.

## Tests

Siguiendo el patrón de `src/lib/*.test.ts` (vitest + testing-library), un test
ligero por componente nuevo:

- `WordsPullUp.test.tsx`: renderiza el texto completo (todas las palabras presentes
  en el DOM) y, con `prefers-reduced-motion`, no aplica transform.
- `RevealText.test.tsx`: renderiza el texto completo carácter a carácter (el texto
  accesible coincide con el input).

Sin frameworks ni fixtures nuevos.

## A11y (transversal, no negociable)

- Ambos componentes respetan `prefers-reduced-motion` vía `useReducedMotion()`.
- El texto siempre está en el DOM como contenido real (no pseudo-elementos), por lo
  que lectores de pantalla y SEO lo leen completo, animado o no.
- Contraste y focus-visible existentes se preservan (no se tocan tokens).

## Archivos afectados

| Archivo | Acción |
|---|---|
| `src/components/WordsPullUp.tsx` | nuevo |
| `src/components/RevealText.tsx` | nuevo |
| `src/components/WordsPullUp.test.tsx` | nuevo |
| `src/components/RevealText.test.tsx` | nuevo |
| `src/components/NavBar.tsx` | editar (pastilla) |
| `src/sections/Hero.tsx` | editar (h1 → WordsPullUp, CTA círculo+flecha) |
| `src/sections/About.tsx` | editar (bio → RevealText) |
| `src/sections/Projects.tsx`, `Experience.tsx`, `Contact.tsx`, `Playground.tsx` | editar (h2 → WordsPullUp) |
