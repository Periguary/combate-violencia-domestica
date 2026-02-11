import { AlertCircle, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GeolocationPromptProps {
  onAllow: () => void;
  onDeny: () => void;
  loading?: boolean;
}

/**
 * Componente que exibe um prompt pedindo permissão para usar geolocalização
 */
export function GeolocationPrompt({ onAllow, onDeny, loading = false }: GeolocationPromptProps) {
  return (
    <Card className="p-4 bg-primary/5 border-primary/30 mb-4">
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-primary mb-1">
            Encontrar serviços próximos
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Ative a localização para que possamos mostrar as delegacias e centros de assistência mais próximos de você.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onAllow}
              disabled={loading}
              className="h-8"
            >
              {loading ? 'Obtendo localização...' : 'Permitir'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDeny}
              disabled={loading}
              className="h-8"
            >
              Agora não
            </Button>
          </div>
        </div>
        <button
          onClick={onDeny}
          className="text-muted-foreground hover:text-foreground transition"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}

/**
 * Componente que exibe mensagem de erro de geolocalização
 */
export function GeolocationError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Card className="p-4 bg-destructive/10 border-destructive/30 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-destructive mb-1">
            Erro ao obter localização
          </h3>
          <p className="text-xs text-destructive/80 mb-3">
            {error}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="h-8"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Componente que exibe a localização atual do usuário
 */
export function GeolocationStatus({
  coordinates,
  onClear,
}: {
  coordinates: { latitude: number; longitude: number; accuracy: number };
  onClear: () => void;
}) {
  return (
    <Card className="p-4 bg-accent/10 border-accent/30 mb-4">
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-accent mb-1">
            Sua localização
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            Lat: {coordinates.latitude.toFixed(4)}, Lng: {coordinates.longitude.toFixed(4)}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Precisão: ±{Math.round(coordinates.accuracy)}m
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={onClear}
            className="h-8"
          >
            Limpar localização
          </Button>
        </div>
      </div>
    </Card>
  );
}
