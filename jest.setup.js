import '@testing-library/jest-dom';

// Mock ResizeObserver (needed for svg-pan-zoom / DOM resize)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Provide a safe default fetch mock
global.fetch = jest.fn();
