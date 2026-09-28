'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export interface ScrollItem {
  content: ReactNode
  media_src: string
  alt?: string
  media_type: string
  caption?: string
}

interface ScrollSectionProps {
  scroll_items: ScrollItem[]
  side?: 'left' | 'right' | string
  img_fill?: boolean
  /** Restart a video from the beginning each time its slide becomes active */
  restartVideos?: boolean
}

const ScrollSection = ({
  scroll_items,
  side,
  img_fill,
  restartVideos = false,
}: ScrollSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sectionInView, setSectionInView] = useState(false)

  // Scroll triggers: which slide is active, and whether the section is on screen
  useGSAP(
    () => {
      if (!scroll_items?.length) return

      const sections = gsap.utils.toArray<HTMLElement>('.scroll-text', containerRef.current)
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          refreshPriority: -1,
          onToggle: (self) => {
            if (self.isActive) setCurrentIndex(index)
          },
        })
      })

      // Section visibility, used to play/pause videos
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 75%',
        end: 'bottom 25%',
        onToggle: (self) => setSectionInView(self.isActive),
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
    },
    { scope: containerRef, dependencies: [scroll_items] }
  )

  // Show only the active slide's media
  useGSAP(
    () => {
      const layers = gsap.utils.toArray<HTMLElement>('.story-image', containerRef.current)
      if (!layers.length) return
      gsap.set(layers, { opacity: 0 })
      gsap.set(layers[currentIndex], { opacity: 1 })
    },
    { scope: containerRef, dependencies: [currentIndex, scroll_items] }
  )

  if (!scroll_items?.length) return null

  const mediaWidth = img_fill
    ? 'w-full'
    : side === 'right'
      ? 'w-full md:w-2/3 md:ml-auto'
      : 'w-full md:w-2/3 md:mr-auto'

  return (
    <div ref={containerRef} className="relative min-h-screen w-full">
      {/* 1. Sticky media viewport */}
      <div className={`sticky top-0 z-0 h-[100dvh] overflow-hidden ${mediaWidth}`}>
        <div className="relative h-full w-full bg-white">
          {scroll_items.map((item, i) => {
            const isActive = i === currentIndex
            return (
              <div
                key={i}
                className={`story-image absolute inset-0 ${isActive ? '' : 'pointer-events-none'}`}
                style={{ opacity: i === 0 ? 1 : 0 }}
                aria-hidden={!isActive}
              >
                {item.media_type === 'image' &&
                  (img_fill ? (
                    // Full-bleed: image fills the box, caption sits on the bottom edge
                    <div className="relative h-full w-full">
                      <Image
                        unoptimized
                        alt={item.alt || item.caption || 'Story image'}
                        src={item.media_src}
                        fill
                        priority={i === 0}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        onLoad={() => ScrollTrigger.refresh()}
                        className="object-cover"
                      />
                      {item.caption && <Caption text={item.caption} />}
                    </div>
                  ) : (
                    // Contain: caption follows the real image edges, not the container
                    <div className="flex h-full w-full items-start justify-center md:items-center">
                      <figure className="relative m-0 inline-block max-h-full max-w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={item.alt || item.caption || 'Story image'}
                          src={item.media_src}
                          loading={i === 0 ? 'eager' : 'lazy'}
                          onLoad={() => ScrollTrigger.refresh()}
                          className="block h-auto max-h-[100dvh] w-auto max-w-full"
                        />
                        {item.caption && <Caption text={item.caption} />}
                      </figure>
                    </div>
                  ))}

                {item.media_type === 'video' && (
                  <VideoPlayer
                    src={item.media_src}
                    caption={item.caption}
                    label={item.alt || item.caption || 'Story video'}
                    shouldPlay={sectionInView && isActive}
                    interactive={isActive}
                    restart={restartVideos}
                    fill={!!img_fill}
                    preload={i === 0 ? 'auto' : 'metadata'}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Scrolling text cards over the media.
          pointer-events-none lets clicks reach the video controls underneath;
          the cards themselves re-enable it so links inside them still work. */}
      <div
        className={`pointer-events-none relative -mt-[100dvh] flex w-full ${side === 'right' ? 'justify-start' : 'justify-end'
          }`}
      >
        <div className="w-full px-5 md:w-1/3">
          {scroll_items.map((item, i) => (
            <div key={i} className="scroll-text flex h-[100dvh] items-center justify-center">
              <div className="pointer-events-auto rounded-xl bg-[#f5f0e8] p-6">{item.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */

function Caption({ text }: { text: string }) {
  return (
    <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-3 pt-10 text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.6)]">
      <p className="text-xs italic leading-snug">{text}</p>
    </figcaption>
  )
}

interface VideoPlayerProps {
  src: string
  label: string
  caption?: string
  /** Scroll position says this video should be playing */
  shouldPlay: boolean
  /** Only the visible slide's controls can be clicked or focused */
  interactive: boolean
  restart: boolean
  fill: boolean
  preload: 'auto' | 'metadata'
}

function VideoPlayer({
  src,
  label,
  caption,
  shouldPlay,
  interactive,
  restart,
  fill,
  preload,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // If the viewer pauses manually, scrolling shouldn't override that until they leave the slide
  const userPausedRef = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Scroll-driven play / pause
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (shouldPlay) {
      if (userPausedRef.current) return
      if (restart && v.paused) v.currentTime = 0
      v.play().catch(() => setPlaying(false))
    } else {
      v.pause()
      userPausedRef.current = false
    }
  }, [shouldPlay, restart])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      userPausedRef.current = false
      v.play().catch(() => setPlaying(false))
    } else {
      userPausedRef.current = true
      v.pause()
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const seek = (value: number) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = value
    setTime(value)
  }

  const enterFullscreen = () => {
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (!v) return
    if (v.requestFullscreen) v.requestFullscreen().catch(() => { })
    else v.webkitEnterFullscreen?.() // iPhone Safari
  }

  const tab = interactive ? 0 : -1

  return (
    <figure className="relative m-0 h-full w-full">
      <video
        ref={videoRef}
        src={src}
        aria-label={label}
        muted
        loop
        playsInline
        preload={preload}
        // onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onLoadedData={() => ScrollTrigger.refresh()}
        className={`h-full w-full cursor-pointer ${fill ? 'object-cover' : 'object-contain'}`}
      />

      <figcaption className="absolute hidden inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-3 pt-12 text-white">
        {caption && (
          <p className="mb-2 text-xs italic leading-snug [text-shadow:0_1px_2px_rgb(0_0_0/0.6)]">
            {caption}
          </p>
        )}

        <div className="flex items-center gap-3">
          <ControlButton label={playing ? 'Pause video' : 'Play video'} onClick={togglePlay} tabIndex={tab}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </ControlButton>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => seek(Number(e.target.value))}
            tabIndex={tab}
            aria-label="Seek"
            aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-[#f5f0e8]"
          />

          <span className="shrink-0 text-xs tabular-nums text-white/85">
            {formatTime(time)} / {formatTime(duration)}
          </span>

          <ControlButton label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute} tabIndex={tab}>
            {muted ? <MutedIcon /> : <VolumeIcon />}
          </ControlButton>

          <ControlButton label="Full screen" onClick={enterFullscreen} tabIndex={tab}>
            <FullscreenIcon />
          </ControlButton>
        </div>
      </figcaption>
    </figure>
  )
}

function ControlButton({
  label,
  onClick,
  tabIndex,
  children,
}: {
  label: string
  onClick: () => void
  tabIndex: number
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      tabIndex={tabIndex}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      {children}
    </button>
  )
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/* Icons (inline so there's no extra dependency) */
const iconProps = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true }

const PlayIcon = () => (
  <svg {...iconProps}><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
)
const PauseIcon = () => (
  <svg {...iconProps}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
)
const VolumeIcon = () => (
  <svg {...iconProps}>
    <path d="M4 9v6h4l5 4V5L8 9H4Z" />
    <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const MutedIcon = () => (
  <svg {...iconProps}>
    <path d="M4 9v6h4l5 4V5L8 9H4Z" />
    <path d="m16.5 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const FullscreenIcon = () => (
  <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
)

export default ScrollSection