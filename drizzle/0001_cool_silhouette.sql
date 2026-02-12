CREATE TABLE `denuncias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`encrypted_data` longtext NOT NULL,
	`encryption_iv` varchar(32) NOT NULL,
	`encryption_tag` varchar(32) NOT NULL,
	`status` enum('novo','em_analise','resolvido','arquivado') NOT NULL DEFAULT 'novo',
	`tipo_violencia` varchar(50),
	`ip_hash` varchar(64),
	`user_agent_hash` varchar(64),
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`atualizado_em` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`data_expiracao` timestamp,
	`deletado` timestamp,
	CONSTRAINT `denuncias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `denuncias_audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`denuncia_id` int NOT NULL,
	`acao` enum('criada','visualizada','atualizada','deletada','descriptografada') NOT NULL,
	`usuario_id` int,
	`ip_hash` varchar(64),
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `denuncias_audit_log_id` PRIMARY KEY(`id`)
);
