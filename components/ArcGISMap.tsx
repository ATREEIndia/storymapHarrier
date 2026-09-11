"use client";

import { useEffect, useRef } from "react";
import { locations } from "@/data/locations";

// All ArcGIS imports are DYNAMIC inside initMap.
// NEVER import ArcGIS at top level — it crashes Next.js SSR.

interface MapControls {
  goToLocation: (idx: number) => Promise<void>;
  goToPrevLocation: (idx: number) => Promise<void>;
  zoomToShowAll: () => Promise<void>;
}

interface Props {
  onReady: (controls: MapControls) => void;
}

// ── 1. Easing ──────────────────────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ── 2. Bearing calculation ─────────────────────────────────────────────────
// Returns the compass bearing in degrees (0-360) from point A to point B.
// Used to rotate the bird image to face direction of travel.
// from and to are [longitude, latitude] arrays (ArcGIS coordinate order).
function calculateBearing(from: number[], to: number[]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const lat1 = toRad(from[1]);
  const lat2 = toRad(to[1]);
  const dLng = toRad(to[0] - from[0]);
  const x = Math.sin(dLng) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2)
    - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(x, y)) + 360) % 360;
}

// ── 3. Catmull-Rom spline ──────────────────────────────────────────────────
// Takes an array of waypoints and returns a smooth curved path
// that passes through ALL points. Returns [longitude, latitude] pairs
// because ArcGIS Polyline paths use [lng, lat] order.
function getCatmullRomPoints(
  waypoints: { lat: number; lng: number }[],
  steps: number = 80
): number[][] {
  if (waypoints.length < 2) return [];

  // Duplicate first and last for Catmull-Rom phantom points
  const pts = [
    waypoints[0],
    ...waypoints,
    waypoints[waypoints.length - 1],
  ];

  const result: number[][] = [];

  for (let i = 1; i < pts.length - 2; i++) {
    const p0 = pts[i - 1], p1 = pts[i],
      p2 = pts[i + 1], p3 = pts[i + 2];

    for (let j = 0; j <= steps; j++) {
      const t = j / steps;
      const t2 = t * t;
      const t3 = t2 * t;

      const lat = 0.5 * (
        2 * p1.lat +
        (-p0.lat + p2.lat) * t +
        (2 * p0.lat - 5 * p1.lat + 4 * p2.lat - p3.lat) * t2 +
        (-p0.lat + 3 * p1.lat - 3 * p2.lat + p3.lat) * t3
      );
      const lng = 0.5 * (
        2 * p1.lng +
        (-p0.lng + p2.lng) * t +
        (2 * p0.lng - 5 * p1.lng + 4 * p2.lng - p3.lng) * t2 +
        (-p0.lng + 3 * p1.lng - 3 * p2.lng + p3.lng) * t3
      );

      result.push([lng, lat]); // ArcGIS order: longitude first
    }
  }

  return result;
}

export default function ArcGISMap({ onReady }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const birdImgRef = useRef<HTMLImageElement>(null);
  const birdPosRef = useRef({ lat: 0, lng: 0 });

  useEffect(() => {
    let mapView: any = null;

    // Guards against React Strict Mode's dev-only double-invoke of effects:
    // the first invocation's cleanup fires while initMap is still awaiting
    // its dynamic imports, before mapView exists to destroy. Checking this
    // flag right after those imports resolve stops the stale first run from
    // ever creating a second SceneView on the same container.
    let cancelled = false;

    // ── Runtime state (not React state — never causes re-renders) ──────────

    // Precomputed Catmull-Rom path for each segment
    // Key = location index (1 to 10), value = [[lng,lat], ...]
    const segmentPoints = new Map<number, number[][]>();

    // The trail graphic currently being animated (removed each frame)
    let currentTrailGraphic: any = null;

    // Permanent completed trail graphics — accumulate, never removed
    // Index matches location index of the DESTINATION of that segment
    const permanentTrails = new Map<number, any>();

    // Neighbor dot graphics per location — accumulate during forward scroll
    // Removed during backward scroll
    const neighborGraphicsMap = new Map<number, any[]>();

    // Location dot + label graphics per location
    const locationMarkerMap = new Map<number, any[]>();

    // Which location index is currently active
    let activeIndex = 0;

    // Cancel function for the in-flight animation
    let cancelCurrentAnimation: (() => void) | null = null;

    // Whether the final overview zoom has been triggered
    let overviewShown = false;

    // Bumped by every goToLocation/goToPrevLocation call. zoomToShowAll's
    // multi-shot sequence checks this between shots so that scrolling away
    // mid-sequence aborts the remaining shots instead of fighting the
    // user's own navigation.
    let navigationToken = 0;

    const initMap = async () => {
      if (!mapRef.current) return;

      // ── Dynamic ArcGIS imports ────────────────────────────────────────────
      // Import ALL modules here at the top of initMap in one block.
      // Do not scatter imports throughout the function.
      // const Map = (await import("@arcgis/core/Map")).default;

      // const esriConfig          = (await import("@arcgis/core/config")).default;
      // const Map0                 = (await import("@arcgis/core/Map")).default;
      // const SceneView           = (await import("@arcgis/core/views/SceneView")).default;
      // const TileLayer           = (await import("@arcgis/core/layers/TileLayer")).default;
      // const GraphicsLayer       = (await import("@arcgis/core/layers/GraphicsLayer")).default;
      // const Graphic             = (await import("@arcgis/core/Graphic")).default;
      // const Point               = (await import("@arcgis/core/geometry/Point")).default;
      // const Polyline            = (await import("@arcgis/core/geometry/Polyline")).default;
      // const Extent              = (await import("@arcgis/core/geometry/Extent")).default;
      // const SimpleMarkerSymbol  = (await import("@arcgis/core/symbols/SimpleMarkerSymbol")).default;
      // const SimpleLineSymbol    = (await import("@arcgis/core/symbols/SimpleLineSymbol")).default;
      // const TextSymbol          = (await import("@arcgis/core/symbols/TextSymbol")).default;
      // const PictureMarkerSymbol = (await import("@arcgis/core/symbols/PictureMarkerSymbol")).default;


      const [
        esriConfig,
        Map,
        SceneView,
        GraphicsLayer,
        FeatureLayer,
        Graphic,
        Point,
        Polyline,
        Extent,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        TextSymbol,
        PictureMarkerSymbol,
      ] = await new Promise<any[]>((resolve) => {
        (window as any).require([
          "esri/config",
          "esri/Map",
          "esri/views/SceneView",
          "esri/layers/GraphicsLayer",
          "esri/layers/FeatureLayer",
          "esri/Graphic",
          "esri/geometry/Point",
          "esri/geometry/Polyline",
          "esri/geometry/Extent",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/symbols/TextSymbol",
          "esri/symbols/PictureMarkerSymbol",
        ], (...modules: any[]) => resolve(modules));
      });

      // Set API key exactly as before
      esriConfig.apiKey = process.env.NEXT_PUBLIC_ARCGIS_API_KEY ?? "";

      if (cancelled) return;

      // Country boundaries layer
      const boundaryLayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0",
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [0, 0, 0, 0],           // transparent fill
            outline: {
              color: [255, 165, 0, 1], // white border, 40% opacity
              width: 1.0,
            },
          },
        },
        popupEnabled: false,
      });
      // Country highlight layer — specific countries in custom colors
      const highlightLayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0",
        definitionExpression: "COUNTRY IN ('Pakistan', 'India', 'Afghanistan', 'Tajikistan', 'Kyrgyzstan', 'Kazakhstan', 'Uzbekistan')",

         renderer: {
          type: "unique-value",
          field: "COUNTRY",
          uniqueValueInfos: [
            {
              value: "Pakistan",
              symbol: {
                type: "simple-fill",
                color: [255, 215, 0, 0.25],      // gold
                outline: { color: [255, 215, 0, 0.9], width: 1.2 },
              },
            },
            {
              value: "India",
              symbol: {
                type: "simple-fill",
                color: [0, 180, 0, 0.25],        // green
                outline: { color: [0, 200, 0, 0.9], width: 1.2 },
              },
            },
            {
              value: "Afghanistan",
              symbol: {
                type: "simple-fill",
                color: [255, 100, 0, 0.25],      // orange
                outline: { color: [255, 120, 0, 0.9], width: 1.2 },
              },
            },
            {
              value: "Tajikistan",
              symbol: {
                type: "simple-fill",
                color: [0, 180, 255, 0.25],      // sky blue
                outline: { color: [0, 200, 255, 0.9], width: 1.2 },
              },
            },
            {
              value: "Kyrgyzstan",
              symbol: {
                type: "simple-fill",
                color: [200, 0, 255, 0.25],      // purple
                outline: { color: [220, 0, 255, 0.9], width: 1.2 },
              },
            },
            {
              value: "Kazakhstan",
              symbol: {
                type: "simple-fill",
                color: [0, 255, 180, 0.25],      // turquoise
                outline: { color: [0, 255, 180, 0.9], width: 1.2 },
              },
            },
            {
              value: "Uzbekistan",
              symbol: {
                type: "simple-fill",
                color: [255, 50, 100, 0.25],      // pink/rose
                outline: { color: [255, 50, 100, 0.9], width: 1.2 },
              },
            },
          ],
        },
        popupEnabled: false,
      });

      // above boundary layer, below trails


      // Add boundary layer BELOW trail and marker layers
      // 0 = bottom of layer stack


      // ── Map — pure satellite, no labels ──────────────────────────────────
      const map = new Map({
        // basemap: {
        //   baseLayers: [
        //     new TileLayer({
        //       url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        //     }),
        //   ],
        // },
        basemap: "arcgis/imagery",
        ground: "world-elevation",
      });

      // ── SceneView — 3D with terrain ───────────────────────────────────────
      const first = locations[0];

      // mapView = new SceneView({
      //   container: mapRef.current,
      //   map,
      //   // Use center + zoom for initial position — more reliable than
      //   // camera for centering at a specific coordinate
      //   center: [first.lng, first.lat],
      //   zoom: first.zoom,
      //   ui: { components: [] },
      //   environment: {
      //     atmosphereEnabled: true,
      //     starsEnabled: false,
      //   },
      // });
      mapView = new SceneView({
        container: mapRef.current,
        map,
        camera: {
          position: {
            latitude:  32.28153233704449, 
            longitude: 76.13154293304282,
            z: 5500000,
          },
          tilt: 0,
          heading: 0,
        },
        ui: { components: [] },
        environment: {
          atmosphereEnabled: true,
          starsEnabled: false,
        },
        popup: { autoOpenEnabled: false },
      });

      await mapView.when();

      // ── CSS bird overlay ─────────────────────────────────────────────────
      // The bird is an HTML <img> positioned over the map via
      // mapView.toScreen(), rotated with a CSS transform. This avoids
      // ArcGIS's PictureMarkerSymbol angle issues and needs no canvas.
      const updateBirdOverlay = (
        lat: number,
        lng: number,
        angleDeg: number,
        imgUrl: string
      ) => {
        const el = birdImgRef.current;
        if (!el || !mapView) return;

        const screenPt = mapView.toScreen(new Point({
          latitude: lat,
          longitude: lng,
        }));

        if (!screenPt) return;

        birdPosRef.current = { lat, lng };
        el.src = imgUrl;
        el.style.display = "block";
        el.style.left = `${screenPt.x - 26}px`; // center horizontally
        el.style.top = `${screenPt.y - 20}px`; // center vertically
        el.style.transform = `rotate(${angleDeg}deg)`;
      };

      const hideBirdOverlay = () => {
        const el = birdImgRef.current;
        if (el) el.style.display = "none";
      };

      // Reposition bird overlay whenever the camera moves (goTo pans/tilts)
      mapView.watch("camera", () => {
        const el = birdImgRef.current;
        if (!el || el.style.display === "none") return;

        const screenPt = mapView.toScreen(new Point({
          latitude: birdPosRef.current.lat,
          longitude: birdPosRef.current.lng,
        }));
        if (!screenPt) return;
        el.style.left = `${screenPt.x - 26}px`;
        el.style.top = `${screenPt.y - 26}px`;
      });

      // Show bird after map is ready
      updateBirdOverlay(first.lat, first.lng, first.angle, "/harrier-sitting.png");

      // ── Disable ALL user interaction ──────────────────────────────────────
      mapView.on("drag", (e: any) => e.stopPropagation());
      mapView.on("mouse-wheel", (e: any) => e.stopPropagation());
      mapView.on("double-click", (e: any) => e.stopPropagation());
      mapView.on("key-down", (e: any) => e.stopPropagation());
      mapView.on("hold", (e: any) => e.stopPropagation());

      // ── Graphics layers ───────────────────────────────────────────────────
      // Order matters: trailLayer renders below markerLayer
      // Bird and dots always appear above trail lines
      const trailLayer = new GraphicsLayer();
      const markerLayer = new GraphicsLayer();
      map.addMany([trailLayer, markerLayer]);
     // map.add(highlightLayer, 1);
     // map.add(boundaryLayer, 0);

      // ── Shared symbols ────────────────────────────────────────────────────
      const dotSymbol = new SimpleMarkerSymbol({
        style: "circle",
        size: "10px",
        color: "#FFD700",
        outline: { color: "#000000", width: 1.5 },
      });

      const neighborDotSymbol = new SimpleMarkerSymbol({
        style: "circle",
        size: "7px",
        color: [255, 215, 0, 0.75],
        outline: { color: [0, 0, 0, 0.5], width: 1 },
      });

      const trailSymbol = new SimpleLineSymbol({
        color: "#FFD700",
        width: 2.5,
        style: "dash",
      });

      // ── Precompute all Catmull-Rom segment paths ──────────────────────────
      // Do this once on load so animations never have to compute points
      for (let i = 1; i < locations.length; i++) {
        const loc = locations[i];
        const prevLoc = locations[i - 1];

        const allWaypoints = [
          { lat: prevLoc.lat, lng: prevLoc.lng },
          ...loc.waypoints,
          { lat: loc.lat, lng: loc.lng },
        ];

        segmentPoints.set(i, getCatmullRomPoints(allWaypoints, 80));
      }

      // ── Helper: add location dot + label ─────────────────────────────────
      const addLocationMarker = (idx: number) => {
        if (locationMarkerMap.has(idx)) return;
        const loc = locations[idx];
        const dot = new Graphic({
          geometry: new Point({ latitude: loc.lat, longitude: loc.lng }),
          symbol: dotSymbol,
        });
        const label = new Graphic({
          geometry: new Point({ latitude: loc.lat, longitude: loc.lng }),
          symbol: new TextSymbol({
            text: loc.title,
            color: "#FFD700",
            haloColor: "#000000",
            haloSize: 1.5,
            yoffset: 46,
            font: { size: 11, weight: "bold" },
          }),
        });
        markerLayer.addMany([dot, label]);
        locationMarkerMap.set(idx, [dot, label]);
      };

      // ── Helper: remove location dot + label ──────────────────────────────
      const removeLocationMarker = (idx: number) => {
        const graphics = locationMarkerMap.get(idx);
        if (graphics) {
          graphics.forEach((g: any) => markerLayer.remove(g));
          locationMarkerMap.delete(idx);
        }
      };

      // ── Helper: add neighbor dots ─────────────────────────────────────────
      const addNeighborDots = (idx: number) => {
        if (neighborGraphicsMap.has(idx)) return;
        const loc = locations[idx];
        const graphics = loc.neighbors.map((n) =>
          new Graphic({
            geometry: new Point({ latitude: n.lat, longitude: n.lng }),
            symbol: neighborDotSymbol,
            attributes: {
              // Only store label if neighbor_label is true
              label: n.neighbor_label ? n.label : null,
            },
          })
        );
        markerLayer.addMany(graphics);
        neighborGraphicsMap.set(idx, graphics);
      };

      // ── Helper: remove neighbor dots ──────────────────────────────────────
      const removeNeighborDots = (idx: number) => {
        const graphics = neighborGraphicsMap.get(idx);
        if (graphics) {
          graphics.forEach((g: any) => markerLayer.remove(g));
          neighborGraphicsMap.delete(idx);
        }
      };

      // ── Place first location immediately ──────────────────────────────────
      addLocationMarker(0);
      addNeighborDots(0);

      // ── animateTrail ──────────────────────────────────────────────────────
      // Animates the trail drawing for one segment.
      // segmentIdx: which segment (matches destination location index)
      // direction: "forward" draws A→B, "backward" draws B→A
      // onComplete: called when animation finishes
      // Returns a cancel function

      const animateTrail = (
        segmentIdx: number,
        direction: "forward" | "backward",
        onComplete: () => void
      ): (() => void) => {
        const pts = segmentPoints.get(segmentIdx);
        if (!pts || pts.length < 2) { onComplete(); return () => { }; }

        // Reverse points for backward animation
        const drawPts = direction === "backward" ? [...pts].reverse() : pts;

        const DURATION = 3500;
        const startTime = performance.now();
        let rafId = 0;
        let cancelled = false;

        const loc = locations[
          direction === "forward" ? segmentIdx : segmentIdx - 1
        ];
        const angleOffset = loc?.angle ?? 0;

        const tick = (now: number) => {
          if (cancelled) return;

          const elapsed = now - startTime;
          const progress = Math.min(elapsed / DURATION, 1);
          const easedProgress = easeInOutCubic(progress);
          const count = Math.floor(easedProgress * drawPts.length);

          if (count >= 2) {
            // Remove previous animated graphic — always keep only one
            if (currentTrailGraphic) {
              trailLayer.remove(currentTrailGraphic);
              currentTrailGraphic = null;
            }

            // Add new graphic with more points revealed
            currentTrailGraphic = new Graphic({
              geometry: new Polyline({
                paths: [drawPts.slice(0, count)],
                spatialReference: { wkid: 4326 },
              }),
              symbol: trailSymbol,
            });
            trailLayer.add(currentTrailGraphic);

            // Move bird to the tip of the drawn trail
            const tip = drawPts[count - 1];
            const next = drawPts[Math.min(count, drawPts.length - 1)];

            if (tip && next && tip[0] !== undefined && next[0] !== undefined) {
              const rawBearing = calculateBearing(tip, next);
              const finalAngle = (rawBearing + angleOffset) % 360;

              updateBirdOverlay(tip[1], tip[0], finalAngle, "/harrier-flying.png");
            }
          }

          if (progress < 1 && !cancelled) {
            rafId = requestAnimationFrame(tick);
          } else if (!cancelled) {
            if (currentTrailGraphic) {
              trailLayer.remove(currentTrailGraphic);
              currentTrailGraphic = null;
            }
            onComplete();
          }
        };

        rafId = requestAnimationFrame(tick);

        // Return cancel function
        return () => {
          cancelled = true;
          cancelAnimationFrame(rafId);
          if (currentTrailGraphic) {
            trailLayer.remove(currentTrailGraphic);
            currentTrailGraphic = null;
          }
        };
      };

      // ── goToLocation (forward scroll) ─────────────────────────────────────
      // Called when user scrolls forward to location at idx.
      // 1. Cancels any in-flight animation
      // 2. Pans camera to new location
      // 3. Fills any skipped segments instantly
      // 4. Animates trail for current segment
      // 5. Places sitting bird, neighbor dots, location marker on complete

      const goToLocation = async (idx: number): Promise<void> => {
        if (idx < 0 || idx >= locations.length) return;

        navigationToken++;

        // Cancel in-flight animation and immediately make its segment
        // permanent so no trail is ever left missing — otherwise there
        // would be a visible gap for the duration of the camera pan
        // below, before the skipped-segment fill loop catches up.
        if (cancelCurrentAnimation) {
          cancelCurrentAnimation();
          cancelCurrentAnimation = null;

          const cancelledSegIdx = activeIndex;
          if (cancelledSegIdx > 0 && !permanentTrails.has(cancelledSegIdx)) {
            const pts = segmentPoints.get(cancelledSegIdx);
            if (pts && pts.length >= 2) {
              const permanent = new Graphic({
                geometry: new Polyline({
                  paths: [pts],
                  spatialReference: { wkid: 4326 },
                }),
                symbol: trailSymbol,
              });
              trailLayer.add(permanent);
              permanentTrails.set(cancelledSegIdx, permanent);
            }
          }
        }

        overviewShown = false;
        const loc = locations[idx];

        // Pan camera
        await mapView.goTo(
          {
            target: new Point({
              latitude: loc.lat,
              longitude: loc.lng,
            }),
            zoom: loc.zoom,
            tilt: loc.tilt,
            heading: loc.heading,
          },
          { duration: loc.duration, easing: "ease-in-out" }
        ).catch(() => { }); // ignore AbortError from rapid scroll

        // First location — just place sitting bird, no trail
        if (idx === 0) {
          updateBirdOverlay(loc.lat, loc.lng, loc.angle, "/harrier-sitting.png");
          activeIndex = 0;
          return;
        }

        // Fill ALL segments between current position and target, including
        // activeIndex itself in case its animation was just cancelled above
        for (let s = Math.max(activeIndex, 1); s < idx; s++) {
          if (!permanentTrails.has(s)) {
            const pts = segmentPoints.get(s);
            if (pts && pts.length >= 2) {
              const permanent = new Graphic({
                geometry: new Polyline({
                  paths: [pts],
                  spatialReference: { wkid: 4326 },
                }),
                symbol: trailSymbol,
              });
              trailLayer.add(permanent);
              permanentTrails.set(s, permanent);
            }
          }
          // Add markers and neighbors for skipped locations
          if (!locationMarkerMap.has(s)) addLocationMarker(s);
          if (!neighborGraphicsMap.has(s)) addNeighborDots(s);
        }

        // Start trail animation — does NOT block goToLocation from resolving.
        // The trail draws in the background while the user can keep scrolling.
        const cancel = animateTrail(idx, "forward", () => {
          // Make trail permanent
          const pts = segmentPoints.get(idx);
          if (pts && pts.length >= 2) {
            const permanent = new Graphic({
              geometry: new Polyline({
                paths: [pts],
                spatialReference: { wkid: 4326 },
              }),
              symbol: trailSymbol,
            });
            trailLayer.add(permanent);
            permanentTrails.set(idx, permanent);
          }

          // Switch bird to sitting pose at destination
          updateBirdOverlay(loc.lat, loc.lng, loc.angle, "/harrier-sitting.png");

          // Add markers for this location
          addLocationMarker(idx);
          addNeighborDots(idx);

          activeIndex = idx;
        });
        cancelCurrentAnimation = cancel;

        // Set activeIndex immediately so backward scroll works correctly
        // even if trail is still drawing
        activeIndex = idx;

        // Add markers immediately — do not wait for trail to finish
        addLocationMarker(idx);
        addNeighborDots(idx);
      };

      // ── goToPrevLocation (backward scroll) ────────────────────────────────
      // Called when user scrolls back to location at idx.
      // 1. Cancels any in-flight animation
      // 2. Removes the permanent trail for the segment being reversed
      // 3. Removes neighbor dots and marker for the location being left
      // 4. Animates trail BACKWARD (B→A)
      // 5. Places sitting bird at previous location on complete

      const goToPrevLocation = async (idx: number): Promise<void> => {
        if (idx < 0 || idx >= locations.length) return;

        navigationToken++;

        // Cancel in-flight animation
        if (cancelCurrentAnimation) {
          cancelCurrentAnimation();
          cancelCurrentAnimation = null;
        }

        const loc = locations[idx];

        // Pan camera back
        await mapView.goTo(
          {
            target: new Point({
              latitude: loc.lat,
              longitude: loc.lng,
            }),
            zoom: loc.zoom,
            tilt: loc.tilt,
            heading: loc.heading,
          },
          { duration: loc.duration, easing: "ease-in-out" }
        ).catch(() => { });

        // The segment we are reversing is activeIndex
        // (the trail from idx → activeIndex)
        const segIdx = activeIndex;

        // Remove permanent trail for segment being reversed
        if (permanentTrails.has(segIdx)) {
          trailLayer.remove(permanentTrails.get(segIdx));
          permanentTrails.delete(segIdx);
        }

        // Remove markers for the location we are leaving
        removeLocationMarker(activeIndex);
        removeNeighborDots(activeIndex);

        // Animate trail backward — does NOT block goToPrevLocation from resolving
        const cancel = animateTrail(segIdx, "backward", () => {
          // Place bird sitting at destination (going back to idx)
          updateBirdOverlay(loc.lat, loc.lng, loc.angle, "/harrier-sitting.png");
          activeIndex = idx;
        });
        cancelCurrentAnimation = cancel;

        // Set immediately — do not wait for trail
        activeIndex = idx;
      };

      // ── zoomToShowAll — cinematic drone overview after last location ──────
      // Fits all 11 locations in view via a short multi-shot sweep: swings
      // in from one side, arcs across to the other, then settles on a low,
      // north-facing hero shot. Facing north (instead of the ~south-facing
      // heading used at the last location) puts Sri Lanka/India at the
      // base of the frame with the route receding toward Kazakhstan in the
      // distance — the opposite orientation of a single location's camera.
      // Bird stays sitting at last location. All trails and dots remain visible.

      const zoomToShowAll = async () => {
        if (overviewShown) return;
        overviewShown = true;

        if (cancelCurrentAnimation) {
          cancelCurrentAnimation();
          cancelCurrentAnimation = null;
        }

        navigationToken++;
        const myToken = navigationToken;

        const lats = locations.map(l => l.lat);
        const lngs = locations.map(l => l.lng);
        const pad = 1.5; // degrees padding

        const extent = new Extent({
          xmin: Math.min(...lngs) - pad,
          xmax: Math.max(...lngs) + pad,
          ymin: Math.min(...lats) - pad,
          ymax: Math.max(...lats) + pad,
          spatialReference: { wkid: 4326 },
        });

        // Final heading is the mathematical opposite of the last location's
        // heading (160°) — facing ~north instead of ~south.
        const FINAL_HEADING = 0;
        // Requesting a steep tilt here is intentional even though the route
        // spans ~27° of latitude: SceneView's extent-fit won't actually let
        // the camera tilt this far while still framing the whole route (it
        // settles around ~54° in practice) — asking for more than that just
        // means we always get its natural ceiling rather than accidentally
        // under-asking for it.
        const FINAL_TILT = 0;

        const shots = [
          // { heading: FINAL_HEADING - 90, tilt: FINAL_TILT, duration: 2200 }, // side approach — west
          // { heading: FINAL_HEADING + 90, tilt: FINAL_TILT, duration: 2200 }, // arc across — east
          { heading: FINAL_HEADING, tilt: FINAL_TILT, duration: 3000 }, // settle — hero shot
        ];

        for (const shot of shots) {
          if (myToken !== navigationToken) return; // user scrolled away — abandon remaining shots
          await mapView.goTo(
            {
              target: extent,
              tilt: shot.tilt,
              heading: ((shot.heading % 360) + 360) % 360,
            },
            { duration: shot.duration, easing: "ease-in-out" }
          ).catch(() => { });
        }
      };

      // ── Hover tooltip ─────────────────────────────────────────────────────
      // Uses hitTest to detect which neighbor dot the mouse is over.
      // Shows an HTML tooltip div — faster than ArcGIS popup.
      // Only shows label if neighbor_label: true (label attribute not null).

      mapView.on("pointer-move", async (event: any) => {
        const tooltip = tooltipRef.current;
        if (!tooltip) return;

        const response = await mapView.hitTest(event, {
          include: [markerLayer],
        });

        const hit = response.results?.[0]?.graphic;
        const label = hit?.attributes?.label as string | null;

        if (label) {
          tooltip.style.opacity = "1";
          tooltip.style.left = `${event.x + 14}px`;
          tooltip.style.top = `${event.y - 34}px`;
          tooltip.textContent = label;
        } else {
          tooltip.style.opacity = "0";
        }
      });

      mapView.on("pointer-leave", () => {
        if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
      });

      // ── Expose controls to parent ─────────────────────────────────────────
      onReady({ goToLocation, goToPrevLocation, zoomToShowAll });
    };

    initMap();

    return () => {
      cancelled = true;
      // Cancel in-flight trail animation cleanly before destroying the view
      if (cancelCurrentAnimation) {
        cancelCurrentAnimation();
        cancelCurrentAnimation = null;
      }
      if (mapView) mapView.destroy();
    };
  }, [onReady]);

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* ArcGIS renders into this div */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Bird overlay — CSS positioned over the map */}
      <img
        ref={birdImgRef}
        src="/harrier-sitting.png"
        alt="harrier"
        style={{
          position: "absolute",
          width: "52px",
          height: "52px",
          pointerEvents: "none",
          zIndex: 5,
          display: "none",
          transformOrigin: "center center",
          transition: "none",
          objectFit: "contain",
        }}
      />

      {/* HTML tooltip — faster than ArcGIS popup, no latency */}
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          background: "rgba(0,0,0,0.82)",
          color: "#ffffff",
          fontSize: "11px",
          padding: "5px 10px",
          borderRadius: "4px",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          opacity: 0,
          transition: "opacity 0.15s ease",
          letterSpacing: "0.03em",
          zIndex: 10,
        }}
      />
    </div>
  );
}
