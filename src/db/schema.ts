import { pgTable, uuid, text, timestamp, integer, date, pgEnum, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const transactionType = pgEnum("transaction_type", ["income", "expense"]);
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(), name: text("name").notNull(),
  type: transactionType("type").notNull(), icon: text("icon").notNull(), color: text("color").notNull(),
}, (t) => [uniqueIndex("categories_type_name_idx").on(t.type, t.name)]);
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(), userId: uuid("user_id").notNull(),
  categoryId: uuid("category_id").notNull().references(() => categories.id), type: transactionType("type").notNull(),
  description: text("description").notNull(), amount: integer("amount").notNull(), date: date("date").notNull(), notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("transactions_user_date_idx").on(t.userId, t.date), check("transactions_amount_positive", sql`${t.amount} > 0`)]);
