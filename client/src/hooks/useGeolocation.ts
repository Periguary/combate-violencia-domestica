import { useState, useEffect, useCallback } from 'react';

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface UseGeolocationReturn {
  coordinates: GeolocationCoordinates | null;
  error: string | null;
  loading: boolean;
  requestPermission: () => void;
  clearLocation: () => void;
}

/**
 * Hook customizado para gerenciar geolocalização do navegador
 * Solicita permissão ao usuário e retorna coordenadas de latitude/longitude
 */
export function useGeolocation(): UseGeolocationReturn {
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setCoordinates({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
    setError(null);
    setLoading(false);
    console.log('[useGeolocation] Localização obtida com sucesso', {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Erro ao obter localização';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Permissão negada. Ative a localização nas configurações do navegador.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Localização não disponível. Tente novamente mais tarde.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Tempo limite excedido ao obter localização.';
        break;
    }

    setError(errorMessage);
    setLoading(false);
    console.warn('[useGeolocation] Erro ao obter localização:', errorMessage);
  }, []);

  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador');
      console.warn('[useGeolocation] Geolocalização não suportada');
      return;
    }

    setLoading(true);
    setError(null);

    // Usar getCurrentPosition com timeout de 10 segundos
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Não usar cache, sempre obter localização atual
      }
    );
  }, [handleSuccess, handleError]);

  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setError(null);
    setLoading(false);
  }, []);

  // Tentar obter localização automaticamente ao montar o componente
  useEffect(() => {
    // Verificar se o navegador suporta geolocalização
    if (!navigator.geolocation) {
      console.warn('[useGeolocation] Geolocalização não suportada');
      return;
    }

    // Verificar se já temos permissão armazenada em localStorage
    const hasLocationPermission = localStorage.getItem('geolocation_permission');

    if (hasLocationPermission === 'granted') {
      requestPermission();
    }
  }, []);

  return {
    coordinates,
    error,
    loading,
    requestPermission,
    clearLocation,
  };
}

/**
 * Hook para solicitar e gerenciar permissão de geolocalização com UI
 */
export function useGeolocationWithUI() {
  const [showPrompt, setShowPrompt] = useState(false);
  const geo = useGeolocation();

  const handleRequestPermission = () => {
    localStorage.setItem('geolocation_permission', 'granted');
    geo.requestPermission();
    setShowPrompt(false);
  };

  const handleDenyPermission = () => {
    localStorage.setItem('geolocation_permission', 'denied');
    setShowPrompt(false);
  };

  // Mostrar prompt se não temos localização e não foi negado
  useEffect(() => {
    if (!geo.coordinates && !geo.error && !geo.loading) {
      const permission = localStorage.getItem('geolocation_permission');
      if (permission !== 'denied') {
        setShowPrompt(true);
      }
    }
  }, [geo.coordinates, geo.error, geo.loading]);

  return {
    ...geo,
    showPrompt,
    handleRequestPermission,
    handleDenyPermission,
  };
}
