'use client'

import React from 'react'
import Image from 'next/image'
import ButtonBlack from './button-black'
import ButtonWhite from './button-white'

type Product = {
  label: string
  name: string
  price: string
  image: string
}

const products: Product[] = [
  {
    label: 'Hand Dyed',
    name: 'Honey Cashmere',
    price: 'Rp35.000,00',
    image: '/yarn-1.png',
  },
  {
    label: 'Natural Fibre',
    name: 'Quenti Alpaca Natural White',
    price: 'Rp55.000,00',
    image: '/yarn-2.png',
  },
  {
    label: 'Vegan',
    name: 'Back to Basic All Cotton',
    price: 'Rp30.000,00',
    image: '/yarn-3.png',
  },
]

interface ProductsProps {
  search: string
}

const Products: React.FC<ProductsProps> = ({ search= "" }) => {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className="my-12 px-4">
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">Product not found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => (
            <div key={idx} className="flex flex-col items-start">
              <div className="relative w-full h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs bg-gray-200 px-2 py-1 mt-4 inline-block w-max">
                {product.label}
              </span>
              <h3 className="font-bold text-lg mt-2">{product.name}</h3>
              <p className="font-semibold mt-1">IDR{product.price}</p>
              <div className="flex justify-between gap-2 mt-2">
                <ButtonBlack className='mt-2'>Add to Cart</ButtonBlack>
                <ButtonWhite className='mt-2'>Buy Now</ButtonWhite>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Products
