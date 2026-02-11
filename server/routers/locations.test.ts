import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

// Mock context para testes
function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("locations router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createTestContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("getLocations", () => {
    it("deve retornar localizacoes sem filtro", async () => {
      const result = await caller.locations.getLocations({
        type: "all",
      });

      expect(result).toBeDefined();
      expect(result.locations).toBeDefined();
      expect(Array.isArray(result.locations)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      expect(result.filtered).toBe(false);
    });

    it("deve retornar localizacoes filtradas por DEAM", async () => {
      const result = await caller.locations.getLocations({
        type: "deam",
      });

      expect(result).toBeDefined();
      expect(result.locations).toBeDefined();
      expect(Array.isArray(result.locations)).toBe(true);
      expect(result.filtered).toBe(true);

      // Verificar se todas as localizacoes sao DEAM
      result.locations.forEach((loc) => {
        expect(loc.type).toBe("deam");
      });
    });

    it("deve retornar localizacoes filtradas por CRAS", async () => {
      const result = await caller.locations.getLocations({
        type: "cras",
      });

      expect(result).toBeDefined();
      expect(result.locations).toBeDefined();
      expect(Array.isArray(result.locations)).toBe(true);
      expect(result.filtered).toBe(true);

      // Verificar se todas as localizacoes sao CRAS
      result.locations.forEach((loc) => {
        expect(loc.type).toBe("cras");
      });
    });

    it("deve retornar localizacoes filtradas por CREAS", async () => {
      const result = await caller.locations.getLocations({
        type: "creas",
      });

      expect(result).toBeDefined();
      expect(result.locations).toBeDefined();
      expect(Array.isArray(result.locations)).toBe(true);
      expect(result.filtered).toBe(true);

      // Verificar se todas as localizacoes sao CREAS
      result.locations.forEach((loc) => {
        expect(loc.type).toBe("creas");
      });
    });

    it("deve retornar localizacoes com estrutura correta", async () => {
      const result = await caller.locations.getLocations({
        type: "all",
      });

      expect(result.locations.length).toBeGreaterThan(0);

      const location = result.locations[0];
      expect(location).toHaveProperty("id");
      expect(location).toHaveProperty("name");
      expect(location).toHaveProperty("type");
      expect(location).toHaveProperty("address");
      expect(location).toHaveProperty("phone");
      expect(location).toHaveProperty("lat");
      expect(location).toHaveProperty("lng");
      expect(location).toHaveProperty("description");

      // Validar tipos
      expect(typeof location.id).toBe("string");
      expect(typeof location.name).toBe("string");
      expect(typeof location.type).toBe("string");
      expect(typeof location.lat).toBe("number");
      expect(typeof location.lng).toBe("number");

      // Validar ranges
      expect(location.lat).toBeGreaterThanOrEqual(-90);
      expect(location.lat).toBeLessThanOrEqual(90);
      expect(location.lng).toBeGreaterThanOrEqual(-180);
      expect(location.lng).toBeLessThanOrEqual(180);
    });
  });

  describe("getNearby", () => {
    it("deve retornar localizacoes proximas a um ponto", async () => {
      const result = await caller.locations.getNearby({
        lat: -23.5505,
        lng: -46.6333,
        radiusKm: 50,
        type: "all",
      });

      expect(result).toBeDefined();
      expect(result.locations).toBeDefined();
      expect(Array.isArray(result.locations)).toBe(true);
      expect(result.center).toEqual({ lat: -23.5505, lng: -46.6333 });
      expect(result.radiusKm).toBe(50);
    });

    it("deve retornar localizacoes ordenadas por distancia", async () => {
      const result = await caller.locations.getNearby({
        lat: -23.5505,
        lng: -46.6333,
        radiusKm: 50,
        type: "all",
      });

      if (result.locations.length > 1) {
        // Verificar se esta ordenado por distancia
        for (let i = 0; i < result.locations.length - 1; i++) {
          const current = result.locations[i];
          const next = result.locations[i + 1];
          expect(current.distance).toBeLessThanOrEqual(next.distance);
        }
      }
    });

    it("deve respeitar o raio de busca", async () => {
      const radiusKm = 10;
      const result = await caller.locations.getNearby({
        lat: -23.5505,
        lng: -46.6333,
        radiusKm,
        type: "all",
      });

      // Todas as localizacoes devem estar dentro do raio
      result.locations.forEach((loc) => {
        expect(loc.distance).toBeLessThanOrEqual(radiusKm);
      });
    });

    it("deve validar coordenadas de entrada", async () => {
      // Latitude invalida (> 90)
      await expect(
        caller.locations.getNearby({
          lat: 91,
          lng: -46.6333,
          radiusKm: 10,
          type: "all",
        })
      ).rejects.toThrow();

      // Longitude invalida (> 180)
      await expect(
        caller.locations.getNearby({
          lat: -23.5505,
          lng: 181,
          radiusKm: 10,
          type: "all",
        })
      ).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("deve retornar uma localizacao por ID", async () => {
      // Primeiro, obter todas as localizacoes
      const allLocations = await caller.locations.getLocations({
        type: "all",
      });

      if (allLocations.locations.length > 0) {
        const firstLocation = allLocations.locations[0];
        const result = await caller.locations.getById({
          id: firstLocation.id,
        });

        expect(result).toBeDefined();
        expect(result.id).toBe(firstLocation.id);
        expect(result.name).toBe(firstLocation.name);
      }
    });

    it("deve lancar erro para ID invalido", async () => {
      await expect(
        caller.locations.getById({
          id: "id-inexistente-12345",
        })
      ).rejects.toThrow("Localização não encontrada");
    });
  });

  describe("getStats", () => {
    it("deve retornar estatisticas das localizacoes", async () => {
      const result = await caller.locations.getStats();

      expect(result).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
      expect(result.byType).toBeDefined();
      expect(result.byType.deam).toBeGreaterThanOrEqual(0);
      expect(result.byType.cras).toBeGreaterThanOrEqual(0);
      expect(result.byType.creas).toBeGreaterThanOrEqual(0);
      expect(result.bySource).toBeDefined();

      // Total deve ser a soma dos tipos
      const totalByType =
        result.byType.deam + result.byType.cras + result.byType.creas;
      expect(result.total).toBe(totalByType);
    });
  });

  describe("refreshCache", () => {
    it("deve atualizar o cache com sucesso", async () => {
      const result = await caller.locations.refreshCache();

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });

  describe("getCacheInfo", () => {
    it("deve retornar informacoes do cache", async () => {
      const result = await caller.locations.getCacheInfo();

      expect(result).toBeDefined();
      expect(result.size).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.entries)).toBe(true);
    });
  });
});
