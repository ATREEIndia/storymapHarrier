




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

// const AnimatedStages = () => {
//   const containerRef1 = useRef<HTMLDivElement>(null)
//   const imageRef = useRef<HTMLDivElement>(null)

//   const [currentIndex, setCurrentIndex] = useState(0)

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const images =
//         gsap.utils.toArray<HTMLElement>('.stage-image')

//       const descriptions =
//         gsap.utils.toArray<HTMLElement>('.stage-description')

//       // Initial state
//       gsap.set(images, {
//         flexGrow: 1,
//         opacity: 0.45,
//       })

//       // First image active
//       gsap.set(images[0], {
//         flexGrow: 5,
//         opacity: 1,
//       })

//       // Pin image area
//       ScrollTrigger.create({
//         trigger: containerRef1.current,
//         start: "top top",
//         end: 'bottom bottom',
//         pin: imageRef.current,
//         pinSpacing: false,

//       })

//       // Scroll triggers for descriptions
//       descriptions.forEach((section, index) => {
//         ScrollTrigger.create({
//           trigger: section,
//           start: 'top top',
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
//     }, containerRef1)

//     return () => ctx.revert()
//   }, [])

//   return (
//     <div
//       ref={containerRef1}
//       className="relative w-full "
//     >
      

//       {/* ================================= */}
//       {/* PINNED IMAGE AREA */}
//       {/* ================================= */}

//       <div
//         ref={imageRef}
//         className="
//           relative
//           z-20
//           w-full
//           h-screen
//           p-2
         
//         "
//       >
//         <div className="w-full h-full flex gap-1 md:gap-2">
//           {stages.map((stage) => (
//             <div
//               key={stage.id}
//               className="
//                 stage-image
//                 relative
//                 h-full
//                 flex-2
//                 min-w-0
//                 overflow-hidden
//               "
//             >
//               <Image
//                 unoptimized
//                 src={stage.image}
//                 alt={stage.title}
//                 fill
//                 className="object-contain "
//               />
//             </div>
//           ))}
//         </div>
//       </div>


//       {/* ================================= */}
//       {/* SCROLL TRIGGER AREA */}
//       {/* ================================= */}

//       <div className="relative w-full">

//         {stages.map((stage) => (
//           <section
//             key={stage.id}
//             className="
//               stage-description
//               min-h-[80vh]
//               md:min-h-screen
//               flex
//               items-center
//               p-5
//               md:p-10
//             "
//           >
//             {/* Invisible content used only as scroll trigger */}

//             <div className="w-full max-w-2xl opacity-0 pointer-events-none">
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

//     </div>
//   )
// }

// export default AnimatedStages



// 'use client'

// import React, { useRef } from 'react'
// import Image from 'next/image'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { useGSAP } from '@gsap/react'

// gsap.registerPlugin(ScrollTrigger)

// const stages = [
//   {
//     id: 1,
//     title: 'Stage 1',
//     image:
//       'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s1.png',
//   },
//   {
//     id: 2,
//     title: 'Stage 2',
//     image:
//       'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s2.png',
//   },
//   {
//     id: 3,
//     title: 'Stage 3',
//     image:
//       'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s3.png',
//   },
//   {
//     id: 4,
//     title: 'Stage 4',
//     image:
//       'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s4.png',
//   },
//   {
//     id: 5,
//     title: 'Stage 5',
//     image:
//       'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s5.png',
//   },
// ]

// const AnimatedStages = () => {
//   const containerRef = useRef<HTMLDivElement>(null)

//   useGSAP(
//     () => {
//       const images = gsap.utils.toArray<HTMLElement>('.stage-image')
//       if (!images.length || !containerRef.current) return

//       // Set initial widths directly via GSAP
//       images.forEach((img, i) => {
//         gsap.set(img, {
//           flexGrow: i === 0 ? 5 : 1,
//           opacity: i === 0 ? 1 : 0.45,
//         })
//       })

//       // Single scrubbed timeline driven by native browser scrolling
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: 'top top',
//           end: 'bottom bottom',
//           scrub: 0.5,
//           invalidateOnRefresh: true,
//         },
//       })

//       // Animate stages smoothly as user scrolls through the container height
//       stages.forEach((_, index) => {
//         if (index === 0) return

//         tl.to(
//           images,
//           {
//             flexGrow: (i) => (i === index ? 5 : 1),
//             opacity: (i) => (i === index ? 1 : 0.45),
//             duration: 1,
//             ease: 'power1.inOut',
//           },
//           `stage-${index}`
//         )
//       })
//     },
//     { scope: containerRef }
//   )

//   return (
//     /* Outer container defines natural scroll height (e.g. 500vh for 5 stages) */
//     <div
//       ref={containerRef}
//       className="relative w-full border-2"
//       style={{ height: `${stages.length * 100}vh` }}
//     >
//       {/* Native CSS Sticky Viewport: Handles pinning 100% glitch-free without DOM mutations */}
//       <div className="sticky top-0 left-0 w-full h-screen p-4 bg-white overflow-hidden flex items-center z-10">
//         <div className="w-full h-full flex gap-2 md:gap-4 items-center">
//           {stages.map((stage) => (
//             <div
//               key={stage.id}
//               className="stage-image relative h-full min-w-0 flex-1 overflow-hidden"
//             >
//               <Image
//                 unoptimized
//                 src={stage.image}
//                 alt={stage.title}
//                 fill
//                 priority
//                 className="object-contain"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AnimatedStages











'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const stages = [
  {
    id: 1,
    title: 'Stage 1',
    image:
      'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s1.png',
  },
  {
    id: 2,
    title: 'Stage 2',
    image:
      'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s2.png',
  },
  {
    id: 3,
    title: 'Stage 3',
    image:
      'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s3.png',
  },
  {
    id: 4,
    title: 'Stage 4',
    image:
      'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s4.png',
  },
  {
    id: 5,
    title: 'Stage 5',
    image:
      'https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/stages/s5.png',
  },
]

const AnimatedStages = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const images = gsap.utils.toArray<HTMLElement>('.stage-image')
      if (!images.length || !containerRef.current) return

      // Set initial widths directly via GSAP
      images.forEach((img, i) => {
        gsap.set(img, {
          flexGrow: i === 0 ? 5 : 1,
          opacity: i === 0 ? 1 : 0.45,
        })
      })

      // Single scrubbed timeline driven by native browser scrolling
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })

      // 1. ADD INITIAL HOLD / BUFFER:
      // Holds Stage 1 active for a full viewport scroll distance so the user
      // sees Stage 1 active as soon as the section locks into place.
      tl.to({}, { duration: 1 })

      // 2. Animate subsequent stages progressively
      stages.forEach((_, index) => {
        if (index === 0) return

        tl.to(images, {
          flexGrow: (i) => (i === index ? 5 : 1),
          opacity: (i) => (i === index ? 1 : 0.45),
          duration: 1,
          ease: 'power1.inOut',
        })

        // Adds a small pause on each stage so each image stays enlarged briefly
        tl.to({}, { duration: 0.5 })
      })
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${(stages.length + 1) * 100}vh` }}
    >
      {/* Native CSS Sticky Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen p-4  overflow-hidden flex items-center z-10">
        <div className="w-full h-full flex gap-2 md:gap-4 items-center">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="stage-image relative h-full min-w-0 flex-1 overflow-hidden"
            >
              <Image
                unoptimized
                src={stage.image}
                alt={stage.title}
                fill
                priority
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnimatedStages