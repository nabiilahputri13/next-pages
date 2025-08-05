import { useState } from 'react'
import Image from 'next/image'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { db } from '@/lib/db'
import { carts, cartItems, products, patterns } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import ButtonBlack from '@/components/button-black'

type CartItem = {
  id: string
  itemType: 'product' | 'pattern'
  quantity: number
  detail: {
    id: string
    name: string
    price: number
    imageUrl: string
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) return { redirect: { destination: '/', permanent: false } }

  const userId = session.user.id
  const userCart = await db.select().from(carts).where(eq(carts.userId, userId)).then(res => res[0])
  if (!userCart) return { props: { items: [] } }

  const items = await db.select().from(cartItems).where(eq(cartItems.cartId, userCart.id))
  const detailedItems: CartItem[] = await Promise.all(items.map(async (item) => {
    const base = item.itemType === 'product'
      ? await db.select().from(products).where(eq(products.id, item.itemId)).then(r => r[0])
      : await db.select().from(patterns).where(eq(patterns.id, item.itemId)).then(r => r[0])
    return {
      id: item.id,
      itemType: item.itemType as 'product' | 'pattern',
      quantity: item.quantity,
      detail: {
        id: base.id,
        name: base.name,
        price: base.price,
        imageUrl: base.imageUrl
      }
    }
  }))

  return { props: { items: detailedItems } }
}

export default function CartPage({ items: initialItems }: { items: CartItem[] }) {
  const [items, setItems] = useState<CartItem[]>(initialItems)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleQuantity = async (id: string, change: number) => {
    const item = items.find(i => i.id === id)
    if (!item) return

    if (item.quantity === 1 && change === -1) {
      const confirmDelete = confirm('Are you sure you want to remove this item from your cart?')
      if (!confirmDelete) return
    }

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', cartItemId: id, change }),
    })

    if (res.ok) {
      if (item.quantity + change <= 0) {
        setItems(prev => prev.filter(i => i.id !== id))
      } else {
        setItems(prev =>
          prev.map(i => i.id === id ? { ...i, quantity: i.quantity + change } : i)
        )
      }
    }
  }

  const handleRemove = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to remove this item?')
    if (!confirmDelete) return

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', cartItemId: id }),
    })

    if (res.ok) {
      setItems(prev => prev.filter(i => i.id !== id))
    }
  }

  // Tambahkan di dalam fungsi CartPage setelah handleRemove
const totalSelected = items
  .filter(i => selectedItems.includes(i.id))
  .reduce((sum, item) => sum + item.detail.price * item.quantity, 0)

const handleCheckout = () => {
  alert(`You checked out items worth Rp${totalSelected.toLocaleString('id-ID')}`)
  // lanjutkan ke logika sesungguhnya jika ada (misal: kirim ke API checkout)
}


  return (
    <section className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-4 border p-4 rounded-md ${
                selectedItems.includes(item.id) ? 'bg-gray-100 border-blue-400' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  className={`w-6 h-6 border flex items-center justify-center ${
                    selectedItems.includes(item.id) ? 'bg-black text-white' : ''
                  }`}
                  onClick={() => toggleSelect(item.id)}
                >
                  {selectedItems.includes(item.id) ? '✔' : ''}
                </button>
                <Image
                  src={item.detail.imageUrl}
                  alt={item.detail.name}
                  width={100}
                  height={100}
                  className="object-cover border-2"
                />
              </div>

              <div className="flex-1 px-2">
                <h3 className="font-semibold text-lg">{item.detail.name}</h3>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600">
                  Price: Rp{item.detail.price.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantity(item.id, -1)}
                  className="border px-3 py-1 hover:bg-black hover:text-white"
                >−</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantity(item.id, 1)}
                  className="border px-3 py-1 hover:bg-black hover:text-white"
                >＋</button>
              </div>

              <ButtonBlack
                onClick={() => handleRemove(item.id)}
                className="bg-black text-white px-4 py-2"
              >
                Remove
              </ButtonBlack>
            </div>
          ))}
        </div>
      )}

      {selectedItems.length > 0 && (
  <div className="mt-6 border-t pt-4 flex flex-col items-end gap-3">
    <p className="text-lg font-semibold">
      Total: Rp{totalSelected.toLocaleString('id-ID')}
    </p>
    <ButtonBlack
      onClick={handleCheckout} className='bg-green-500'
        >
      Checkout
    </ButtonBlack>
  </div>
)}

    </section>
  )
}
