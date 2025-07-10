'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider, KeenSliderPlugin } from 'keen-slider/react'
import ButtonBlack from './button-black'
import ButtonWhite from './button-white'

type Project = {
  title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  image: string
  stars: number
}

const projects: Project[] = [
  {
    title: 'All Day Vintage Sweater',
    level: 'Beginner',
    image: '/project-1.png',
    stars: 4
  },
  {
    title: 'Halloween Buddy Doll Set',
    level: 'Advanced',
    image: '/project-2.png',
    stars: 4,
  },
  {
    title: 'Flower Fairy Mesh Bag',
    level: 'Intermediate',
    image: '/project-3.png',
    stars: 5,
  },
  {
    title: 'Winter Fluffy Beanie',
    level: 'Beginner',
    image: '/project-4.png',
    stars: 5,
  },
]

// 🔁 Autoplay plugin
const Autoplay: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout>
  let mouseOver = false

  const clearNextTimeout = () => clearTimeout(timeout)

  const nextTimeout = () => {
    clearTimeout(timeout)
    if (mouseOver) return
    timeout = setTimeout(() => slider.next(), 3000)
  }

  slider.on('created', () => {
    slider.container.addEventListener('mouseover', () => {
      mouseOver = true
      clearNextTimeout()
    })
    slider.container.addEventListener('mouseout', () => {
      mouseOver = false
      nextTimeout()
    })
    nextTimeout()
  })
  slider.on('dragStarted', clearNextTimeout)
  slider.on('animationEnded', nextTimeout)
  slider.on('updated', nextTimeout)
}

const PopularProjects: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

const [sliderInstanceRef, slider] = useKeenSlider<HTMLDivElement>(
  {
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 20 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 24 },
      },
    },
  },
  [Autoplay] // ✅ Tempat yang benar untuk plugin
)


  return (
    <section className="px-10 relative">
      <div ref={sliderInstanceRef} className="keen-slider">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="keen-slider__slide bg-white p-10 flex flex-col"
          >
            <div className="relative w-full h-100">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover "
              />
            </div>
            <span className="text-xs bg-gray-200 px-2 py-1  mt-4 inline-block w-max">
              {project.level}
            </span>
            <h2 className="font-bold text-lg mt-2">{project.title}</h2>
            <div className="flex items-center">
            <h2 className="font-bold text-xl mt-2">{project.stars}</h2>
            <div className="flex text-3xl text-yellow-500 ml-2">
                {'★'.repeat(project.stars)}
                {'☆'.repeat(5 - project.stars)}
            </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <ButtonBlack>Get Pattern</ButtonBlack>
              <ButtonWhite>Save</ButtonWhite>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {loaded && slider.current && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            className="absolute left-2 top-1/2 w-10 h-10 transform -translate-y-1/2 z-10 bg-white p-2 border hover:bg-black hover:border hover:text-white transition"
          >
            ‹
          </button>
          <button
            onClick={() => slider.current?.next()}
            className="absolute right-2 top-1/2 w-10 h-10 transform -translate-y-1/2 z-10 bg-white p-2 border hover:bg-black hover:border hover:text-white transition"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {loaded && slider.current && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(slider.current.track.details.slides.length).keys()].map((idx) => (
            <button
              key={idx}
              onClick={() => slider.current?.moveToIdx(idx)}
              className={`w-2 h-2 rounded-full  ${
                currentSlide === idx ? 'bg-stone-400' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default PopularProjects
