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

    // Called whenever the active location changes (driven by ScrollTrigger's
    // onUpdate below, not IntersectionObserver anymore)
    const handleSectionEnter = useCallback(async (idx: number) => {
        if (idx === activeIdxRef.current) return;
        if (!controlsRef.current) return;
        if (isAnimatingRef.current) return;

        isAnimatingRef.current = true;
        const prev = activeIdxRef.current;
        activeIdxRef.current = idx;

        try {
            if (idx > prev) {
                await controlsRef.current.goToLocation(idx);
                if (idx === locations.length - 1) {
                    // Cover animateTrail's full 3500ms duration before zooming out —
                    // see ArcGISMap.tsx for why goToLocation resolves before the
                    // trail draw finishes.
                    await new Promise((r) => setTimeout(r, 3800));
                    await controlsRef.current.zoomToShowAll();
                }
            } else {
                await controlsRef.current.goToPrevLocation(idx);
            }
        } catch {
            activeIdxRef.current = prev;
        } finally {
            isAnimatingRef.current = false;
        }
    }, []);

    const handleMapReady = useCallback((controls: MapControls) => {
        controlsRef.current = controls;
    }, []);

    // ── GSAP ScrollTrigger setup ─────────────────────────────────────────────
    // useEffect(() => {
    //     const section = sectionRef.current;
    //     const panel = leftPanelRef.current;
    //     const inner = leftPanelInnerRef.current;
    //     if (!section || !panel || !inner) return;

    //     const ctx = gsap.context(() => {
    //         let st: ScrollTrigger | null = null;
    //         let resizeTimeout: ReturnType<typeof setTimeout>;
    //         let scrollDistance = 0;
    //         let breakpoints: number[] = [];

    //         const measure = () => {
    //             scrollDistance = Math.max(inner.scrollHeight - panel.clientHeight, 0);
    //             const sectionEls = Array.from(
    //                 inner.querySelectorAll<HTMLElement>("[data-section-idx]")
    //             );
    //             breakpoints = sectionEls.map((el) => el.offsetTop);
    //         };

    //         const build = () => {
    //             measure();
    //             if (scrollDistance <= 0) return;

    //             if (st) {
    //                 // Update the existing pin in place instead of destroying and
    //                 // recreating it — killing a live pinned trigger removes its
    //                 // pin-spacer for a frame, which is exactly the window where other
    //                 // ScrollTriggers further down the page (e.g. ScrollSection) can
    //                 // get their start/end measured against a temporarily-shrunk page.
    //                 st.vars.end = `+=${scrollDistance}`;
    //                 st.refresh();
    //                 return;
    //             }

    //             st = ScrollTrigger.create({
    //                 trigger: section,
    //                 start: "top top",
    //                 end: () => `+=${scrollDistance}`,
    //                 pin: true,
    //                 pinSpacing: true,
    //                 scrub: true,
    //                 anticipatePin: 1,
    //                 invalidateOnRefresh: true,
    //                 onUpdate: (self) => {
    //                     const scrollTop = self.progress * scrollDistance;
    //                     gsap.set(inner, { y: -scrollTop });
    //                     if (progressBarRef.current) {
    //                         progressBarRef.current.style.width = `${self.progress * 100}%`;
    //                     }
    //                     let idx = -1;
    //                     for (let i = 0; i < breakpoints.length; i++) {
    //                         if (scrollTop >= breakpoints[i] - 1) idx = i;
    //                     }
    //                     handleSectionEnter(idx === -1 ? 0 : idx);
    //                 },
    //             });
    //         };

    //         const initialTid = setTimeout(() => {
    //             build();
    //             // Final settle-and-broadcast refresh: fires once everything (this
    //             // section's own layout) is stable, and refreshes every ScrollTrigger
    //             // on the page — including ones created by sibling sections like
    //             // ScrollSection — so their positions are measured against the final,
    //             // full-height layout exactly once, deterministically.
    //             requestAnimationFrame(() => ScrollTrigger.refresh());
    //         }, 250);

    //         const onResize = () => {
    //             clearTimeout(resizeTimeout);
    //             resizeTimeout = setTimeout(build, 150);
    //         };
    //         window.addEventListener("resize", onResize);

    //         const ro = new ResizeObserver(() => {
    //             clearTimeout(resizeTimeout);
    //             resizeTimeout = setTimeout(build, 150);
    //         });
    //         ro.observe(inner);

    //         return () => {
    //             clearTimeout(initialTid);
    //             clearTimeout(resizeTimeout);
    //             window.removeEventListener("resize", onResize);
    //             ro.disconnect();
    //         };
    //     }, section);











    //     // const ctx0 = gsap.context(() => {
    //     //     let st: ScrollTrigger | null = null;
    //     //     let resizeTimeout: ReturnType<typeof setTimeout>;

    //     //     const build = () => {
    //     //         // Kill and rebuild cleanly — layout (heights, breakpoints) may
    //     //         // have changed since last build (resize, image load, isDesktop flip)
    //     //         st?.kill();
    //     //         gsap.set(inner, { y: 0 });

    //     //         // How far the inner content needs to travel = its natural height
    //     //         // minus the visible window (panel) height. This is the same
    //     //         // quantity a native `overflow: scroll` panel would have used as
    //     //         // scrollHeight - clientHeight — we're just driving it via transform
    //     //         // instead of native scroll, so page wheel/touch input can pin
    //     //         // properly rather than being redirected.
    //     //         const scrollDistance = Math.max(
    //     //             inner.scrollHeight - panel.clientHeight,
    //     //             0
    //     //         );
    //     //         if (scrollDistance <= 0) return;

    //     //         // Breakpoint = offsetTop of each location section within the
    //     //         // sliding inner container. Once the inner has slid past a
    //     //         // breakpoint, that location is "active."
    //     //         const sectionEls = Array.from(
    //     //             inner.querySelectorAll<HTMLElement>("[data-section-idx]")
    //     //         );
    //     //         const breakpoints = sectionEls.map((el) => el.offsetTop);

    //     //         st = ScrollTrigger.create({
    //     //             trigger: section,
    //     //             start: "top top",
    //     //             // Pinning + the exact scroll runway are both handled by
    //     //             // ScrollTrigger here — no manual wrapper height / release
    //     //             // buffer needed, and critically: nothing is intercepted until
    //     //             // the section's top has actually reached the viewport top.
    //     //             end: () => `+=${scrollDistance}`,
    //     //             pin: true,
    //     //             pinSpacing: true,
    //     //             scrub: true,
    //     //             anticipatePin: 1,
    //     //             invalidateOnRefresh: true,
    //     //             onUpdate: (self) => {
    //     //                 const scrollTop = self.progress * scrollDistance;
    //     //                 gsap.set(inner, { y: -scrollTop });

    //     //                 if (progressBarRef.current) {
    //     //                     progressBarRef.current.style.width = `${self.progress * 100}%`;
    //     //                 }

    //     //                 let idx = -1;
    //     //                 for (let i = 0; i < breakpoints.length; i++) {
    //     //                     if (scrollTop >= breakpoints[i] - 1) idx = i;
    //     //                 }
    //     //                 handleSectionEnter(idx === -1 ? 0 : idx);
    //     //             },
    //     //         });

    //     //         ScrollTrigger.refresh();
    //     //     };

    //     //     // Initial build — slight delay lets images/layout settle first
    //     //     const initialTid = setTimeout(build, 250);

    //     //     // Rebuild on resize (debounced) — heights/breakpoints depend on
    //     //     // viewport and on isDesktop-driven layout
    //     //     const onResize = () => {
    //     //         clearTimeout(resizeTimeout);
    //     //         resizeTimeout = setTimeout(build, 150);
    //     //     };
    //     //     window.addEventListener("resize", onResize);

    //     //     // Rebuild if the inner content's height changes after mount
    //     //     // (image load, font swap, etc.) — keeps breakpoints accurate
    //     //     const ro = new ResizeObserver(() => {
    //     //         clearTimeout(resizeTimeout);
    //     //         resizeTimeout = setTimeout(build, 150);
    //     //     });
    //     //     ro.observe(inner);

    //     //     return () => {
    //     //         clearTimeout(initialTid);
    //     //         clearTimeout(resizeTimeout);
    //     //         window.removeEventListener("resize", onResize);
    //     //         ro.disconnect();
    //     //     };
    //     // }, section);

    //     return () => ctx.revert();
    // }, [isDesktop, handleSectionEnter]);

    // ── GSAP ScrollTrigger setup ─────────────────────────────────────────────
useEffect(() => {
    const section = sectionRef.current;
    const panel = leftPanelRef.current;
    const inner = leftPanelInnerRef.current;
    if (!section || !panel || !inner) return;

    const ctx0 = gsap.context(() => {
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
                onUpdate: (self) => {
                    const scrollTop = self.progress * scrollDistance;
                    gsap.set(inner, { y: -scrollTop });
                    if (progressBarRef.current) {
                        progressBarRef.current.style.width = `${self.progress * 100}%`;
                    }
                    let idx = -1;
                    for (let i = 0; i < breakpoints.length; i++) {
                        if (scrollTop >= breakpoints[i] - 1) idx = i;
                    }
                    handleSectionEnter(idx === -1 ? 0 : idx);
                },
            });
        };

        // Build immediately — all left-panel box dimensions are fixed
        // synchronously (explicit width/height on every image), so the
        // pin-spacer's final height is known right away. Building it
        // synchronously, rather than after a delay, is what matters:
        // ScrollSection's own triggers (further down the page) must
        // measure themselves AFTER this pin-spacer already exists, not
        // before — otherwise a late height jump here shifts the whole
        // page under ScrollSection's feet and desyncs its onEnter state.
        build();

        // Safety net only — catches any later, unexpected shift (e.g. a
        // slow custom font swap). Does not gate ScrollSection's timing;
        // that's now handled by ordering, not by racing refreshes.
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
    }, section);

    return () => ctx0.revert();
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
            {/* ══ LEFT PANEL — text, driven by GSAP transform, not native scroll ══ */}
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
                {/* Progress bar — stays fixed at top of the panel window, outside
            the sliding inner content */}
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

                {/* Sliding content — GSAP sets its `y` transform directly */}
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
                            Perhaps since the ice ages, the harriers have been following
                            the same route and this has got hard wired into their brain.
                            When on such long-distance migrations, they have to
                            occasionally stop for a few days to refuel.
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

                    {/* ── Story sections — one per location ── */}
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
                                    alt="Northern Harrier bird"
                                    fill
                                    className={`object-cover shadow-lg rounded-2xl ${loc.img.length > 2 ? "flex" : "block"
                                        }`}
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

            {/* ══ RIGHT PANEL — map ═══════════════════════════════════════════════ */}
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