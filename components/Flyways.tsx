'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import blankmap from "@/public/blankmap.png"
import african_flyway from "@/public/african_flyway.png"
import centralasian_flyway from "@/public/centralasian_flyway.png"
import eastAsian_flyway from "@/public/eastasian_flyway.png"
import american_flyway from "@/public/americas_flyway.png"

const flyways = [
   {
    label: "CENTRAL ASIAN FLYWAY",
    activeBg: "bg-red-800",
    img: centralasian_flyway,
  },
  {
    label: "AFRICAN-EURASIAN FLYWAY",
    activeBg: "bg-green-950",
    img: african_flyway,
  },
 
  {
    label: "EAST ASIAN-AUSTRALASIAN FLYWAY",
    activeBg: "bg-yellow-500",
    img: eastAsian_flyway,
  },
  {
    label: "AMERICAS FLYWAY",
    activeBg: "bg-blue-800",
    img: american_flyway,
  },
]

const Flyways = () => {
  const [currentImgIndex, setCurrentImgIndex] = useState<number | null>(0)

  const currentImg = currentImgIndex !== null ? flyways[currentImgIndex].img : blankmap

  return (
    <div className='w-full bg-white p-2 mt-10'>
         <p className='w-full  text-sm flex justify-center animate-bounce '>Click to explore</p>

      {/* Button row — horizontal scroll on mobile, wrap on desktop */}
      <div className='flex flex-row flex-wrap sm:flex-nowrap gap-2 mb-2 overflow-x-auto pb-1 justify-center'>
       
        {flyways.map((fw, i) => (
          <button
            key={fw.label}
            onClick={() => setCurrentImgIndex(currentImgIndex === i ? null : i)}
            className={`
              flex-shrink-0 border-2 px-2 xl:mt-5 py-1.5 text-xs sm:text-sm font-medium tracking-wide cursor-pointer transition-colors duration-200 rounded
              ${currentImgIndex === i
                ? `${fw.activeBg} text-white border-transparent`
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
              }
            `}
          >
            {fw.label}
          </button>
        ))}
      </div>

      {/* Map image */}
      <div className='relative w-full h-52 sm:h-72 md:h-[500px] lg:h-[650px] xl:h-[800px]'>
        <Image
        unoptimized
          src={currentImg}
          fill
          loading="eager"
          className='object-contain'
          alt='flyway map'
        />
      </div>

    </div>
  )
}

export default Flyways