'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface ScrollItem {
  content: ReactNode
  img_src: string
  alt?: string

}

interface ScrollSectionProps {
  scroll_items: ScrollItem[]
  side?:string,
  img_fill?:boolean
}

const ScrollSection = ({ scroll_items, side, img_fill }: ScrollSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentImgIndex] = useState(0)

  // Initialize ScrollTrigger
  useEffect(() => {
    if (!scroll_items || scroll_items.length === 0) return

    const q = gsap.utils.selector(containerRef)
    const ctx = gsap.context(() => {
      // Pin image panel
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: imageRef.current,
        pinSpacing: false,
      })

      // Trigger index updates on scroll
      const sections = q('.scroll-text')
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setCurrentImgIndex(index),
          onEnterBack: () => setCurrentImgIndex(index),
        })
      })

      ScrollTrigger.refresh()
    }, containerRef)

    return () => ctx.revert()
  }, [scroll_items])

  // Handle smooth image transitions
  useEffect(() => {
    if (!containerRef.current || !scroll_items?.length) return

    const q = gsap.utils.selector(containerRef)
    const images = q('.story-image')

    if (!images.length) return

    gsap.to(images, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    })

    gsap.to(images[currentIndex], {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.inOut',
    })
  }, [currentIndex, scroll_items])

  if (!scroll_items || scroll_items.length === 0) {
    return null
  }

  return (
    <div ref={containerRef} className={`w-full relative flex ${side==="right"?"":"flex-row-reverse"}`}>
      {/* Scrollable Text Area */}
      <div className="w-1/3 px-5 z-10">
        {scroll_items.map((item, i) => (
          <div
            key={i}
            className="scroll-text h-[100dvh] flex items-center "
          >
            <div className='bg-[#f5f0e8] p-4 rounded-xl'>{item.content}</div>
          </div>
        ))}
      </div>

      {/* Sticky Image Viewport */}
      <div
        ref={imageRef}
        className={`${img_fill?"w-full":"w-2/3"} absolute ${side=="right"?"right-0":"left-0"} top-0 h-[100dvh] bg-white overflow-hidden`}
      >
        {scroll_items.map((item, i) => (
          <div
            key={i}
            className="story-image absolute inset-0"
            style={{
              opacity: i === 0 ? 1 : 0,
            }}
          >
            <Image
              unoptimized
              alt={item.alt || ''}
              fill
              src={item.img_src}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScrollSection