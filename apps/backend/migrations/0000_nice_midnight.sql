CREATE TABLE IF NOT EXISTS `user_sessions` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(24) NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `users` (
	`id` text(24) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255),
	`username` text(255) NOT NULL,
	`password` text(255) NOT NULL,
	`avatar_url` text(255)
);
