// 'use client'

// import Image from 'next/image'
// import React, { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

// gsap.registerPlugin(ScrollTrigger)

// const stages = [
//   {
//     id: 1,
//     title: 'Stage 1',
//     description: 'Description for stage 1',
//     image:
//       'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s1.png',
//   },
//   {
//     id: 2,
//     title: 'Stage 2',
//     description: 'Description for stage 2',
//     image:
//       'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s2.png',
//   },
//   {
//     id: 3,
//     title: 'Stage 3',
//     description: 'Description for stage 3',
//     image:
//       'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s3.png',
//   },
//   {
//     id: 4,
//     title: 'Stage 4',
//     description: 'Description for stage 4',
//     image:
//       'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s4.png',
//   },
//   {
//     id: 5,
//     title: 'Stage 5',
//     description: 'Description for stage 5',
//     image:
//       'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s5.png',
//   },
// ]

// const AnimatedStages2 = () => {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const imageRef = useRef<HTMLDivElement>(null)

//   const [currentIndex, setCurrentIndex] = useState(0)

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const images =
//         gsap.utils.toArray<HTMLElement>('.stage-image')

//       const descriptions =
//         gsap.utils.toArray<HTMLElement>('.stage-description')

//       // Initial image state
//       gsap.set(images, {
//         flexGrow: 1,
//         opacity: 0.45,
//       })

//       ScrollTrigger.create({
//         trigger: containerRef.current,
//         start: 'top top',
//         end: 'bottom bottom',
//         pin: imageRef.current,
//         pinSpacing: false,
//       })

//       descriptions.forEach((section, index) => {
//         ScrollTrigger.create({
//           trigger: section,
//           start: 'top 60%',
//           end: 'bottom 60%',

//           onEnter: () => activateStage(index),
//           onEnterBack: () => activateStage(index),
//         })
//       })

//       function activateStage(index: number) {
//         setCurrentIndex(index)

//         images.forEach((image, imageIndex) => {
//           gsap.to(image, {
//             flexGrow: imageIndex === index ? 5 : 1,
//             opacity: imageIndex === index ? 1 : 0.45,
//             duration: 0.7,
//             ease: 'power2.out',
//             overwrite: true,
//           })
//         })
//       }

//       ScrollTrigger.refresh()
//     }, containerRef)

//     return () => ctx.revert()
//   }, [])

//   return (
//     <div ref={containerRef} className="w-full border-3 relative">
//       {/* ========================= */}
//       {/* IMAGE AREA */}
//       {/* ========================= */}

//       <div ref={imageRef} className="w-full h-[40vh] p-2 z-20 border-2">
//         <div className="w-full h-full flex gap-1 md:gap-2">
//           {stages.map((stage) => (
//             <div key={stage.id} className="stage-image relative h-full flex-1 min-w-0">
//               <Image
//                 unoptimized
//                 src={stage.image}
//                 alt={stage.title}
//                 fill
//                 className="object-contain"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ========================= */}
//       {/* DESCRIPTION AREA */}
//       {/* ========================= */}
//       <div className='absolute inset-0 w-full '>
//         <div className=" w-1  opacity-0">
//         {stages.map((stage) => (
//           <section key={stage.id} className="stage-description min-h-[80vh] md:min-h-screen flex items-center p-5 md:p-10">
//             <div className="w-full bg-orange-200 p-6 md:p-10 rounded-2xl">
//               <h2 className="text-3xl md:text-5xl font-bold">
//                 {stage.title}
//               </h2>

//               <p className="mt-4 md:mt-6 text-base md:text-lg">
//                 {stage.description}
//               </p>
//             </div>
//           </section>
//         ))}
//       </div>

//       </div>

      
//     </div>
//   )
// }

// export default AnimatedStages2




'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stages = [
  {
    id: 1,
    title: 'Stage 1',
    description: 'Description for stage 1',
    image:
      'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s1.png',
  },
  {
    id: 2,
    title: 'Stage 2',
    description: 'Description for stage 2',
    image:
      'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s2.png',
  },
  {
    id: 3,
    title: 'Stage 3',
    description: 'Description for stage 3',
    image:
      'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s3.png',
  },
  {
    id: 4,
    title: 'Stage 4',
    description: 'Description for stage 4',
    image:
      'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s4.png',
  },
  {
    id: 5,
    title: 'Stage 5',
    description: 'Description for stage 5',
    image:
      'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s5.png',
  },
]

const AnimatedStages = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const images =
        gsap.utils.toArray<HTMLElement>('.stage-image')

      const descriptions =
        gsap.utils.toArray<HTMLElement>('.stage-description')

      // Initial state
      gsap.set(images, {
        flexGrow: 1,
        opacity: 0.45,
      })

      // First image active
      gsap.set(images[0], {
        flexGrow: 5,
        opacity: 1,
      })

      // Pin image area
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: 'bottom bottom',
        pin: imageRef.current,
        pinSpacing: false,

      })

      // Scroll triggers for descriptions
      descriptions.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 60%',
          end: 'bottom 60%',

          onEnter: () => activateStage(index),
          onEnterBack: () => activateStage(index),
        })
      })

      function activateStage(index: number) {
        setCurrentIndex(index)

        images.forEach((image, imageIndex) => {
          gsap.to(image, {
            flexGrow: imageIndex === index ? 5 : 1,
            opacity: imageIndex === index ? 1 : 0.45,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: true,
          })
        })
      }

      ScrollTrigger.refresh()
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full "
    >
      

      {/* ================================= */}
      {/* PINNED IMAGE AREA */}
      {/* ================================= */}

      <div
        ref={imageRef}
        className="
          relative
          z-20
          w-full
          h-screen
          p-2
         
        "
      >
        <div className="w-full h-full flex gap-1 md:gap-2">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="
                stage-image
                relative
                h-full
                flex-2
                min-w-0
                overflow-hidden
              "
            >
              <Image
                unoptimized
                src={stage.image}
                alt={stage.title}
                fill
                className="object-contain "
              />
            </div>
          ))}
        </div>
      </div>


      {/* ================================= */}
      {/* SCROLL TRIGGER AREA */}
      {/* ================================= */}

      <div className="relative w-full">

        {stages.map((stage) => (
          <section
            key={stage.id}
            className="
              stage-description
              min-h-[80vh]
              md:min-h-screen
              flex
              items-center
              p-5
              md:p-10
            "
          >
            {/* Invisible content used only as scroll trigger */}

            <div className="w-full max-w-2xl opacity-0 pointer-events-none">
              <h2 className="text-3xl md:text-5xl font-bold">
                {stage.title}
              </h2>

              <p className="mt-4 md:mt-6 text-base md:text-lg">
                {stage.description}
              </p>
            </div>

          </section>
        ))}

      </div>

    </div>
  )
}

export default AnimatedStages



