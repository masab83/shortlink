import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // "user" or "admin"
  isActive: boolean("is_active").default(true),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  pendingEarnings: decimal("pending_earnings", { precision: 10, scale: 2 }).default("0.00"),
  referralCode: varchar("referral_code").unique(),
  referredBy: varchar("referred_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// URL Links table
export const links = pgTable("links", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  originalUrl: text("original_url").notNull(),
  shortCode: varchar("short_code", { length: 8 }).unique().notNull(),
  title: varchar("title"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  totalViews: integer("total_views").default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Link Analytics table
export const linkAnalytics = pgTable("link_analytics", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  linkId: uuid("link_id").references(() => links.id),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  country: varchar("country"),
  device: varchar("device"),
  referrer: text("referrer"),
  earnings: decimal("earnings", { precision: 10, scale: 2 }).default("0.00"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// CPM Rates table
export const cpmRates = pgTable("cpm_rates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  country: varchar("country").notNull(),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  device: varchar("device").default("all"), // "desktop", "mobile", "all"
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Withdrawals table
export const withdrawals = pgTable("withdrawals", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: varchar("method").notNull(), // "paypal", "payoneer", "bitcoin"
  details: jsonb("details"), // payment details
  status: varchar("status").default("pending"), // "pending", "approved", "rejected", "paid"
  adminNotes: text("admin_notes"),
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Referrals table
export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").references(() => users.id),
  referredId: varchar("referred_id").references(() => users.id),
  commission: decimal("commission", { precision: 10, scale: 2 }).default("0.00"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
  withdrawals: many(withdrawals),
  referralsGiven: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referred" }),
}));

export const linksRelations = relations(links, ({ one, many }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
  analytics: many(linkAnalytics),
}));

export const linkAnalyticsRelations = relations(linkAnalytics, ({ one }) => ({
  link: one(links, {
    fields: [linkAnalytics.linkId],
    references: [links.id],
  }),
}));

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  user: one(users, {
    fields: [withdrawals.userId],
    references: [users.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: "referrer",
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
    relationName: "referred",
  }),
}));

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertLink = typeof links.$inferInsert;
export type Link = typeof links.$inferSelect;

export type InsertLinkAnalytics = typeof linkAnalytics.$inferInsert;
export type LinkAnalytics = typeof linkAnalytics.$inferSelect;

export type InsertCpmRate = typeof cpmRates.$inferInsert;
export type CpmRate = typeof cpmRates.$inferSelect;

export type InsertWithdrawal = typeof withdrawals.$inferInsert;
export type Withdrawal = typeof withdrawals.$inferSelect;

export type InsertReferral = typeof referrals.$inferInsert;
export type Referral = typeof referrals.$inferSelect;

// Validation schemas
export const insertLinkSchema = createInsertSchema(links).pick({
  originalUrl: true,
  title: true,
  description: true,
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).pick({
  amount: true,
  method: true,
  details: true,
});

export const insertCpmRateSchema = createInsertSchema(cpmRates).pick({
  country: true,
  rate: true,
  device: true,
});
