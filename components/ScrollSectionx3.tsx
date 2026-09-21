'use client'

import { ReactNode, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollItem {
  content: ReactNode
  media_src: string
  alt?: string
  media_type: string
  caption: string
}

interface ScrollSectionProps {
  scroll_items: ScrollItem[]
  side?: string
  img_fill?: boolean
}

const ScrollSection = ({ scroll_items, side, img_fill }: ScrollSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyMediaRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentImgIndex] = useState(0)

  useGSAP(
    () => {
      if (!scroll_items || scroll_items.length === 0) return
      if (!containerRef.current || !stickyMediaRef.current) return

      // Pin the media panel explicitly through GSAP so it respects upstream pinned spacing
    //   const pinTrigger = ScrollTrigger.create({
    //     trigger: containerRef.current,
    //     start: 'top top',
    //     end: 'bottom bottom',
    //     pin: stickyMediaRef.current,
    //     pinSpacing: false,
    //     onUpdate: (self) => {
    //       const idx = Math.min(
    //         scroll_items.length - 1,
    //         Math.max(0, Math.floor(self.progress * scroll_items.length))
    //       )
    //       setCurrentImgIndex((prev) => (prev === idx ? prev : idx))
    //     },
    //     // onRefresh: (self) => {
    //     //   const idx = Math.min(
    //     //     scroll_items.length - 1,
    //     //     Math.max(0, Math.floor(self.progress * scroll_items.length))
    //     //   )
    //     //   setCurrentImgIndex((prev) => (prev === idx ? prev : idx))
    //     // },
    //   })

    const pinTrigger = ScrollTrigger.create({
  trigger: containerRef.current,
  start: "top top",
  end: "bottom bottom",

  pin: stickyMediaRef.current,
  pinSpacing: false,

  onUpdate: (self) => {
    const idx = Math.min(
      scroll_items.length - 1,
      Math.max(
        0,
        Math.floor(self.progress * scroll_items.length)
      )
    );

    setCurrentImgIndex((prev) =>
      prev === idx ? prev : idx
    );
  },
});


      return () => pinTrigger.kill()
    },
    { scope: containerRef, dependencies: [scroll_items] }
  )

  useGSAP(
    () => {
      if (!containerRef.current || !scroll_items?.length) return

      const images = gsap.utils.toArray<HTMLElement>('.story-image', containerRef.current)
      if (!images.length) return

      images.forEach((img, idx) => {
        gsap.set(img, { opacity: idx === currentIndex ? 1 : 0 })
      })
    },
    { scope: containerRef, dependencies: [currentIndex, scroll_items] }
  )

  if (!scroll_items || scroll_items.length === 0) {
    return null
  }

  return (
    <div ref={containerRef} className="w-full relative min-h-screen">
      {/* 1. Media Viewport pinned via GSAP */}
      <div
        ref={stickyMediaRef}
        className={`h-[100vh] w-full overflow-hidden ${
          img_fill
            ? 'w-full z-0'
            : side === 'right'
            ? 'w-full md:w-2/3 md:ml-auto z-0'
            : 'w-full md:w-2/3 md:mr-auto z-0'
        }`}
      >
        <div className="relative w-full h-full bg-white">
          {scroll_items.map((item, i) => (
            <div
              key={i}
              className="story-image absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {item.media_type === 'image' && (
                <div className="w-full h-full relative flex md:items-center items-start justify-center">
                  {img_fill ? (
                    <>
                      <Image
                        unoptimized
                        alt={item.alt || 'story image'}
                        fill
                        priority={i === 0}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        src={item.media_src}
                        onLoad={() => {}}
                        className="object-cover"
                      />
                      <i className="absolute bottom-0 left-0 right-0 z-10 px-4 py-3 text-white text-sm bg-gradient-to-t from-black/70 to-transparent">
                        {item.caption ?? ''}
                      </i>
                    </>
                  ) : (
                    <div className="relative max-w-full max-h-full">
                      <img
                        alt={item.alt || 'story image'}
                        src={item.media_src}
                        className="block max-w-full max-h-full w-auto h-auto object-contain object-top md:object-center"
                        onLoad={() => {}}
                      />
                      <i
                        className={`${
                          item.caption ? '' : 'hidden'
                        } absolute bottom-0 left-0 right-0 z-10 px-4 py-3 text-white text-sm bg-gradient-to-t from-black/70 to-transparent`}
                      >
                        {item.caption ?? ''}
                      </i>
                    </div>
                  )}
                </div>
              )}

              {item.media_type === 'video' && (
                <video
                  src={item.media_src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedData={() => {}}
                  className={`w-full h-full ${
                    img_fill ? 'object-cover' : 'object-contain'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Scrollable Text Overlay Track */}
      <div
        className={`relative -mt-[100vh] w-full flex ${
          side === 'right' ? 'justify-start' : 'justify-end'
        }`}
      >
        <div className="w-full md:w-1/3 px-5">
          {scroll_items.map((item, i) => (
            <div
              key={i}
              className="scroll-text h-[100vh] flex items-center justify-center"
            >
              <div className="bg-[#f5f0e8] p-6 rounded-xl border-stone-200">
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