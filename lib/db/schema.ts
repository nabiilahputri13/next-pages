import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  integer,
  pgEnum,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['admin', 'customer'])

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 30 }).notNull().unique(),
  password: text().notNull(),
  role: userRoleEnum('role').notNull().default('customer'),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
})

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  label: text('label').notNull(),
  price: integer('price').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})