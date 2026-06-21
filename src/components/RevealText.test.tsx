import { render, screen } from '@testing-library/react';
import RevealText from './RevealText';

// ponytail: vi.mock hoisted — framer ESM no permite redefinir exports en runtime;
// mock factory reexporta todo y deja useReducedMotion mockeable con vi.fn()
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

import * as framerMotion from 'framer-motion';

describe('RevealText', () => {
  it('el texto accesible coincide con el input', () => {
    const text = 'hola mundo';
    const { container } = render(<RevealText text={text} />);
    const got = container.textContent?.replace(/ /g, ' ');
    expect(got).toBe(text);
    // verifica que el texto se divide en spans por carácter (no es un <p>{text}</p> plano)
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe([...text].length);
  });

  it('con reduced-motion renderiza el texto plano', () => {
    window.matchMedia = (q: string) =>
      ({ matches: true, media: q, onchange: null,
         addEventListener() {}, removeEventListener() {},
         addListener() {}, removeListener() {}, dispatchEvent: () => false,
       }) as unknown as MediaQueryList;
    vi.mocked(framerMotion.useReducedMotion).mockReturnValue(true);
    render(<RevealText text="texto plano" />);
    expect(screen.getByText('texto plano')).toBeInTheDocument();
  });
});
