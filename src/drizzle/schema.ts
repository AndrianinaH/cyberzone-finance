import { pgTable, serial, text, timestamp, uniqueIndex, pgEnum, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (users) => {
  return {
    uniqueIdx: uniqueIndex('unique_idx').on(users.email),
  };
});

export const usersRelations = relations(users, ({ many }) => ({
  movements: many(movements),
}));

export const movementTypeEnum = pgEnum('movement_type', ['entry', 'exit']);
export const currencyEnum = pgEnum('currency', ['MGA', 'RMB', 'AED', 'EUR', 'USD']);

export const movements = pgTable('movements', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').notNull().references(() => users.id),
  type: movementTypeEnum('type').notNull(),
  amount: numeric('amount').notNull(),
  currency: currencyEnum('currency').notNull(),
  exchangeRate: numeric('exchange_rate'),
  amountMGA: numeric('amount_mga').notNull(),
  description: text('description').notNull(),
  date: timestamp('date').notNull(),
  author: text('author').notNull(),
  responsible: text('responsible').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const movementsRelations = relations(movements, ({ one }) => ({
  author: one(users, {
    fields: [movements.userId],
    references: [users.id],
  }),
}));