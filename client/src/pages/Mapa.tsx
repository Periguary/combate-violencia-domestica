import { useEffect, useState } from "react";
import { MapPin, Phone, MapIcon, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MapView from "@/components/Map";

/**
 * Mapa Interativo - Delegacias da Mulher e Centros de Referencia
 * Design: Institutional Minimalism with Purpose
 * Color Palette: Deep Blue (#1e3a8a) + Soft Beige (#f5f1e8) + Soft Red (#dc2626)
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
}

// Dados de exemplo com localizacoes reais de algumas cidades brasileiras
const LOCATIONS: MapLocation[] = [
  // Sao Paulo - DEAM
  {
    id: "deam-sp-01",
    name: "Delegacia da Mulher - Centro",
    type: "deam",
    address: "Rua Aurora, 1000 - Centro, Sao Paulo, SP",
    phone: "(11) 3311-0000",
    lat: -23.5505,
    lng: -46.6333,
    hours: "24h",
    description: "Delegacia especializada em violencia domestica com atendimento 24 horas"
  },
  {
    id: "deam-sp-02",
    name: "Delegacia da Mulher - Zona Leste",
    type: "deam",
    address: "Av. Paulista, 2000 - Bela Vista, Sao Paulo, SP",
    phone: "(11) 3088-0000",
    lat: -23.5615,
    lng: -46.6560,
    hours: "24h",
    description: "Delegacia especializada em violencia domestica"
  },
  // CRAS - Sao Paulo
  {
    id: "cras-sp-01",
    name: "CRAS Centro",
    type: "cras",
    address: "Rua Tamanduatei, 500 - Republica, Sao Paulo, SP",
    phone: "(11) 3222-0000",
    lat: -23.5495,
    lng: -46.6410,
    hours: "08h - 17h",
    description: "Centro de Referencia de Assistencia Social com acompanhamento psicossocial"
  },
  {
    id: "cras-sp-02",
    name: "CRAS Vila Mariana",
    type: "cras",
    address: "Rua Vergueiro, 3000 - Vila Mariana, Sao Paulo, SP",
    phone: "(11) 5084-0000",
    lat: -23.5850,
    lng: -46.6180,
    hours: "08h - 17h",
    description: "Centro de Referencia de Assistencia Social"
  },
  // CREAS - Sao Paulo
  {
    id: "creas-sp-01",
    name: "CREAS Centro",
    type: "creas",
    address: "Rua Rego Freitas, 800 - Republica, Sao Paulo, SP",
    phone: "(11) 3224-0000",
    lat: -23.5520,
    lng: -46.6480,
    hours: "08h - 18h",
    description: "Centro de Referencia Especializado de Assistencia Social para situacoes de risco"
  },
  // Rio de Janeiro - DEAM
  {
    id: "deam-rj-01",
    name: "Delegacia da Mulher - Centro",
    type: "deam",
    address: "Av. Rio Branco, 1000 - Centro, Rio de Janeiro, RJ",
    phone: "(21) 2332-0000",
    lat: -22.9068,
    lng: -43.1729,
    hours: "24h",
    description: "Delegacia especializada em violencia domestica"
  },
  // Belo Horizonte - DEAM
  {
    id: "deam-mg-01",
    name: "Delegacia da Mulher - Centro",
    type: "deam",
    address: "Rua Tamoios, 500 - Centro, Belo Horizonte, MG",
    phone: "(31) 3207-0000",
    lat: -19.9191,
    lng: -43.9386,
    hours: "24h",
    description: "Delegacia especializada em violencia domestica"
  },
  // Brasilia - CRAS
  {
    id: "cras-df-01",
    name: "CRAS Asa Sul",
    type: "cras",
    address: "SGAS 605, Bloco A - Asa Sul, Brasilia, DF",
    phone: "(61) 3901-0000",
    lat: -15.8267,
    lng: -47.8822,
    hours: "08h - 17h",
    description: "Centro de Referencia de Assistencia Social"
  }
];

export default function Mapa() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [filterType, setFilterType] = useState<"all" | "deam" | "cras" | "creas">("all");
  const [mapReady, setMapReady] = useState(false);

  const filteredLocations = filterType === "all" 
    ? LOCATIONS 
    : LOCATIONS.filter(loc => loc.type === filterType);

  const getTypeLabel = (type: string) => {
    switch(type) {
      case "deam": return "Delegacia da Mulher";
      case "cras": return "CRAS";
      case "creas": return "CREAS";
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "deam": return "bg-destructive/20 border-destructive text-destructive";
      case "cras": return "bg-accent/20 border-accent text-accent";
      case "creas": return "bg-primary/20 border-primary text-primary";
      default: return "bg-muted";
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
            Localize as delegacias da mulher (DEAM), centros de assistencia social (CRAS) e centros especializados (CREAS) mais proximos de voce.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b border-border py-6">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              className="rounded-full"
            >
              Todos ({LOCATIONS.length})
            </Button>
            <Button 
              variant={filterType === "deam" ? "default" : "outline"}
              onClick={() => setFilterType("deam")}
              className="rounded-full"
            >
              Delegacias da Mulher ({LOCATIONS.filter(l => l.type === "deam").length})
            </Button>
            <Button 
              variant={filterType === "cras" ? "default" : "outline"}
              onClick={() => setFilterType("cras")}
              className="rounded-full"
            >
              CRAS ({LOCATIONS.filter(l => l.type === "cras").length})
            </Button>
            <Button 
              variant={filterType === "creas" ? "default" : "outline"}
              onClick={() => setFilterType("creas")}
              className="rounded-full"
            >
              CREAS ({LOCATIONS.filter(l => l.type === "creas").length})
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
              <Card className="p-0 overflow-hidden h-96 lg:h-[600px] shadow-lg">
                <MapView 
                  onMapReady={() => setMapReady(true)}
                  locations={filteredLocations}
                  selectedLocation={selectedLocation}
                  onLocationSelect={setSelectedLocation}
                />
              </Card>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Clique nos marcadores do mapa para ver detalhes. Use o zoom para explorar diferentes areas.</p>
              </div>
            </div>

            {/* Sidebar - Locations List */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary">
                  {filteredLocations.length} Servico(s) Encontrado(s)
                </h3>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredLocations.map((location) => (
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
                        <div className={`px-2 py-1 rounded text-xs font-bold ${getTypeColor(location.type)}`}>
                          {getTypeLabel(location.type)}
                        </div>
                      </div>
                      <h4 className="font-bold text-primary mt-2 text-sm">{location.name}</h4>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{location.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <a href={`tel:${location.phone}`} className="hover:text-primary">
                            {location.phone}
                          </a>
                        </div>
                        {location.hours && (
                          <div className="text-xs">
                            <strong>Horario:</strong> {location.hours}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-l-4 border-l-destructive">
              <h3 className="font-bold text-primary mb-2">Delegacia da Mulher (DEAM)</h3>
              <p className="text-sm text-muted-foreground">
                Unidades especializadas em violencia domestica e familiar. Registram ocorrencias e oferecem atendimento especializado.
              </p>
            </Card>
            <Card className="p-6 border-l-4 border-l-accent">
              <h3 className="font-bold text-primary mb-2">CRAS</h3>
              <p className="text-sm text-muted-foreground">
                Centro de Referencia de Assistencia Social. Oferece acompanhamento psicossocial, orientacao e apoio integral a vitimas.
              </p>
            </Card>
            <Card className="p-6 border-l-4 border-l-primary">
              <h3 className="font-bold text-primary mb-2">CREAS</h3>
              <p className="text-sm text-muted-foreground">
                Centro Especializado de Assistencia Social. Atende situacoes de risco e violacao de direitos com acompanhamento intensivo.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Alert */}
      <section className="bg-destructive/10 border-l-4 border-destructive py-6">
        <div className="container flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-destructive mb-2">Em Situacao de Emergencia?</h3>
            <p className="text-sm mb-3">
              Se voce esta em perigo imediato, ligue para a Policia Militar (190) ou procure uma delegacia mais proxima.
            </p>
            <p className="text-sm">
              <strong>Ligue 180:</strong> Central de Atendimento a Mulher (24h, gratuito e confidencial)
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <MapIcon className="w-5 h-5" />
                Mapa de Servicos
              </h3>
              <p className="text-sm opacity-90">
                Localize delegacias, centros de assistencia e servicos de protecao proximos de voce.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contatos Rapidos</h4>
              <ul className="text-sm space-y-2 opacity-90">
                <li>Ligue 180 (24h)</li>
                <li>Disque 190 (Emergencias)</li>
                <li>CRAS/CREAS (Assistencia)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Navegacao</h4>
              <ul className="text-sm space-y-2 opacity-90">
                <li>
                  <a href="/" className="hover:underline">
                    Voltar ao Inicio
                  </a>
                </li>
                <li>
                  <a href="/#tipos" className="hover:underline">
                    Tipos de Violencia
                  </a>
                </li>
                <li>
                  <a href="/#denunciar" className="hover:underline">
                    Como Denunciar
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm opacity-75">
            <p>© 2026 Combate a Violencia Domestica. Todos os direitos reservados.</p>
            <p className="mt-2">Desenvolvido como Projeto de Ensino Extensionista | Prazo Final: 31/12/2028</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
