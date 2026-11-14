import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);
const font = (weight: 400 | 600) =>
  readFileSync(require.resolve(`@fontsource/dm-sans/files/dm-sans-latin-${weight}-normal.woff`));
const fonts = [
  { name: "DM Sans", data: font(400), weight: 400 as const, style: "normal" as const },
  { name: "DM Sans", data: font(600), weight: 600 as const, style: "normal" as const },
];

const INK = "#16181d";
const MUTED = "#5b606b";
const VIOLET = "#7a2fc4";
const LINE = "#d9dbe0";

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style: { display: "flex", ...style }, children },
});
const anchor = (pos: Record<string, number>) =>
  el("div", { position: "absolute", width: 10, height: 10, background: INK, ...pos });

export async function renderOgCard(card: { kicker: string; title: string; description?: string }) {
  const long = card.title.length > 48;
  const tree = el("div", { width: 1200, height: 630, background: "#ffffff", position: "relative", fontFamily: "DM Sans" }, [
    el("div", { position: "absolute", left: 32, top: 32, width: 1136, height: 566, border: `1px solid ${LINE}` }),
    anchor({ left: 27, top: 27 }), anchor({ left: 1163, top: 27 }), anchor({ left: 27, top: 593 }), anchor({ left: 1163, top: 593 }),
    el("div", { position: "absolute", left: 32, top: 32, width: 1024, height: 462, flexDirection: "column", justifyContent: "space-between", padding: "52px 56px" }, [
      el("div", { alignItems: "center", gap: 14 }, [
        el("div", { width: 18, height: 18, background: VIOLET }),
        el("div", { fontSize: 30, fontWeight: 600, color: INK, letterSpacing: -0.5 }, "Algorims"),
      ]),
      el("div", { flexDirection: "column" }, [
        el("div", { fontSize: 22, fontWeight: 600, color: VIOLET, textTransform: "uppercase", letterSpacing: 3 }, card.kicker),
        el("div", { marginTop: 22, fontSize: long ? 60 : 72, fontWeight: 600, color: INK, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 980 }, card.title),
        card.description
          ? el("div", { marginTop: 26, fontSize: 28, color: MUTED, lineHeight: 1.35, maxWidth: 900 }, card.description)
          : el("div", {}),
      ]),
      el("div", { fontSize: 22, color: MUTED }, "www.algorims.com"),
    ]),
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg).render().asPng();
}
