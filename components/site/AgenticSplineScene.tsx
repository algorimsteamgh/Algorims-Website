"use client";

import Script from "next/script";
import { useEffect } from "react";

const SPLINE_VIEWER_SRC =
  "https://unpkg.com/@splinetool/viewer@1.9.28/build/spline-viewer.js";
const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

type SplineViewerElement = HTMLElement & {
  shadowRoot: ShadowRoot | null;
};

const stripWatermark = (viewer: SplineViewerElement) => {
  const shadowRoot = viewer.shadowRoot;
  if (!shadowRoot) {
    return false;
  }

  const selector = "#logo, a[href*='spline'], #spline-logo, .spline-logo";
  shadowRoot.querySelectorAll(selector).forEach((element) => element.remove());

  if (!shadowRoot.getElementById("__strip-spline-logo")) {
    const style = document.createElement("style");
    style.id = "__strip-spline-logo";
    style.textContent =
      "#logo, a[href*='spline'], #spline-logo, .spline-logo { display:none !important; visibility:hidden !important; opacity:0 !important; pointer-events:none !important; }";
    shadowRoot.appendChild(style);
  }

  return true;
};

export function AgenticSplineScene() {
  useEffect(() => {
    const mount = document.querySelector<HTMLElement>("[data-agentic-spline]");
    if (!mount) {
      return;
    }

    mount.style.position = "relative";
    mount.style.zIndex = "10";
    mount.style.display = "block";
    mount.style.width = "100%";
    mount.style.height = "100%";

    if (mount.querySelector("spline-viewer")) {
      return;
    }

    const loader = document.getElementById("spline-loader");
    const viewer = document.createElement("spline-viewer") as SplineViewerElement;
    viewer.id = "hero-spline";
    viewer.setAttribute("url", SPLINE_SCENE_URL);
    viewer.setAttribute("events-target", "global");
    viewer.setAttribute(
      "style",
      "position:absolute;inset:0;display:block;width:100%;height:100%;background:transparent",
    );
    mount.appendChild(viewer);

    const hideLoader = () => {
      if (!loader) {
        return;
      }

      loader.style.opacity = "0";
      window.setTimeout(() => {
        loader.style.display = "none";
      }, 700);
    };

    const onLoad = () => {
      hideLoader();
      stripWatermark(viewer);
    };

    viewer.addEventListener("load", onLoad, { once: true });
    viewer.addEventListener("load-complete", onLoad, { once: true });

    let tries = 0;
    const poll = window.setInterval(() => {
      tries += 1;
      stripWatermark(viewer);
      if (tries > 60) {
        window.clearInterval(poll);
      }
    }, 200);

    const loaderTimeout = window.setTimeout(hideLoader, 8000);

    return () => {
      window.clearInterval(poll);
      window.clearTimeout(loaderTimeout);
      viewer.removeEventListener("load", onLoad);
      viewer.removeEventListener("load-complete", onLoad);
      viewer.remove();
    };
  }, []);

  return (
    <Script
      id="spline-viewer-runtime"
      type="module"
      src={SPLINE_VIEWER_SRC}
      strategy="afterInteractive"
    />
  );
}
