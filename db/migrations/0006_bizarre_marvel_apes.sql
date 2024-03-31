ALTER TABLE user ADD `status` text DEFAULT 'offline' NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` DROP COLUMN `status`;