const track = document.querySelector<HTMLElement>(".showcase-track");
const showcase = track?.querySelector<HTMLElement>(".scroll-showcase");
const pin = track?.querySelector<HTMLElement>(".showcase-pin");

if (track && showcase && pin) {
  const links = [...showcase.querySelectorAll<HTMLAnchorElement>(".showcase-index a")];
  const panels = [...showcase.querySelectorAll<HTMLElement>(".showcase-panel")];
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const styles = getComputedStyle(track);
  const pinTop = parseFloat(styles.getPropertyValue("--pin-top"));
  const step = parseFloat(styles.getPropertyValue("--scroll-step"));
  const scrollStart = () => window.scrollY + track.getBoundingClientRect().top - pinTop;
  const isPinned = () => track.hasAttribute("data-scroll");
  const hashIndex = () => links.findIndex((link) => link.hash === window.location.hash);
  const nav = showcase.querySelector<HTMLElement>(".showcase-index");
  let active = -1;
  let frame = 0;

  const placePill = () => {
    const link = links[active];
    if (!nav || !link) return;
    nav.style.setProperty("--pill-x", `${link.offsetLeft}px`);
    nav.style.setProperty("--pill-y", `${link.offsetTop}px`);
    nav.style.setProperty("--pill-w", `${link.offsetWidth}px`);
    nav.style.setProperty("--pill-h", `${link.offsetHeight}px`);
  };

  const select = (index: number) => {
    if (index === active) return;

    showcase.style.setProperty("--shuffle-from", index < active ? "-12px" : "12px");
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
      if (i === index) links[i].setAttribute("aria-current", "location");
      else links[i].removeAttribute("aria-current");
    });
    active = index;
    placePill();
  };

  const followScroll = () => {
    frame = 0;
    if (!isPinned()) return;

    const position = Math.round((window.scrollY - scrollStart()) / step);
    const index = Math.max(0, Math.min(panels.length - 1, position));
    if (index === active) return;

    const focused = document.activeElement;
    const moveFocus = panels[active].contains(focused);
    if (moveFocus && focused?.matches("a")) return;
    select(index);
    if (moveFocus) panels[index].querySelector<HTMLElement>("h2, h3")?.focus({ preventScroll: true });
  };

  const queueScroll = () => {
    if (isPinned() && !frame) frame = requestAnimationFrame(followScroll);
  };

  const goTo = (index: number, alignPanel = false) => {
    select(index);
    if (isPinned()) {
      window.scrollTo({ top: scrollStart() + index * step, behavior: "instant" });
    } else if (alignPanel || panels[index].getBoundingClientRect().top > window.innerHeight - 120) {
      panels[index].scrollIntoView({ block: "start", behavior: "instant" });
    }
  };

  const followHash = () => {
    const index = hashIndex();
    if (index !== -1) goTo(index, true);
    else if (isPinned()) queueScroll();
    else if (!window.location.hash) select(0);
  };

  const measure = () => {
    placePill();
    const wasPinned = isPinned();
    showcase.setAttribute("data-measuring", "");
    const maxHeight = showcase.offsetHeight;
    showcase.removeAttribute("data-measuring");
    const fits = maxHeight + pinTop + 24 <= window.innerHeight;
    track.toggleAttribute("data-scroll", motion.matches && fits);
    if (isPinned()) {
      track.style.setProperty("--showcase-max-height", `${maxHeight}px`);
      const offset = panels[active].getBoundingClientRect().top - pin.getBoundingClientRect().top;
      const stickyTop = parseFloat(getComputedStyle(pin).top);
      track.style.setProperty("--showcase-scroll-margin", `${stickyTop + offset}px`);
      if (wasPinned) queueScroll();
    }
  };

  select(Math.max(0, hashIndex()));
  showcase.setAttribute("data-ready", "");
  measure();
  followHash();
  requestAnimationFrame(() => showcase.setAttribute("data-pill-ready", ""));

  links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (window.location.hash !== link.hash) history.pushState(null, "", link.hash);
      goTo(index);
      if (event.detail === 0) {
        panels[index].querySelector<HTMLElement>("h2, h3")?.focus({ preventScroll: true });
      }
    });
  });
  window.addEventListener("hashchange", followHash);
  window.addEventListener("scroll", queueScroll, { passive: true });
  window.addEventListener("resize", measure);
  motion.addEventListener("change", measure);
  showcase.addEventListener("focusout", queueScroll);
  void document.fonts.ready.then(measure);
}
