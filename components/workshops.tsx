'use client'

import React from 'react'
import Image from 'next/image'
import ButtonBlack from './button-black'
import ButtonWhite from './button-white'

type Workshop = {
  level: string
  name: string
  date: string
  image: string
}

const workshops: Workshop[] = [
  {
    level: 'Advanced',
    name: 'The Making of Neapolitan Knitted Sockse',
    date: 'Saturday, August 20th 2029',
    image: '/ws-1.png',
  },
  {
    level: 'Beginner',
    name: 'Bloom with Lavender Crocheted Bag',
    date: 'Sunday, August 21th 2029',
    image: '/ws-2.png',
  },
  {
    level: 'Intermediate',
    name: 'Crochet With Us “Mesh X Sweater”',
    date: 'Saturday, August 20th 2029',
    image: '/ws-3.png',
  },
]

const UpcomingWorkshops: React.FC = () => {
  return (
    <section className="my-12 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {workshops.map((workshop, idx) => (
          <div key={idx} className="flex flex-col items-start">
            <div className="relative w-full h-64">
              <Image
                src={workshop.image}
                alt={workshop.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs bg-gray-200 px-2 py-1 mt-4 inline-block w-max">
              {workshop.level}
            </span>
            <h3 className="font-bold text-lg mt-2">{workshop.name}</h3>
            <p className="font-semibold mt-1">{workshop.date}</p>
            <div className="flex justify-between gap-2 mt-2">
              <ButtonBlack className='mt-2'>Register</ButtonBlack>
              <ButtonWhite className='mt-2'>See Detail</ButtonWhite>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default UpcomingWorkshops 