import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { carts, cartItems, products, patterns } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { authOptions } from '@/lib/auth/options'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: 'Unauthorized' })

    const userId = session.user.id

    // Get or create cart
    let cartId: string
    const userCart = await db.select().from(carts).where(eq(carts.userId, userId)).then(res => res[0])
    if (userCart) {
      cartId = userCart.id
    } else {
      const newCart = await db.insert(carts)
        .values({ userId })
        .returning({ id: carts.id })
        .then(res => res[0])
      cartId = newCart.id
    }

    // Handle methods
    if (req.method === 'GET') {
      const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId))

      const detailedItems = await Promise.all(items.map(async item => {
        const itemDetail = item.itemType === 'product'
          ? await db.select().from(products).where(eq(products.id, item.itemId)).then(res => res[0])
          : await db.select().from(patterns).where(eq(patterns.id, item.itemId)).then(res => res[0])

        return {
          ...item,
          detail: itemDetail,
        }
      }))

      return res.status(200).json({ items: detailedItems })
    }

    if (req.method === 'POST') {
      const { action, itemType, itemId, quantity, cartItemId, change } = req.body

      // Handle update quantity
      if (action === 'update') {
        if (!cartItemId || typeof change !== 'number') {
          return res.status(400).json({ message: 'Invalid parameters for update' })
        }

        const item = await db.select().from(cartItems).where(eq(cartItems.id, cartItemId)).then(r => r[0])
        if (!item) return res.status(404).json({ message: 'Cart item not found' })

        const newQuantity = item.quantity + change
        if (newQuantity <= 0) {
          await db.delete(cartItems).where(eq(cartItems.id, cartItemId))
        } else {
          await db.update(cartItems)
            .set({ quantity: newQuantity })
            .where(eq(cartItems.id, cartItemId))
        }

        return res.status(200).json({ message: 'Quantity updated' })
      }

      // Handle delete
      if (action === 'delete') {
        if (!cartItemId) return res.status(400).json({ message: 'Missing cartItemId' })
        await db.delete(cartItems).where(eq(cartItems.id, cartItemId))
        return res.status(200).json({ message: 'Item removed from cart' })
      }

      // Default: add to cart
      if (!['product', 'pattern'].includes(itemType) || !itemId) {
        return res.status(400).json({ message: 'Invalid item type or id' })
      }

      const itemExists = await db
        .select()
        .from(itemType === 'product' ? products : patterns)
        .where(eq(itemType === 'product' ? products.id : patterns.id, itemId))
        .then(res => res[0])

      if (!itemExists) {
        return res.status(404).json({ message: 'Item not found' })
      }

      const existing = await db.select().from(cartItems)
        .where(and(eq(cartItems.cartId, cartId), eq(cartItems.itemId, itemId)))
        .then(res => res[0])

      if (existing) {
        await db.update(cartItems)
          .set({ quantity: existing.quantity + (quantity || 1) })
          .where(eq(cartItems.id, existing.id))
      } else {
        await db.insert(cartItems).values({
          id: uuidv4(),
          cartId,
          itemType,
          itemId,
          quantity: quantity || 1,
        })
      }

      return res.status(201).json({ message: 'Item added to cart' })
    }

    res.status(405).json({ message: 'Method not allowed' })
  } catch (err) {
    console.error('Cart error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
