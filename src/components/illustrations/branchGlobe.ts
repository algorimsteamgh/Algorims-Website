// Shared geometry for BranchGlobe.astro: used at build time for the static SVG
// and in the browser for rotation.
import { geoGraticule, geoInterpolate, geoDistance, geoOrthographic, geoPath, geoRotation } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryObject } from "topojson-specification";
import land110m from "world-atlas/land-110m.json" with { type: "json" };

const topology = land110m as unknown as Topology<{ land: GeometryObject }>;
export const land = feature(topology, topology.objects.land);

export const SIZE = 560;
export const CENTER = SIZE / 2;
export const RADIUS = 228;
/**
 * Fallback view (no JS / reduced motion): centred over the Arctic at 69°N 53°E.
 * Every office is within 76° of centre, and the long Singapore–US arc is seen at ~42° rather than edge-on.
 */
export const STATIC_ROTATION: [number, number] = [-53, -69];
/** Tilt used while auto-rotating. */
export const SPIN_TILT = -30;

export type LonLat = [number, number];
export interface GlobeOffice {
  id: string;
  role: "hq" | "branch";
  lon: number;
  lat: number;
}

export interface GlobeFrame {
  land: string;
  graticule: string;
  dots: string;
  arcs: { id: string; d: string }[];
  anchors: { id: string; role: "hq" | "branch"; x: number; y: number; visible: boolean }[];
}

const ARC_STEPS = 64;
const graticuleLines = geoGraticule().step([15, 15])();
const round = (n: number) => Math.round(n * 10) / 10;

function projector(rotation: [number, number]) {
  const rotate = geoRotation(rotation);
  return (point: LonLat, lift = 1) => {
    const [lon, lat] = rotate(point).map((deg) => (deg * Math.PI) / 180);
    const x = Math.cos(lat) * Math.sin(lon);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(lon);
    // A point is hidden only when it is behind the globe and inside its silhouette.
    const visible = z > 0 || (x * x + y * y) * lift * lift > 1;
    return { x: round(CENTER + RADIUS * lift * x), y: round(CENTER - RADIUS * lift * y), visible };
  };
}

/** Great-circle arc lifted off the surface, split wherever it passes behind the globe. */
function arcPath(project: ReturnType<typeof projector>, from: LonLat, to: LonLat) {
  const interpolate = geoInterpolate(from, to);
  const height = 0.06 + 0.16 * (geoDistance(from, to) / Math.PI);
  let d = "";
  let drawing = false;
  for (let i = 0; i <= ARC_STEPS; i++) {
    const t = i / ARC_STEPS;
    const p = project(interpolate(t) as LonLat, 1 + height * Math.sin(Math.PI * t));
    if (!p.visible) {
      drawing = false;
      continue;
    }
    d += `${drawing ? "L" : "M"}${p.x} ${p.y}`;
    drawing = true;
  }
  return d;
}

/** Point along a lifted arc, for the travelling pulse. */
export function arcPoint(rotation: [number, number], from: LonLat, to: LonLat, t: number) {
  const height = 0.06 + 0.16 * (geoDistance(from, to) / Math.PI);
  return projector(rotation)(geoInterpolate(from, to)(t) as LonLat, 1 + height * Math.sin(Math.PI * t));
}

export function renderFrame(
  rotation: [number, number],
  dots: LonLat[],
  offices: GlobeOffice[],
  options: { graticule?: boolean; dotStride?: number } = {},
): GlobeFrame {
  const { graticule = true, dotStride = 1 } = options;
  const projection = geoOrthographic().scale(RADIUS).translate([CENTER, CENTER]).rotate(rotation).precision(0.5);
  const project = projector(rotation);

  let dotPath = "";
  for (let i = 0; i < dots.length; i += dotStride) {
    const p = project(dots[i]);
    if (p.visible) dotPath += `M${p.x} ${p.y}h0`;
  }

  const hq = offices.find((office) => office.role === "hq")!;
  const origin: LonLat = [hq.lon, hq.lat];

  return {
    land: geoPath(projection)(land) ?? "",
    graticule: graticule ? (geoPath(projection)(graticuleLines) ?? "") : "",
    dots: dotPath,
    arcs: offices
      .filter((office) => office.role === "branch")
      .map((office) => ({ id: office.id, d: arcPath(project, origin, [office.lon, office.lat]) })),
    anchors: offices.map((office) => ({ id: office.id, role: office.role, ...project([office.lon, office.lat]) })),
  };
}

type Vec3 = [number, number, number];
const toVec = ([lon, lat]: LonLat): Vec3 => {
  const [l, p] = [(lon * Math.PI) / 180, (lat * Math.PI) / 180];
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
};
const normalize = (v: Vec3): Vec3 => {
  const length = Math.hypot(...v);
  return v.map((n) => n / length) as Vec3;
};

/**
 * View that frames one office. Branches: aim between HQ and the branch, offset 35° off the arc's plane,
 * because a great circle seen from inside its own plane projects to a flat line.
 */
export function focusRotation(offices: GlobeOffice[], id: string): [number, number] {
  const office = offices.find((o) => o.id === id)!;
  const hq = offices.find((o) => o.role === "hq")!;
  if (office.role === "hq") return [-hq.lon, -Math.min(hq.lat + 20, 60)];
  const a = toVec([hq.lon, hq.lat]);
  const b = toVec([office.lon, office.lat]);
  const mid = normalize([a[0] + b[0], a[1] + b[1], a[2] + b[2]]);
  let pole = normalize([a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]);
  if (pole[2] < 0) pole = pole.map((n) => -n) as Vec3; // look from the northern side
  const offset = (35 * Math.PI) / 180;
  const [x, y, z] = normalize(mid.map((n, i) => n * Math.cos(offset) + pole[i] * Math.sin(offset)) as Vec3);
  return [(-Math.atan2(y, x) * 180) / Math.PI, (-Math.asin(z) * 180) / Math.PI];
}
