'use client'

import { useEffect, useRef, useState } from 'react'
import Title from './Title'
import { responsive } from './Constants'

export interface CreditGroup {
  title: string
  names: string[]
}

interface EndCreditsProps {
  heading?: string
  groups: CreditGroup[]
  footnote?: string
}

const EndCredits = ({ heading = 'Credits', groups, footnote }: EndCreditsProps) => {
  const containerRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Remove blank names and empty groups
  const cleanGroups = groups
    .map((g) => ({ ...g, names: g.names.map((n) => n.trim()).filter(Boolean) }))
    .filter((g) => g.names.length > 0)

  // The largest group leads on the left; the rest go in the grid
  const leadIndex = cleanGroups.reduce(
    (best, g, i, arr) => (g.names.length > arr[best].names.length ? i : best),
    0
  )
  const lead = cleanGroups[leadIndex]
  const rest = cleanGroups.filter((_, i) => i !== leadIndex)

  const item = `transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
    visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
  }`
  const delay = (i: number) => ({ transitionDelay: visible ? `${(i + 1) * 100}ms` : '0ms' })

  const padding = 'px-5 md:px-20 lg:px-30'
  const label = 'mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500'

  if (!lead) return null

  return (
    <section
      ref={containerRef}
      aria-labelledby="credits-heading"
      className={`w-full bg-[#f5f0e8] pb-16 md:pb-2 md:pt-4 ${responsive}`}
    >
      <div id="credits-heading" className={`${padding} pt-5 md:pt-10`}>
        <Title mainTitle={heading} />
      </div>

      <div
        className={`${padding} mt-8 grid gap-12 md:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-0`}
      >
        {/* Lead group: one continuous list */}
        <div className={`${item} lg:pr-12`} style={delay(0)}>
          <h3 className={`${label} flex items-baseline justify-between`}>
            <span>{lead.title}</span>
            {/* <span className="font-normal tabular-nums text-neutral-400">
              {String(lead.names.length).padStart(2, '0')}
            </span> */}
          </h3>
          <ul className="columns-2 gap-x-6 text-base sm:columns-1 md:text-lg">
            {lead.names.map((name, j) => (
              <li
                key={`${name}-${j}`}
                className="break-inside-avoid   py-1.5 last:border-b-0"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        {/* Other groups */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:pl-12">
          {rest.map((group, i) => (
            <div key={group.title} className={item} style={delay(i + 1)}>
              <h3 className={label}>{group.title}</h3>
              <ul className="space-y-1 text-base md:text-lg">
                {group.names.map((name, j) => (
                  <li key={`${name}-${j}`}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {footnote && (
        <p
          className={`${item} ${padding} mt-14 text-center text-xs text-neutral-500 md:mt-20`}
          style={delay(cleanGroups.length)}
        >
          {footnote}
        </p>
      )}
    </section>
  )
}

export default EndCredits