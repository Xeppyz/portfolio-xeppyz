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

// jsdom no implementa IntersectionObserver; framer-motion whileInView lo necesita.
if (!window.IntersectionObserver) {
  // ponytail: stub mínimo — observe/unobserve/disconnect no hacen nada en tests
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
}
