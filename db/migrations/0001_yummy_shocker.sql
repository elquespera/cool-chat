CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`color` text DEFAULT 'blue' NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
