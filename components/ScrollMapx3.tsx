"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useCallback, useState } from "react";
import { locations } from "@/data/locations";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ArcGISMap = dynamic(() => import("@/components/ArcGISMap"), {
  ssr: false,
});

interface MapControls {
  goToLocation: (idx: number) => Promise<void>;
  goToPrevLocation: (idx: number) => Promise<void>;
  zoomToShowAll: () => Promise<void>;
}

/** Index used for the intro panel (before any location). */
const INTRO = -1;

/**
 * How far down the panel a section's top edge must reach before it counts
 * as "entered". 0.6 = when the section's top passes 60% of the panel height.
 * Raise it (e.g. 0.9) to trigger earlier, lower it (e.g. 0.3) to trigger later.
 */
const TRIGGER_RATIO = 0.6;

export default function ScrollMap() {
  const controlsRef = useRef<MapControls | null>(null);

  // What the map is currently showing
  const activeIdxRef = useRef<number>(INTRO);
  // What the scroll position is asking for (always the latest request)
  const targetIdxRef = useRef<number>(INTRO);
  const isAnimatingRef = useRef<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const leftPanelInnerRef = useRef<HTMLDivElement>(null);
  const mapPanelRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // ── Map transition queue ───────────────────────────────────────────────
  // Runs animations one at a time until the map matches the latest target.
  // Requests made mid-animation are not lost; they are picked up next loop.
  const runTransitions = useCallback(async () => {
    if (isAnimatingRef.current || !controlsRef.current) return;
    isAnimatingRef.current = true;

    try {
      while (targetIdxRef.current !== activeIdxRef.current) {
        const controls = controlsRef.current;
        if (!controls) break;

        const prev = activeIdxRef.current;
        const next = targetIdxRef.current;

        try {
          if (next === INTRO) {
            // Scrolled back to the intro → zoom out
            await controls.zoomToShowAll();
          } else if (next > prev) {
            // Moving forward (includes INTRO → 0, zooming into the first item)
            await controls.goToLocation(next);

            if (next === locations.length - 1) {
              await new Promise((r) => setTimeout(r, 3800));
              // Only zoom out if the user is still on the last item
              if (targetIdxRef.current === next) {
                await controls.zoomToShowAll();
              }
            }
          } else {
            // Moving backward between locations
            await controls.goToPrevLocation(next);
          }

          activeIdxRef.current = next;
        } catch {
          // Animation failed or was interrupted; stop and wait for next scroll
          break;
        }
      }
    } finally {
      isAnimatingRef.current = false;
    }
  }, []);

  const handleSectionEnter = useCallback(
    (idx: number) => {
      if (idx === targetIdxRef.current) return;
      targetIdxRef.current = idx;
      runTransitions();
    },
    [runTransitions]
  );

  const handleMapReady = useCallback(
    (controls: MapControls) => {
      controlsRef.current = controls;
      // If the user scrolled before the map finished loading, catch up now
      runTransitions();
    },
    [runTransitions]
  );

  // ── Scoped GSAP Setup ──────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const panel = leftPanelRef.current;
    const inner = leftPanelInnerRef.current;
    if (!section || !panel || !inner) return;

    const ctx = gsap.context(() => {
      let st: ScrollTrigger | null = null;
      let resizeTimeout: ReturnType<typeof setTimeout>;
      let scrollDistance = 0;
      let breakpoints: number[] = [];

      const measure = () => {
        scrollDistance = Math.max(inner.scrollHeight - panel.clientHeight, 0);
        const sectionEls = Array.from(
          inner.querySelectorAll<HTMLElement>("[data-section-idx]")
        );
        breakpoints = sectionEls.map((el) => el.offsetTop);
      };

      const build = () => {
        measure();
        if (scrollDistance <= 0) return;

        if (st) {
          st.vars.end = `+=${scrollDistance}`;
          st.refresh();
          return;
        }

        st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: measure,
          onUpdate: (self) => {
            const scrollTop = self.progress * scrollDistance;
            gsap.set(inner, { y: -scrollTop });

            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${self.progress * 100}%`;
            }

            // A section counts as entered once its top passes the trigger line
            const triggerLine = scrollTop + panel.clientHeight * TRIGGER_RATIO;

            let idx = INTRO;
            for (let i = 0; i < breakpoints.length; i++) {
              if (triggerLine >= breakpoints[i]) idx = i;
            }

            handleSectionEnter(idx);
          },
        });

        ScrollTrigger.refresh();
      };

      build();

      const onResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(build, 150);
      };

      window.addEventListener("resize", onResize);

      const ro = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(build, 150);
      });
      ro.observe(inner);

      return () => {
        clearTimeout(resizeTimeout);
        window.removeEventListener("resize", onResize);
        ro.disconnect();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop, handleSectionEnter]);

  return (
    <section
      ref={sectionRef}
      style={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ══ LEFT PANEL — text, driven by GSAP transform ══ */}
      <div
        ref={leftPanelRef}
        className="left-panel"
        style={{
          width: isDesktop ? "40%" : "100%",
          height: isDesktop ? "100%" : "60vh",
          order: isDesktop ? 1 : 2,
          overflow: "hidden",
          touchAction: "pan-y",
          background: "#F5F0E8",
          color: "#1a1a1a",
          position: "relative",
          flexShrink: 0,
          borderRight: isDesktop ? "1px solid rgba(0,0,0,0.08)" : "none",
          borderTop: isDesktop ? "none" : "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "rgba(0,0,0,0.08)",
            zIndex: 20,
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              height: "100%",
              width: "0%",
              background: "#8B4513",
            }}
          />
        </div>

        {/* Sliding content */}
        <div ref={leftPanelInnerRef}>
          {/* ── Intro ── */}
          <div
            style={{
              minHeight: isDesktop ? "100vh" : "60vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: isDesktop ? "0 52px" : "0 28px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "10px",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "rgba(139,69,19,0.65)",
              }}
            >
              AN INTERACTIVE JOURNEY
            </p>
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: isDesktop
                  ? "clamp(1.8rem, 3.5vw, 2.8rem)"
                  : "clamp(1.4rem, 5vw, 2rem)",
                fontWeight: 600,
                lineHeight: 1.15,
                marginTop: "20px",
                color: "#1a1a1a",
              }}
            >
              Following Gangai
            </h1>
            <p
              style={{
                marginTop: "10px",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)",
                lineHeight: 1.55,
                color: "rgba(0,0,0,0.52)",
              }}
            >
              Gangai flew along the Central Asian Flyway to reach India.
              Perhaps since the ice ages, the harriers have been following the
              same route and this has got hard wired into their brain. When on
              such long-distance migrations, they have to occasionally stop for
              a few days to refuel.
            </p>
            <p
              style={{
                marginTop: "30px",
                fontSize: "11px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.32)",
              }}
            >
              Scroll to follow the flight
            </p>
            <div
              style={{
                marginTop: "44px",
                fontSize: "20px",
                color: "rgba(0,0,0,0.28)",
                animation: "bounce 2s infinite",
              }}
            >
              ↓
            </div>
          </div>

          {/* ── Story sections ── */}
          {locations.map((loc, i) => (
            <div
              key={loc.id}
              data-section-idx={i}
              style={{
                minHeight: isDesktop ? "100vh" : "60vh",
                padding: isDesktop ? "72px 52px" : "32px 24px",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: isDesktop ? "center" : "flex-start",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "1px",
                  background: "rgba(139,69,19,0.42)",
                  margin: "14px 0",
                }}
              />

              <h2
                style={{
                  margin: 0,
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "#1a1a1a",
                }}
              >
                {loc.title}
              </h2>

              <div className="w-full flex">
                <Image
                  unoptimized
                  alt=""
                  src={loc.subtitle}
                  width={100}
                  height={100}
                  onLoad={() => ScrollTrigger.refresh()}
                  className="object-contain"
                />
              </div>

              <p
                style={{
                  marginTop: "22px",
                  fontSize: "14.5px",
                  lineHeight: 1.85,
                  color: "rgba(0,0,0,0.68)",
                }}
              >
                {loc.description}
              </p>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: isDesktop ? "300px" : "200px",
                  marginTop: "16px",
                  marginBottom: "8px",
                  flexShrink: 0,
                }}
              >
                <Image
                  unoptimized
                  src={loc.img}
                  alt={loc.title}
                  fill
                  onLoad={() => ScrollTrigger.refresh()}
                  className="object-cover shadow-lg rounded-2xl"
                />
              </div>

              {loc.neighbors.length > 0 && (
                <div
                  style={{
                    marginTop: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT PANEL — map ══ */}
      <div
        ref={mapPanelRef}
        style={{
          width: isDesktop ? "60%" : "100%",
          height: isDesktop ? "100%" : "40vh",
          order: isDesktop ? 2 : 1,
          position: "relative",
          outline: "none",
          flexShrink: 0,
          touchAction: "pan-y",
        }}
      >
        <ArcGISMap onReady={handleMapReady} />
      </div>
    </section>
  );
}