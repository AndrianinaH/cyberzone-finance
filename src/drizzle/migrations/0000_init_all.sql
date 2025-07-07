CREATE TABLE `movements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` text NOT NULL,
	`currency` text NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`exchange_rate` decimal(10,2),
	`amount_mga` decimal(10,2) NOT NULL,
	`description` text NOT NULL,
	`date` timestamp NOT NULL,
	`author` text NOT NULL,
	`responsible` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `movements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_idx` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `movements` ADD CONSTRAINT `movements_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;