import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Disaster Reports table
export const disasterReports = sqliteTable('disaster_reports', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category: text('category').notNull(),
  severity: text('severity').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  locationName: text('location_name').notNull(),
  region: text('region').notNull(),
  photoUrl: text('photo_url'),
  photoUrls: text('photo_urls', { mode: 'json' }),
  reporterName: text('reporter_name').notNull(),
  reporterContact: text('reporter_contact').notNull(),
  status: text('status').notNull().default('Pending'),
  reportType: text('report_type').notNull().default('disaster'),
  verifiedBy: text('verified_by'),
  verifiedAt: text('verified_at'),
  affectedResidents: integer('affected_residents').default(0),
  urgentNeeds: text('urgent_needs'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Evacuation Centers table
export const evacuationCenters = sqliteTable('evacuation_centers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  disasterReportId: integer('disaster_report_id').references(() => disasterReports.id).notNull(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  capacity: integer('capacity').notNull(),
  currentOccupancy: integer('current_occupancy').default(0),
  contact: text('contact').notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  createdAt: text('created_at').notNull(),
});

// Infrastructure Status table
export const infrastructureStatus = sqliteTable('infrastructure_status', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  disasterReportId: integer('disaster_report_id').references(() => disasterReports.id).notNull(),
  infrastructureType: text('infrastructure_type').notNull(), // Road, Bridge, Hospital, School, Power, Water
  status: text('status').notNull(), // Operational, Damaged, Destroyed
  description: text('description').notNull(),
  createdAt: text('created_at').notNull(),
});

// Community Sentiments table
export const communitySentiments = sqliteTable('community_sentiments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  disasterReportId: integer('disaster_report_id').references(() => disasterReports.id).notNull(),
  sentiment: text('sentiment').notNull(), // Urgent, Concerned, Stable, Recovering
  comment: text('comment').notNull(),
  submittedBy: text('submitted_by').notNull(),
  createdAt: text('created_at').notNull(),
});