import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};

Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com valores padrão', () => {
    const { result } = renderHook(() => useGeolocation());

    expect(result.current.coordinates).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('deve solicitar permissão de geolocalização', () => {
    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestPermission();
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(result.current.loading).toBe(true);
  });

  it('deve atualizar coordenadas quando sucesso', () => {
    const mockPosition = {
      coords: {
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 10,
      },
    } as GeolocationPosition;

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestPermission();
    });

    expect(result.current.coordinates).toEqual({
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
    });
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('deve definir erro quando permissão negada', () => {
    const mockError = {
      code: 1, // PERMISSION_DENIED
      message: 'User denied geolocation',
    } as GeolocationPositionError;

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError);
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestPermission();
    });

    expect(result.current.coordinates).toBeNull();
    expect(result.current.error).toContain('Permissão negada');
    expect(result.current.loading).toBe(false);
  });

  it('deve limpar localização quando clearLocation é chamado', () => {
    const mockPosition = {
      coords: {
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 10,
      },
    } as GeolocationPosition;

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestPermission();
    });

    expect(result.current.coordinates).not.toBeNull();

    act(() => {
      result.current.clearLocation();
    });

    expect(result.current.coordinates).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('deve retornar erro quando geolocalização não é suportada', () => {
    const originalGeolocation = navigator.geolocation;
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestPermission();
    });

    expect(result.current.error).toContain('não é suportada');

    Object.defineProperty(navigator, 'geolocation', {
      value: originalGeolocation,
      writable: true,
    });
  });

  it('deve usar opções corretas ao chamar getCurrentPosition', () => {
    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.requestPermission();
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
});
