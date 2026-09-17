export function tickerFrame(label: string, progress: number): string {
  const match = /^(\d+)(?:\.(\d+))?(.*)$/.exec(label);
  if (!match) return label;
  const decimals = match[2]?.length ?? 0;
  const value = Math.max(1, Number(`${match[1]}.${match[2] ?? '0'}`) * progress);
  const number = decimals ? value.toFixed(decimals) : String(Math.round(value)).padStart(2, '0');
  return `${number}${match[3]}`;
}

export function initNumberTickers(): void {
  const counters = [...document.querySelectorAll<HTMLElement>('[data-counter]')];
  if (!counters.length) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Map<HTMLElement, number>();
  const labels = new Map(counters.map((counter) => [counter, counter.textContent ?? '']));
  const finish = () => {
    running.forEach((frame) => cancelAnimationFrame(frame));
    running.clear();
    counters.forEach((counter) => { counter.textContent = labels.get(counter)!; });
  };
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const counter = entry.target as HTMLElement;
      observer.unobserve(counter);
      if (reducedMotion.matches) continue;
      const label = labels.get(counter)!;
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - started) / 1200, 1);
        counter.textContent = tickerFrame(label, 1 - (1 - progress) ** 3);
        if (progress < 1) running.set(counter, requestAnimationFrame(tick));
        else { counter.textContent = label; running.delete(counter); }
      };
      running.set(counter, requestAnimationFrame(tick));
    }
  }, { threshold: .35 });
  counters.forEach((counter) => observer.observe(counter));
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finish(); });
}
