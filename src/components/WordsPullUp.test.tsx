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
