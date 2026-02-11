import { useState, useEffect } from "react";
import { MapPin, Phone, MapIcon, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MapView from "@/components/Map";
import { trpc } from "@/lib/trpc";

/**
 * Mapa Interativo - Delegacias da Mulher e Centros de Referencia
 * Integrado com APIs governamentais para dados atualizados
 * Design: Institutional Minimalism with Purpose
 */

interface MapLocation {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  hours?: string;
  description: string;
  source?: string;
  lastUpdated?: Date;
}

export default function Mapa() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [filterType, setFilterType] = useState<"all" | "deam" | "cras" | "creas">("all");
  const [mapReady, setMapReady] = useState(false);

  // Buscar dados de localizações da API
  const { data: locationsData, isLoading, error, refetch } = trpc.locations.getLocations.useQuery({
    type: filterType === "all" ? "all" : filterType,
  });

  const locations = locationsData?.locations || [];
  const filteredLocations = locations;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "deam":
        return "Delegacia da Mulher";
      case "cras":
        return "CRAS";
      case "creas":
        return "CREAS";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deam":
        return "bg-destructive/20 border-destructive text-destructive";
      case "cras":
        return "bg-accent/20 border-accent text-accent";
      case "creas":
        return "bg-primary/20 border-primary text-primary";
      default:
        return "bg-muted";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deam":
        return "🚔";
      case "cras":
        return "🏥";
      case "creas":
        return "🛡️";
      default:
        return "📍";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Mapa de Servicos</h1>
          </div>
          <div className="hidden md:flex gap-6">
            <a href="/" className="text-sm font-medium hover:text-primary transition">
              Voltar ao Inicio
            </a>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="bg-primary text-white py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4">Encontre Delegacias e Centros de Referencia</h2>
          <p className="text-lg opacity-90 max-w-2xl">
            Localize as delegacias da mulher (DEAM), centros de assistencia social (CRAS) e centros especializados (CREAS) mais proximos de voce. Dados atualizados de fontes governamentais.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b border-border py-6">
        <div className="container">
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              className="rounded-full"
            >
              Todos ({locations.length})
            </Button>
            <Button
              variant={filterType === "deam" ? "default" : "outline"}
              onClick={() => setFilterType("deam")}
              className="rounded-full"
            >
              Delegacias ({locations.filter((l) => l.type === "deam").length})
            </Button>
            <Button
              variant={filterType === "cras" ? "default" : "outline"}
              onClick={() => setFilterType("cras")}
              className="rounded-full"
            >
              CRAS ({locations.filter((l) => l.type === "cras").length})
            </Button>
            <Button
              variant={filterType === "creas" ? "default" : "outline"}
              onClick={() => setFilterType("creas")}
              className="rounded-full"
            >
              CREAS ({locations.filter((l) => l.type === "creas").length})
            </Button>

            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="ml-auto"
              title="Atualizar dados das APIs governamentais"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="p-0 overflow-hidden h-96 lg:h-[600px] shadow-lg relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Carregando dados...</p>
                    </div>
                  </div>
                ) : null}
                <MapView
                  onMapReady={() => setMapReady(true)}
                  locations={filteredLocations}
                  selectedLocation={selectedLocation}
                  onLocationSelect={setSelectedLocation}
                />
              </Card>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Clique nos marcadores do mapa para ver detalhes. Use o zoom para explorar diferentes areas.</p>
                {locationsData?.lastUpdate && (
                  <p className="mt-2 text-xs">
                    Ultima atualizacao: {new Date(locationsData.lastUpdate).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar - Locations List */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Carregando...
                    </span>
                  ) : (
                    `${filteredLocations.length} Servico(s) Encontrado(s)`
                  )}
                </h3>

                {error && (
                  <Card className="p-4 bg-destructive/10 border-destructive/50">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-destructive">Erro ao carregar dados</p>
                        <p className="text-xs text-destructive/80 mt-1">
                          {error.message || "Tente novamente mais tarde"}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredLocations.length === 0 && !isLoading ? (
                    <Card className="p-4 text-center text-muted-foreground">
                      <p>Nenhum servico encontrado para o filtro selecionado.</p>
                    </Card>
                  ) : (
                    filteredLocations.map((location) => (
                      <Card
                        key={location.id}
                        className={`p-4 cursor-pointer transition border-l-4 ${
                          selectedLocation?.id === location.id
                            ? "border-l-primary bg-primary/5 shadow-md"
                            : "border-l-muted hover:shadow-md"
                        }`}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getTypeIcon(location.type)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{location.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{getTypeLabel(location.type)}</p>

                            {location.phone && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-foreground">
                                <Phone className="w-3 h-3" />
                                <a href={`tel:${location.phone}`} className="hover:text-primary">
                                  {location.phone}
                                </a>
                              </div>
                            )}

                            {location.hours && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <span className="font-medium">Horario:</span> {location.hours}
                              </p>
                            )}

                            {location.source && location.source !== "fallback" && (
                              <p className="text-xs text-primary/60 mt-1">
                                Fonte: {location.source}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-primary/5 border-t border-border py-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-primary mb-2">Delegacias da Mulher (DEAM)</h3>
              <p className="text-sm text-muted-foreground">
                Especializadas em atender mulheres vitimas de violencia domestica. Funcionam 24 horas.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">CRAS</h3>
              <p className="text-sm text-muted-foreground">
                Centro de Referencia de Assistencia Social oferece acompanhamento psicossocial e orientacoes.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-2">CREAS</h3>
              <p className="text-sm text-muted-foreground">
                Centro Especializado para situacoes de risco e violacoes de direitos. Atendimento especializado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
