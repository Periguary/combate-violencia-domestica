/**
 * Locations Router
 * Procedimentos tRPC para buscar dados de delegacias e centros de referência
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { governmentDataService } from '../services/governmentDataService';

export const locationsRouter = router({
  /**
   * Busca todas as localizações de delegacias e centros
   * Com filtro opcional por tipo
   */
  getLocations: publicProcedure
    .input(
      z.object({
        type: z.enum(['deam', 'cras', 'creas', 'all']).default('all'),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const allLocations = await governmentDataService.getLocations();

        // Filtrar por tipo se especificado
        if (input?.type && input.type !== 'all') {
          return {
            locations: allLocations.filter(loc => loc.type === input.type),
            total: allLocations.length,
            filtered: true,
            lastUpdate: new Date(),
          };
        }

        return {
          locations: allLocations,
          total: allLocations.length,
          filtered: false,
          lastUpdate: new Date(),
        };
      } catch (error) {
        console.error('[locationsRouter] Erro ao buscar localizações:', error);
        throw new Error('Erro ao buscar localizações');
      }
    }),

  /**
   * Busca localizações próximas a um ponto (latitude/longitude)
   * Retorna localizações dentro de um raio especificado em km
   */
  getNearby: publicProcedure
    .input(
      z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        radiusKm: z.number().min(1).max(100).default(10),
        type: z.enum(['deam', 'cras', 'creas', 'all']).default('all'),
      })
    )
    .query(async ({ input }) => {
      try {
        const allLocations = await governmentDataService.getLocations();

        // Calcular distância usando fórmula de Haversine
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371; // Raio da Terra em km
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        // Filtrar por tipo e distância
        const nearby = allLocations
          .filter(loc => (input.type === 'all' ? true : loc.type === input.type))
          .map(loc => ({
            ...loc,
            distance: calculateDistance(input.lat, input.lng, loc.lat, loc.lng),
          }))
          .filter(loc => loc.distance <= input.radiusKm)
          .sort((a, b) => a.distance - b.distance);

        return {
          locations: nearby,
          total: nearby.length,
          center: { lat: input.lat, lng: input.lng },
          radiusKm: input.radiusKm,
          lastUpdate: new Date(),
        };
      } catch (error) {
        console.error('[locationsRouter] Erro ao buscar localizações próximas:', error);
        throw new Error('Erro ao buscar localizações próximas');
      }
    }),

  /**
   * Busca uma localização específica por ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const allLocations = await governmentDataService.getLocations();
        const location = allLocations.find(loc => loc.id === input.id);

        if (!location) {
          throw new Error('Localização não encontrada');
        }

        return location;
      } catch (error) {
        console.error('[locationsRouter] Erro ao buscar localização:', error);
        throw new Error('Localização não encontrada');
      }
    }),

  /**
   * Retorna estatísticas sobre as localizações
   */
  getStats: publicProcedure.query(async () => {
    try {
      const allLocations = await governmentDataService.getLocations();

      const stats = {
        total: allLocations.length,
        byType: {
          deam: allLocations.filter(l => l.type === 'deam').length,
          cras: allLocations.filter(l => l.type === 'cras').length,
          creas: allLocations.filter(l => l.type === 'creas').length,
        },
        bySource: {} as Record<string, number>,
        lastUpdate: new Date(),
      };

      // Contar por fonte
      allLocations.forEach(loc => {
        stats.bySource[loc.source] = (stats.bySource[loc.source] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('[locationsRouter] Erro ao buscar estatísticas:', error);
      throw new Error('Erro ao buscar estatísticas');
    }
  }),

  /**
   * Força atualização do cache
   * Útil para sincronizar dados com APIs governamentais
   */
  refreshCache: publicProcedure.mutation(async () => {
    try {
      governmentDataService.clearCache();
      const locations = await governmentDataService.getLocations();

      return {
        success: true,
        message: `Cache atualizado com ${locations.length} localizações`,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('[locationsRouter] Erro ao atualizar cache:', error);
      throw new Error('Erro ao atualizar cache');
    }
  }),

  /**
   * Retorna informações sobre o cache
   */
  getCacheInfo: publicProcedure.query(() => {
    return governmentDataService.getCacheInfo();
  }),
});
