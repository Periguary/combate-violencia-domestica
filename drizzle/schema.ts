import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, longtext } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela para armazenar denúncias anônimas criptografadas
 * Todos os dados sensíveis são armazenados criptografados
 */
export const denuncias = mysqlTable("denuncias", {
  id: int("id").autoincrement().primaryKey(),
  
  // Dados criptografados (AES-256-GCM)
  encryptedData: longtext("encrypted_data").notNull(),
  encryptionIv: varchar("encryption_iv", { length: 32 }).notNull(),
  encryptionTag: varchar("encryption_tag", { length: 32 }).notNull(),
  
  // Metadados
  status: mysqlEnum("status", ["novo", "em_analise", "resolvido", "arquivado"]).default("novo").notNull(),
  tipoViolencia: varchar("tipo_violencia", { length: 50 }),
  
  // Rastreamento de segurança
  ipHash: varchar("ip_hash", { length: 64 }),
  userAgentHash: varchar("user_agent_hash", { length: 64 }),
  
  // Timestamps
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  dataExpiracao: timestamp("data_expiracao"),
  deletado: timestamp("deletado"),
});

export type Denuncia = typeof denuncias.$inferSelect;
export type InsertDenuncia = typeof denuncias.$inferInsert;

/**
 * Tabela para log de acessos às denúncias (auditoria)
 */
export const denunciasAuditLog = mysqlTable("denuncias_audit_log", {
  id: int("id").autoincrement().primaryKey(),
  denunciaId: int("denuncia_id").notNull(),
  acao: mysqlEnum("acao", ["criada", "visualizada", "atualizada", "deletada", "descriptografada"]).notNull(),
  usuarioId: int("usuario_id"),
  ipHash: varchar("ip_hash", { length: 64 }),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export type DenunciaAuditLog = typeof denunciasAuditLog.$inferSelect;
export type InsertDenunciaAuditLog = typeof denunciasAuditLog.$inferInsert;