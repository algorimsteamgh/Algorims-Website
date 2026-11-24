const track = document.querySelector<HTMLElement>("[data-partner-track]");
const showcase = track?.querySelector<HTMLElement>(".partner-showcase");

if (track && showcase) {
  const links = [...showcase.querySelectorAll<HTMLAnchorElement>(".credential-index a")];
  const panels = [...showcase.querySelectorAll<HTMLElement>(".partner")];
  const stickyTop = () => parseFloat(getComputedStyle(showcase).top);
  const trackStart = () => window.scrollY + track.getBoundingClientRect().top - stickyTop();
  const step = () => (track.clientHeight - showcase.offsetHeight) / (panels.length - 1);
  let active = -1;
  let frame = 0;

  const select = (index: number) => {
    if (index === active) return;

    track.style.setProperty("--shuffle-from", index < active ? "-12px" : "12px");
    panels.forEach((panel, i) => {
      panel.inert = i !== index;
      if (i === index) links[i].setAttribute("aria-current", "location");
      else links[i].removeAttribute("aria-current");
    });
    active = index;
  };

  const followScroll = () => {
    frame = 0;
    if (!track.hasAttribute("data-scroll")) return;

    const position = Math.round((window.scrollY - trackStart()) / step());
    const index = Math.max(0, Math.min(panels.length - 1, position));
    if (index === active) return;

    const focused = document.activeElement;
    const moveFocus = panels[active].contains(focused);
    if (moveFocus && focused?.matches("a")) return;
    select(index);
    if (moveFocus) panels[index].querySelector("h2")?.focus({ preventScroll: true });
  };

  const queueScroll = () => {
    if (!frame) frame = requestAnimationFrame(followScroll);
  };

  const goTo = (index: number, alignPanel = false) => {
    select(index);
    if (track.hasAttribute("data-scroll")) {
      window.scrollTo({ top: trackStart() + index * step(), behavior: "instant" });
    } else if (alignPanel || panels[index].getBoundingClientRect().top > window.innerHeight - 120) {
      panels[index].scrollIntoView({ block: "start", behavior: "instant" });
    }
  };

  const hashIndex = () => links.findIndex((link) => link.hash === window.location.hash);
  const followHash = () => {
    const index = hashIndex();
    if (index !== -1) goTo(index, true);
    else if (track.hasAttribute("data-scroll")) queueScroll();
    else if (!window.location.hash) select(0);
  };

  const measure = () => {
    const wasSticky = track.hasAttribute("data-scroll");
    track.setAttribute("data-scroll", "");
    const fits = showcase.offsetHeight + stickyTop() + 20 <= window.innerHeight;
    track.toggleAttribute("data-scroll", fits);
    if (fits && wasSticky) queueScroll();
  };

  select(Math.max(0, hashIndex()));
  track.setAttribute("data-ready", "");
  measure();
  followHash();

  links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (window.location.hash !== link.hash) history.pushState(null, "", link.hash);
      goTo(index);
      if (event.detail === 0) {
        panels[index].querySelector("h2")?.focus({ preventScroll: true });
      }
    });
  });
  window.addEventListener("hashchange", followHash);
  window.addEventListener("scroll", queueScroll, { passive: true });
  window.addEventListener("resize", measure);
  showcase.addEventListener("focusout", queueScroll);
  void document.fonts.ready.then(measure);
}
