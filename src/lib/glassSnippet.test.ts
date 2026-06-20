import { describe, it, expect } from 'vitest';
import { toGlassCss, toTailwind } from './glassSnippet';

describe('toGlassCss', () => {
  it('generates CSS with given values', () => {
    const css = toGlassCss({ blur: 14, opacity: 0.06, radius: 16, angle: 135 });
    expect(css).toContain('backdrop-filter: blur(14px)');
    expect(css).toContain('border-radius: 16px');
    expect(css).toContain('rgba(255, 255, 255, 0.06)');
  });

  it('clamps blur to 0-40', () => {
    expect(toGlassCss({ blur: -5, opacity: 0.1, radius: 8, angle: 0 })).toContain('blur(0px)');
    expect(toGlassCss({ blur: 100, opacity: 0.1, radius: 8, angle: 0 })).toContain('blur(40px)');
  });

  it('clamps opacity to 0-1', () => {
    const css0 = toGlassCss({ blur: 10, opacity: -1, radius: 8, angle: 0 });
    expect(css0).toContain('rgba(255, 255, 255, 0.00)');
    const css1 = toGlassCss({ blur: 10, opacity: 2, radius: 8, angle: 0 });
    expect(css1).toContain('rgba(255, 255, 255, 1.00)');
  });

  it('clamps radius to 0-32', () => {
    expect(toGlassCss({ blur: 10, opacity: 0.1, radius: -2, angle: 0 })).toContain('border-radius: 0px');
    expect(toGlassCss({ blur: 10, opacity: 0.1, radius: 100, angle: 0 })).toContain('border-radius: 32px');
  });
});

describe('toTailwind', () => {
  it('generates Tailwind class string with backdrop-blur', () => {
    const classes = toTailwind({ blur: 14, opacity: 0.06, radius: 16, angle: 135 });
    expect(classes).toContain('backdrop-blur-');
    expect(classes).toContain('rounded-');
  });

  it('includes bg-white with opacity', () => {
    const classes = toTailwind({ blur: 14, opacity: 0.1, radius: 16, angle: 135 });
    expect(classes).toContain('bg-white/');
  });
});
