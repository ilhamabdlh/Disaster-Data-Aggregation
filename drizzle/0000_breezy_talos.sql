CREATE TABLE `community_sentiments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`disaster_report_id` integer NOT NULL,
	`sentiment` text NOT NULL,
	`comment` text NOT NULL,
	`submitted_by` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`disaster_report_id`) REFERENCES `disaster_reports`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `disaster_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category` text NOT NULL,
	`severity` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`location_name` text NOT NULL,
	`region` text NOT NULL,
	`photo_url` text,
	`reporter_name` text NOT NULL,
	`reporter_contact` text NOT NULL,
	`status` text DEFAULT 'Pending' NOT NULL,
	`verified_by` text,
	`verified_at` text,
	`affected_residents` integer DEFAULT 0,
	`urgent_needs` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `evacuation_centers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`disaster_report_id` integer NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`capacity` integer NOT NULL,
	`current_occupancy` integer DEFAULT 0,
	`contact` text NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`disaster_report_id`) REFERENCES `disaster_reports`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `infrastructure_status` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`disaster_report_id` integer NOT NULL,
	`infrastructure_type` text NOT NULL,
	`status` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`disaster_report_id`) REFERENCES `disaster_reports`(`id`) ON UPDATE no action ON DELETE no action
);
