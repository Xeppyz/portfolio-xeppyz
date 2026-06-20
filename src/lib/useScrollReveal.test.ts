import { renderHook } from '@testing-library/react';
import useScrollReveal from './useScrollReveal';

// Mock IntersectionObserver
const observeMock = vi.fn();
const unobserveMock = vi.fn();
const disconnectMock = vi.fn();

beforeEach(() => {
  window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: observeMock,
    unobserve: unobserveMock,
    disconnect: disconnectMock,
  }));
});

describe('useScrollReveal', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current).toHaveProperty('current');
  });
});
