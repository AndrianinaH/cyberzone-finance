CREATE TABLE `trosa` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`description` text NOT NULL,
	`montant_total` decimal(10,2) NOT NULL,
	`date_paiement` timestamp,
	`is_paid` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trosa_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trosa_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trosa_id` int NOT NULL,
	`montant` decimal(10,2) NOT NULL,
	`date_paiement` timestamp NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trosa_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `trosa` ADD CONSTRAINT `trosa_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trosa_payments` ADD CONSTRAINT `trosa_payments_trosa_id_trosa_id_fk` FOREIGN KEY (`trosa_id`) REFERENCES `trosa`(`id`) ON DELETE no action ON UPDATE no action;