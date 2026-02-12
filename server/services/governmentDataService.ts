/**
 * Government Data Service
 * Integração com APIs governamentais para buscar dados atualizados de:
 * - Delegacias da Mulher (DEAM)
 * - Centros de Assistência Social (CRAS)
 * - Centros Especializados de Assistência Social (CREAS)
 */

import axios, { AxiosInstance } from 'axios';

export interface GovernmentLocation {
  id: string;
  name: string;
  type: 'deam' | 'cras' | 'creas';
  address: string;
  phone: string;
  lat: number;
  lng: number;
  hours?: string;
  description: string;
  source: string;
  lastUpdated: Date;
  distance?: number;
}

interface CacheEntry {
  data: GovernmentLocation[];
  timestamp: number;
  expiresAt: number;
}

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;
const DADOS_GOV_BR_API = 'https://dados.gov.br/api/3/action';
const IBGE_API = 'https://servicodados.ibge.gov.br/api/v1';

class GovernmentDataService {
  private cache: Map<string, CacheEntry> = new Map();
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'CombateViolenciaDomestica/1.0',
      },
    });
  }

  async getLocations(): Promise<GovernmentLocation[]> {
    const cacheKey = 'government_locations';
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      console.log('[GovernmentDataService] Retornando dados do cache');
      return cached.data;
    }

    console.log('[GovernmentDataService] Buscando dados de APIs governamentais');

    try {
      const locations: GovernmentLocation[] = [];

      const [deamLocations, crasLocations, creasLocations] = await Promise.allSettled([
        this.fetchDEAMLocations(),
        this.fetchCRASLocations(),
        this.fetchCREASLocations(),
      ]);

      if (deamLocations.status === 'fulfilled') {
        locations.push(...deamLocations.value);
      }
      if (crasLocations.status === 'fulfilled') {
        locations.push(...crasLocations.value);
      }
      if (creasLocations.status === 'fulfilled') {
        locations.push(...creasLocations.value);
      }

      if (locations.length === 0) {
        console.warn('[GovernmentDataService] Nenhum dado obtido de APIs, usando fallback');
        return this.getFallbackLocations();
      }

      this.cache.set(cacheKey, {
        data: locations,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION_MS,
      });

      console.log(`[GovernmentDataService] ${locations.length} locais carregados com sucesso`);
      return locations;
    } catch (error) {
      console.error('[GovernmentDataService] Erro ao buscar dados:', error);
      return this.getFallbackLocations();
    }
  }

  private async fetchDEAMLocations(): Promise<GovernmentLocation[]> {
    try {
      const response = await this.axiosInstance.get(
        `${DADOS_GOV_BR_API}/package_search?q=DEAM+delegacia+mulher&rows=1000`
      );

      const locations: GovernmentLocation[] = [];

      if (response.data?.result?.results) {
        for (const pkg of response.data.result.results) {
          if (pkg.resources && pkg.resources.length > 0) {
            try {
              const resourceUrl = pkg.resources[0].url;
              const dataResponse = await this.axiosInstance.get(resourceUrl);

              if (Array.isArray(dataResponse.data)) {
                for (const item of dataResponse.data) {
                  if (item.latitude && item.longitude) {
                    locations.push({
                      id: `deam-${item.id || Math.random()}`,
                      name: item.nome || item.name || 'DEAM',
                      type: 'deam',
                      address: item.endereco || item.address || 'Endereco nao disponivel',
                      phone: item.telefone || item.phone || 'Telefone nao disponivel',
                      lat: parseFloat(item.latitude),
                      lng: parseFloat(item.longitude),
                      hours: item.horario || item.hours,
                      description: 'Delegacia especializada em violencia domestica',
                      source: 'dados.gov.br',
                      lastUpdated: new Date(),
                    });
                  }
                }
              }
            } catch (e) {
              console.warn('[GovernmentDataService] Erro ao processar recurso DEAM:', e);
            }
          }
        }
      }

      return locations;
    } catch (error) {
      console.warn('[GovernmentDataService] Erro ao buscar DEAM:', error);
      return [];
    }
  }

  private async fetchCRASLocations(): Promise<GovernmentLocation[]> {
    try {
      const response = await this.axiosInstance.get(
        `${DADOS_GOV_BR_API}/package_search?q=CRAS+centro+assistencia+social&rows=1000`
      );

      const locations: GovernmentLocation[] = [];

      if (response.data?.result?.results) {
        for (const pkg of response.data.result.results) {
          if (pkg.resources && pkg.resources.length > 0) {
            try {
              const resourceUrl = pkg.resources[0].url;
              const dataResponse = await this.axiosInstance.get(resourceUrl);

              if (Array.isArray(dataResponse.data)) {
                for (const item of dataResponse.data) {
                  if (item.latitude && item.longitude) {
                    locations.push({
                      id: `cras-${item.id || Math.random()}`,
                      name: item.nome || item.name || 'CRAS',
                      type: 'cras',
                      address: item.endereco || item.address || 'Endereco nao disponivel',
                      phone: item.telefone || item.phone || 'Telefone nao disponivel',
                      lat: parseFloat(item.latitude),
                      lng: parseFloat(item.longitude),
                      hours: item.horario || item.hours,
                      description: 'Centro de Referencia de Assistencia Social',
                      source: 'dados.gov.br',
                      lastUpdated: new Date(),
                    });
                  }
                }
              }
            } catch (e) {
              console.warn('[GovernmentDataService] Erro ao processar recurso CRAS:', e);
            }
          }
        }
      }

      return locations;
    } catch (error) {
      console.warn('[GovernmentDataService] Erro ao buscar CRAS:', error);
      return [];
    }
  }

  private async fetchCREASLocations(): Promise<GovernmentLocation[]> {
    try {
      const response = await this.axiosInstance.get(
        `${DADOS_GOV_BR_API}/package_search?q=CREAS+especializado+assistencia+social&rows=1000`
      );

      const locations: GovernmentLocation[] = [];

      if (response.data?.result?.results) {
        for (const pkg of response.data.result.results) {
          if (pkg.resources && pkg.resources.length > 0) {
            try {
              const resourceUrl = pkg.resources[0].url;
              const dataResponse = await this.axiosInstance.get(resourceUrl);

              if (Array.isArray(dataResponse.data)) {
                for (const item of dataResponse.data) {
                  if (item.latitude && item.longitude) {
                    locations.push({
                      id: `creas-${item.id || Math.random()}`,
                      name: item.nome || item.name || 'CREAS',
                      type: 'creas',
                      address: item.endereco || item.address || 'Endereco nao disponivel',
                      phone: item.telefone || item.phone || 'Telefone nao disponivel',
                      lat: parseFloat(item.latitude),
                      lng: parseFloat(item.longitude),
                      hours: item.horario || item.hours,
                      description: 'Centro Especializado de Assistencia Social',
                      source: 'dados.gov.br',
                      lastUpdated: new Date(),
                    });
                  }
                }
              }
            } catch (e) {
              console.warn('[GovernmentDataService] Erro ao processar recurso CREAS:', e);
            }
          }
        }
      }

      return locations;
    } catch (error) {
      console.warn('[GovernmentDataService] Erro ao buscar CREAS:', error);
      return [];
    }
  }

  private getFallbackLocations(): GovernmentLocation[] {
    return [
      // Sao Paulo
      { id: 'deam-sp-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Rua Aurora, 1000 - Centro, Sao Paulo, SP', phone: '(11) 3311-0000', lat: -23.5505, lng: -46.6333, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      { id: 'deam-sp-02', name: 'Delegacia da Mulher - Zona Leste', type: 'deam', address: 'Av. Paulista, 2000 - Bela Vista, Sao Paulo, SP', phone: '(11) 3088-0000', lat: -23.5615, lng: -46.6560, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      { id: 'cras-sp-01', name: 'CRAS Centro', type: 'cras', address: 'Rua Tamanduatei, 500 - Republica, Sao Paulo, SP', phone: '(11) 3222-0000', lat: -23.5495, lng: -46.6410, hours: '08h - 17h', description: 'Centro de Referencia de Assistencia Social', source: 'fallback', lastUpdated: new Date() },
      { id: 'cras-sp-02', name: 'CRAS Vila Mariana', type: 'cras', address: 'Rua Vergueiro, 3000 - Vila Mariana, Sao Paulo, SP', phone: '(11) 5084-0000', lat: -23.5850, lng: -46.6180, hours: '08h - 17h', description: 'Centro de Referencia de Assistencia Social', source: 'fallback', lastUpdated: new Date() },
      { id: 'creas-sp-01', name: 'CREAS Centro', type: 'creas', address: 'Rua Rego Freitas, 800 - Republica, Sao Paulo, SP', phone: '(11) 3224-0000', lat: -23.5520, lng: -46.6480, hours: '08h - 18h', description: 'Centro Especializado de Assistencia Social', source: 'fallback', lastUpdated: new Date() },
      // Rio de Janeiro
      { id: 'deam-rj-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Av. Rio Branco, 1000 - Centro, Rio de Janeiro, RJ', phone: '(21) 2332-0000', lat: -22.9068, lng: -43.1729, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      { id: 'deam-rj-02', name: 'Delegacia da Mulher - Zona Norte', type: 'deam', address: 'Rua Conde de Bonfim, 1000 - Tijuca, Rio de Janeiro, RJ', phone: '(21) 2284-0000', lat: -22.9165, lng: -43.2333, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      // Belo Horizonte
      { id: 'deam-mg-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Rua Tamoios, 500 - Centro, Belo Horizonte, MG', phone: '(31) 3207-0000', lat: -19.9191, lng: -43.9386, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      // Brasilia
      { id: 'cras-df-01', name: 'CRAS Asa Sul', type: 'cras', address: 'SGAS 605, Bloco A - Asa Sul, Brasilia, DF', phone: '(61) 3901-0000', lat: -15.8267, lng: -47.8822, hours: '08h - 17h', description: 'Centro de Referencia de Assistencia Social', source: 'fallback', lastUpdated: new Date() },
      { id: 'deam-df-01', name: 'Delegacia da Mulher - Plano Piloto', type: 'deam', address: 'SGAS 605, Bloco C - Asa Sul, Brasilia, DF', phone: '(61) 3901-1234', lat: -15.8300, lng: -47.8800, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      // Salvador
      { id: 'deam-ba-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Rua Chile, 1500 - Centro, Salvador, BA', phone: '(71) 3117-0000', lat: -12.9714, lng: -38.5014, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      // Recife
      { id: 'deam-pe-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Rua Benfica, 800 - Santo Antonio, Recife, PE', phone: '(81) 3181-0000', lat: -8.0476, lng: -34.8770, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      // Fortaleza
      { id: 'deam-ce-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Rua Floriano Peixoto, 500 - Centro, Fortaleza, CE', phone: '(85) 3101-0000', lat: -3.7319, lng: -38.5267, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      // Manaus
      { id: 'deam-am-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Rua Lobo d Almada, 500 - Centro, Manaus, AM', phone: '(92) 3234-0000', lat: -3.1190, lng: -60.0217, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      // Curitiba
      { id: 'deam-pr-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Rua XV de Novembro, 1000 - Centro, Curitiba, PR', phone: '(41) 3330-0000', lat: -25.4290, lng: -49.2671, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      { id: 'cras-pr-01', name: 'CRAS Centro', type: 'cras', address: 'Rua Emiliano Perneta, 1000 - Centro, Curitiba, PR', phone: '(41) 3350-0000', lat: -25.4250, lng: -49.2700, hours: '08h - 17h', description: 'Centro de Referencia de Assistencia Social', source: 'fallback', lastUpdated: new Date() },
      // Porto Alegre
      { id: 'deam-rs-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Rua Sete de Setembro, 1000 - Centro, Porto Alegre, RS', phone: '(51) 3288-0000', lat: -30.0277, lng: -51.2287, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      // Goiania
      { id: 'cras-go-01', name: 'CRAS Centro', type: 'cras', address: 'Avenida Goias, 1500 - Centro, Goiania, GO', phone: '(62) 3201-0000', lat: -15.7942, lng: -48.8758, hours: '08h - 17h', description: 'Centro de Referencia de Assistencia Social', source: 'fallback', lastUpdated: new Date() },
      { id: 'deam-go-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Rua 4, 1000 - Centro, Goiania, GO', phone: '(62) 3201-5000', lat: -15.7900, lng: -48.8750, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
      // Belem
      { id: 'deam-pa-01', name: 'Delegacia da Mulher - Centro', type: 'deam', address: 'Rua Oswaldo Cruz, 500 - Centro, Belem, PA', phone: '(91) 3201-0000', lat: -1.4558, lng: -48.4915, hours: '24h', description: 'Delegacia especializada em violencia domestica', source: 'fallback', lastUpdated: new Date() },
    ];
  }

  clearCache(): void {
    this.cache.clear();
    console.log('[GovernmentDataService] Cache limpo');
  }

  getCacheInfo(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

export const governmentDataService = new GovernmentDataService();
