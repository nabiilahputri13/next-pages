import ButtonBlack from "@/components/button-black"

export default function Home() {
  return (
    <div>
      <section
        className="bg-cover bg-center text-white min-h-[700px] flex items-center justify-center "
        style={{ backgroundImage: "url('/landing-bg.png')" }}>
          <div className="text-center items-cente container mx-auto">
            <h1 className="text-8xl font-bold mb-4">START YOUR YARN <br/> JOURNEY</h1>
            <ButtonBlack>CLICK HERE TO START</ButtonBlack>
          </div>
    </section>

    <section>
      <div>

      </div>
    </section>

    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mt-4">Popular Projects</h1>

      <hr className="border-t border-black my-6" />

      <h1 className="text-2xl font-bold text-center mt-4">Explore</h1>
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg overflow-hidden mt-8">
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

      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg overflow-hidden mt-25">
          <div className="p-6 md:w-1/2">
          <h2 className="text-xl font-bold mb-2">New Arrival Yarn</h2>
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

      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg overflow-hidden mt-25">
         <img
            src="/home-3.png"
            alt="New Arrival Yarn"
            className="w-full md:w-1/2 object-cover"
          />
          <div className="p-6 md:w-1/2">
          <h2 className="text-xl font-bold mb-2">New Arrival Yarn</h2>
          <p className="text-gray-600 text-xl mb-4">
            Pure cotton made from real wool. Perfect yarn for dailywear. Giving the utmost comfortable, soft, warm and cozy feeling.
          </p>
          <ButtonBlack>Workshops</ButtonBlack>
        </div>
      </div>

    <hr className="border-t border-black my-6" />

    </div>

</div>
  )
}
