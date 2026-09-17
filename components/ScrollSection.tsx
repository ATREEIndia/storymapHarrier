// 'use client'

// import { useEffect, useRef, useState, ReactNode, RefObject } from 'react'
// import Image from 'next/image'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

// gsap.registerPlugin(ScrollTrigger)

// export interface ScrollItem {
//   content: ReactNode
//   media_src: string
//   alt?: string
//   media_type:string

// }

// interface ScrollSectionProps {
//   scroll_items: ScrollItem[]
//   side?:string,
//   img_fill?:boolean,
//    containerRef: RefObject<HTMLDivElement | null>

// }

// const ScrollSection = ({ scroll_items, side, img_fill, containerRef }: ScrollSectionProps) => {
//   //const containerRef = useRef<HTMLDivElement>(null)
//   const imageRef = useRef<HTMLDivElement>(null)
//   const [currentIndex, setCurrentImgIndex] = useState(0)

//   // Initialize ScrollTrigger
//   useEffect(() => {
//     if (!scroll_items || scroll_items.length === 0) return

//     const q = gsap.utils.selector(containerRef)
//     const ctx = gsap.context(() => {
//       // Pin image panel
//       ScrollTrigger.create({
//         trigger: containerRef.current,
//         start: 'top top',
//         end: 'bottom bottom',
//         pin: imageRef.current,
//         pinSpacing: false,
//       })

//       // Trigger index updates on scroll
//       const sections = q('.scroll-text')
//       sections.forEach((section, index) => {
//         ScrollTrigger.create({
//           trigger: section,
//           start: 'top 50%',
//           end: 'bottom 50%',
//           onEnter: () => setCurrentImgIndex(index),
//           onEnterBack: () => setCurrentImgIndex(index),
//         })
//       })

//       ScrollTrigger.refresh()
//     }, containerRef)

//     return () => ctx.revert()
//   }, [scroll_items])

//   // Handle smooth image transitions
//   useEffect(() => {
//     if (!containerRef.current || !scroll_items?.length) return

//     const q = gsap.utils.selector(containerRef)
//     const images = q('.story-image')

//     if (!images.length) return

//     gsap.to(images, {
//       opacity: 0,
//       duration: 0.8,
//       ease: 'power2.inOut',
//     })

//     gsap.to(images[currentIndex], {
//       opacity: 1,
//       duration: 1.2,
//       ease: 'power2.inOut',
//     })
//   }, [currentIndex, scroll_items])

//   if (!scroll_items || scroll_items.length === 0) {
//     return null
//   }

//   return (
//     <div ref={containerRef} className={` border-2  w-full relative flex ${side==="right"?"":"flex-row-reverse"}`}>
//       {/* Scrollable Text Area */}
//       <div className="md:w-1/3 px-5 z-10">
//         {scroll_items.map((item, i) => (
//           <div
//             key={i}
//             className="scroll-text h-[100dvh] flex items-center border-2 "
//           >
//             <div className='bg-[#f5f0e8] p-4 rounded-xl '>{item.content}</div>
//           </div>
//         ))}
//       </div>

//       {/* Sticky Image Viewport */}
//       <div
//         ref={imageRef}
//         className={`${img_fill?"w-full":"md:w-2/3"} w-full absolute z-11 xl:z-0  ${side=="right"?"md:right-0":"md:left-0"}  top-0 h-[30vh]  md:h-[100dvh] bg-white overflow-hidden`}
//       >
//         {scroll_items.map((item, i) => (
//           <div
//             key={i}
//             className="story-image absolute inset-0"
//             style={{
//               opacity: i === 0 ? 1 : 0,
//             }}
//           >
//             <Image
//               unoptimized
//               alt={item.alt || ''}
//               fill
//               loading="eager"
//               src={item.media_src}
//               className={`${img_fill?"object-cover":""}object-contain ${item.media_type==="image"?"flex":"hidden"}`}
//             />

//             <video
//           className={` ${img_fill?"object-cover":""} object-contain ${item.media_type==="video"?"flex":"hidden"}`}
//           src={item.media_src}
//           autoPlay
//           muted
//           loop
//           playsInline

//         />


//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ScrollSection

// 'use client'

// import { ReactNode, useRef, useState } from 'react'
// import Image from 'next/image'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { useGSAP } from '@gsap/react'


// gsap.registerPlugin(ScrollTrigger)

// export interface ScrollItem {
//   content: ReactNode
//   media_src: string
//   alt?: string
//   media_type:string

// }

// interface ScrollSectionProps {
//   scroll_items: ScrollItem[]
//   side?:string,
//   img_fill?:boolean,


// }



// const ScrollSection = ({ scroll_items, side, img_fill }: ScrollSectionProps) => {

//   const containerRef_roost = useRef<HTMLDivElement>(null)
//   const imageRef_roost = useRef<HTMLDivElement>(null)
//   const [currentIndex, setCurrentImgIndex] = useState(0)



//   // Initialize ScrollTrigger safely with useGSAP
//   useGSAP(
//     () => {
//       if (!scroll_items || scroll_items.length === 0) return

//       // Pin image panel
//       ScrollTrigger.create({
//         trigger: containerRef_roost.current,
//         start: 'top top',
//         end: 'bottom bottom',
//         pin: imageRef_roost.current,
//         pinSpacing: false,
//         invalidateOnRefresh: true,
//       })

//       // Trigger index updates on scroll
//       const sections = gsap.utils.toArray<HTMLElement>('.scroll-text')
//       sections.forEach((section, index) => {
//         ScrollTrigger.create({
//           trigger: section,
//           start: 'top 50%',
//           end: 'bottom 50%',
//           onEnter: () => setCurrentImgIndex(index),
//           onEnterBack: () => setCurrentImgIndex(index),
//         })
//       })

//       // Force GSAP recalculation after mount
//       ScrollTrigger.refresh()
//     },
//     { scope: containerRef_roost, dependencies: [scroll_items] }
//   )

//   // Handle smooth image opacity transitions
//   useGSAP(
//     () => {
//       if (!containerRef_roost.current || !scroll_items?.length) return

//       const images = gsap.utils.toArray<HTMLElement>('.story-image')
//       if (!images.length) return

//       gsap.to(images, {
//         opacity: 0,
//         duration: 0.8,
//         ease: 'power2.inOut',
//       })

//       gsap.to(images[currentIndex], {
//         opacity: 1,
//         duration: 1.2,
//         ease: 'power2.inOut',
//       })
//     },
//     { scope: containerRef_roost, dependencies: [currentIndex, scroll_items] }
//   )

//   if (!scroll_items || scroll_items.length === 0) {
//     return null
//   }

//   return (
//     <div
//       ref={containerRef_roost}
//       className={`w-full relative flex ${side === 'right' ? '' : 'flex-row-reverse'}`}
//     >
//       {/* Scrollable Text Area */}
//       <div className="md:w-1/3 px-5 z-10">
//         {scroll_items.map((item, i) => (
//           <div
//             key={i}
//             className="scroll-text h-[100dvh] flex items-center "
//           >
//             <div className="bg-[#f5f0e8] p-4 rounded-xl">{item.content}</div>
//           </div>
//         ))}
//       </div>

//       {/* Sticky Image Viewport */}
//       <div
//         ref={imageRef_roost}
//         className={`${img_fill ? 'w-full' : 'md:w-2/3'} w-full absolute z-11 xl:z-0 ${
//           side === 'right' ? 'md:right-0' : 'md:left-0'
//         } top-0 h-[30vh] md:h-[100dvh] bg-white overflow-hidden`}
//       >
//         {scroll_items.map((item, i) => (
//           <div
//             key={i}
//             className="story-image absolute inset-0"
//             style={{
//               opacity: i === 0 ? 1 : 0,
//             }}
//           >
//             {item.media_type === 'image' && (
//               <Image
//                 unoptimized
//                 alt={'image'}
//                 fill
//                 loading="eager"
//                 src={item.media_src}
//                 onLoad={() => ScrollTrigger.refresh()}
//                 className={`${img_fill ? 'object-cover' : 'object-contain'}`}
//               />
//             )}

//             {item.media_type === 'video' && (
//               <video
//                 src={item.media_src}
//                 autoPlay
//                 muted
//                 loop
//                 playsInline
//                 onLoadedData={() => ScrollTrigger.refresh()}
//                 className={`w-full h-full ${img_fill ? 'object-cover' : 'object-contain'}`}
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ScrollSection




// 'use client'

// import { ReactNode, useRef, useState } from 'react'
// import Image from 'next/image'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { useGSAP } from '@gsap/react'

// gsap.registerPlugin(ScrollTrigger)

// export interface ScrollItem {
//   content: ReactNode
//   media_src: string
//   alt?: string
//   media_type: string
// }

// interface ScrollSectionProps {
//   scroll_items: ScrollItem[]
//   side?: string
//   img_fill?: boolean
// }

// const ScrollSection = ({ scroll_items, side, img_fill }: ScrollSectionProps) => {
//   const containerRef_roost = useRef<HTMLDivElement>(null)
//   const [currentIndex, setCurrentImgIndex] = useState(0)

//   // Track text triggers to switch active media index cleanly
//   useGSAP(
//     () => {
//       if (!scroll_items || scroll_items.length === 0) return

//       const sections = gsap.utils.toArray<HTMLElement>('.scroll-text')
//       sections.forEach((section, index) => {
//         ScrollTrigger.create({
//           trigger: section,
//           start: 'top 50%',
//           end: 'bottom 50%',
//           onEnter: () => setCurrentImgIndex(index),
//           onEnterBack: () => setCurrentImgIndex(index),
//         })
//       })

//       // Safely force coordinate calculation after layout paint
//       requestAnimationFrame(() => {
//         ScrollTrigger.refresh()
//       })
//     },
//     { scope: containerRef_roost, dependencies: [scroll_items] }
//   )

//   // Handle smooth media opacity transitions
//   useGSAP(
//     () => {
//       if (!containerRef_roost.current || !scroll_items?.length) return

//       const images = gsap.utils.toArray<HTMLElement>('.story-image')
//       if (!images.length) return

//       gsap.to(images, {
//         opacity: 0,
//         duration: 0.6,
//         ease: 'power2.inOut',
//       })

//       gsap.to(images[currentIndex], {
//         opacity: 1,
//         duration: 0.8,
//         ease: 'power2.inOut',
//       })
//     },
//     { scope: containerRef_roost, dependencies: [currentIndex, scroll_items] }
//   )

//   if (!scroll_items || scroll_items.length === 0) {
//     return null
//   }

//   return (
//     <div
//       ref={containerRef_roost}
//       className={`w-full  relative flex ${side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
//     >
//       {/* 1. Sticky Media Viewport using CSS (Zero-jump pinning) */}
//       <div
//         className={`sticky  top-0 h-[100dvh] z-0 overflow-hidden  ${
//           img_fill ? 'w-full' : 'w-full'
//         }`}
//       >
//         <div className="relative w-full h-full bg-white">
//           {scroll_items.map((item, i) => (
//             <div
//               key={i}
//               className="story-image absolute inset-0"
//               style={{
//                 opacity: i === 0 ? 1 : 0,
//               }}
//             >
//               {item.media_type === 'image' && (
//                 <Image
//                   unoptimized
//                   alt={item.alt || 'story image'}
//                   fill
//                   priority={i === 0}
//                   loading={i === 0 ? 'eager' : 'lazy'}
//                   src={item.media_src}
//                   onLoad={() => ScrollTrigger.refresh()}
//                   className={`${img_fill ? 'object-cover' : 'object-contain'}`}
//                 />
//               )}

//               {item.media_type === 'video' && (
//                 <video
//                   src={item.media_src}
//                   autoPlay
//                   muted
//                   loop
//                   playsInline
//                   onLoadedData={() => ScrollTrigger.refresh()}
//                   className={`w-full h-full ${
//                     img_fill ? 'object-cover' : 'object-contain'
//                   }`}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 2. Scrollable Text Area - Controls heights and scroll triggers */}
//       <div className="w-full md:w-1/3 px-5 z-10 -ml-full md:ml-0">
//         {scroll_items.map((item, i) => (
//           <div
//             key={i}
//             className="scroll-text h-[100dvh] flex items-center justify-center"
//           >
//             <div className="bg-[#f5f0e8] p-6 rounded-xl">
//               {item.content}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ScrollSection

'use client'

import { ReactNode, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export interface ScrollItem {
  content: ReactNode
  media_src: string
  alt?: string
  media_type: string,
  caption:string
}

interface ScrollSectionProps {
  scroll_items: ScrollItem[]
  side?: string
  img_fill?: boolean
}

const ScrollSection = ({ scroll_items, side, img_fill }: ScrollSectionProps) => {
  const containerRef_roost = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentImgIndex] = useState(0)

  // Track text triggers to switch active media index
  useGSAP(
    () => {
      if (!scroll_items || scroll_items.length === 0) return

      const sections = gsap.utils.toArray<HTMLElement>('.scroll-text')
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setCurrentImgIndex(index),
          onEnterBack: () => setCurrentImgIndex(index),
        })
      })

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    },
    { scope: containerRef_roost, dependencies: [scroll_items] }
  )

  // Handle smooth media opacity transitions
  useGSAP(
    () => {
      if (!containerRef_roost.current || !scroll_items?.length) return

      const images = gsap.utils.toArray<HTMLElement>('.story-image')
      if (!images.length) return

      gsap.to(images, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      })

      gsap.to(images[currentIndex], {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.inOut',
      })
    },
    { scope: containerRef_roost, dependencies: [currentIndex, scroll_items] }
  )

  if (!scroll_items || scroll_items.length === 0) {
    return null
  }

  return (
    <div
      ref={containerRef_roost}
      className="w-full relative min-h-screen"
    >
      {/* 1. Background Sticky Media Viewport */}
      <div
        className={`sticky top-0 h-[100dvh] overflow-hidden  ${img_fill
          ? 'w-full z-0'
          : side === 'right'
            ? 'w-full md:w-2/3 md:ml-auto z-0'
            : 'w-full md:w-2/3 md:mr-auto z-0'
          }`}
      >
        <div className="relative w-full h-full bg-white   ">
          {scroll_items.map((item, i) => (
            <div
              key={i}
              className="story-image absolute inset-0 "
              style={{
                opacity: i === 0 ? 1 : 0,
              }}
            >

              {item.media_type === 'image' && (
                <div className="w-full h-full relative flex md:items-center items-start justify-center">
                  {img_fill ? (
                    // Full-bleed mode: image genuinely fills the box, so bottom-0 caption is safe
                    <>
                      <Image
                        unoptimized
                        alt={item.alt || 'story image'}
                        fill
                        priority={i === 0}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        src={item.media_src}
                        onLoad={() => ScrollTrigger.refresh()}
                        className="object-cover"
                      />
                      <p className="absolute bottom-0 left-0 right-0 z-10 px-4 py-3 text-white text-sm bg-gradient-to-t from-black/70 to-transparent">
                        {item.caption??""}
                      </p>
                    </>
                  ) : (
                    // Contain mode: image may not fill the box, so caption must follow the real image, not the container
                    <div className="relative max-w-full max-h-full">
                      <img
                        alt={item.alt || 'story image'}
                        src={item.media_src}
                        className="block max-w-full max-h-full w-auto h-auto object-contain object-top md:object-center "
                      />
                      <p className={`${item.caption?"":"hidden"} absolute bottom-0 left-0 right-0 z-10 px-4 py-3 text-white text-sm bg-gradient-to-t from-black/70 to-transparent`}>
                       {item.caption??""}
                      </p>
                    </div>
                  )}
                </div>
              )}


              {/* {item.media_type === 'image' && (
                <div className='w-full h-full relative flex flex-col'>
                  <Image
                    unoptimized
                    alt={item.alt || 'story image'}
                    fill
                    priority={i === 0}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    src={item.media_src}
                    onLoad={() => ScrollTrigger.refresh()}
                    className={`${img_fill ? 'object-cover' : 'object-contain object-top md:object-center'}`}
                  />

                  
                  <p className="absolute bottom-0 left-0 right-0 z-10 px-4 py-3 text-white text-sm bg-gradient-to-t from-black/70 to-transparent">
                    caption
                  </p>
                </div>
              )
              
              } */}

              {item.media_type === 'video' && (
                <video
                  src={item.media_src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedData={() => ScrollTrigger.refresh()}
                  className={`w-full h-full ${img_fill ? 'object-cover' : 'object-contain'
                    }`}
                />
              )}







            </div>
          ))}
        </div>

      </div>

      {/* 2. Scrollable Text Overlay Track */}
      <div
        className={`relative  -mt-[100dvh] w-full flex ${side === 'right' ? 'justify-start' : 'justify-end'
          }`}
      >
        <div className="w-full md:w-1/3 px-5">
          {scroll_items.map((item, i) => (
            <div
              key={i}
              className="scroll-text h-[100dvh] flex items-center justify-center"
            >
              <div className="bg-[#f5f0e8] p-6 rounded-xl  border-stone-200 ">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScrollSection
