'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface ScrollItem {
  content: ReactNode
  media_src: string
  alt?: string
  media_type: string
}

interface ScrollSectionProps {
  scroll_items: ScrollItem[]
  side?: 'left' | 'right'
  img_fill?: boolean
}

const ScrollSection2 = ({ scroll_items, side = 'left', img_fill = false }: ScrollSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [currentIndex, setCurrentImgIndex] = useState(0)

  // Build + refresh triggers, waiting for media to actually load first
  useEffect(() => {
    if (!scroll_items || scroll_items.length === 0) return
    if (!containerRef.current) return

    const q = gsap.utils.selector(containerRef)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: imageRef.current,
        pinSpacing: false,
      })

      q('.scroll-text').forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setCurrentImgIndex(index),
          onEnterBack: () => setCurrentImgIndex(index),
        })
      })
    }, containerRef)

    // Don't trust trigger positions until async media has settled the layout
    const mediaEls = Array.from(
      containerRef.current.querySelectorAll('img, video')
    ) as (HTMLImageElement | HTMLVideoElement)[]

    let pending = mediaEls.length
    const markLoaded = () => {
      pending -= 1
      if (pending <= 0) ScrollTrigger.refresh()
    }

    mediaEls.forEach((el) => {
      if (el instanceof HTMLImageElement) {
        el.complete ? markLoaded() : el.addEventListener('load', markLoaded, { once: true })
      } else {
        el.readyState >= 1 ? markLoaded() : el.addEventListener('loadedmetadata', markLoaded, { once: true })
      }
    })

    const fallback = window.setTimeout(() => ScrollTrigger.refresh(), 1200)
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      ctx.revert()
      window.clearTimeout(fallback)
      window.removeEventListener('resize', onResize)
    }
  }, [scroll_items])

  // Crossfade the active image/video
  useEffect(() => {
    if (!containerRef.current || !scroll_items?.length) return
    const q = gsap.utils.selector(containerRef)
    const panels = q('.story-image')
    if (!panels.length) return

    

    gsap.to(panels, { opacity: 0, duration: 0, ease: 'power2.inOut' })
    gsap.to(panels[currentIndex], { opacity: 1, duration: 0, ease: 'power2.inOut' })

    // Only play the video that's actually in view; pause the rest so N stacked
    // sections aren't all decoding video simultaneously off-screen
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === currentIndex) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [currentIndex, scroll_items])

  if (!scroll_items || scroll_items.length === 0) return null

  return (
    <div ref={containerRef} className={`w-full relative flex ${side === 'right' ? '' : 'flex-row-reverse'}`}>
      {/* Scrollable text column */}
      <div className="md:w-1/3 px-5 z-10">
        {scroll_items.map((item, i) => (
          <div key={i} className="scroll-text h-[100dvh] flex items-center">
            <div className=" p-4 rounded-xl">{item.content}</div>
          </div>
        ))}
      </div>

      {/* Sticky media viewport */}
      <div
        ref={imageRef}
        className={`${img_fill ? 'w-full' : 'md:w-2/3'} w-full absolute z-[11] xl:z-0 ${
          side === 'right' ? 'md:right-0' : 'md:left-0'
        } top-0 h-[30vh] md:h-[100dvh] bg-white overflow-hidden`}
      >
        {scroll_items.map((item, i) => (
          <div
            key={i}
            className="story-image absolute inset-0"
            style={{ opacity: i === 0  ? 1 : 0 }}
          >
            {item.media_type === 'image' ? (
              <Image
                unoptimized
                alt={item.alt || ''}
                fill
                loading="eager"
                src={item.media_src}
                className={img_fill ? 'object-cover' : 'object-contain'}
              />
            ) : (
              <video
                ref={(el) => { videoRefs.current[i] = el }}
                className={`w-full h-full ${img_fill ? 'object-cover' : 'object-contain'}`}
                src={item.media_src}
                muted
                loop
                playsInline
                preload={i === 0 ? 'auto' : 'metadata'}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScrollSection2