import { geoContains } from "d3-geo";
import { offices } from "../../data/offices";
import { STATIC_ROTATION, land, renderFrame, type LonLat, type GlobeOffice } from "./branchGlobe";

// Build the fixed dot grid and fallback frame once, rather than on every dev request.
const STEP = 3;
export const dots: LonLat[] = [];
for (let lat = -58.5; lat < 84; lat += STEP) {
  const lonStep = STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.2);
  for (let lon = -180 + lonStep / 2; lon < 180; lon += lonStep) {
    const point: LonLat = [Math.round(lon * 10) / 10, lat];
    if (geoContains(land, point)) dots.push(point);
  }
}

export const globeOffices: GlobeOffice[] = offices.map(({ id, role, lon, lat }) => ({ id, role, lon, lat }));
export const frame = renderFrame(STATIC_ROTATION, dots, globeOffices);
if (!dots.length || !frame.land) throw new Error("Globe fallback failed to render");
