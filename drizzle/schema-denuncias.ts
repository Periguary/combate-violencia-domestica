import { int, mysqlTable, text, timestamp, varchar, longtext, mysqlEnum } from "drizzle-orm/mysql-core";

/**
 * Tabela para armazenar denúncias anônimas criptografadas
 * Todos os dados sensíveis são armazenados criptografados
 */
export const denuncias = mysqlTable("denuncias", {
  id: int("id").autoincrement().primaryKey(),
  
  // Dados criptografados (AES-256-GCM)
  encryptedData: longtext("encrypted_data").notNull(), // JSON criptografado com todos os dados da denúncia
  encryptionIv: varchar("encryption_iv", { length: 32 }).notNull(), // IV (Initialization Vector) para descriptografia
  encryptionTag: varchar("encryption_tag", { length: 32 }).notNull(), // Auth tag para verificação de integridade
  
  // Metadados (não criptografados, apenas para auditoria/filtros)
  status: mysqlEnum("status", ["novo", "em_analise", "resolvido", "arquivado"]).default("novo").notNull(),
  tipoViolencia: varchar("tipo_violencia", { length: 50 }), // deam, cras, creas, etc
  
  // Rastreamento de segurança
  ipHash: varchar("ip_hash", { length: 64 }), // Hash do IP (não armazena IP real)
  userAgentHash: varchar("user_agent_hash", { length: 64 }), // Hash do User Agent
  
  // Timestamps
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  
  // Retenção de dados
  dataExpiracao: timestamp("data_expiracao"), // Quando os dados devem ser deletados
  deletado: timestamp("deletado"), // Soft delete timestamp
});

export type Denuncia = typeof denuncias.$inferSelect;
export type InsertDenuncia = typeof denuncias.$inferInsert;

/**
 * Tabela para armazenar chaves de descriptografia (separada por segurança)
 * Nunca armazenar chaves com os dados criptografados
 */
export const decryptionKeys = mysqlTable("decryption_keys", {
  id: int("id").autoincrement().primaryKey(),
  
  // Referência à denúncia
  denunciaId: int("denuncia_id").notNull(),
  
  // Chave mestra criptografada (armazenada com uma chave diferente)
  encryptedKey: varchar("encrypted_key", { length: 512 }).notNull(),
  
  // Metadados
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
});

export type DecryptionKey = typeof decryptionKeys.$inferSelect;
export type InsertDecryptionKey = typeof decryptionKeys.$inferInsert;

/**
 * Tabela para log de acessos às denúncias (auditoria)
 */
export const denunciasAuditLog = mysqlTable("denuncias_audit_log", {
  id: int("id").autoincrement().primaryKey(),
  
  denunciaId: int("denuncia_id").notNull(),
  
  // Ação realizada
  acao: mysqlEnum("acao", ["criada", "visualizada", "atualizada", "deletada", "descriptografada"]).notNull(),
  
  // Quem fez (se aplicável)
  usuarioId: int("usuario_id"),
  
  // IP do acesso (hash)
  ipHash: varchar("ip_hash", { length: 64 }),
  
  // Timestamp
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export type DenunciaAuditLog = typeof denunciasAuditLog.$inferSelect;
export type InsertDenunciaAuditLog = typeof denunciasAuditLog.$inferInsert;
