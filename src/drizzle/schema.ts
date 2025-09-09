import {
  mysqlTable,
  int,
  text,
  timestamp,
  uniqueIndex,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const users = mysqlTable(
  "users",
  {
    id: int("id").primaryKey().autoincrement(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  },
);

export const usersRelations = relations(users, ({ many }) => ({
  movements: many(movements),
  trosa: many(trosa),
}));

export const movements = mysqlTable("movements", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id),

  // Replacing ENUMs with TEXT + manual constraints (enforced at app level)
  type: text("type").notNull(), // expected: 'entry' or 'exit'
  currency: text("currency").notNull(), // expected: 'MGA', 'RMB', etc.

  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 2 }),
  amountMGA: decimal("amount_mga", { precision: 10, scale: 2 }).notNull(),

  description: text("description").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  author: text("author").notNull(),
  responsible: text("responsible").notNull(),
  isSale: boolean("is_sale").notNull().default(false),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const movementsRelations = relations(movements, ({ one }) => ({
  author: one(users, {
    fields: [movements.userId],
    references: [users.id],
  }),
}));

export const trosa = mysqlTable("trosa", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id),
  description: text("description").notNull(),
  montantTotal: decimal("montant_total", { precision: 10, scale: 2 }).notNull(),
  datePaiement: timestamp("date_paiement", { mode: "date" }),
  isPaid: boolean("is_paid").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const trosaRelations = relations(trosa, ({ one, many }) => ({
  user: one(users, {
    fields: [trosa.userId],
    references: [users.id],
  }),
  payments: many(trosaPayments),
}));

export const trosaPayments = mysqlTable("trosa_payments", {
  id: int("id").primaryKey().autoincrement(),
  trosaId: int("trosa_id")
    .notNull()
    .references(() => trosa.id),
  montant: decimal("montant", { precision: 10, scale: 2 }).notNull(),
  datePaiement: timestamp("date_paiement", { mode: "date" }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const trosaPaymentsRelations = relations(trosaPayments, ({ one }) => ({
  trosa: one(trosa, {
    fields: [trosaPayments.trosaId],
    references: [trosa.id],
  }),
}));
