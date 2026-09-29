"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { predators_show } from "./Constants";
import Title from "./Title";


type Props = {
 
  initialId?: string;
  title?: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export default function PredatorShowcase({
  
  initialId,
  title = " Predators",
}: Props) {

    const items = predators_show;
  const [activeIndex, setActiveIndex] = useState(() => {
    const i = items.findIndex((p) => p.id === initialId);
    return i >= 0 ? i : 0;
  });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const baseId = useId();

  const active = items[activeIndex];
  if (!active) return null;

  const select = (index: number, moveFocus = false) => {
    setActiveIndex(index);
    const tab = tabRefs.current[index];
    if (moveFocus) tab?.focus();
    tab?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  // Arrow keys / Home / End move between species (WAI-ARIA tabs pattern)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    const map: Record<string, number> = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  };

  return (
   
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 ">
        <Title mainTitle="The predators are always lurking"/>
        

        {/* Stage: photo / video of the selected species */}
        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active.id}`}
          className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#111811] sm:aspect-video mt-10"
        >
          {items.map((p, i) => (
            <MediaLayer
              key={p.id}
              predator={p}
              isActive={i === activeIndex}
              priority={i === 0}
              reducedMotion={reducedMotion}
            />
          ))}

          {/* Caption */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-24 sm:p-8 sm:pt-32">
            <div aria-live="polite" className="w-full">
              <p className=" text-3xl text-white leading-none sm:text-5xl">{active.name}</p>
              <p className="mt-2 text-base italic text-white sm:text-lg">
                {active.scientificName}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#ECE6D6]/90 sm:text-base">
                {active.fact}
              </p>
             
            </div>
          </div>
        </div>

        {/* Rail: illustration + name for each species */}
        <div
          role="tablist"
          aria-label="Choose a predator"
          onKeyDown={onKeyDown}
          className="mt-4 grid auto-cols-[minmax(7.5rem,1fr)] grid-flow-col gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] snap-x snap-mandatory"
        >
          {items.map((p, i) => {
            const selected = i === activeIndex;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`${baseId}-tab-${p.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                className={[
                  "group relative flex snap-start flex-col items-center gap-2 px-2 pb-3 pt-4 text-center cursor-pointer",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[#D4A24C] focus-visible:ring-offset-2 ",
                  "motion-safe:transition-colors",
                  selected ? "" : "hover:bg-[#222C24]",
                ].join(" ")}
              >
                <span className="relative h-16 w-16 sm:h-30 sm:w-30">
                  <Image
                  unoptimized
                    src={p.illustration}
                    alt=""
                    fill
                    sizes="80px"
                    className={[
                      "object-contain motion-safe:transition-opacity",
                      selected ? "opacity-100" : "opacity-50 group-hover:opacity-80",
                    ].join(" ")}
                  />
                </span>
                <span
                  className={[
                    "text-sm leading-snug text-black", 
                    selected ? "text-[#ECE6D6]" : "text-[#ECE6D6]/60 group-hover:text-[#ECE6D6]/85",
                  ].join(" ")}
                >
                  {p.name}
                </span>
                {/* Selected indicator */}
                <span
                  aria-hidden
                  className={[
                    "absolute inset-x-3 bottom-0 h-0.5 origin-left bg-[#D4A24C] motion-safe:transition-transform motion-safe:duration-300",
                    selected ? "scale-x-100" : "scale-x-0",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>
    
  );
}

function MediaLayer({
  predator,
  isActive,
  priority,
  reducedMotion,
}: {
  predator: any;
  isActive: boolean;
  priority: boolean;
  reducedMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { media } = predator;

  // Play the active video from the start; pause the rest
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive && !reducedMotion) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive, reducedMotion]);

  return (
    <div
      aria-hidden={!isActive}
      className={[
        "absolute inset-0 motion-safe:transition-opacity motion-safe:duration-500",
        isActive ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      {media.type === "image" ? (
        <Image
        unoptimized
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          aria-label={media.alt}
          muted
          loop
          playsInline
          preload={isActive ? "auto" : "none"}
          controls={reducedMotion}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}