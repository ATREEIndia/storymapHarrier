"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useCallback, useState } from "react";
import { locations } from "@/data/locations";
import { responsive } from "./Constants";
import Image from "next/image";

const ArcGISMap = dynamic(
  () => import("@/components/ArcGISMap"),
  { ssr: false }
);

interface MapControls {
  goToLocation: (idx: number) => Promise<void>;
  goToPrevLocation: (idx: number) => Promise<void>;
  zoomToShowAll: () => Promise<void>;
}

export default function ScrollMap() {
  const controlsRef = useRef<MapControls | null>(null);
  const activeIdxRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const mapPanelRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  // True once the intro has fully left the left panel's viewport.
  // Starts false — the intro fills the panel on load, so scroll is
  // locked until an IntersectionObserver confirms it has exited.
  const introGoneRef = useRef<boolean>(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect screen size on mount and on resize
  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkSize(); // run immediately on mount
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Called by IntersectionObserver when a section enters the left panel
  const handleSectionEnter = useCallback(async (idx: number) => {
    console.log("handleSectionEnter fired with idx:", idx,
      "active:", activeIdxRef.current,
      "animating:", isAnimatingRef.current);
    // Skip if already at this location
    if (idx === activeIdxRef.current) return;
    // Skip if no controls yet
    if (!controlsRef.current) return;
    // Skip if already animating TO this exact index
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const prev = activeIdxRef.current;

    // Update immediately so rapid scroll does not queue duplicates
    activeIdxRef.current = idx;

    try {
      if (idx > prev) {
        await controlsRef.current.goToLocation(idx);
        // After last location, zoom out to show full journey
        if (idx === locations.length - 1) {
          // Wait for the trail animation to finish landing the bird before
          // zooming out. goToLocation now resolves as soon as the camera
          // pan completes (the trail draw runs in the background, see
          // ArcGISMap.tsx), so this must cover animateTrail's full fixed
          // 3500ms duration or zoomToShowAll cancels it mid-flight.
          await new Promise((r) => setTimeout(r, 3800));
          await controlsRef.current.zoomToShowAll();
        }
      } else {
        await controlsRef.current.goToPrevLocation(idx);
      }
    } catch {
      // Restore on error
      activeIdxRef.current = prev;
    } finally {
      isAnimatingRef.current = false;
    }
  }, []);

  // Called once the map component has finished initializing
  const handleMapReady = useCallback((controls: MapControls) => {
    controlsRef.current = controls;
  }, []);

  useEffect(() => {
    const panel = leftPanelRef.current;
    const map = mapPanelRef.current;
    if (!panel || !map) return;

    // ── Progress bar ──────────────────────────────────────────────────────
    // Updates as user scrolls the left panel
    const onPanelScroll = () => {
      const bar = progressBarRef.current;
      if (!bar) return;
      const max = panel.scrollHeight - panel.clientHeight;
      const pct = max > 0 ? (panel.scrollTop / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    };
    panel.addEventListener("scroll", onPanelScroll, { passive: true });

    // ── Intro scroll lock ───────────────────────────────────────────────────
    // Blocks downward scroll of the left panel past the point where the
    // intro div has fully exited its viewport. Shared by every input path
    // that can move panel.scrollTop (direct panel wheel/touch, and the
    // map-panel redirect below) so the lock holds no matter which side of
    // the screen the user is scrolling from.
    // Returns true if the delta was blocked/clamped (caller should
    // preventDefault and skip its normal scroll action).
    const clampIntroLock = (delta: number): boolean => {
      if (introGoneRef.current) return false; // intro confirmed gone — no lock
      if (delta <= 0) return false;            // only downward scroll is locked
      const intro = introRef.current;
      if (!intro) return false;

      const introBottom = intro.offsetTop + intro.offsetHeight;

      if (panel.scrollTop >= introBottom) {
        // Already scrolled past the intro (e.g. the sections observer's
        // introGoneRef update hasn't landed yet) — release instead of
        // blocking, so the user is never stranded at the boundary.
        introGoneRef.current = true;
        return false;
      }

      if (panel.scrollTop + delta >= introBottom) {
        // This tick would jump past the intro's exit point — clamp exactly
        // to the boundary instead of blocking outright, so scroll still
        // feels responsive right up to where the intro finishes leaving.
        panel.scrollTop = introBottom;
        return true;
      }
      return false; // still within the intro — let it scroll naturally
    };

    // ── Redirect map panel scroll to left panel ───────────────────────────
    // Wheel events on map → scroll left panel
    const onMapWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (clampIntroLock(e.deltaY)) return;
      panel.scrollBy({ top: e.deltaY, behavior: "auto" });
    };

    // Touch events on map → scroll left panel
    let touchStartY = 0;
    const onMapTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onMapTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      if (clampIntroLock(dy)) return;
      panel.scrollBy({ top: dy, behavior: "auto" });
    };

    // Keyboard scroll — works when map panel is focused
    const onMapKeyDown = (e: KeyboardEvent) => {
      const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "];
      if (!scrollKeys.includes(e.key)) return;
      e.preventDefault();
      const amount = ["PageDown", "PageUp"].includes(e.key)
        ? panel.clientHeight * 0.8 : 120;
      const dir = ["ArrowUp", "PageUp"].includes(e.key) ? -1 : 1;
      const delta = amount * dir;
      if (clampIntroLock(delta)) return;
      panel.scrollBy({ top: delta, behavior: "smooth" });
    };

    // Use capture:true so our handler fires before ArcGIS intercepts events
    map.addEventListener("wheel", onMapWheel, { passive: false, capture: true });
    map.addEventListener("touchstart", onMapTouchStart, { passive: false });
    map.addEventListener("touchmove", onMapTouchMove, { passive: false, capture: true });
    map.addEventListener("keydown", onMapKeyDown);
    map.tabIndex = 0; // make focusable for keyboard

    // ── Lock direct scroll on the left panel itself ────────────────────────
    // Same clamp, applied to wheel/touch events that originate on the
    // panel (as opposed to the map-redirect path above).
    const onPanelWheel = (e: WheelEvent) => {
      if (clampIntroLock(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    let panelTouchStartY = 0;
    const onPanelTouchStart = (e: TouchEvent) => {
      panelTouchStartY = e.touches[0].clientY;
    };
    const onPanelTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const dy = panelTouchStartY - currentY;
      panelTouchStartY = currentY;
      if (clampIntroLock(dy)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    panel.addEventListener("wheel", onPanelWheel, { passive: false, capture: true });
    panel.addEventListener("touchstart", onPanelTouchStart, { passive: false });
    panel.addEventListener("touchmove", onPanelTouchMove, { passive: false, capture: true });

    // ── Watch the intro div — lock scroll while it is visible ──────────────
    // Fires when the intro fully enters or leaves the left panel viewport
    let introObserver: IntersectionObserver | null = null;
    if (introRef.current) {
      introObserver = new IntersectionObserver(
        ([entry]) => {
          introGoneRef.current = !entry.isIntersecting;
        },
        { root: panel, threshold: 0 }
      );
      introObserver.observe(introRef.current);
    }

    // ── IntersectionObserver — watches story sections ─────────────────────
    // Fires when a section enters the visible area of the left panel
    let observer: IntersectionObserver | null = null;
    const tid = setTimeout(() => {
      const sections = panel.querySelectorAll("[data-section-idx]");
      if (sections.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          // Pick the most-visible section rather than reacting to every
          // entry — on mobile, sections can be tall enough that more than
          // one crosses a threshold in the same batch.
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length === 0) return;
          // Safety net: even if the wheel/touch lock below fails to
          // block a scroll, do not trigger map animations until the
          // intro has been confirmed fully out of view.
          if (!introGoneRef.current) return;

          const idx = Number(
            visible[0].target.getAttribute("data-section-idx")
          );
          handleSectionEnter(idx);
        },
        {
          root: panel,  // observe relative to left panel not window
          // Multiple thresholds: on desktop, sections match the panel
          // height exactly so 0.9 fires cleanly. On mobile, sections are
          // fixed to the panel's 60vh but inner content can still cause
          // slight variance, so the lower thresholds catch the transition
          // reliably as one section replaces another.
          threshold: [0.1, 0.4, 0.6, 0.9],
        }
      );

      sections.forEach((s) => observer!.observe(s));
    }, 200);

    return () => {
      clearTimeout(tid);
      if (observer) observer.disconnect();
      if (introObserver) introObserver.disconnect();
      panel.removeEventListener("scroll", onPanelScroll);
      panel.removeEventListener("wheel", onPanelWheel, { capture: true });
      panel.removeEventListener("touchstart", onPanelTouchStart);
      panel.removeEventListener("touchmove", onPanelTouchMove, { capture: true });
      map.removeEventListener("wheel", onMapWheel, { capture: true });
      map.removeEventListener("touchstart", onMapTouchStart);
      map.removeEventListener("touchmove", onMapTouchMove, { capture: true });
      map.removeEventListener("keydown", onMapKeyDown);
    };
  }, [handleSectionEnter]);

  return (
    <section style={{
      display: "flex",
      flexDirection: isDesktop ? "row" : "column",
      width: "100%",
      height: "100vh",
      overflow: "hidden",
    }}>

      {/* ══ LEFT PANEL — scrollable text ═════════════════════════════════ */}
      <div
        ref={leftPanelRef}
        className="left-panel"
        style={{
          width: isDesktop ? "40%" : "100%",
          height: isDesktop ? "100%" : "60vh",
          order: isDesktop ? 1 : 2,
          overflowY: "scroll",
          overflowX: "hidden",
          scrollbarWidth: "none",
          background: "#F5F0E8",
          color: "#1a1a1a",
          position: "relative",
          flexShrink: 0,
          borderRight: isDesktop ? "1px solid rgba(0,0,0,0.08)" : "none",
          borderTop: isDesktop ? "none" : "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* Progress bar — sticky at top of left panel */}
        <div style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(0,0,0,0.08)",
          zIndex: 20,
          flexShrink: 0,
        }}>
          <div
            ref={progressBarRef}
            style={{
              height: "100%",
              width: "0%",
              background: "#8B4513",
              transition: "width 0.08s linear",
            }}
          />
        </div>

        {/* ── Intro ── */}
        <div
          ref={introRef}
          style={{
            minHeight: isDesktop ? "100vh" : "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isDesktop ? "0 52px" : "0 28px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}>
          <p style={{
            margin: 0,
            fontSize: "10px",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(139,69,19,0.65)",
          }}>
            AN INTERACTIVE JOURNEY
          </p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: isDesktop
              ? "clamp(1.8rem, 3.5vw, 2.8rem)"
              : "clamp(1.4rem, 5vw, 2rem)",
            fontWeight: 600,
            lineHeight: 1.15,
            marginTop: "20px",
            color: "#1a1a1a",
          }}>
            Following Gangai
          </h1>
          <p style={{
            marginTop: "10px",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)",
            lineHeight: 1.55,
            color: "rgba(0,0,0,0.52)",
          }}>
            Gangai will fly along the Central Asian Flyway to reach India. Perhaps since the ice ages,  the harriers have been following the same route and this has got hard wired into their brain. When on such long distance migrations, Gangai has to occasionally stop to refuel for a couple of days.
          </p>
          <p style={{
            marginTop: "30px",
            fontSize: "11px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.32)",
          }}>
            Scroll to follow the flight
          </p>
          <div style={{
            marginTop: "44px",
            fontSize: "20px",
            color: "rgba(0,0,0,0.28)",
            animation: "bounce 2s infinite",
          }}>
            ↓
          </div>
        </div>

        {/* ── Story sections — one per location ── */}
        {locations.map((loc, i) => (
          <div
            key={loc.id}
            data-section-idx={i}
            style={{
              minHeight: isDesktop ? "100vh" : "60vh",
              // Fixed (not auto) on mobile so each section matches the
              // panel's 60vh viewport exactly — required for the
              // IntersectionObserver's thresholds to be reachable.
              height: isDesktop ? "100vh" : "60vh",
              padding: isDesktop ? "72px 52px" : "32px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: isDesktop ? "center" : "flex-start",
              overflowY: isDesktop ? "visible" : "auto",
              overflowX: "hidden",
            }}
          >
            {/* Index counter */}
            <p style={{
              margin: 0,
              fontSize: "10px",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "rgba(139,69,19,0.62)",
            }}>
              {String(i + 1).padStart(2, "0")} &nbsp;/&nbsp; {String(locations.length).padStart(2, "0")}
            </p>

            {/* Divider line */}
            <div style={{
              width: "36px",
              height: "1px",
              background: "rgba(139,69,19,0.42)",
              margin: "14px 0",
            }} />

            {/* Title */}
            <h2 style={{
              margin: 0,
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#1a1a1a",
            }}>
              {loc.title}
            </h2>

            {/* Subtitle */}
            <p style={{
              margin: "6px 0 0",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.40)",
            }}>
              {loc.subtitle}
            </p>

            {/* Description */}
            <p style={{
              marginTop: "22px",
              fontSize: "14.5px",
              lineHeight: 1.85,
              color: "rgba(0,0,0,0.68)",
            }}>
              {loc.description}
            </p>

            <div style={{
              position: "relative",
              width: "100%",
              height: isDesktop ? "300px" : "200px",
              marginTop: "16px",
              marginBottom: "8px",
              flexShrink: 0,
            }}>
                    <Image
                    unoptimized
                      src={loc.img}
                      alt="Northern Harrier bird"
                      fill
                      className={`object-cover shadow-lg rounded-2xl ${loc.img.length>2?"flex":"block"}`}
                    />
                    {/* <p className="absolute bottom-3 bg-black/45  right-3 z-10 text-xs  opacity-70 px-2 text-white">Pc: Illustrations of TG, Arjun( phd student), Prashanth (researcher) and Chian (Field researcher )</p> */}
                  </div>

            {/* Neighbor legend */}
            {loc.neighbors.length > 0 && (
              <div style={{
                marginTop: "28px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>


              </div>
            )}
          </div>
        ))}

        {/* ── Outro ── */}
        {/* <div style={{
          minHeight: isDesktop ? "60vh" : "40vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isDesktop ? "0 52px" : "0 28px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}>
          <p style={{
            margin: 0,
            fontSize: "10px",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "rgba(139,69,19,0.62)",
          }}>
            JOURNEY&apos;S END
          </p>

          <div style={{
            width: "36px",
            height: "1px",
            background: "rgba(139,69,19,0.42)",
            margin: "14px 0",
          }} /> */}

          {/* <h2 style={{
            margin: 0,
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#1a1a1a",
          }}>
            A Life of Return
          </h2>

          <p style={{
            marginTop: "22px",
            fontSize: "14.5px",
            lineHeight: 1.85,
            color: "rgba(0,0,0,0.68)",
          }}>
            Each year Gangai retraced this same arc between Kazakhstan and Maharashtra —
            a route etched into him before he ever flew it alone. His journey, tracked one
            GPS ping at a time, shows how the grassland corridors of seven countries must
            stay intact for a single bird to keep finding his way home.
          </p> */}
        {/* </div> */}
      </div>

      {/* ══ RIGHT PANEL — map ═════════════════════════════════════════════ */}
      <div
        ref={mapPanelRef}
        style={{
          width: isDesktop ? "60%" : "100%",
          height: isDesktop ? "100%" : "40vh",
          order: isDesktop ? 2 : 1,
          position: "relative",
          outline: "none",
          flexShrink: 0,
        }}
      >
        <ArcGISMap onReady={handleMapReady} />
      </div>
    </section>
  );
}
