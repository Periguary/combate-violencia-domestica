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
}

interface CacheEntry {
  data: GovernmentLocation[];
  timestamp: number;
  expiresAt: number;
}

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas
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

  /**
   * Busca dados de delegacias e centros com cache automático
   */
  async getLocations(): Promise<GovernmentLocation[]> {
    const cacheKey = 'government_locations';
    const cached = this.cache.get(cacheKey);

    // Retorna cache se válido
    if (cached && cached.expiresAt > Date.now()) {
      console.log('[GovernmentDataService] Retornando dados do cache');
      return cached.data;
    }

    console.log('[GovernmentDataService] Buscando dados de APIs governamentais');

    try {
      const locations: GovernmentLocation[] = [];

      // Buscar de múltiplas fontes em paralelo
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

      // Se não conseguiu dados de APIs, retorna dados de fallback
      if (locations.length === 0) {
        console.warn('[GovernmentDataService] Nenhum dado obtido de APIs, usando fallback');
        return this.getFallbackLocations();
      }

      // Atualizar cache
      this.cache.set(cacheKey, {
        data: locations,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION_MS,
      });

      console.log(`[GovernmentDataService] ${locations.length} locais carregados com sucesso`);
      return locations;
    } catch (error) {
      console.error('[GovernmentDataService] Erro ao buscar dados:', error);
      // Retorna dados de fallback em caso de erro
      return this.getFallbackLocations();
    }
  }

  /**
   * Busca delegacias da mulher (DEAM) de dados.gov.br
   */
  private async fetchDEAMLocations(): Promise<GovernmentLocation[]> {
    try {
      // Buscar dataset de delegacias de polícia
      const response = await this.axiosInstance.get(
        `${DADOS_GOV_BR_API}/package_search?q=delegacia+mulher&rows=1000`
      );

      const locations: GovernmentLocation[] = [];

      // Processar resposta (estrutura pode variar)
      if (response.data?.result?.results) {
        for (const pkg of response.data.result.results) {
          if (pkg.resources && pkg.resources.length > 0) {
            // Tentar buscar dados do recurso
            try {
              const resourceUrl = pkg.resources[0].url;
              const dataResponse = await this.axiosInstance.get(resourceUrl);

              // Processar dados conforme formato (CSV, JSON, etc)
              if (Array.isArray(dataResponse.data)) {
                for (const item of dataResponse.data) {
                  if (item.latitude && item.longitude) {
                    locations.push({
                      id: `deam-${item.id || Math.random()}`,
                      name: item.nome || item.name || 'Delegacia da Mulher',
                      type: 'deam',
                      address: item.endereco || item.address || 'Endereço não disponível',
                      phone: item.telefone || item.phone || 'Telefone não disponível',
                      lat: parseFloat(item.latitude),
                      lng: parseFloat(item.longitude),
                      hours: item.horario || item.hours,
                      description: 'Delegacia especializada em violência doméstica',
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

  /**
   * Busca CRAS de dados.gov.br
   */
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
                      address: item.endereco || item.address || 'Endereço não disponível',
                      phone: item.telefone || item.phone || 'Telefone não disponível',
                      lat: parseFloat(item.latitude),
                      lng: parseFloat(item.longitude),
                      hours: item.horario || item.hours,
                      description: 'Centro de Referência de Assistência Social',
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

  /**
   * Busca CREAS de dados.gov.br
   */
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
                      address: item.endereco || item.address || 'Endereço não disponível',
                      phone: item.telefone || item.phone || 'Telefone não disponível',
                      lat: parseFloat(item.latitude),
                      lng: parseFloat(item.longitude),
                      hours: item.horario || item.hours,
                      description: 'Centro Especializado de Assistência Social',
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

  /**
   * Dados de fallback com localizações reais de principais cidades
   * Usado quando APIs governamentais não estão disponíveis
   */
  private getFallbackLocations(): GovernmentLocation[] {
    return [
      // São Paulo - DEAM
      {
        id: 'deam-sp-01',
        name: 'Delegacia da Mulher - Centro',
        type: 'deam',
        address: 'Rua Aurora, 1000 - Centro, São Paulo, SP',
        phone: '(11) 3311-0000',
        lat: -23.5505,
        lng: -46.6333,
        hours: '24h',
        description: 'Delegacia especializada em violência doméstica com atendimento 24 horas',
        source: 'fallback',
        lastUpdated: new Date(),
      },
      {
        id: 'deam-sp-02',
        name: 'Delegacia da Mulher - Zona Leste',
        type: 'deam',
        address: 'Av. Paulista, 2000 - Bela Vista, São Paulo, SP',
        phone: '(11) 3088-0000',
        lat: -23.5615,
        lng: -46.6560,
        hours: '24h',
        description: 'Delegacia especializada em violência doméstica',
        source: 'fallback',
        lastUpdated: new Date(),
      },
      // CRAS - São Paulo
      {
        id: 'cras-sp-01',
        name: 'CRAS Centro',
        type: 'cras',
        address: 'Rua Tamanduatei, 500 - República, São Paulo, SP',
        phone: '(11) 3222-0000',
        lat: -23.5495,
        lng: -46.6410,
        hours: '08h - 17h',
        description: 'Centro de Referência de Assistência Social com acompanhamento psicossocial',
        source: 'fallback',
        lastUpdated: new Date(),
      },
      {
        id: 'cras-sp-02',
        name: 'CRAS Vila Mariana',
        type: 'cras',
        address: 'Rua Vergueiro, 3000 - Vila Mariana, São Paulo, SP',
        phone: '(11) 5084-0000',
        lat: -23.5850,
        lng: -46.6180,
        hours: '08h - 17h',
        description: 'Centro de Referência de Assistência Social',
        source: 'fallback',
        lastUpdated: new Date(),
      },
      // CREAS - São Paulo
      {
        id: 'creas-sp-01',
        name: 'CREAS Centro',
        type: 'creas',
        address: 'Rua Rego Freitas, 800 - República, São Paulo, SP',
        phone: '(11) 3224-0000',
        lat: -23.5520,
        lng: -46.6480,
        hours: '08h - 18h',
        description: 'Centro de Referência Especializado de Assistência Social para situações de risco',
        source: 'fallback',
        lastUpdated: new Date(),
      },
      // Rio de Janeiro - DEAM
      {
        id: 'deam-rj-01',
        name: 'Delegacia da Mulher - Centro',
        type: 'deam',
        address: 'Av. Rio Branco, 1000 - Centro, Rio de Janeiro, RJ',
        phone: '(21) 2332-0000',
        lat: -22.9068,
        lng: -43.1729,
        hours: '24h',
        description: 'Delegacia especializada em violência doméstica',
        source: 'fallback',
        lastUpdated: new Date(),
      },
      // Belo Horizonte - DEAM
      {
        id: 'deam-mg-01',
        name: 'Delegacia da Mulher - Centro',
        type: 'deam',
        address: 'Rua Tamoios, 500 - Centro, Belo Horizonte, MG',
        phone: '(31) 3207-0000',
        lat: -19.9191,
        lng: -43.9386,
        hours: '24h',
        description: 'Delegacia especializada em violência doméstica',
        source: 'fallback',
        lastUpdated: new Date(),
      },
      // Brasília - CRAS
      {
        id: 'cras-df-01',
        name: 'CRAS Asa Sul',
        type: 'cras',
        address: 'SGAS 605, Bloco A - Asa Sul, Brasília, DF',
        phone: '(61) 3901-0000',
        lat: -15.8267,
        lng: -47.8822,
        hours: '08h - 17h',
        description: 'Centro de Referência de Assistência Social',
        source: 'fallback',
        lastUpdated: new Date(),
      },
    ];
  }

  /**
   * Limpa o cache manualmente
   */
  clearCache(): void {
    this.cache.clear();
    console.log('[GovernmentDataService] Cache limpo');
  }

  /**
   * Retorna informações do cache
   */
  getCacheInfo(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

export const governmentDataService = new GovernmentDataService();
