'use client'

import { useEffect, useRef, useState } from 'react'
import Title from './Title'

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
          observer.disconnect() // animate only once
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const item = `transition-all duration-700 ease-out motion-reduce:transition-none ${
    visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
  }`

  return (
    <section ref={containerRef} className="w-full bg-[#f5f0e8] px-5 py-16 md:pt-24">
      <div className="mx-auto max-w-5xl">
        <div className='my-5'> 
            <Title  mainTitle='Credits '/>

        </div>
       

        <div className="grid gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-3 lg:gap-12">
          {groups.map((group, i) => (
            <div
              key={group.title}
              className={item}
              style={{ transitionDelay: visible ? `${(i + 1) * 100}ms` : '0ms' }}
            >
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                {group.title}
              </h3>
              <ul className="space-y-1 text-base md:text-lg">
                {group.names.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {footnote && (
          <p
            className={`${item} mt-12 text-center text-xs text-neutral-500 md:mt-16`}
            style={{ transitionDelay: visible ? `${(groups.length + 1) * 100}ms` : '0ms' }}
          >
            {footnote}
          </p>
        )}
      </div>

      
    </section>
  )
}

export default EndCredits