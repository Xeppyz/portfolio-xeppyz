import { describe, it, expect } from 'vitest'

// Trivial smoke test — confirms jsdom environment and jest-dom matchers load.
describe('smoke', () => {
  it('runs in jsdom environment', () => {
    expect(typeof document).toBe('object')
  })

  it('jest-dom matchers are available', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    expect(el).toBeInTheDocument()
    document.body.removeChild(el)
  })
})
