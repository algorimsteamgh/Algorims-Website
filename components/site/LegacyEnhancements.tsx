"use client";

import Script from "next/script";
import { useEffect } from "react";

import { AgenticSplineScene } from "./AgenticSplineScene";

declare global {
  interface Window {
    ccafDismissNotice?: () => void;
    ccafOpen?: Set<number>;
    ccafToggle?: (index: number) => void;
    lucide?: {
      createIcons: () => void;
    };
    __ppScrollHandler?: (() => void) | null;
  }
}

type LegacyEnhancementsProps = {
  agenticAi?: boolean;
  ccaf?: boolean;
};

type FormResponse = {
  errors?: Record<string, string>;
  fallbackMailto?: string;
  message?: string;
  ok?: boolean;
};

const bindStatusElement = (
  form: HTMLFormElement,
  id: string,
): HTMLParagraphElement => {
  const existing = form.querySelector<HTMLParagraphElement>(`#${id}`);
  if (existing) {
    return existing;
  }

  const status = document.createElement("p");
  status.id = id;
  status.className = "hidden text-sm text-destructive";
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton?.parentNode) {
    submitButton.parentNode.insertBefore(status, submitButton);
  }
  return status;
};

const setFieldError = (
  form: HTMLFormElement,
  name: string,
  message: string,
) => {
  const element = form.querySelector<HTMLElement>(`[data-error="${name}"]`);
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.toggle("hidden", !message);
};

const clearFieldErrors = (form: HTMLFormElement, fields: string[]) => {
  for (const field of fields) {
    setFieldError(form, field, "");
  }
};

const setButtonLoading = (
  button: HTMLButtonElement | null,
  loading: boolean,
  idleHtml?: string,
) => {
  if (!button) {
    return;
  }

  if (loading) {
    button.dataset.idle = idleHtml ?? button.innerHTML;
    button.disabled = true;
    button.style.opacity = "0.7";
    button.style.pointerEvents = "none";
    button.textContent = "Sending...";
    return;
  }

  button.disabled = false;
  button.style.opacity = "";
  button.style.pointerEvents = "";
  if (button.dataset.idle) {
    button.innerHTML = button.dataset.idle;
    window.lucide?.createIcons();
  }
};

const submitLegacyForm = async (
  form: HTMLFormElement,
  endpoint: string,
): Promise<FormResponse> => {
  const response = await fetch(endpoint, {
    method: "POST",
    body: new FormData(form),
  });
  const json = (await response.json().catch(() => ({}))) as FormResponse;

  if (!response.ok) {
    throw json;
  }

  return json;
};

const bindContactForm = () => {
  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  if (!form) {
    return;
  }

  const success = document.getElementById("contact-success");
  const fields = document.getElementById("contact-fields");
  const reset = document.getElementById("contact-reset");
  const status = bindStatusElement(form, "contact-status");
  const submitButton = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );

  const onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    clearFieldErrors(form, ["name", "email", "service", "message"]);
    status.classList.add("hidden");

    setButtonLoading(submitButton, true);
    try {
      const result = await submitLegacyForm(form, "/api/contact");
      if (result.fallbackMailto) {
        window.location.href = result.fallbackMailto;
      }
      fields?.classList.add("hidden");
      success?.classList.remove("hidden");
    } catch (error) {
      const result = (error ?? {}) as FormResponse;
      if (result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          setFieldError(form, field, message);
        }
      }
      if (result.message) {
        status.textContent = result.message;
        status.classList.remove("hidden");
      }
    } finally {
      setButtonLoading(submitButton, false);
    }
  };

  const onReset = () => {
    success?.classList.add("hidden");
    fields?.classList.remove("hidden");
    form.reset();
    clearFieldErrors(form, ["name", "email", "service", "message"]);
    status.classList.add("hidden");
  };

  form.addEventListener("submit", onSubmit);
  reset?.addEventListener("click", onReset);

  return () => {
    form.removeEventListener("submit", onSubmit);
    reset?.removeEventListener("click", onReset);
  };
};

const bindSupportForm = () => {
  const form = document.getElementById(
    "support-form-el",
  ) as HTMLFormElement | null;
  if (!form) {
    return;
  }

  const success = document.getElementById("support-success");
  const fields = document.getElementById("support-fields");
  const reset = document.getElementById("support-reset");
  const fileInput = document.getElementById(
    "s-attachment",
  ) as HTMLInputElement | null;
  const fileLabel = document.getElementById("s-attachment-label");
  const status = bindStatusElement(form, "support-status");
  const submitButton = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  const fieldNames = [
    "name",
    "company",
    "email",
    "subject",
    "category",
    "priority",
    "description",
  ];

  const syncFileLabel = () => {
    if (!fileLabel) {
      return;
    }

    fileLabel.textContent =
      fileInput?.files?.length && fileInput.files[0]
        ? fileInput.files[0].name
        : "Attach a screenshot, log, or document (optional)";
  };

  const onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    clearFieldErrors(form, fieldNames);
    status.classList.add("hidden");

    setButtonLoading(submitButton, true);
    try {
      const result = await submitLegacyForm(form, "/api/support");
      if (result.fallbackMailto) {
        window.location.href = result.fallbackMailto;
      }
      fields?.classList.add("hidden");
      success?.classList.remove("hidden");
    } catch (error) {
      const result = (error ?? {}) as FormResponse;
      if (result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          setFieldError(form, field, message);
        }
        const firstError = form.querySelector<HTMLElement>(
          "[data-error]:not(.hidden)",
        );
        if (firstError) {
          const top = firstError.getBoundingClientRect().top + window.scrollY - 140;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
      if (result.message) {
        status.textContent = result.message;
        status.classList.remove("hidden");
      }
    } finally {
      setButtonLoading(submitButton, false);
    }
  };

  const onReset = () => {
    success?.classList.add("hidden");
    fields?.classList.remove("hidden");
    form.reset();
    clearFieldErrors(form, fieldNames);
    status.classList.add("hidden");
    syncFileLabel();
  };

  fileInput?.addEventListener("change", syncFileLabel);
  form.addEventListener("submit", onSubmit);
  reset?.addEventListener("click", onReset);

  return () => {
    fileInput?.removeEventListener("change", syncFileLabel);
    form.removeEventListener("submit", onSubmit);
    reset?.removeEventListener("click", onReset);
  };
};

const bindJourneyTimeline = () => {
  const journeys = Array.from(
    document.querySelectorAll<HTMLElement>("[data-journey]"),
  );
  if (!journeys.length) {
    return;
  }

  const heights = journeys.map((journey) => journey.offsetHeight);
  journeys.forEach((journey, index) => {
    journey.style.setProperty("--journey-h", `${heights[index]}px`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        const target = entry.target as HTMLElement;
        target.classList.add("is-visible");
        observer.unobserve(target);
      }
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
  );

  for (const journey of journeys) {
    observer.observe(journey);
  }

  return () => observer.disconnect();
};

const bindProductsPage = () => {
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".pp-card"));
  if (!cards.length) {
    if (window.__ppScrollHandler) {
      window.removeEventListener("scroll", window.__ppScrollHandler);
      window.__ppScrollHandler = null;
    }
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.18, rootMargin: "0px 0px -60px 0px" },
  );

  for (const card of cards) {
    revealObserver.observe(card);
  }

  const railLinks = Array.from(
    document.querySelectorAll<HTMLElement>("[data-pp-rail-target]"),
  );
  const railClickCleanups: Array<() => void> = [];
  let activeObserver: IntersectionObserver | null = null;

  if (railLinks.length) {
    const setCurrent = (id: string) => {
      for (const link of railLinks) {
        link.setAttribute(
          "aria-current",
          link.getAttribute("data-pp-rail-target") === id ? "true" : "false",
        );
      }
    };

    activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrent((entry.target as HTMLElement).id);
          }
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
    );

    for (const card of cards) {
      activeObserver.observe(card);
    }

    for (const link of railLinks) {
      const onClick = (event: Event) => {
        const id = link.getAttribute("data-pp-rail-target");
        if (!id) {
          return;
        }

        const target = document.getElementById(id);
        if (!target) {
          return;
        }

        event.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 96;
        window.scrollTo({ top: y, behavior: "smooth" });
        setCurrent(id);
      };

      link.addEventListener("click", onClick);
      railClickCleanups.push(() => link.removeEventListener("click", onClick));
    }
  }

  const logos = Array.from(document.querySelectorAll<HTMLElement>(".pp-logo"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scrollRaf = 0;

  if (logos.length && !reduceMotion) {
    const updateLogos = () => {
      scrollRaf = 0;
      for (const logo of logos) {
        const card = logo.closest<HTMLElement>(".pp-card");
        if (!card) {
          continue;
        }

        const rect = card.getBoundingClientRect();
        const viewportHeight = window.innerHeight || 1;
        const progress =
          1 -
          Math.min(
            Math.max((rect.top + rect.height / 2) / viewportHeight, 0),
            1,
          );
        const offset = (progress - 0.5) * -24;
        logo.style.transform = `translateY(${offset.toFixed(2)}px)`;
      }
    };
    const onScroll = () => {
      if (!scrollRaf) {
        scrollRaf = window.requestAnimationFrame(updateLogos);
      }
    };

    updateLogos();
    if (window.__ppScrollHandler) {
      window.removeEventListener("scroll", window.__ppScrollHandler);
    }
    window.__ppScrollHandler = onScroll;
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  return () => {
    revealObserver.disconnect();
    activeObserver?.disconnect();
    for (const cleanup of railClickCleanups) {
      cleanup();
    }
    if (window.__ppScrollHandler) {
      window.removeEventListener("scroll", window.__ppScrollHandler);
      window.__ppScrollHandler = null;
    }
    if (scrollRaf) {
      window.cancelAnimationFrame(scrollRaf);
    }
  };
};

const bindRadialOrbital = () => {
  const stage = document.querySelector<HTMLElement>("[data-rot-stage]");
  if (!stage || stage.dataset.rotBound === "true") {
    return;
  }

  stage.dataset.rotBound = "true";
  const nodes = Array.from(
    stage.querySelectorAll<HTMLElement>("[data-rot-node]"),
  );
  if (!nodes.length) {
    return;
  }

  const total = nodes.length;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getRadius = () => {
    const width = stage.clientWidth;
    if (width < 480) return 150;
    if (width < 768) return 195;
    if (width < 1100) return 220;
    return 260;
  };

  let radius = getRadius();
  let rotation = -90;
  let autoRotate = true;
  let activeId: string | null = null;
  let raf = 0;
  let visible = true;

  const place = () => {
    nodes.forEach((node, index) => {
      const angle = ((index / total) * 360 + rotation) % 360;
      const radians = (angle * Math.PI) / 180;
      const x = Math.cos(radians) * radius;
      const y = Math.sin(radians) * radius;
      const z = Math.round(100 + 50 * Math.cos(radians));
      const opacity = Math.max(
        0.55,
        Math.min(1, 0.55 + 0.45 * ((1 + Math.sin(radians)) / 2)),
      );
      node.style.setProperty("--x", `${x.toFixed(2)}px`);
      node.style.setProperty("--y", `${y.toFixed(2)}px`);
      node.style.setProperty("--z", String(z));
      node.style.setProperty("--op", opacity.toFixed(3));
    });
  };

  const stopTick = () => {
    if (raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const startTick = () => {
    if (!raf && visible && autoRotate && !reduceMotion) {
      raf = window.requestAnimationFrame(tick);
    }
  };

  const tick = () => {
    raf = 0;
    if (!visible || !autoRotate || reduceMotion) {
      return;
    }

    rotation = (rotation + 0.16) % 360;
    place();
    startTick();
  };

  const setActive = (id: string) => {
    const node = nodes.find((entry) => entry.dataset.rotNode === id);
    if (!node) {
      return;
    }

    activeId = id;
    autoRotate = false;
    stage.dataset.paused = "true";
    stopTick();

    const related = (node.dataset.relatedIds || "").split(",").filter(Boolean);
    for (const entry of nodes) {
      entry.removeAttribute("data-active");
      entry.removeAttribute("data-related");
    }

    node.dataset.active = "true";
    for (const relatedId of related) {
      nodes
        .find((entry) => entry.dataset.rotNode === relatedId)
        ?.setAttribute("data-related", "true");
    }

    const index = nodes.indexOf(node);
    rotation = -90 - (index / total) * 360;
    place();
  };

  const clear = () => {
    activeId = null;
    autoRotate = true;
    delete stage.dataset.paused;
    for (const node of nodes) {
      node.removeAttribute("data-active");
      node.removeAttribute("data-related");
    }
    startTick();
  };

  const nodeCleanups: Array<() => void> = [];
  for (const node of nodes) {
    const onClick = (event: Event) => {
      event.stopPropagation();
      const target = event.target;
      if (target instanceof Element && target.closest(".rot-card")) {
        return;
      }

      const id = node.dataset.rotNode;
      if (!id) {
        return;
      }

      if (activeId === id) clear();
      else setActive(id);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      const id = node.dataset.rotNode;
      if (!id) {
        return;
      }

      if (activeId === id) clear();
      else setActive(id);
    };

    node.addEventListener("click", onClick);
    node.addEventListener("keydown", onKeyDown);
    nodeCleanups.push(() => {
      node.removeEventListener("click", onClick);
      node.removeEventListener("keydown", onKeyDown);
    });
  }

  const onStageClick = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    if (
      target === stage ||
      target.classList.contains("rot-orbit") ||
      target.classList.contains("rot-rings")
    ) {
      clear();
    }
  };

  const onJumpClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest<HTMLElement>("[data-rot-jump]");
    if (!button?.dataset.rotJump) {
      return;
    }

    event.stopPropagation();
    setActive(button.dataset.rotJump);
  };

  const onResize = () => {
    const nextRadius = getRadius();
    if (nextRadius !== radius) {
      radius = nextRadius;
      place();
    }
  };

  stage.addEventListener("click", onStageClick);
  stage.addEventListener("click", onJumpClick);
  window.addEventListener("resize", onResize);

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) {
        startTick();
      } else {
        stopTick();
      }
    },
    { rootMargin: "160px 0px" },
  );
  visibilityObserver.observe(stage);

  place();
  startTick();

  return () => {
    stopTick();
    visibilityObserver.disconnect();
    stage.removeEventListener("click", onStageClick);
    stage.removeEventListener("click", onJumpClick);
    window.removeEventListener("resize", onResize);
    for (const cleanup of nodeCleanups) {
      cleanup();
    }
    delete stage.dataset.rotBound;
  };
};

const bindHeroNodes = () => {
  const wrappers = Array.from(
    document.querySelectorAll<HTMLElement>("[data-ai-hero]"),
  );
  if (!wrappers.length) {
    return;
  }

  const cleanups: Array<() => void> = [];

  for (const wrapper of wrappers) {
    if (wrapper.dataset.nodesBound === "true") {
      continue;
    }

    wrapper.dataset.nodesBound = "true";
    const svg = wrapper.querySelector<SVGSVGElement>("svg");
    const cards = Array.from(
      wrapper.querySelectorAll<HTMLElement>("[data-node-card]"),
    );
    const detail = wrapper.querySelector<HTMLElement>("[data-node-detail]");
    const label = wrapper.querySelector<HTMLElement>("[data-detail-label]");
    const description = wrapper.querySelector<HTMLElement>("[data-detail-desc]");
    const icon = wrapper.querySelector<HTMLElement>("[data-detail-icon]");
    const close = wrapper.querySelector<HTMLElement>("[data-detail-close]");
    const dataNode = wrapper.querySelector<HTMLElement>("[data-node-data]");
    if (!detail || !label || !description || !icon || !dataNode) {
      continue;
    }

    let nodeData: Array<{ n: number; icon: string; label: string; desc: string }> = [];
    try {
      nodeData = JSON.parse(dataNode.textContent || "[]");
    } catch {
      continue;
    }

    const pause = () => {
      wrapper.dataset.paused = "true";
      try {
        svg?.pauseAnimations();
      } catch {}
    };

    const resume = () => {
      delete wrapper.dataset.paused;
      for (const card of cards) {
        card.removeAttribute("data-active");
      }
      detail.classList.remove("is-visible");
      try {
        svg?.unpauseAnimations();
      } catch {}
    };

    const activate = (nodeId: string) => {
      const node = nodeData.find((entry) => String(entry.n) === nodeId);
      if (!node) {
        return;
      }

      for (const card of cards) {
        card.toggleAttribute(
          "data-active",
          String(card.getAttribute("data-node-card")) === nodeId,
        );
      }

      label.textContent = node.label;
      description.textContent = node.desc;
      icon.innerHTML = `<i data-lucide="${node.icon}" class="!w-5 !h-5"></i>`;
      window.lucide?.createIcons();
      detail.classList.add("is-visible");
      pause();
    };

    const cardCleanups: Array<() => void> = [];
    for (const card of cards) {
      const trigger = (event: Event) => {
        event.stopPropagation();
        const nodeId = card.getAttribute("data-node-card");
        if (nodeId) {
          activate(nodeId);
        }
      };

      card.addEventListener("mouseenter", trigger);
      card.addEventListener("focus", trigger, true);
      card.addEventListener("click", trigger);
      cardCleanups.push(() => {
        card.removeEventListener("mouseenter", trigger);
        card.removeEventListener("focus", trigger, true);
        card.removeEventListener("click", trigger);
      });
    }

    const onClose = (event: Event) => {
      event.stopPropagation();
      resume();
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && wrapper.dataset.paused === "true") {
        resume();
      }
    };

    close?.addEventListener("click", onClose);
    wrapper.addEventListener("mouseleave", resume);
    document.addEventListener("keydown", onEscape);

    cleanups.push(() => {
      close?.removeEventListener("click", onClose);
      wrapper.removeEventListener("mouseleave", resume);
      document.removeEventListener("keydown", onEscape);
      for (const cleanup of cardCleanups) {
        cleanup();
      }
      delete wrapper.dataset.nodesBound;
    });
  }

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
};

export function LegacyEnhancements({
  agenticAi = false,
  ccaf = false,
}: LegacyEnhancementsProps) {
  useEffect(() => {
    const normalizeLegacyHash = () => {
      if (!window.location.hash.startsWith("#/")) {
        return;
      }

      const target = window.location.hash.slice(1);
      window.history.replaceState({}, "", target);
    };

    const handleLegacyHashLink = (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>('a[href^="#/"]');
      if (!link) {
        return;
      }

      event.preventDefault();
      window.location.href = link.href.replace(`${window.location.origin}/#`, `${window.location.origin}`);
    };

    normalizeLegacyHash();
    document.addEventListener("click", handleLegacyHashLink);

    return () => {
      document.removeEventListener("click", handleLegacyHashLink);
    };
  }, []);

  useEffect(() => {
    window.lucide?.createIcons();
  }, []);

  useEffect(() => {
    const cleanups = [bindContactForm(), bindSupportForm()].filter(
      (cleanup): cleanup is () => void => Boolean(cleanup),
    );

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, []);

  useEffect(() => {
    const cleanups = [
      bindHeroNodes(),
      bindProductsPage(),
      bindRadialOrbital(),
      bindJourneyTimeline(),
    ].filter((cleanup): cleanup is () => void => Boolean(cleanup));

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, []);

  useEffect(() => {
    if (!ccaf) {
      return;
    }

    window.ccafDismissNotice = () => {
      try {
        localStorage.setItem("algorims-ccaf-notice-dismissed", "1");
      } catch {}
      document.querySelector("[data-ccaf-notice]")?.remove();
    };

    window.ccafOpen = new Set<number>();
    window.ccafToggle = (index: number) => {
      const panel = document.querySelector<HTMLElement>(
        `[data-ccaf-panel="${index}"]`,
      );
      const chevron = document.querySelector<HTMLElement>(
        `[data-ccaf-chevron="${index}"]`,
      );
      if (!panel) {
        return;
      }

      const isOpen = !panel.classList.contains("hidden");
      window.ccafOpen?.forEach((openIndex) => {
        document
          .querySelector<HTMLElement>(`[data-ccaf-panel="${openIndex}"]`)
          ?.classList.add("hidden");
        const openChevron = document.querySelector<HTMLElement>(
          `[data-ccaf-chevron="${openIndex}"]`,
        );
        if (openChevron) {
          openChevron.style.transform = "";
        }
      });
      window.ccafOpen?.clear();

      if (!isOpen) {
        panel.classList.remove("hidden");
        if (chevron) {
          chevron.style.transform = "rotate(180deg)";
        }
        window.ccafOpen?.add(index);
      }
    };

    return () => {
      delete window.ccafDismissNotice;
      delete window.ccafToggle;
      delete window.ccafOpen;
    };
  }, [ccaf]);

  return (
    <>
      <Script
        id="legacy-lucide"
        src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"
        strategy="afterInteractive"
        onLoad={() => window.lucide?.createIcons()}
      />
      {agenticAi ? <AgenticSplineScene /> : null}
    </>
  );
}
