CREATE TABLE `outh_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`provider` enum('google','github') NOT NULL,
	`provider_account_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `outh_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `outh_accounts_provider_account_id_unique` UNIQUE(`provider_account_id`)
);
--> statement-breakpoint
ALTER TABLE `outh_accounts` ADD CONSTRAINT `outh_accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;