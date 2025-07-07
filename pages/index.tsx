'use client'

import ButtonBlack from "@/components/button-black"
import PopularProjects from "@/components/popular-projects"
import Products from "@/components/products"
import UpcomingWorkshops from "@/components/workshops"
import Link from "next/link"
import { signIn, useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()
  const user = session?.user
  return (
    <div>
      <section
        className="bg-cover bg-center text-white min-h-[700px] flex items-center justify-center "
        style={{ backgroundImage: "url('/landing-bg.png')" }}>
          <div className="text-center items-cente container mx-auto">
            <h1 className="text-8xl font-bold mb-4 whitespace-pre-line">
            {user ? `Welcome back, ${user.name?.split(' ')[0]}!` : 'START YOUR YARN\nJOURNEY'}
            </h1>
            {!user && (
              <ButtonBlack onClick={() => signIn('google')}>
                CLICK HERE TO START
              </ButtonBlack>
            )}
          </div>
    </section>

    <section>
      <div>

      </div>
    </section>

    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mt-4">Popular Projects</h1>
      <PopularProjects/>
      <hr className="border-t border-black my-6" />

    </div>

    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">Explore</h1>
      <div className="flex flex-col md:flex-row items-center bg-white overflow-hidden mt-12">
         <img
            src="/home-1.png"
            alt="New Arrival Yarn"
            className="w-full md:w-1/2 object-cover"
          />
          <div className="p-6 md:w-1/2">
          <h2 className="text-xl font-bold mb-2">New Arrival Yarn</h2>
          <p className="text-gray-600 text-xl mb-4">
            Pure cotton made from real wool. Perfect yarn for dailywear. Giving the utmost comfortable, soft, warm and cozy feeling.
          </p>
          <ButtonBlack>Shop Now</ButtonBlack>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center bg-white overflow-hidden mt-25">
          <div className="p-6 md:w-1/2">
          <h2 className="text-xl font-bold mb-2">Community</h2>
          <p className="text-gray-600 text-xl mb-4">
            Pure cotton made from real wool. Perfect yarn for dailywear. Giving the utmost comfortable, soft, warm and cozy feeling.
          </p>
          <ButtonBlack>Join Community</ButtonBlack>
        </div>
        <img
            src="/home-2.png"
            alt="New Arrival Yarn"
            className="w-full md:w-1/2 object-cover"
          />
      </div>

      <div className="flex flex-col md:flex-row items-center bg-white overflow-hidden mt-25">
         <img
            src="/home-3.png"
            alt="New Arrival Yarn"
            className="w-full md:w-1/2 object-cover"
          />
          <div className="p-6 md:w-1/2">
          <h2 className="text-xl font-bold mb-2">Upgrade Your Skill</h2>
          <p className="text-gray-600 text-xl mb-4">
            Pure cotton made from real wool. Perfect yarn for dailywear. Giving the utmost comfortable, soft, warm and cozy feeling.
          </p>
          <ButtonBlack>Workshops</ButtonBlack>
        </div>
      </div>

    <hr className="border-t border-black my-6" />

    </div>

    <section
        className="bg-cover bg-center text-white min-h-[300px] flex items-center justify-center "
        style={{ backgroundImage: "url('/landing-2.png')" }}>
          <div className="text-center items-cente container mx-auto">
               </div>
    </section>

      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mt-4">All Time Best Selling Yarn</h1>
      <Products/>
      <div className="flex justify-end mt-4">
              <Link href="/shop-yarn" className="text-sm font-bold text-gray-600 hover:underline">
                View More
              </Link>
      </div>
      <hr className="border-t border-black my-6" />

    </div>

    <section
        className="bg-cover bg-center text-white min-h-[300px] flex items-center justify-center "
        style={{ backgroundImage: "url('/landing-3.png')" }}>
          <div className="text-center items-cente container mx-auto">
               </div>
    </section>

      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mt-4">Upcoming Workshops</h1>
      <UpcomingWorkshops/>
      <div className="flex justify-end mt-4">
      <Link href="/workshop" className="text-sm font-bold text-gray-600 hover:underline">
        View More
      </Link>
      </div>
      <hr className="border-t border-black my-6" />
      
    </div>

    <div className="container mx-auto text-center items-center justify-centerp-4 mb-15">
      <p className="text-2xl font-light text-center">Don’t wanna miss out new <br/> patterns and workshops?</p>
      <ButtonBlack className="mt-4">SUBSCRIBE FOR FREE</ButtonBlack>
    </div>

</div>
  )
}