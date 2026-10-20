'use client'
import React, { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { responsive } from './Constants'

type probs = {
    beforeSrc?: string;
    afterSrc?: string;
    beforeLabel?: string;
    afterLabel?: string;
    caption?: string;
    initialPosition?: number;
    customClass?: string
}

const BeforeAfterSlider = ({
    beforeSrc = '/before.JPG',
    afterSrc = '/after.JPG',
    beforeLabel = 'Before',
    afterLabel = 'After',
    caption,
    initialPosition = 50,
    customClass = ''
}: probs) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState(initialPosition)
    const [dragging, setDragging] = useState(false)

    const updateFromClientX = useCallback((clientX: number) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        const pct = ((clientX - rect.left) / rect.width) * 100
        setPosition(Math.min(100, Math.max(0, pct)))
    }, [])

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
        updateFromClientX(e.clientX)
    }

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (dragging) updateFromClientX(e.clientX)
    }

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId)
        setDragging(false)
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const step = e.shiftKey ? 10 : 2
        if (e.key === 'ArrowLeft') setPosition(p => Math.max(0, p - step))
        else if (e.key === 'ArrowRight') setPosition(p => Math.min(100, p + step))
        else if (e.key === 'Home') setPosition(0)
        else if (e.key === 'End') setPosition(100)
        else return
        e.preventDefault()
    }

    return (
        <div className={`${responsive} ${customClass} h-dvh`}>
            <div
                ref={containerRef}
                className="relative w-full aspect-[4/3] max-h-screen   mx-auto overflow-hidden rounded-2xl shadow-lg select-none touch-pan-y cursor-ew-resize"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                {/* After image (bottom layer) */}
                <Image
                    src={afterSrc}
                    alt={afterLabel}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover pointer-events-none"
                    draggable={false}
                />

                {/* Before image (top layer, clipped) */}
                <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                >
                    <Image
                        src={beforeSrc}
                        alt={beforeLabel}
                        fill
                        sizes="(max-width: 1024px) 100vw, 1024px"
                        className="object-cover pointer-events-none"
                        draggable={false}
                    />
                </div>

                {/* Labels */}
                <span className="absolute top-3 left-3 z-10 bg-black/50 text-white text-xs md:text-sm px-2 py-1 rounded">
                    {beforeLabel}
                </span>
                <span className="absolute top-3 right-3 z-10 bg-black/50 text-white text-xs md:text-sm px-2 py-1 rounded">
                    {afterLabel}
                </span>

                {/* Divider + handle */}
                <div
                    className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_6px_rgba(0,0,0,0.5)] pointer-events-none"
                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                />
                <div
                    role="slider"
                    tabIndex={0}
                    aria-label="Before and after comparison"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(position)}
                    onKeyDown={onKeyDown}
                    className="absolute top-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-amber-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/60"
                    style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 6 3 12 9 18" />
                        <polyline points="15 6 21 12 15 18" />
                    </svg>
                </div>

                {caption && (
                    <p className="absolute bottom-3 right-3 z-10 bg-black/45 text-xs opacity-70 px-2 text-white">{caption}</p>
                )}
            </div>
        </div>
    )
}

export default BeforeAfterSlider
