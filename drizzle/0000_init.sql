CREATE TABLE `attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`skill_id` text NOT NULL,
	`concept_id` integer,
	`vocab_card_id` integer,
	`session_id` integer,
	`exercise_type` text NOT NULL,
	`prompt` text,
	`user_answer` text,
	`expected_answer` text,
	`is_correct` integer,
	`score` real NOT NULL,
	`error_tag` text,
	`response_time_ms` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`concept_id`) REFERENCES `concepts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vocab_card_id`) REFERENCES `vocab_cards`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `study_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `attempts_concept_idx` ON `attempts` (`concept_id`);--> statement-breakpoint
CREATE INDEX `attempts_created_idx` ON `attempts` (`created_at`);--> statement-breakpoint
CREATE TABLE `concepts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`skill_id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`cefr_level` text NOT NULL,
	`domain` text DEFAULT 'general' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `concepts_slug_unique` ON `concepts` (`slug`);--> statement-breakpoint
CREATE TABLE `mastery` (
	`concept_id` integer PRIMARY KEY NOT NULL,
	`score` real DEFAULT 0 NOT NULL,
	`attempts_count` integer DEFAULT 0 NOT NULL,
	`correct_count` integer DEFAULT 0 NOT NULL,
	`last_practiced_at` integer,
	`next_review_at` integer,
	FOREIGN KEY (`concept_id`) REFERENCES `concepts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `study_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`planned_minutes` integer,
	`started_at` integer DEFAULT (unixepoch()) NOT NULL,
	`ended_at` integer
);
--> statement-breakpoint
CREATE TABLE `vocab_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`term` text NOT NULL,
	`definition` text NOT NULL,
	`example` text,
	`translation_fr` text,
	`domain` text DEFAULT 'general' NOT NULL,
	`concept_id` integer,
	`source` text,
	`ease_factor` real DEFAULT 2.5 NOT NULL,
	`interval_days` real DEFAULT 0 NOT NULL,
	`repetitions` integer DEFAULT 0 NOT NULL,
	`lapses` integer DEFAULT 0 NOT NULL,
	`due_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`concept_id`) REFERENCES `concepts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `vocab_cards_due_idx` ON `vocab_cards` (`due_at`);