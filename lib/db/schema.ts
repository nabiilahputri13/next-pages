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

export const patterns = pgTable('patterns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  label: text('label').notNull(),
  price: integer('price').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  rating: integer('rating').notNull().default(5),
  createdAt: timestamp('created_at').defaultNow()
})

export const carts = pgTable('carts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const cartItems = pgTable('cart_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  cartId: uuid('cart_id')
    .notNull()
    .references(() => carts.id, { onDelete: 'cascade' }),
  itemType: text('item_type').notNull(), // 'product' | 'pattern'
  itemId: uuid('item_id').notNull(), // refer ke products.id atau patterns.id
  quantity: integer('quantity').notNull().default(1),
})
