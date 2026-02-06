import { pgTable, text, timestamp, uuid, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: text("creator_id").notNull(),
  companyId: text("company_id").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const voiceProfiles = pgTable("voice_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: text("creator_id").notNull().unique(),
  fishVoiceId: text("fish_voice_id"),
  consentAccepted: boolean("consent_accepted").default(false).notNull(),
  toneProfile: text("tone_profile"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const audioSummaries = pgTable("audio_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id).notNull(),
  audioUrl: text("audio_url").notNull(),
  script: text("script").notNull(),
  duration: integer("duration"), // in seconds
  lengthType: text("length_type").notNull(), // 'short' | 'standard'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const broadcasts = pgTable("broadcasts", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id).notNull(),
  audioSummaryId: uuid("audio_summary_id").references(() => audioSummaries.id).notNull(),
  audienceType: text("audience_type").notNull(), // 'all' | 'product_scoped'
  productIds: jsonb("product_ids").$type<string[]>(),
  totalRecipients: integer("total_recipients").default(0),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  userId: text("user_id").primaryKey(),
  muteAll: boolean("mute_all").default(false).notNull(),
  mutedCreators: jsonb("muted_creators").$type<string[]>().default([]).notNull(),
  textOnly: boolean("text_only").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
