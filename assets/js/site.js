/* ---------- tiny helpers ---------- */
// Compute a relative base path from this script's own <script src>, so it works regardless of how the page itself is hosted
const BASE_PATH = (() => {
  const src = document.currentScript && document.currentScript.src;
  if (src) return src.replace(/assets\/js\/site\.js(?:\?.*)?$/, "").replace(/\/$/, "") || ".";
  return ".";
})();
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  for (const k of kids.flat()) {
    if (k == null || k === false) continue;
    el.append(k.nodeType ? k : document.createTextNode(k));
  }
  return el;
};
const icon = (name, cls = "!w-4 !h-4") => `<i data-lucide="${name}" class="${cls}"></i>`;
// Map each AWS service to a representative Lucide icon (keyword-matched, most specific first)
const awsIcon = (name = "") => {
  const n = name.toLowerCase();
  const rules = [
    [/guardrail/, "shield-check"],
    [/guardduty|macie|waf|shield|cloudtrail|vpc|\bwaf\b/, "shield"],
    [/knowledge base|kendra/, "book-open"],
    [/bedrock|claude|sagemaker|comprehend medical/, "sparkles"],
    [/textract|\bocr\b/, "scan-text"],
    [/step function/, "workflow"],
    [/lambda/, "zap"],
    [/eventbridge|event-driven/, "radio"],
    [/aurora|dynamodb|rds|postgres|pgvector/, "database"],
    [/opensearch|search/, "search"],
    [/cognito/, "user-check"],
    [/\bkms\b|encrypt/, "key-round"],
    [/quicksight|dashboard|analytics/, "bar-chart-3"],
    [/connect/, "headset"],
    [/\blex\b/, "bot"],
    [/contact lens|transcrib/, "audio-lines"],
    [/pinpoint|\bses\b|\bsns\b/, "send"],
    [/\bs3\b|storage/, "hard-drive"],
    [/a2i|human-in-the-loop/, "user-round-check"],
    [/\bsqs\b|\bdlq\b|queue/, "layers"],
    [/comprehend|translate|language/, "languages"],
    [/api gateway|cloudfront|\bcdn\b/, "network"],
  ];
  for (const [re, ic] of rules) if (re.test(n)) return ic;
  return "cloud";
};
const eyebrow = (text) => `
  <div class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
    <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>${text}
  </div>`;
const sectionHeader = ({ eyebrow: eb, title, description, align = "center" }) => `
  <div class="max-w-3xl space-y-5 ${align === "center" ? "mx-auto text-center" : "text-left"}">
    ${eb ? eyebrow(eb) : ""}
    <h2 class="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">${title}</h2>
    ${description ? `<p class="text-pretty text-lg leading-relaxed text-muted-foreground">${description}</p>` : ""}
  </div>`;

/* ---------- AI Hero Visual ---------- */
function aiHeroVisual() {
  const SIZE = 480, c = SIZE / 2;
  const RING_OUTER = 170, RING_INNER = 80, CORE = 50, NODE_DIST = 215;
  const deg = d => d * Math.PI / 180;
  const polar = (cx, cy, r, a) => ({ x: cx + r * Math.cos(deg(a)), y: cy + r * Math.sin(deg(a)) });
  const NODES = [
    { n:1, icon:"eye",          label:"Perception",      desc:"Multimodal inputs — text, vision, voice, telemetry — fused into a unified, real-time understanding of context.", angle:0 },
    { n:2, icon:"brain-circuit",label:"Memory",          desc:"Vector, graph, and structured stores that give agents continuity across sessions, systems, and conversations.", angle:45 },
    { n:3, icon:"lightbulb",    label:"Reasoning",       desc:"Chain-of-thought and tool-augmented reasoning that breaks complex problems into actionable steps.", angle:90 },
    { n:4, icon:"target",       label:"Planning",        desc:"Goal decomposition, task scheduling, and adaptive replanning when the environment shifts mid-flight.", angle:135 },
    { n:5, icon:"zap",          label:"Action",          desc:"Tool-using agents that call APIs, execute workflows, and operate safely inside your enterprise stack.", angle:180 },
    { n:6, icon:"line-chart",   label:"Learning",        desc:"Continuous evaluation, feedback loops, and fine-tuning that compound agent quality over time.", angle:225 },
    { n:7, icon:"users",        label:"Human Oversight", desc:"Approval gates, escalation paths, and explainability that keep humans in the loop where it matters.", angle:270 },
    { n:8, icon:"shield-check", label:"Governance",      desc:"Policy guardrails, audit trails, and compliance controls baked into every agent action.", angle:315 },
  ];

  const arc = (id, a1, a2, sweep = 1) => {
    const p1 = polar(c, c, RING_INNER, a1), p2 = polar(c, c, RING_INNER, a2);
    return `<path id="${id}" d="M ${p1.x},${p1.y} A ${RING_INNER},${RING_INNER} 0 0 ${sweep} ${p2.x},${p2.y}" />`;
  };

  const flowArrows = "";

  // Graceful curved arcs from bot → each node with traveling glowing particles.
  // Curves match the orbital rotation, particles stream outward like data leaving the agent.
  const nodeSvgs = NODES.map(node => {
    const a = node.angle - 90;
    const start = polar(c, c, CORE + 2, a);
    const end   = polar(c, c, NODE_DIST - 42, a);
    // perpendicular offset for a subtle clockwise curve (tangential to orbit direction)
    const midR  = (CORE + NODE_DIST) / 2 + 6;
    const midA  = a + 10;
    const ctrl  = polar(c, c, midR, midA);
    const arcId = `arc-path-${node.n}`;
    const dur   = 3.4;
    const delay = -node.n * 0.42;
    return `
      <!-- curved energy trace -->
      <path id="${arcId}"
            d="M ${start.x},${start.y} Q ${ctrl.x},${ctrl.y} ${end.x},${end.y}"
            stroke="hsl(var(--primary) / 0.28)" stroke-width="1" fill="none" stroke-linecap="round"
            stroke-dasharray="2 5">
        <animate attributeName="stroke-dashoffset" from="7" to="0" dur="1.4s" repeatCount="indefinite" />
      </path>

      <!-- glowing trailing particle -->
      <circle r="3" fill="hsl(var(--primary-glow))" filter="url(#particle-glow)">
        <animateMotion dur="${dur}s" begin="${delay}s" repeatCount="indefinite" rotate="auto">
          <mpath href="#${arcId}" />
        </animateMotion>
        <animate attributeName="opacity" values="0;0.4;1;1;0.3;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite" />
      </circle>

      <!-- second smaller particle, slightly offset -->
      <circle r="1.6" fill="hsl(var(--primary))" opacity="0.85">
        <animateMotion dur="${dur}s" begin="${delay - 0.18}s" repeatCount="indefinite">
          <mpath href="#${arcId}" />
        </animateMotion>
      </circle>`;
  }).join("");

  const nodeCards = NODES.map(node => {
    const a = node.angle - 90;
    const cardP = polar(50, 50, (NODE_DIST * 100) / SIZE, a);
    const shimmerDelay = -node.n * 0.7;
    return `
      <div class="group absolute" data-node-card="${node.n}" style="left:${cardP.x}%;top:${cardP.y}%;transform:translate(-50%,-50%)">
        <!-- counter-rotate so label stays upright while the orbit spins CCW -->
        <div style="animation:spin-cw 60s linear infinite;transform-origin:50% 50%">
          <div class="animate-float" style="animation-delay:${-node.n * 0.6}s;animation-duration:${5 + (node.n % 3) * 0.7}s">
            <div class="relative">
              <!-- soft chromatic halo -->
              <div class="absolute -inset-1 rounded-full opacity-60 blur-md transition-opacity duration-300 group-hover:opacity-100"
                   style="background:linear-gradient(135deg, hsl(var(--primary)/0.45), hsl(var(--accent)/0.45))"></div>

              <!-- chip -->
              <div class="chip-hit relative flex items-center gap-2 overflow-hidden rounded-full border border-primary/30 pl-1 pr-2.5 py-1 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/60"
                   style="background:linear-gradient(135deg, hsl(0 0% 100% / 0.98), hsl(var(--primary) / 0.08) 80%, hsl(var(--primary) / 0.12));box-shadow:0 8px 24px -10px hsl(var(--primary)/0.55), inset 0 1px 0 hsl(0 0% 100% / 0.6)">
                <!-- shimmer streak -->
                <span class="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                      style="background:linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.55), transparent);animation:chip-shimmer 6s ease-in-out infinite;animation-delay:${shimmerDelay}s"></span>

                <!-- glass-marble icon -->
                <div class="relative grid h-7 w-7 shrink-0 place-items-center rounded-full text-white"
                     style="background:linear-gradient(135deg, hsl(var(--primary-glow)), hsl(var(--primary)) 60%, hsl(var(--primary-deep))); box-shadow:0 4px 10px -2px hsl(var(--primary)/0.65), inset 0 1px 0 hsl(0 0% 100% / 0.45), inset 0 -2px 4px hsl(var(--primary-deep) / 0.45)">
                  <!-- specular highlight -->
                  <span class="pointer-events-none absolute inset-0.5 rounded-full"
                        style="background:radial-gradient(circle at 32% 28%, hsl(0 0% 100% / 0.55) 0%, transparent 55%)"></span>
                  <span class="relative">${icon(node.icon, "!w-3.5 !h-3.5")}</span>
                </div>

                <span class="relative text-[11px] font-semibold text-foreground leading-none whitespace-nowrap tracking-wide">${node.label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }).join("");

  return `
    <div data-ai-hero class="relative mx-auto w-full" style="max-width:${SIZE}px;aspect-ratio:1/1;perspective:1400px">
      <div class="absolute inset-0 -z-10" style="background:radial-gradient(circle at center, hsl(var(--primary) / 0.12) 0%, transparent 60%)"></div>
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-primary/15 blur-3xl animate-drift"></div>
        <div class="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-accent/15 blur-3xl animate-drift" style="animation-delay:-7s"></div>
      </div>

      <div class="relative h-full w-full animate-float" style="transform-style:preserve-3d;transform:rotateX(14deg) rotateZ(-2deg);animation-duration:9s">
        <svg viewBox="0 0 ${SIZE} ${SIZE}" class="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="ring-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity=".9"/>
              <stop offset="100%" stop-color="hsl(var(--primary-glow))" stop-opacity=".6"/>
            </linearGradient>
            <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity="0"/>
              <stop offset="50%" stop-color="hsl(var(--primary-glow))" stop-opacity="1"/>
              <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity="0"/>
            </linearGradient>
            <radialGradient id="core-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity=".45"/>
              <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity="0"/>
            </radialGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" />
            </marker>
            <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            ${arc("arc-sense", -135, -45, 1)}
            ${arc("arc-think", -45, 45, 1)}
            ${arc("arc-act", 135, 45, 0)}
            ${arc("arc-learn", 225, 135, 0)}
          </defs>

          <circle cx="${c}" cy="${c}" r="120" fill="url(#core-halo)" />

          ${flowArrows}

          <!-- Beams + node anchors rotate counter-clockwise (in lock-step with the orbiting cards) -->
          <g>
            <animateTransform attributeName="transform" type="rotate"
              from="0 ${c} ${c}" to="-360 ${c} ${c}" dur="60s" repeatCount="indefinite" />
            ${nodeSvgs}
          </g>

          <!-- SENSE · THINK · ACT · LEARN arc labels rotate clockwise around the bot -->
          <g fill="hsl(var(--primary))" font-size="10" font-weight="700" letter-spacing="6" style="text-transform:uppercase">
            <animateTransform attributeName="transform" type="rotate"
              from="0 ${c} ${c}" to="360 ${c} ${c}" dur="40s" repeatCount="indefinite" />
            <text><textPath href="#arc-sense" startOffset="50%" text-anchor="middle">Sense</textPath></text>
            <text><textPath href="#arc-think" startOffset="50%" text-anchor="middle">Think</textPath></text>
            <text><textPath href="#arc-act"   startOffset="50%" text-anchor="middle">Act</textPath></text>
            <text><textPath href="#arc-learn" startOffset="50%" text-anchor="middle">Learn</textPath></text>
          </g>
        </svg>

        <!-- 3D ORBITAL SPHERE: three tilted rings revolving on Y axis -->
        <div class="absolute inset-0 grid place-items-center pointer-events-none" style="transform-style:preserve-3d">
          <div class="relative" style="width:240px;height:240px;transform-style:preserve-3d;animation:spin-3d-y 22s linear infinite">
            <!-- ring 1 -->
            <div class="absolute inset-0 rounded-full" style="border:1px solid hsl(var(--primary) / 0.45);box-shadow:0 0 24px -6px hsl(var(--primary) / 0.4) inset;transform:rotateX(75deg)">
              <div class="absolute h-2.5 w-2.5 rounded-full" style="top:50%;left:100%;transform:translate(-50%,-50%);background:hsl(var(--primary-glow));box-shadow:0 0 12px hsl(var(--primary-glow)),0 0 22px hsl(var(--primary))"></div>
            </div>
            <!-- ring 2 -->
            <div class="absolute inset-0 rounded-full" style="border:1px solid hsl(var(--accent) / 0.4);transform:rotateX(75deg) rotateY(60deg)">
              <div class="absolute h-2 w-2 rounded-full" style="top:50%;left:0%;transform:translate(-50%,-50%);background:hsl(var(--accent));box-shadow:0 0 10px hsl(var(--accent))"></div>
            </div>
            <!-- ring 3 -->
            <div class="absolute inset-0 rounded-full" style="border:1px solid hsl(var(--primary) / 0.4);transform:rotateX(75deg) rotateY(120deg)">
              <div class="absolute h-2 w-2 rounded-full" style="top:50%;left:100%;transform:translate(-50%,-50%);background:hsl(var(--primary));box-shadow:0 0 10px hsl(var(--primary))"></div>
            </div>
          </div>
        </div>

        <!-- Counter-rotating equatorial ring (different speed/direction for parallax) -->
        <div class="absolute inset-0 grid place-items-center pointer-events-none" style="transform-style:preserve-3d">
          <div class="relative rounded-full"
               style="width:280px;height:280px;border:1px dashed hsl(var(--primary) / 0.25);transform:rotateX(72deg);animation:spin-cw 36s linear infinite">
            <div class="absolute h-1.5 w-1.5 rounded-full" style="top:50%;left:0%;transform:translate(-50%,-50%);background:hsl(var(--primary-glow));box-shadow:0 0 8px hsl(var(--primary-glow))"></div>
            <div class="absolute h-1.5 w-1.5 rounded-full" style="top:50%;left:100%;transform:translate(-50%,-50%);background:hsl(var(--accent));box-shadow:0 0 8px hsl(var(--accent))"></div>
          </div>
        </div>

        <!-- Pulsing emanation waves from the bot -->
        <div class="absolute left-1/2 top-1/2 pointer-events-none">
          <div class="absolute rounded-full" style="width:140px;height:140px;left:0;top:0;border:1px solid hsl(var(--primary) / 0.55);animation:emanate 4.5s ease-out infinite"></div>
          <div class="absolute rounded-full" style="width:140px;height:140px;left:0;top:0;border:1px solid hsl(var(--primary) / 0.45);animation:emanate 4.5s ease-out infinite;animation-delay:-1.5s"></div>
          <div class="absolute rounded-full" style="width:140px;height:140px;left:0;top:0;border:1px solid hsl(var(--accent) / 0.45);animation:emanate 4.5s ease-out infinite;animation-delay:-3s"></div>
        </div>

        <!-- core -->
        <div class="absolute left-1/2 top-1/2" style="transform:translate(-50%,-50%) translateZ(40px)">
          <div class="relative">
            <span class="absolute inset-0 rounded-full bg-primary/40 blur-2xl animate-pulse"></span>
            <div class="relative grid place-items-center rounded-full bg-gradient-primary shadow-glow border border-white/25" style="width:${CORE*2}px;height:${CORE*2}px">
              ${icon("bot", "!w-9 !h-9 text-white")}
            </div>
          </div>
        </div>

        <!-- Orbiting node cards (rotate counter-clockwise; matches the beams in the SVG) -->
        <div class="absolute inset-0" style="animation:spin-ccw 60s linear infinite;transform-origin:50% 50%">
          ${nodeCards}
        </div>
      </div>

      <!-- Click-to-inspect detail panel (centered, replaces the bot while a node is active) -->
      <div data-node-detail class="rounded-2xl border border-primary/30 bg-white/95 p-5 text-left shadow-glow backdrop-blur-xl">
        <div class="flex items-start gap-3">
          <div data-detail-icon class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-white shadow-md">
            ${icon("bot", "!w-5 !h-5")}
          </div>
          <div class="min-w-0 flex-1">
            <p data-detail-label class="text-base font-semibold leading-tight tracking-tight text-foreground">Select a node</p>
            <p data-detail-desc class="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">Click any capability to learn more.</p>
          </div>
          <button data-detail-close class="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Close">
            ${icon("x", "!w-3.5 !h-3.5")}
          </button>
        </div>
      </div>

      <!-- Serialized node data for the click handler -->
      <script type="application/json" data-node-data>${JSON.stringify(NODES.map(n => ({ n: n.n, icon: n.icon, label: n.label, desc: n.desc })))}<\/script>
    </div>`;
}

/* =================== PAGES =================== */

function pageHome() {
  return `
  <!-- Hero -->
  <section class="relative overflow-hidden surface-hero pt-10 pb-24 lg:pt-16 lg:pb-32">
    <div class="absolute inset-0 grid-bg opacity-40"></div>
    <div class="absolute -top-24 left-1/4 h-[360px] w-[360px] rounded-full bg-primary/10 blur-3xl animate-drift"></div>
    <div class="absolute top-32 right-0 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl animate-drift" style="animation-delay:-6s"></div>

    <div class="container-x relative">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div class="text-center lg:text-left animate-fade-up">
          ${eyebrow("AWS Advanced Consulting Partner")}
          <h1 class="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl xl:text-7xl" style="font-size: 60px">
            The Future of Enterprise Is
            <span class="relative inline-block">
              <span class="text-gradient">Autonomous.</span>
              <span class="pointer-events-none absolute -inset-x-2 -bottom-2 h-2 rounded-full bg-gradient-primary opacity-30 blur-md"></span>
            </span>
            We Build It.
          </h1>
          <p class="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0" data-comment-anchor="cc-1">
            Algorims is purpose-built for the age of agentic AI — building intelligent systems that don't just automate work, but reason through it, decide on it, and act to deliver real enterprise outcomes.
            <br><br>
            As an AWS Advanced Consulting Partner, we engineer AI agents, autonomous workflows, and self-improving systems at enterprise scale — secure, measurable, and built to last.
          </p>
          <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <a href="/contact" class="btn btn-hero btn-xl">Get Started ${icon("arrow-right")}</a>
            <a href="/agentic-ai" class="btn btn-outline btn-xl">Explore Agentic AI</a>
          </div>
        </div>
        <div class="relative animate-fade-up" style="animation-delay:200ms">
          ${aiHeroVisual()}
        </div>
      </div>

      <div class="mt-20">
        <p class="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by teams shipping at enterprise scale
        </p>
        <div class="mt-8 relative overflow-hidden"
             style="-webkit-mask-image:linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);mask-image:linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);">
          <div class="flex w-max items-center gap-12 md:gap-16" style="animation:trusted-marquee 50s linear infinite">
            ${[1,2].map(() => Array.from({length: 14}, (_, i) => {
              const n = String(i+1).padStart(2,'0');
              const ext = i === 10 ? 'svg' : 'png';
              return `<img src="${BASE_PATH}/assets/trusted/logo-${n}.${ext}" alt="Algorims client logo" class="trusted-logo h-10 w-auto max-w-[140px] object-contain md:h-12" loading="lazy" />`;
            }).join("")).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Metrics -->
  <section class="py-8 lg:py-12">
    <div class="container-x">
      <div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        ${[
          {v:"20+",l:"Enterprises Transformed"},
          {v:"10+",l:"Certified AI & Cloud Engineers"},
          {v:"7+",l:"Industries and Growing"},
          {v:"99.99%",l:"Enterprise-Grade Reliability"},
        ].map(m => `
          <div class="bg-card p-8 text-center transition-colors hover:bg-secondary/40">
            <p class="text-4xl font-semibold tracking-tight text-gradient md:text-5xl">${m.v}</p>
            <p class="mt-2 text-sm text-muted-foreground">${m.l}</p>
          </div>
        `).join("")}
      </div>
      <p class="mt-6 text-center text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Trusted by enterprises across Singapore, SEA and beyond</p>

      <div class="mt-12 grid gap-6 md:grid-cols-2">
        ${[
          {
            eyebrow: "What makes us different",
            title: "Complexity Is Our Speciality",
            desc: "The harder the problem, the more we lean in. We are built for enterprises navigating complex transformations — bringing clarity, speed, and precision to challenges that others find too difficult to solve.",
            icon: "layers",
          },
          {
            eyebrow: "How we work",
            title: "Discover & Diagnose",
            desc: "We start by listening. Before writing a single line of code, we immerse ourselves in your business — understanding your goals, challenges, existing systems, and the outcomes that matter most. No assumptions. No templates. Just deep discovery.",
            icon: "search",
          },
        ].map(c => `
          <div class="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg lg:p-10">
            <div class="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20"></div>
            <div class="relative flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                ${icon(c.icon, "!w-5 !h-5")}
              </div>
              <p class="text-xs font-medium uppercase tracking-[0.18em] text-primary">${c.eyebrow}</p>
            </div>
            <h3 class="relative mt-6 text-2xl font-semibold tracking-tight md:text-3xl">${c.title}</h3>
            <p class="relative mt-3 text-base leading-relaxed text-muted-foreground">${c.desc}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="mx-auto max-w-[880px] space-y-5 text-center">
        ${eyebrow("What we do")}
        <h2 class="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">From Cloud to Agentic. <span class="text-gradient">End to End</span></h2>
        <p class="text-pretty text-lg leading-relaxed text-muted-foreground">Three&nbsp;&nbsp;practices. One relentless focus: Enterprise-grade systems that drive measurable business value.</p>
      </div>
      <div class="mt-14 grid gap-6 md:grid-cols-3">
        ${[
          {icon:"code-2",     title:"Development",       desc:"Not just code. AI-ready applications engineered by senior developers — built to perform, scale, and integrate intelligently from day one. From enterprise web and mobile platforms to complex APIs and system integrations — we deliver production-grade software that is robust, future-proof, and designed to work seamlessly alongside your AI infrastructure.",       to:"#/services#dev", accent:true},
          {icon:"cloud",      title:"Cloud Engineering", desc:"Your cloud should work smarter. We build AWS-native foundations that eliminate waste, maximise performance, and turn infrastructure into a strategic business asset. From landing zones and cloud migrations to architecture modernisation and cost optimisation — we engineer cloud environments that are secure, scalable, and purpose-built to power intelligent enterprise systems.",      to:"#/services#cloud"},
          {icon:"git-branch", title:"DevOps & Platform", desc:"Ship faster. Break nothing. We engineer CI/CD pipelines, developer platforms, and SRE practices where speed, reliability, and security move together — always. From internal developer platforms to automated testing, observability, and incident response — we build the engineering foundation that lets your teams deploy with confidence and operate at enterprise scale.",            to:"#/services#devops"},
        ].map(s => `
          <a href="${s.to}" class="group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${s.accent ? "border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card" : "border-border bg-card hover:border-primary/30"}">
            <div class="grid h-12 w-12 place-items-center rounded-2xl ${s.accent ? "bg-gradient-primary text-white shadow-glow" : "bg-primary/10 text-primary"}">
              ${icon(s.icon, "!w-6 !h-6")}
            </div>
            <h3 class="mt-6 text-2xl font-semibold tracking-tight">${s.title}</h3>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">${s.desc}</p>
            <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
              Learn more
              ${icon("arrow-right","!w-4 !h-4")}
            </span>
          </a>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Case study preview -->
  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        ${sectionHeader({align:"left", eyebrow:"Selected work", title:`Intelligence Delivered. <span class="text-gradient">Impact Measured.</span>`})}
        <a href="/case-studies" class="btn btn-ghost btn-default rounded-full">View all case studies ${icon("arrow-right")}</a>
      </div>
      <div class="mt-12 grid gap-6 lg:grid-cols-2">
        ${[
          {
            tag:"Agentic AI · Quick Service Restaurants",
            title:"How We Turned Workforce Complexity Into Real-Time Intelligence for a Leading QSR Chain",
            problem:"A major QSR operator across Singapore was making critical workforce decisions in the dark — buried in manual reports, fragmented data, and delayed insights that left managers guessing on staffing, costs, and productivity.",
            solution:"Algorims built a Conversational Analytics Platform on AWS — powered by GenAI — enabling business users to ask workforce questions in plain English and instantly receive real-time insights, visual analytics, and intelligent recommendations. No analysts. No waiting. No guesswork.",
            metric:"490K+ transactions analysed · 46% productivity gap uncovered · Deployed in 4 weeks",
          },
          {
            tag:"Cloud · SaaS",
            title:"How We Reduced Time-to-Hire by 60% with an AI-Powered Recruitment Platform",
            problem:"Hiring top talent was taking too long. Manual CV screening, disconnected recruitment workflows, and slow hiring processes were leaving critical positions unfilled for weeks — costing businesses time, money, and their best candidates to competitors.",
            solution:"We built a Recruitment as a Service platform on AWS — underpinned by a fully automated CI/CD pipeline using GitHub Actions, Docker, and Kubernetes — eliminating manual CV screening entirely and accelerating every stage of the hiring journey from application to offer.",
            metric:"60% reduction in time-to-hire · Manual CV screening eliminated · Top talent secured faster",
          },
        ].map(c => `
          <article class="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg">
            <div class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20"></div>
            <p class="relative text-xs font-medium uppercase tracking-widest text-primary">${c.tag}</p>
            <h3 class="relative mt-4 text-2xl font-semibold leading-tight tracking-tight md:text-[1.6rem]">${c.title}</h3>
            <div class="relative mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>${c.problem}</p>
              <p>${c.solution}</p>
            </div>
            <div class="relative mt-6 rounded-2xl border border-border/80 bg-background/40 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Impact</p>
              <p class="mt-1 text-base font-semibold text-gradient">${c.metric}</p>
            </div>
            <div class="relative mt-6 flex items-center justify-between">
              <a href="/case-studies" class="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">Read the full story ${icon("arrow-right","!w-4 !h-4")}</a>
              <div class="grid h-10 w-10 place-items-center rounded-full border border-border transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary">${icon("arrow-up-right","!w-4 !h-4")}</div>
            </div>
          </article>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Partner highlight -->
  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-14">
        <div class="absolute inset-0 surface-mesh opacity-40"></div>
        <div class="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div class="space-y-5">
            ${eyebrow("Strategic alliance")}
            <h2 class="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">AWS <span class="text-gradient">Advanced Consulting Partner</span></h2>
            <p class="text-base leading-relaxed text-muted-foreground">As an AWS Advanced Consulting Partner, Algorims delivers certified, enterprise-grade expertise across AI, data, and cloud infrastructure — bringing architectural rigour, GenAI innovation, and proven AWS specialisations to every engagement.</p>
            <div class="flex items-center gap-5 pt-2">
              <img src="${BASE_PATH}/assets/aws-partner-badge.png" alt="AWS Partner — Advanced Tier Services" class="h-28 w-28 shrink-0 object-contain" />
              <div class="flex flex-wrap gap-2">
                ${["Bedrock","SageMaker","EKS","Well-Architected","GenAI Competency"].map(b => `<span class="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">${b}</span>`).join("")}
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            ${[
              {icon:"shield-check", label:"Well-Architected reviews"},
              {icon:"zap",          label:"GenAI accelerators"},
              {icon:"cloud",        label:"Migration & modernization"},
              {icon:"line-chart",   label:"FinOps & optimization"},
            ].map(f => `
              <div class="rounded-2xl border border-border bg-background/60 p-5 backdrop-blur">
                ${icon(f.icon, "!w-5 !h-5 text-primary")}
                <p class="mt-3 text-sm font-medium">${f.label}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${ctaBlock()}
  `;
}

function ctaBlock() {
  return `
  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-dark p-10 text-white shadow-lg md:p-16">
        <div class="absolute inset-0 surface-mesh opacity-60"></div>
        <div class="absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl" style="background:hsl(var(--primary-glow) / .3)"></div>
        <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full blur-3xl" style="background:hsl(var(--primary) / .4)"></div>

        <div class="relative grid gap-10 md:grid-cols-5 md:items-center">
          <div class="md:col-span-3 space-y-5">
            <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
              <span class="h-1.5 w-1.5 rounded-full" style="background:hsl(var(--primary-glow))"></span>
              Ready when you are
            </div>
            <h2 class="text-balance text-4xl font-semibold leading-tight md:text-5xl">
              Let's architect your <span class="bg-clip-text text-transparent" style="background-image:linear-gradient(to right, hsl(var(--primary-glow)), white)">Agentic Enterprise</span>.
            </h2>
            <p class="max-w-xl text-base leading-relaxed text-white/75">
              Talk to our team about your AI, cloud, or platform engineering goals. We'll design a plan that scales with your business.
            </p>
          </div>
          <div class="md:col-span-2 flex flex-col gap-3 md:items-end">
            <a href="/contact" class="btn btn-xl" style="background:white;color:hsl(var(--primary-deep))">
              Book a consultation ${icon("arrow-right")}
            </a>
            <a href="/services" class="btn btn-ghost btn-lg rounded-full" style="color:white">Explore services</a>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function aboutHeroAnim() {
  return `
    <div class="aha-wrap" aria-hidden="true">
      <svg class="aha-svg" viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="aha-bg-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stop-color="hsl(280 95% 70%)" stop-opacity="0.28"/>
            <stop offset="55%"  stop-color="hsl(265 85% 58%)" stop-opacity="0.10"/>
            <stop offset="100%" stop-color="hsl(265 85% 58%)" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="aha-core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stop-color="hsl(265 85% 58%)"/>
            <stop offset="55%"  stop-color="hsl(275 90% 64%)"/>
            <stop offset="100%" stop-color="hsl(280 95% 72%)"/>
          </linearGradient>
          <linearGradient id="aha-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="hsl(280 95% 70%)" stop-opacity="0"/>
            <stop offset="50%"  stop-color="hsl(280 95% 70%)" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="hsl(280 95% 70%)" stop-opacity="0"/>
          </linearGradient>
          <pattern id="aha-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="1.1" fill="hsl(265 60% 65% / 0.18)"/>
          </pattern>
        </defs>

        <!-- backdrop: dot grid + radial halo -->
        <g class="aha-grid-fade"><rect x="0" y="0" width="460" height="460" fill="url(#aha-dots)"/></g>
        <rect x="0" y="0" width="460" height="460" fill="url(#aha-bg-glow)"/>

        <!-- ambient corner sparks -->
        <g>
          <circle class="aha-spark aha-spark-1" cx="38"  cy="46"  r="2.2" fill="hsl(280 95% 70%)"/>
          <circle class="aha-spark aha-spark-2" cx="426" cy="58"  r="2.4" fill="hsl(265 85% 58%)"/>
          <circle class="aha-spark aha-spark-3" cx="46"  cy="418" r="2.0" fill="hsl(265 85% 58%)"/>
          <circle class="aha-spark aha-spark-4" cx="420" cy="412" r="2.4" fill="hsl(280 95% 70%)"/>
        </g>

        <!-- pulse rings from the core -->
        <circle class="aha-ping aha-ping-1" cx="230" cy="230" r="48" fill="none" stroke="hsl(280 95% 70%)" stroke-width="1.4"/>
        <circle class="aha-ping aha-ping-2" cx="230" cy="230" r="48" fill="none" stroke="hsl(265 85% 58%)" stroke-width="1.2"/>
        <circle class="aha-ping aha-ping-3" cx="230" cy="230" r="48" fill="none" stroke="hsl(280 95% 70%)" stroke-width="1.0"/>

        <!-- =================== CONNECTION LINKS =================== -->
        <g stroke="hsl(265 85% 58% / 0.55)" stroke-width="1.4" stroke-linecap="round" fill="none">
          <line class="aha-link aha-link-1" x1="230" y1="230" x2="110" y2="90"/>
          <line class="aha-link aha-link-2" x1="230" y1="230" x2="350" y2="90"/>
          <line class="aha-link aha-link-3" x1="230" y1="230" x2="60"  y2="230"/>
          <line class="aha-link aha-link-4" x1="230" y1="230" x2="400" y2="230"/>
          <line class="aha-link aha-link-5" x1="230" y1="230" x2="110" y2="370"/>
          <line class="aha-link aha-link-6" x1="230" y1="230" x2="350" y2="370"/>
        </g>

        <!-- =================== TRAVELING DATA DOTS =================== -->
        <g>
          <circle class="aha-dot aha-dot-1" cx="230" cy="230" r="3.2" fill="hsl(212 90% 60%)"/>
          <circle class="aha-dot aha-dot-2" cx="230" cy="230" r="3.2" fill="hsl(265 85% 58%)"/>
          <circle class="aha-dot aha-dot-3" cx="230" cy="230" r="3.2" fill="hsl(150 65% 50%)"/>
          <circle class="aha-dot aha-dot-4" cx="230" cy="230" r="3.2" fill="hsl(40 95% 58%)"/>
          <circle class="aha-dot aha-dot-5" cx="230" cy="230" r="3.2" fill="hsl(280 95% 70%)"/>
          <circle class="aha-dot aha-dot-6" cx="230" cy="230" r="3.2" fill="hsl(0 75% 62%)"/>
        </g>

        <!-- =================== CAPABILITY NODES =================== -->
        <g font-family="'DM Sans', system-ui, sans-serif">
          <!-- top-left: Cloud -->
          <g transform="translate(110 90)"><g class="aha-node aha-node-1">
            <rect x="-54" y="-19" width="108" height="38" rx="19" fill="white" stroke="hsl(265 30% 88%)"/>
            <circle cx="-38" cy="0" r="6" fill="hsl(212 90% 60%)"/>
            <text x="-25" y="4" font-size="12" font-weight="600" fill="hsl(260 30% 18%)">Cloud</text>
          </g></g>

          <!-- top-right: Agentic AI -->
          <g transform="translate(350 90)"><g class="aha-node aha-node-2">
            <rect x="-58" y="-19" width="116" height="38" rx="19" fill="white" stroke="hsl(265 30% 88%)"/>
            <circle cx="-42" cy="0" r="6" fill="url(#aha-core-grad)"/>
            <text x="-30" y="4" font-size="12" font-weight="600" fill="hsl(260 30% 18%)">Agentic AI</text>
          </g></g>

          <!-- center-left: DevOps -->
          <g transform="translate(60 230)"><g class="aha-node aha-node-3">
            <rect x="-50" y="-19" width="100" height="38" rx="19" fill="white" stroke="hsl(265 30% 88%)"/>
            <circle cx="-34" cy="0" r="6" fill="hsl(150 65% 50%)"/>
            <text x="-21" y="4" font-size="12" font-weight="600" fill="hsl(260 30% 18%)">DevOps</text>
          </g></g>

          <!-- center-right: Data & ML -->
          <g transform="translate(400 230)"><g class="aha-node aha-node-4">
            <rect x="-54" y="-19" width="108" height="38" rx="19" fill="white" stroke="hsl(265 30% 88%)"/>
            <circle cx="-38" cy="0" r="6" fill="hsl(40 95% 58%)"/>
            <text x="-25" y="4" font-size="12" font-weight="600" fill="hsl(260 30% 18%)">Data &amp; ML</text>
          </g></g>

          <!-- bottom-left: Platform -->
          <g transform="translate(110 370)"><g class="aha-node aha-node-5">
            <rect x="-54" y="-19" width="108" height="38" rx="19" fill="white" stroke="hsl(265 30% 88%)"/>
            <circle cx="-38" cy="0" r="6" fill="hsl(280 95% 70%)"/>
            <text x="-25" y="4" font-size="12" font-weight="600" fill="hsl(260 30% 18%)">Platform</text>
          </g></g>

          <!-- bottom-right: Security -->
          <g transform="translate(350 370)"><g class="aha-node aha-node-6">
            <rect x="-54" y="-19" width="108" height="38" rx="19" fill="white" stroke="hsl(265 30% 88%)"/>
            <circle cx="-38" cy="0" r="6" fill="hsl(0 75% 62%)"/>
            <text x="-25" y="4" font-size="12" font-weight="600" fill="hsl(260 30% 18%)">Security</text>
          </g></g>
        </g>

        <!-- =================== CORE MONOGRAM =================== -->
        <g transform="translate(230 230)"><g class="aha-core">
          <rect x="-44" y="-44" width="88" height="88" rx="22" fill="url(#aha-core-grad)"/>
          <!-- subtle inner highlight -->
          <rect x="-38" y="-38" width="76" height="34" rx="17" fill="white" opacity="0.18"/>
          <text x="0" y="16" text-anchor="middle"
                font-family="'DM Sans', system-ui, sans-serif"
                font-size="50" font-weight="700" fill="white" letter-spacing="-0.02em">A</text>
          <!-- corner tick -->
          <circle cx="32" cy="-32" r="6" fill="white"/>
          <circle cx="32" cy="-32" r="3" fill="url(#aha-core-grad)"/>
        </g></g>

        <!-- =================== SCANNING SWEEP =================== -->
        <rect class="aha-scan" x="-60" y="0" width="120" height="460" fill="url(#aha-sweep)"/>
      </svg>
    </div>
  `;
}

function pageAbout() {
  return `
  <section class="py-20 lg:py-12">
    <div class="container-x">
      <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="space-y-6 lg:col-span-7">
          ${eyebrow("About Algorims")}
          <h1 class="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">The Future of Enterprise Starts Here.</h1>
          <p class="text-2xl font-semibold leading-tight tracking-tight md:text-3xl"><span class="text-gradient">We built the foundation for it.</span></p>
          <p class="text-lg leading-relaxed text-muted-foreground">From cloud pioneers to agentic AI leaders — this is the story of a firm built to be different from day one.</p>
        </div>
        <div class="lg:col-span-5">
          ${aboutHeroAnim()}
        </div>
      </div>
    </div>
  </section>

  <section class="py-12">
    <div class="container-x">
      <div class="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-4">
          ${eyebrow("Our story")}
          <h2 class="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">Why we <span class="text-gradient">exist</span></h2>
        </div>
        <div class="space-y-5 text-lg leading-relaxed text-muted-foreground lg:col-span-8">
          <p>In 2023, Algorims was founded on a single, uncompromising conviction — that enterprises deserve one trusted partner with the depth to do it all. A firm that could architect bulletproof cloud foundations, engineer world-class DevOps pipelines, and deploy cutting-edge agentic AI systems — not as separate services, but as one unified, intelligent capability.</p>
          <p class="text-foreground">Today, Algorims stands at the intersection of cloud excellence and autonomous intelligence — a firm that was never built to follow the market, but to lead it.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="py-12">
    <div class="container-x">
      <div class="space-y-3">
        ${eyebrow("Mission & Vision")}
        <h2 class="text-4xl font-semibold tracking-tight md:text-5xl">What drives us forward</h2>
      </div>

      <div class="mt-10 grid gap-6 md:grid-cols-2">
        ${[
          {
            title:"Mission",
            body:"To empower enterprises with the cloud foundations, engineering excellence, and agentic AI capabilities they need to operate smarter, move faster, and lead their industries with confidence.",
            quote:"Turning enterprise ambition into autonomous, intelligent reality.",
          },
          {
            title:"Vision",
            body:"A world where every enterprise runs on intelligent, autonomous systems — where technology doesn't just support the business, but actively drives it forward and compounds its value.",
            quote:"Every enterprise, autonomously intelligent.",
          },
        ].map(c => `
          <div class="rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-md lg:p-10">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">${c.title}</p>
            <p class="mt-4 text-base leading-relaxed text-foreground/90">${c.body}</p>
            <p class="mt-5 text-sm italic leading-relaxed text-primary/90">${c.quote}</p>
          </div>
        `).join("")}
      </div>

      <div class="mt-14 border-t border-border pt-12">
        <div class="grid gap-8 lg:grid-cols-12">
          <div class="lg:col-span-4">
            <h3 class="text-3xl font-semibold leading-[1.1] tracking-tight md:text-4xl">Our <span class="text-gradient">approach</span></h3>
          </div>
          <div class="space-y-5 text-lg leading-relaxed text-muted-foreground lg:col-span-8">
            <p>We don't parachute in with generic frameworks. We embed alongside your teams, immerse ourselves in your business, and identify the highest-impact opportunities where agentic AI and cloud engineering can create real, measurable change.</p>
            <p>From architecting intelligent workflows and deploying production-grade AI agents to building enterprise cloud foundations and scaling autonomous operations — we co-create solutions that are deeply aligned with your business goals, engineered to last, and built to evolve.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-12">
    <div class="container-x">
      <div class="rounded-3xl bg-secondary/40 p-8 md:p-12 lg:p-14">
        <div class="space-y-3">
          ${eyebrow("Our values")}
          <h2 class="text-4xl font-semibold tracking-tight md:text-5xl">What we stand for</h2>
          <p class="text-base italic text-muted-foreground md:text-lg">What guides us when no one is watching.</p>
        </div>
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          ${[
            {
              icon:"heart-handshake",
              title:"Relentless client partnership",
              body:"We embed deeply, think long-term, and stay committed until the outcomes are real and lasting.",
              quote:"We stay until the outcomes are real.",
            },
            {
              icon:"flag",
              title:"Courage to lead",
              body:"We tackle the problems others find too complex, too ambiguous, or too risky. We go where others won't.",
              quote:"We go where others won't.",
            },
            {
              icon:"shield-check",
              title:"Integrity in every engagement",
              body:"We say what we mean and deliver what we promise. Real partnership is built on trust and transparency.",
              quote:"Honest counsel. Always.",
            },
          ].map(v => `
            <div class="rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-md">
              <div class="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">${icon(v.icon, "!w-5 !h-5")}</div>
              <h3 class="mt-6 text-xl font-semibold tracking-tight">${v.title}</h3>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">${v.body}</p>
              <p class="mt-5 text-sm italic text-primary/90">${v.quote}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  </section>

  <section class="py-10 lg:py-14">
    <div class="container-x">
      ${sectionHeader({eyebrow:"Credentials", title:`Certified <span class="text-gradient">specialists</span> across the stack`, description:"Our engineers and architects hold deep credentials across cloud, data, and AI platforms."})}
      <div class="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        ${[
          "Solutions Architect — Professional",
          "Machine Learning — Specialty",
          "DevOps Engineer — Professional",
          "Data Engineer — Speciality",
          "Claude Skilljar",
          "AWS Generative AI",
        ].map(c => `
          <div class="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            ${icon("award","!w-5 !h-5 text-primary mt-0.5 shrink-0")}
            <p class="text-sm font-medium">${c}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="grid gap-10 rounded-3xl border border-border bg-card p-10 md:grid-cols-2 md:items-center md:p-14">
        <div class="space-y-5">
          ${eyebrow("Team & strength")}
          <h2 class="text-4xl font-semibold tracking-tight md:text-5xl">A senior team, built for <span class="text-gradient">complex systems</span>.</h2>
          <p class="text-base leading-relaxed text-muted-foreground">From staff engineers who've shipped at hyperscale, to ML researchers building agentic systems — we bring the seniority your most ambitious initiatives deserve.</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          ${[
            {v:"10+",l:"Certified AI & Cloud Engineers"},
            {v:"12+",l:"Years avg. experience"},
            {v:"7+",l:"Industries and Growing"},
            {v:"4",  l:"Global delivery hubs"},
          ].map(s => `
            <div class="rounded-2xl border border-border bg-background p-6">
              <p class="text-3xl font-semibold text-gradient">${s.v}</p>
              <p class="mt-1 text-sm text-muted-foreground">${s.l}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  </section>

  <section class="py-12 lg:py-16 overflow-hidden">
    <div class="container-x">
      <div class="space-y-3">
        ${eyebrow("Our journey")}
        <h2 class="text-4xl font-semibold tracking-tight md:text-5xl">Milestones that define us</h2>
      </div>

      <div class="journey relative mt-12 pl-10 md:pl-14" data-journey>
        <span class="journey-line absolute left-[7px] top-2 w-[2px] rounded-full" aria-hidden="true"></span>
        <span class="journey-spark absolute left-[3px] top-0 grid h-4 w-4 place-items-center" aria-hidden="true">
          <span class="absolute inset-0 rounded-full bg-primary/40 blur-md"></span>
          <span class="relative h-3 w-3 rounded-full bg-primary shadow-glow"></span>
        </span>
        ${[
          {year:"2023", title:"Algorims founded in Singapore",        desc:"Built to be the one partner for cloud, DevOps, and agentic AI."},
          {year:"2024", title:"Global expansion",                    desc:"Expanded globally with a second office in India."},
          {year:"2024", title:"AWS Advanced Consulting Partner",     desc:"Achieved AWS Advanced Consulting Partner status."},
          {year:"2025", title:"Agentic AI practice launched",        desc:"Deploying autonomous systems for enterprise clients across Singapore."},
          {year:"Today",title:"40+ projects. 20+ SMEs. 99.9% uptime. 24/7 support.", desc:"Growing every day."},
        ].map((m, i) => `
          <div class="journey-item relative mb-10 last:mb-0" style="--delay:${i * 140}ms; --idx:${i}">
            <span class="journey-dot absolute -left-10 top-1.5 grid h-4 w-4 place-items-center md:-left-14">
              <span class="absolute inset-0 rounded-full bg-primary/30 journey-pulse"></span>
              <span class="relative h-3 w-3 rounded-full bg-primary shadow-glow ring-4 ring-background"></span>
            </span>
            <p class="journey-year text-sm font-semibold uppercase tracking-[0.18em] text-primary">${m.year}</p>
            <h3 class="journey-title mt-2 text-xl font-semibold tracking-tight md:text-2xl">${m.title}</h3>
            <p class="journey-desc mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">${m.desc}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  ${ctaBlock()}
  `;
}

function servicesHeroAnim() {
  return `
    <div class="sha-wrap" aria-hidden="true">
      <svg class="sha-svg" viewBox="0 0 420 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sha-stage-glow" cx="50%" cy="40%" r="65%">
            <stop offset="0%"   stop-color="hsl(280 95% 70%)" stop-opacity="0.25"/>
            <stop offset="60%"  stop-color="hsl(265 85% 58%)" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="hsl(265 85% 58%)" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="sha-cloud-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stop-color="hsl(280 95% 72%)"/>
            <stop offset="100%" stop-color="hsl(265 85% 55%)"/>
          </linearGradient>
          <linearGradient id="sha-pipe-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="hsl(265 85% 58%)" stop-opacity="0"/>
            <stop offset="30%"  stop-color="hsl(265 85% 58%)" stop-opacity="0.55"/>
            <stop offset="70%"  stop-color="hsl(280 95% 70%)" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="hsl(280 95% 70%)" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="sha-node-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stop-color="white"/>
            <stop offset="60%" stop-color="hsl(280 95% 78%)"/>
            <stop offset="100%" stop-color="hsl(265 85% 55%)"/>
          </radialGradient>
          <filter id="sha-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.6" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- ambient halo -->
        <rect x="0" y="0" width="420" height="380" fill="url(#sha-stage-glow)"/>

        <!-- subtle dotted grid behind everything -->
        <g class="sha-grid" fill="hsl(265 30% 65% / 0.28)">
          ${(() => {
            let out = "";
            for (let y = 20; y <= 360; y += 28) {
              for (let x = 20; x <= 400; x += 28) out += `<circle cx="${x}" cy="${y}" r="1"/>`;
            }
            return out;
          })()}
        </g>

        <!-- =================== CLOUD (top) =================== -->
        <g class="sha-cloud-group" transform="translate(210 78)">
          <!-- soft cloud halo ring -->
          <circle class="sha-cloud-halo" r="62" fill="hsl(280 95% 70% / 0.18)"/>
          <circle class="sha-cloud-halo sha-cloud-halo-2" r="48" fill="hsl(280 95% 70% / 0.22)"/>

          <!-- cloud silhouette -->
          <g class="sha-cloud" filter="url(#sha-glow)">
            <path d="M -52 8
                     a 20 20 0 0 1 18 -20
                     a 22 22 0 0 1 38 -10
                     a 18 18 0 0 1 28 6
                     a 16 16 0 0 1 0 30
                     l -76 0
                     a 14 14 0 0 1 -8 -6 z"
                  fill="url(#sha-cloud-grad)"/>
          </g>

          <!-- floating data bits around the cloud -->
          <g class="sha-bits" font-family="ui-monospace, 'SF Mono', monospace" font-size="9" font-weight="600">
            <text class="sha-bit b1" x="-72" y="-26" fill="hsl(265 85% 58%)">{ }</text>
            <text class="sha-bit b2" x="58"  y="-30" fill="hsl(280 95% 65%)">&lt;/&gt;</text>
            <text class="sha-bit b3" x="-78" y="22"  fill="hsl(265 85% 58%)">01</text>
            <text class="sha-bit b4" x="62"  y="24"  fill="hsl(280 95% 65%)">→</text>
          </g>

          <!-- rain of data dots dropping from cloud to pipeline -->
          <g class="sha-rain">
            <circle class="sha-drop d1" cx="-22" cy="22" r="1.8" fill="hsl(280 95% 72%)"/>
            <circle class="sha-drop d2" cx="0"   cy="22" r="1.8" fill="hsl(265 85% 58%)"/>
            <circle class="sha-drop d3" cx="22"  cy="22" r="1.8" fill="hsl(280 95% 72%)"/>
          </g>
        </g>

        <!-- =================== PIPELINE (middle) =================== -->
        <g class="sha-pipeline">
          <!-- track -->
          <line x1="42" y1="200" x2="378" y2="200" stroke="hsl(265 30% 65% / 0.4)" stroke-width="1.5" stroke-dasharray="4 6"/>
          <!-- flowing energy along the track -->
          <line class="sha-flow" x1="42" y1="200" x2="378" y2="200" stroke="url(#sha-pipe-grad)" stroke-width="3" stroke-linecap="round"/>

          <!-- nodes -->
          ${[
            {x: 60,  label: "git",    sym: "git-branch"},
            {x: 145, label: "build",  sym: "package"},
            {x: 230, label: "test",   sym: "check"},
            {x: 315, label: "deploy", sym: "rocket"},
            {x: 378, label: "",       sym: "server"},
          ].map((n, i) => `
            <g class="sha-node sha-node-${i}" transform="translate(${n.x} 200)">
              <circle r="14" fill="white" stroke="hsl(265 85% 58%)" stroke-width="1.5"/>
              <circle class="sha-node-pulse" r="14" fill="none" stroke="hsl(280 95% 70%)" stroke-width="1.5"/>
              ${n.sym === "git-branch" ? `
                <g stroke="hsl(265 85% 45%)" stroke-width="1.6" fill="none" stroke-linecap="round">
                  <circle cx="-4" cy="-3" r="1.6" fill="hsl(265 85% 45%)" stroke="none"/>
                  <circle cx="-4" cy="3"  r="1.6" fill="hsl(265 85% 45%)" stroke="none"/>
                  <circle cx="4"  cy="0"  r="1.6" fill="hsl(265 85% 45%)" stroke="none"/>
                  <path d="M -4 -2 L -4 2 M -4 0 Q 0 0 4 -0.5"/>
                </g>
              ` : n.sym === "package" ? `
                <g stroke="hsl(265 85% 45%)" stroke-width="1.4" fill="none" stroke-linejoin="round">
                  <path d="M -5 -3 L 0 -5.5 L 5 -3 L 5 3 L 0 5.5 L -5 3 Z"/>
                  <path d="M -5 -3 L 0 -0.5 L 5 -3"/>
                  <path d="M 0 -0.5 L 0 5.5"/>
                </g>
              ` : n.sym === "check" ? `
                <path d="M -4 0 L -1 3 L 5 -3" stroke="hsl(150 65% 38%)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              ` : n.sym === "rocket" ? `
                <g fill="hsl(265 85% 45%)" stroke="hsl(265 85% 45%)" stroke-width="0.8" stroke-linejoin="round">
                  <path d="M 0 -5 L 4 1 L 0 3 L -4 1 Z" fill="hsl(265 85% 45%)"/>
                  <path d="M -1.6 3 L 0 5 L 1.6 3" fill="hsl(280 95% 65%)" stroke="none"/>
                </g>
              ` : `
                <g stroke="hsl(265 85% 45%)" stroke-width="1.4" fill="none">
                  <rect x="-5" y="-4" width="10" height="3.5" rx="0.6"/>
                  <rect x="-5" y="0.5" width="10" height="3.5" rx="0.6"/>
                  <circle cx="-2.6" cy="-2.2" r="0.6" fill="hsl(150 65% 50%)" stroke="none"/>
                  <circle cx="-2.6" cy="2.3"  r="0.6" fill="hsl(150 65% 50%)" stroke="none"/>
                </g>
              `}
              ${n.label ? `<text y="32" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="9" font-weight="600" fill="hsl(265 30% 35%)" letter-spacing="0.06em">${n.label.toUpperCase()}</text>` : ""}
            </g>
          `).join("")}

          <!-- traveling packets along the pipeline -->
          <circle class="sha-packet sha-packet-1" cx="60" cy="200" r="3" fill="url(#sha-node-grad)"/>
          <circle class="sha-packet sha-packet-2" cx="60" cy="200" r="2.4" fill="url(#sha-node-grad)"/>
        </g>

        <!-- =================== CODE TERMINAL (bottom) =================== -->
        <g class="sha-terminal" transform="translate(110 260)">
          <rect x="0" y="0" width="200" height="92" rx="10" fill="white" stroke="hsl(265 30% 88%)"/>
          <rect x="0" y="0" width="200" height="18" rx="10" fill="hsl(265 30% 96%)"/>
          <rect x="0" y="14" width="200" height="4" fill="hsl(265 30% 96%)"/>
          <g transform="translate(10 9)">
            <circle cx="0" cy="0" r="2.5" fill="hsl(0 70% 65%)"/>
            <circle cx="9" cy="0" r="2.5" fill="hsl(40 90% 60%)"/>
            <circle cx="18" cy="0" r="2.5" fill="hsl(150 60% 50%)"/>
          </g>
          <text x="100" y="13" text-anchor="middle" font-family="ui-monospace, monospace" font-size="8" fill="hsl(265 30% 55%)">~/algorims/deploy.sh</text>

          <!-- terminal lines (typing in via clip-path animation) -->
          <g font-family="ui-monospace, 'SF Mono', monospace" font-size="9.5">
            <text class="sha-line l1" x="12" y="34"><tspan fill="hsl(280 90% 60%)">$</tspan> <tspan fill="hsl(265 30% 25%)">algorims</tspan> <tspan fill="hsl(150 60% 35%)">build</tspan></text>
            <text class="sha-line l2" x="12" y="50"><tspan fill="hsl(265 30% 55%)">→</tspan> <tspan fill="hsl(265 30% 25%)">image</tspan> <tspan fill="hsl(265 60% 45%)">v1.4.2</tspan> <tspan fill="hsl(150 60% 35%)">✓</tspan></text>
            <text class="sha-line l3" x="12" y="66"><tspan fill="hsl(280 90% 60%)">$</tspan> <tspan fill="hsl(265 30% 25%)">deploy</tspan> <tspan fill="hsl(40 85% 45%)">--prod</tspan></text>
            <text class="sha-line l4" x="12" y="82"><tspan fill="hsl(150 60% 35%)">●</tspan> <tspan fill="hsl(265 30% 25%)">live in</tspan> <tspan fill="hsl(265 60% 45%)">us-east-1</tspan></text>
          </g>
          <!-- typing caret -->
          <rect class="sha-caret" x="12" y="74" width="5" height="10" fill="hsl(280 90% 60%)"/>
        </g>

        <!-- =================== CONNECTORS =================== -->
        <!-- cloud → pipeline -->
        <path d="M 210 130 Q 210 165 210 186" stroke="hsl(265 30% 65% / 0.45)" stroke-width="1.2" stroke-dasharray="3 4" fill="none"/>
        <!-- pipeline → terminal -->
        <path d="M 210 214 Q 210 240 210 260" stroke="hsl(265 30% 65% / 0.45)" stroke-width="1.2" stroke-dasharray="3 4" fill="none"/>
      </svg>
    </div>
  `;
}

function pageServices() {
  const services = [
    {
      id:"cloud",  icon:"cloud",      name:"Cloud Engineering",
      paragraphs:[
        "Your cloud should work harder. We build AWS-native foundations that eliminate waste, maximise performance, and turn infrastructure into a strategic business asset.",
        "From landing zones and cloud migrations to architecture modernisation and cost optimisation — we engineer cloud environments that are secure, scalable, and purpose-built to power intelligent enterprise systems.",
      ],
      who:"Enterprises modernising their infrastructure or building AI-ready cloud foundations.",
      tagsLabel:"AWS Specialisations",
      tags:"Full AWS stack — Landing Zones, EKS, FinOps, Well-Architected, and every service in between.",
      offerings:[
        "AWS landing zones & foundations",
        "Cloud migration & modernisation",
        "Well-Architected reviews",
        "FinOps & cost optimisation",
        "Security & compliance architecture",
        "Serverless & containerised solutions",
      ],
      metrics:["3.4× faster release velocity","99.9% uptime delivered","HIPAA-ready deployments"],
      caseLabel:"View cloud engineering case studies",
    },
    {
      id:"devops", icon:"git-branch", name:"DevOps & Platform",
      paragraphs:[
        "Ship faster. Break nothing. We engineer CI/CD pipelines, developer platforms, and SRE practices where speed, reliability, and security move together — always.",
        "From internal developer platforms to automated testing, observability, and incident response — we build the engineering foundation that lets your teams deploy with confidence and operate at enterprise scale.",
      ],
      who:"Engineering organisations scaling delivery velocity without sacrificing reliability.",
      tagsLabel:"Platform Capabilities",
      tags:"End-to-end platform engineering — GitOps, Kubernetes, Terraform, observability, and the full DevOps toolchain.",
      offerings:[
        "Internal developer platforms",
        "CI/CD pipelines & GitOps",
        "SRE & incident response",
        "Observability & SLOs",
        "Policy-as-code & guardrails",
        "Golden paths for every team",
      ],
      metrics:["10× deployment frequency","<15 min MTTR","Zero-touch releases"],
      caseLabel:"View DevOps case studies",
    },
    {
      id:"dev",    icon:"code-2",    name:"Development",
      paragraphs:[
        "Not just code. AI-ready applications engineered by senior developers — built to perform, scale, and integrate intelligently from day one.",
        "From enterprise web and mobile platforms to complex APIs and system integrations — we deliver production-grade software that is robust, future-proof, and designed to work seamlessly alongside your AI infrastructure.",
      ],
      who:"Product and business leaders shipping ambitious, AI-native digital experiences.",
      tagsLabel:"Stack & Capabilities",
      tags:"Any modern stack — React, Next.js, Node, iOS, Android, GraphQL, and whatever else your product needs.",
      offerings:[
        "Web platforms & dashboards",
        "Cross-platform mobile apps (iOS & Android)",
        "APIs & system integrations",
        "Design systems & UX engineering",
        "AI-native product features",
        "Hand-off-ready code & docs",
      ],
      metrics:["60% faster time-to-hire (RaaS)","4-week MVPs","App Store ready"],
      caseLabel:"View development case studies",
      accent:true,
    },
  ];
  return `
  <section class="py-10 pb-12">
    <div class="container-x">
      <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="space-y-6 lg:col-span-7">
          ${eyebrow("Our Services")}
          <h1 class="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">From Cloud Foundations to <span class="text-gradient">Autonomous Intelligence</span></h1>
          <p class="text-pretty text-lg leading-relaxed text-muted-foreground">Three&nbsp;&nbsp;practices. One relentless focus: production-grade systems that drive measurable business value.</p>

          <div class="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
            ${[
              {v:"40+",   l:"Projects Delivered"},
              {v:"99.9%", l:"System Uptime"},
              {v:"7+",    l:"Industries Served"},
              {v:"24/7",  l:"Support Coverage"},
            ].map(s => `
              <div>
                <p class="text-2xl font-semibold tracking-tight text-gradient md:text-3xl">${s.v}</p>
                <p class="mt-1 text-xs text-muted-foreground">${s.l}</p>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="lg:col-span-5">
          ${servicesHeroAnim()}
        </div>
      </div>
    </div>
  </section>

  ${services.map((s, idx) => `
    <section id="${s.id}" class="py-10 lg:py-14 ${idx % 2 === 1 ? "bg-secondary/40" : ""}">
      <div class="container-x">
        <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div class="space-y-6 lg:col-span-8">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Practice ${String(idx + 1).padStart(2, "0")}</p>
            <div class="flex items-center gap-4">
              <div class="grid h-12 w-12 place-items-center rounded-2xl ${s.accent ? "bg-gradient-primary text-white shadow-glow" : "bg-primary/10 text-primary"}">${icon(s.icon, "!w-6 !h-6")}</div>
              <h2 class="text-4xl font-semibold tracking-tight md:text-5xl">${s.name}</h2>
            </div>
            <div class="max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              ${s.paragraphs.map(p => `<p>${p}</p>`).join("")}
            </div>

            <ul class="grid gap-x-8 gap-y-3 pt-2 sm:grid-cols-2">
              ${s.offerings.map(o => `
                <li class="flex items-start gap-3 text-base text-foreground/90">
                  <span class="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-primary">${icon("check", "!w-4 !h-4")}</span>
                  <span>${o}</span>
                </li>
              `).join("")}
            </ul>

            <div class="flex flex-wrap gap-2 pt-2">
              ${s.metrics.map(m => `<span class="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">${m}</span>`).join("")}
            </div>

            <div class="pt-1">
              <a href="/case-studies" class="inline-flex items-center gap-2 text-base font-semibold text-primary transition-all hover:gap-3">
                ${s.caseLabel} ${icon("arrow-right", "!w-4 !h-4")}
              </a>
            </div>
          </div>

          <aside class="lg:col-span-4">
            <div class="sticky top-28 rounded-3xl border border-border bg-card p-7 shadow-sm md:p-8">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Who it's for</p>
              <p class="mt-3 text-base leading-relaxed text-foreground/90">${s.who}</p>
              <div class="my-6 h-px w-full bg-border"></div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">${s.tagsLabel}</p>
              <p class="mt-3 text-base leading-relaxed text-foreground/90">${s.tags}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `).join("")}

  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-dark p-10 text-center text-white md:p-16">
        <div class="absolute inset-0 grid-bg opacity-20"></div>
        <div class="absolute -right-32 -top-32 h-72 w-72 rounded-full blur-3xl" style="background:hsl(var(--primary) / .35)"></div>
        <div class="absolute -bottom-32 -left-32 h-72 w-72 rounded-full blur-3xl" style="background:hsl(var(--primary-glow) / .25)"></div>
        <div class="relative mx-auto max-w-2xl space-y-6">
          <h2 class="text-balance text-3xl font-semibold leading-tight md:text-4xl">Not sure which practice is right for you?</h2>
          <p class="text-base leading-relaxed text-white/70 md:text-lg">Let's talk. We'll identify exactly where agentic AI and cloud engineering can drive the most value for your enterprise.</p>
          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="/contact" class="btn btn-hero btn-lg">Let's build together</a>
            <a href="/case-studies" class="btn btn-lg rounded-full border border-white/25 px-6 text-white transition-colors hover:bg-white/10">View case studies</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}

function pageAgenticAI() {
  const useCases = [
    {title:"Autonomous customer operations", desc:"Agents that triage, resolve, and escalate across channels with full auditability.", slug:"autonomous-customer-operations"},
    {title:"Intelligent document processing", desc:"Reasoning agents that extract, validate, and act on enterprise documents end-to-end.", slug:"intelligent-document-processing"},
    {title:"Sales & revenue copilots", desc:"Agentic copilots that research accounts, draft outreach, and update CRM — autonomously."},
    {title:"DevOps & SRE agents", desc:"Self-healing systems: agents that detect, diagnose, and remediate production incidents."},
    {title:"Knowledge agents", desc:"Enterprise RAG plus tool use — answers grounded in your systems of record."},
    {title:"Supply chain orchestration", desc:"Agents that monitor signals, forecast demand, and coordinate across partners."},
  ];
  return `
  <section class="relative overflow-hidden surface-hero pt-10 pb-20 lg:pt-16 lg:pb-28">
    <div class="absolute inset-0 grid-bg opacity-40"></div>
    <div class="container-x relative">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div class="space-y-6 animate-fade-up">
          ${eyebrow("Agentic AI Practice")}
          <h1 class="text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">Beyond automation. <span class="text-gradient">Toward Intelligent autonomy.</span></h1>
          <p class="text-lg leading-relaxed text-muted-foreground md:text-xl">Agentic AI is the shift from systems that store information to systems that mine it, reason through it, and act on it — autonomously. We help enterprises unlock the value buried in their data, eliminate costly operational workload, and deploy cost-effective AI agents built on Amazon Nova, Kendra, and S3 Vectors.</p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a href="/contact" class="btn btn-hero btn-lg">Talk to our AI team ${icon("arrow-right")}</a>
            <a href="/case-studies" class="btn btn-outline btn-lg">See agentic case studies</a>
          </div>
        </div>

        <!-- Interactive 3D Spline scene -->
        <div class="relative h-[480px] w-full overflow-hidden rounded-3xl border border-primary/20 shadow-2xl animate-fade-up"
             style="background:var(--gradient-dark);animation-delay:200ms">
          <!-- Soft brand-tinted spotlight wash -->
          <svg class="animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[100%] opacity-0 -top-40 left-0 md:left-40 md:-top-20"
               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3787 2842" fill="none" aria-hidden="true">
            <g filter="url(#hero-spotlight)">
              <ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501"
                       transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
                       fill="hsl(280 95% 70%)" fill-opacity="0.28"></ellipse>
            </g>
            <defs>
              <filter id="hero-spotlight" x="0.86" y="0.84" width="3785.16" height="2840.26"
                      filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur"></feGaussianBlur>
              </filter>
            </defs>
          </svg>

          <!-- Brand-mesh overlay for color cohesion -->
          <div class="absolute inset-0 pointer-events-none opacity-50" style="background:var(--gradient-mesh)"></div>

          <!-- Loading state: lightweight animated robot (instant, no network).
               Crossfades out when the real 3D scene finishes loading. -->
          <div id="spline-loader" class="absolute inset-0 z-[2] grid place-items-center transition-opacity duration-700">
            <div class="flex flex-col items-center gap-5">
              <svg width="240" height="260" viewBox="0 0 240 260" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="drop-shadow-[0_20px_40px_rgba(168,85,247,0.35)]">
                <defs>
                  <linearGradient id="rb-body" x1="60" y1="40" x2="180" y2="230" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="hsl(265 40% 22%)"></stop>
                    <stop offset="1" stop-color="hsl(265 45% 13%)"></stop>
                  </linearGradient>
                  <radialGradient id="rb-screen" cx="0.5" cy="0.45" r="0.7">
                    <stop offset="0" stop-color="hsl(270 50% 16%)"></stop>
                    <stop offset="1" stop-color="hsl(270 55% 9%)"></stop>
                  </radialGradient>
                  <radialGradient id="rb-coreg" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stop-color="hsl(280 95% 80%)"></stop>
                    <stop offset="1" stop-color="hsl(280 95% 62%)"></stop>
                  </radialGradient>
                </defs>

                <!-- soft ground glow -->
                <ellipse class="rb-glow" cx="120" cy="238" rx="74" ry="12" fill="hsl(280 95% 65%)" opacity="0.5" filter="blur(2px)"></ellipse>

                <!-- orbiting particles -->
                <g class="rb-orbit">
                  <circle cx="120" cy="46" r="4" fill="hsl(280 95% 72%)"></circle>
                  <circle cx="120" cy="230" r="3" fill="hsl(265 90% 68%)" opacity="0.8"></circle>
                </g>
                <g class="rb-orbit rb-orbit-rev">
                  <circle cx="26" cy="138" r="3.5" fill="hsl(290 90% 72%)" opacity="0.9"></circle>
                  <circle cx="214" cy="138" r="3" fill="hsl(280 95% 72%)" opacity="0.7"></circle>
                </g>

                <g class="rb-stage">
                  <!-- antenna -->
                  <line x1="120" y1="40" x2="120" y2="20" stroke="hsl(280 60% 55%)" stroke-width="3" stroke-linecap="round"></line>
                  <circle class="rb-antenna-tip" cx="120" cy="15" r="5" fill="hsl(280 95% 75%)"></circle>

                  <!-- head -->
                  <rect x="58" y="40" width="124" height="98" rx="28" fill="url(#rb-body)" stroke="hsl(280 70% 60%)" stroke-opacity="0.5" stroke-width="2"></rect>
                  <!-- face screen -->
                  <rect x="74" y="58" width="92" height="62" rx="18" fill="url(#rb-screen)" stroke="hsl(280 80% 65%)" stroke-opacity="0.35"></rect>
                  <!-- eyes -->
                  <circle class="rb-eye" cx="100" cy="86" r="9" fill="url(#rb-coreg)"></circle>
                  <circle class="rb-eye rb-eye-r" cx="140" cy="86" r="9" fill="url(#rb-coreg)"></circle>
                  <!-- mouth -->
                  <rect class="rb-mouth" x="104" y="104" width="32" height="6" rx="3" fill="hsl(280 90% 70%)"></rect>

                  <!-- ears -->
                  <rect x="48" y="78" width="10" height="24" rx="5" fill="hsl(265 40% 26%)"></rect>
                  <rect x="182" y="78" width="10" height="24" rx="5" fill="hsl(265 40% 26%)"></rect>

                  <!-- neck -->
                  <rect x="104" y="138" width="32" height="12" rx="5" fill="hsl(265 40% 24%)"></rect>

                  <!-- body -->
                  <rect x="72" y="150" width="96" height="72" rx="22" fill="url(#rb-body)" stroke="hsl(280 70% 60%)" stroke-opacity="0.4" stroke-width="2"></rect>
                  <!-- arms -->
                  <rect x="52" y="158" width="14" height="46" rx="7" fill="hsl(265 40% 24%)"></rect>
                  <rect x="174" y="158" width="14" height="46" rx="7" fill="hsl(265 40% 24%)"></rect>
                  <!-- chest core -->
                  <circle class="rb-core-ring" cx="120" cy="186" r="16" fill="none" stroke="hsl(280 95% 72%)" stroke-width="2"></circle>
                  <circle class="rb-core" cx="120" cy="186" r="14" fill="url(#rb-coreg)"></circle>
                </g>
              </svg>
              <span class="text-[10px] uppercase tracking-[0.3em] text-white/60">Initializing agent…</span>
            </div>
          </div>

          <spline-viewer
            id="hero-spline"
            url="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            events-target="global"
            class="relative z-10"
            style="background:transparent"></spline-viewer>
        </div>
      </div>
    </div>
  </section>

  <section class="py-12 lg:py-16">
    <div class="container-x">
      <div class="mx-auto max-w-4xl space-y-6 text-center">
        <h2 class="text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">Your Enterprise Is Sitting On A <span class="text-gradient">Goldmine</span>. But Can't Access It.</h2>
        <p class="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">Most enterprises are drowning in data, documents, and operational complexity — yet the intelligence locked inside remains out of reach. Teams spend hours manually searching for information, processing documents, and executing repetitive tasks that drain resources and slow decision-making.</p>
      </div>

      <div class="mx-auto mt-12 max-w-4xl divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
        ${[
          {icon:"database",        title:"Knowledge is buried",      desc:"Critical insights locked inside siloed systems and disconnected data sources — invisible to the people who need them most."},
          {icon:"banknote",        title:"Operations are expensive", desc:"Manual workflows and repetitive tasks consuming time, budget, and talent that should be focused on higher-value work."},
          {icon:"clock-alert",     title:"Decisions are delayed",    desc:"Without real-time intelligence, leaders make critical decisions on outdated information — slowing growth and increasing risk."},
        ].map(p => `
          <div class="flex items-start gap-5 p-7 transition-colors hover:bg-secondary/40 md:p-8">
            <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">${icon(p.icon, "!w-5 !h-5")}</div>
            <div class="min-w-0">
              <h3 class="text-lg font-semibold tracking-tight md:text-xl">${p.title}</h3>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">${p.desc}</p>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="mx-auto mt-10 max-w-3xl text-center">
        <p class="text-lg font-medium text-foreground md:text-xl">This is not a data problem. It is not a talent problem.</p>
        <p class="mt-3 text-lg leading-relaxed text-muted-foreground md:text-xl">It is an <span class="text-gradient font-semibold">intelligence problem</span> — and agentic AI is the answer.</p>
      </div>
    </div>
  </section>

  <section class="py-10 lg:py-14">
    <div class="container-x">
      ${sectionHeader({eyebrow:"What is Agentic AI", title:`Solution that <span class="text-gradient">mines, decides, and acts for your business</span>`, description:"Agentic AI pairs a powerful reasoning engine with your enterprise knowledge — continuously mining insights, reducing operational workload, and taking autonomous action to drive measurable business outcomes."})}
      <div class="mt-14 grid gap-6 md:grid-cols-4">
        ${[
          {icon:"brain", title:"Reason", desc:"Mines your enterprise knowledge, decomposes complex operational problems, and plans multi-step actions — all without human prompting."},
          {icon:"workflow", title:"Act", desc:"Connects to your APIs, tools, and enterprise systems to execute tasks, reduce manual workload, and deliver outcomes autonomously."},
          {icon:"layers", title:"Remember", desc:"Retains organisational knowledge, learned behaviours, and operational context across every session — getting smarter with every interaction."},
          {icon:"shield-check", title:"Govern", desc:"Enterprise-grade guardrails, cost controls, evaluation frameworks, and full observability — built in from day one."},
        ].map(c => `
          <div class="rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
            <div class="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">${icon(c.icon,"!w-5 !h-5")}</div>
            <h3 class="mt-5 text-lg font-semibold">${c.title}</h3>
            <p class="mt-2 text-sm text-muted-foreground">${c.desc}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <section class="py-10 lg:py-14 bg-secondary/40">
    <div class="container-x">
      ${sectionHeader({eyebrow:"Use cases", title:`Where agentic <span class="text-gradient">Transforms Enterprise Operations</span>`, description:"Real-world deployments where intelligent agents have eliminated operational bottlenecks, unlocked hidden knowledge, and delivered measurable cost savings across industries."})}
      <div class="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${useCases.map(u => `
          <div class="group rounded-3xl border border-border bg-card p-7 transition-all hover:border-primary/30 hover:shadow-md">
            <div class="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow">${icon("bot","!w-5 !h-5")}</div>
            <h3 class="mt-5 text-xl font-semibold tracking-tight">${u.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">${u.desc}</p>
            ${u.slug ? `<a href="/solutions/${u.slug}" class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2.5">Read more ${icon("arrow-right","!w-4 !h-4")}</a>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- ============ Our AWS AI Stack ============ -->
  <section class="relative py-12 lg:py-20 overflow-hidden">
    <!-- ambient mesh -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 surface-mesh opacity-40"></div>
    <div aria-hidden="true" class="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" style="background:radial-gradient(circle, hsl(280 95% 70% / 0.18), transparent 70%)"></div>

    <div class="container-x relative">
      <div class="grid items-end gap-8 md:grid-cols-12">
        <div class="md:col-span-7 space-y-5">
          ${eyebrow("Our AWS AI Stack")}
          <h2 class="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
            Built on the most advanced <span class="text-gradient">AWS AI services</span>.
          </h2>
        </div>
        <div class="md:col-span-5">
          <p class="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            As an AWS Advanced Consulting Partner, we build on the most powerful and trusted AWS AI services — purpose-selected for knowledge mining, reasoning, and enterprise-scale autonomous operations.
          </p>
        </div>
      </div>

      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        ${[
          {n:"01", icon:"sparkles",      name:"Amazon Nova",       role:"Foundation model family",     blurb:"Frontier multimodal reasoning — purpose-built for fast, cost-effective agentic workloads at enterprise scale."},
          {n:"02", icon:"search",        name:"Amazon Kendra",     role:"Intelligent enterprise search", blurb:"Natural-language retrieval across every system of record — turning siloed documents into instant, governed answers."},
          {n:"03", icon:"database-zap",  name:"Amazon S3 Vectors", role:"Native vector storage",       blurb:"Massive-scale embeddings on durable S3 storage — semantic memory for agents without the cost of a separate database."},
          {n:"04", icon:"layers",        name:"AWS Bedrock",       role:"Managed model platform",      blurb:"Model-agnostic by design. Anthropic, Nova, Llama, Mistral and more — orchestrated through a single, secure API."},
          {n:"05", icon:"brain-circuit", name:"Amazon SageMaker",  role:"Custom ML & fine-tuning",     blurb:"Train, tune, and host domain-specific models — closing the gap between generic intelligence and your unique data."},
          {n:"06", icon:"scan-text",     name:"Amazon Textract",   role:"Document AI",                 blurb:"Extract structured signal from contracts, forms and scans — the connective tissue between paperwork and autonomous workflows."},
        ].map((s, i) => `
          <div class="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg ${i === 0 ? "lg:row-span-1" : ""}">
            <!-- corner glow on hover -->
            <div aria-hidden="true" class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style="background:radial-gradient(circle, hsl(280 95% 70% / 0.45), transparent 70%)"></div>

            <div class="flex items-start justify-between">
              <div class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                ${icon(s.icon, "!w-5 !h-5")}
              </div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">${s.n}</span>
                <span class="h-3 w-px bg-border"></span>
                <span class="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">AWS</span>
              </div>
            </div>

            <div class="mt-7">
              <h3 class="text-xl font-semibold tracking-tight">${s.name}</h3>
              <p class="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-primary/80">${s.role}</p>
              <p class="mt-4 text-sm leading-relaxed text-muted-foreground">${s.blurb}</p>
            </div>

            <!-- bottom accent line that grows on hover -->
            <div aria-hidden="true" class="absolute bottom-0 left-7 right-7 h-px origin-left scale-x-0 bg-gradient-primary transition-transform duration-500 group-hover:scale-x-100"></div>
          </div>
        `).join("")}
      </div>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-xs text-muted-foreground">
        <span class="inline-flex items-center gap-2">
          <span class="grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary">${icon("check","!w-3 !h-3")}</span>
          AWS Well-Architected
        </span>
        <span class="h-1 w-1 rounded-full bg-border"></span>
        <span class="inline-flex items-center gap-2">
          <span class="grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary">${icon("shield-check","!w-3 !h-3")}</span>
          Secure by default
        </span>
        <span class="h-1 w-1 rounded-full bg-border"></span>
        <span class="inline-flex items-center gap-2">
          <span class="grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary">${icon("globe","!w-3 !h-3")}</span>
          Region-flexible deployment
        </span>
      </div>
    </div>
  </section>

  <!-- ============ How We Deliver It ============ -->
  <section class="relative bg-secondary/40 py-12 lg:py-20 overflow-hidden">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 grid-bg opacity-50"></div>
    <div class="container-x relative">
      ${sectionHeader({
        eyebrow:"How We Deliver It",
        title:`From first conversation to <span class="text-gradient">autonomous operation</span>.`,
        description:"A senior, hands-on delivery model — measured in weeks, not quarters — purpose-built to take agentic AI from blueprint to production with minimal disruption to your teams."
      })}

      <!-- desktop: 4 steps with connecting flow line -->
      <div class="relative mt-16">
        <!-- connector line (desktop only) -->
        <div aria-hidden="true" class="absolute left-[12.5%] right-[12.5%] top-[58px] hidden h-px lg:block">
          <div class="relative h-full w-full overflow-hidden rounded-full bg-border">
            <div class="hwd-flow absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-primary opacity-70"></div>
          </div>
        </div>

        <ol class="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
          ${[
            {n:"01", icon:"search-check",   title:"Discover",       desc:"We immerse in your business — understanding goals, challenges, and where AI can create the most value.",            duration:"Week 1"},
            {n:"02", icon:"pencil-ruler",   title:"Architect",      desc:"We design your agentic AI blueprint — selecting the right AWS services, agents, and workflows for your needs.",     duration:"Week 2"},
            {n:"03", icon:"rocket",         title:"Build & Deploy", desc:"Our engineers build, test, and deploy production-grade AI agents — fast, precise, and built to last.",              duration:"Weeks 3–8"},
            {n:"04", icon:"line-chart",     title:"Optimise",       desc:"We continuously monitor and improve your systems — ensuring they get smarter and more valuable over time.",         duration:"Ongoing"},
          ].map((s, i) => `
            <li class="relative">
              <!-- step card -->
              <div class="group relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <!-- numbered node sitting on the connector -->
                <div class="relative z-10">
                  <span aria-hidden="true" class="absolute inset-0 -m-2 rounded-full bg-primary/15 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"></span>
                  <div class="relative grid h-[58px] w-[58px] place-items-center rounded-full border-2 border-card bg-gradient-primary text-white shadow-glow transition-transform duration-500 group-hover:scale-105">
                    ${icon(s.icon, "!w-6 !h-6")}
                    <span class="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-card bg-card font-mono text-[10px] font-bold text-primary shadow-sm">${s.n}</span>
                  </div>
                </div>

                <div class="mt-6 w-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
                  <div class="flex items-center justify-between gap-3">
                    <h3 class="text-xl font-semibold tracking-tight">${s.title}</h3>
                    <span class="shrink-0 rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">${s.duration}</span>
                  </div>
                  <p class="mt-3 text-sm leading-relaxed text-muted-foreground">${s.desc}</p>

                  ${i < 3 ? `
                    <!-- mobile chevron between steps -->
                    <div aria-hidden="true" class="mt-5 flex justify-center lg:hidden">
                      <span class="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">${icon("chevron-down","!w-4 !h-4")}</span>
                    </div>
                  ` : ""}
                </div>
              </div>
            </li>
          `).join("")}
        </ol>
      </div>

      <!-- bottom summary strip -->
      <div class="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-full border border-border bg-card px-6 py-3 text-sm shadow-sm">
        <span class="inline-flex items-center gap-2 text-foreground">
          ${icon("zap","!w-4 !h-4 text-primary")}
          <span class="font-semibold">First agent in production</span>
        </span>
        <span class="font-mono text-xs text-muted-foreground">in as little as 6 weeks</span>
      </div>
    </div>
  </section>

  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="grid gap-12 md:grid-cols-12 md:items-center">
        <div class="md:col-span-5 space-y-5">
          ${eyebrow("Enterprise value")}
          <h2 class="text-4xl font-semibold tracking-tight md:text-5xl">Compounding <span class="text-gradient">capability</span>, not just productivity.</h2>
          <p class="text-base leading-relaxed text-muted-foreground">Agentic AI doesn't just speed up existing workflows — it lets you redesign them. The result: lower cost-to-serve, higher quality, and new categories of customer experience.</p>
        </div>
        <div class="md:col-span-7 grid grid-cols-2 gap-4">
          ${[
            {v:"40–80%",l:"Reduction in handling time"},
            {v:"3–10×", l:"Throughput on knowledge work"},
            {v:"24/7",  l:"Always-on operations"},
            {v:"100%",  l:"Auditable decision trails"},
          ].map(s => `
            <div class="rounded-2xl border border-border bg-card p-6">
              <p class="text-3xl font-semibold text-gradient">${s.v}</p>
              <p class="mt-1 text-sm text-muted-foreground">${s.l}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  </section>

  <section class="pb-20 lg:pb-28">
    <div class="container-x">
      <div class="relative overflow-hidden rounded-3xl border border-border bg-gradient-dark p-10 text-white md:p-14">
        <div class="absolute inset-0 surface-mesh opacity-60"></div>
        <div class="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div class="space-y-5">
            <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
              ${icon("sparkles","!w-3 !h-3")} <span style="color:hsl(var(--primary-glow))">Future-ready architecture</span>
            </div>
            <h2 class="text-4xl font-semibold tracking-tight md:text-5xl">Built on a reference architecture for <span class="bg-clip-text text-transparent" style="background-image:linear-gradient(to right, hsl(var(--primary-glow)), white)">production agents</span>.</h2>
            <p class="text-base leading-relaxed text-white/75">Model-agnostic. Tool-rich. Observable by default. Our reference architecture brings together planning, memory, evaluation, and governance — so you ship agents you can trust.</p>
          </div>
          <div class="grid gap-4">
            ${[
              {icon:"network",      t:"Model & vendor agnostic", d:"Bedrock, OpenAI, Anthropic, open-source — composable by design."},
              {icon:"shield-check", t:"Safety & governance",     d:"Policy guardrails, evaluation, and red-teaming workflows."},
              {icon:"workflow",     t:"Tool & API orchestration",d:"Plug agents into your existing systems of record and APIs."},
            ].map(b => `
              <div class="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
                ${icon(b.icon,"!w-5 !h-5")}<span style="display:inline-block;color:hsl(var(--primary-glow));margin-right:.4rem"></span>
                <p class="mt-3 font-semibold">${b.t}</p>
                <p class="mt-1 text-sm text-white/70">${b.d}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ AI page CTA ============ -->
  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-dark p-10 text-white shadow-lg md:p-16">
        <div class="absolute inset-0 surface-mesh opacity-60"></div>
        <div class="absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl" style="background:hsl(var(--primary-glow) / .3)"></div>
        <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full blur-3xl" style="background:hsl(var(--primary) / .4)"></div>

        <div class="relative grid gap-10 md:grid-cols-5 md:items-center">
          <div class="md:col-span-3 space-y-5">
            <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
              <span class="h-1.5 w-1.5 rounded-full animate-pulse" style="background:hsl(var(--primary-glow))"></span>
              Ready when you are
            </div>
            <h2 class="text-balance text-4xl font-semibold leading-[1.05] md:text-5xl">
              Ready to <span class="bg-clip-text text-transparent" style="background-image:linear-gradient(to right, hsl(var(--primary-glow)), white)">unlock the intelligence</span> inside your enterprise?
            </h2>
            <p class="max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Let's build your agentic AI system together — cost-effective, production-grade, and built to last.
            </p>
          </div>
          <div class="md:col-span-2 flex flex-col gap-3 md:items-end">
            <a href="/contact" class="btn btn-xl" style="background:white;color:hsl(var(--primary-deep))">
              Let's build together ${icon("arrow-right")}
            </a>
            <a href="/case-studies" class="btn btn-ghost btn-lg rounded-full" style="color:white">See all case studies</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}

function caseStudiesHeroAnim() {
  return `
    <div class="csa-wrap" aria-hidden="true">
      <svg class="csa-svg" viewBox="0 0 420 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="csa-bg" cx="50%" cy="40%" r="65%">
            <stop offset="0%"   stop-color="hsl(280 95% 70%)" stop-opacity="0.22"/>
            <stop offset="60%"  stop-color="hsl(265 85% 58%)" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="hsl(265 85% 58%)" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="csa-bar-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%"   stop-color="hsl(265 85% 58%)"/>
            <stop offset="100%" stop-color="hsl(280 95% 70%)"/>
          </linearGradient>
          <linearGradient id="csa-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stop-color="hsl(280 95% 70%)" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="hsl(280 95% 70%)" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="csa-chip-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="hsl(280 95% 78%)"/>
            <stop offset="100%" stop-color="hsl(265 85% 55%)"/>
          </radialGradient>
        </defs>

        <!-- ambient halo -->
        <rect x="0" y="0" width="420" height="380" fill="url(#csa-bg)"/>

        <!-- =================== DASHBOARD CARD =================== -->
        <g class="csa-card-group">
          <rect class="csa-card" x="30" y="60" width="280" height="240" rx="16"
                fill="white" stroke="hsl(265 30% 88%)"/>

          <!-- card header -->
          <g transform="translate(46 80)">
            <circle cx="0" cy="0" r="5" fill="url(#csa-chip-grad)"/>
            <text x="14" y="3" font-family="'DM Sans', sans-serif" font-size="11" font-weight="600" fill="hsl(260 30% 12%)">Engagement Impact</text>
            <text x="14" y="18" font-family="ui-monospace, monospace" font-size="8" fill="hsl(265 30% 55%)">last 12 quarters</text>
          </g>

          <!-- KPI strip (top right of card) -->
          <g transform="translate(216 76)" class="csa-kpi-group">
            <rect x="0" y="0" width="76" height="34" rx="8" fill="hsl(265 30% 96%)"/>
            <text x="8" y="12" font-family="ui-monospace, monospace" font-size="7" fill="hsl(265 30% 55%)" letter-spacing="0.06em">IMPACT</text>
            <text class="csa-kpi-num" x="8" y="26" font-family="'DM Sans', sans-serif" font-size="14" font-weight="700" fill="hsl(265 85% 45%)">+78<tspan font-size="9" fill="hsl(265 60% 55%)">%</tspan></text>
            <!-- tiny up-arrow -->
            <g transform="translate(60 18)" class="csa-kpi-arrow">
              <path d="M 0 6 L 4 0 L 8 6 L 5 6 L 5 10 L 3 10 L 3 6 Z" fill="hsl(150 65% 38%)"/>
            </g>
          </g>

          <!-- =================== AREA / LINE CHART =================== -->
          <g transform="translate(46 130)">
            <!-- gridlines -->
            <g stroke="hsl(265 30% 92%)" stroke-width="1">
              <line x1="0" y1="0"  x2="246" y2="0"/>
              <line x1="0" y1="22" x2="246" y2="22"/>
              <line x1="0" y1="44" x2="246" y2="44"/>
              <line x1="0" y1="66" x2="246" y2="66"/>
            </g>

            <!-- area under the line (clipped by reveal) -->
            <g class="csa-reveal">
              <path d="M 0 56 L 26 50 L 52 42 L 78 44 L 104 32 L 130 36 L 156 22 L 182 18 L 208 12 L 234 8 L 246 6 L 246 66 L 0 66 Z"
                    fill="url(#csa-area-grad)"/>
              <!-- line -->
              <path d="M 0 56 L 26 50 L 52 42 L 78 44 L 104 32 L 130 36 L 156 22 L 182 18 L 208 12 L 234 8 L 246 6"
                    fill="none" stroke="hsl(280 95% 60%)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>

            <!-- data points (staggered pop-in) -->
            <g fill="white" stroke="hsl(280 95% 60%)" stroke-width="1.8">
              ${[[0,56],[26,50],[52,42],[78,44],[104,32],[130,36],[156,22],[182,18],[208,12],[234,8],[246,6]].map((p, i) =>
                `<circle class="csa-pt csa-pt-${i}" cx="${p[0]}" cy="${p[1]}" r="2.6"/>`
              ).join("")}
            </g>

            <!-- traveling pulse along the line -->
            <circle class="csa-pulse" r="4" fill="hsl(280 95% 70%)" filter="drop-shadow(0 0 6px hsl(280 95% 70% / 0.9))">
              <animateMotion dur="3.6s" repeatCount="indefinite" rotate="auto"
                             path="M 0 56 L 26 50 L 52 42 L 78 44 L 104 32 L 130 36 L 156 22 L 182 18 L 208 12 L 234 8 L 246 6"/>
            </circle>
          </g>

          <!-- =================== BAR CHART =================== -->
          <g transform="translate(46 222)">
            <!-- baseline -->
            <line x1="0" y1="62" x2="246" y2="62" stroke="hsl(265 30% 86%)" stroke-width="1"/>
            ${[
              { x: 0,   h: 38, label: "Q1" },
              { x: 36,  h: 48, label: "Q2" },
              { x: 72,  h: 30, label: "Q3" },
              { x: 108, h: 54, label: "Q4" },
              { x: 144, h: 44, label: "Q5" },
              { x: 180, h: 58, label: "Q6" },
              { x: 216, h: 50, label: "Q7" },
            ].map((b, i) => `
              <g class="csa-bar csa-bar-${i}" style="--bar-h: ${b.h}px;">
                <rect class="csa-bar-rect" x="${b.x}" y="62" width="22" height="0" rx="3" fill="url(#csa-bar-grad)"/>
                <text x="${b.x + 11}" y="74" text-anchor="middle" font-family="ui-monospace, monospace" font-size="7" fill="hsl(265 30% 55%)">${b.label}</text>
              </g>
            `).join("")}
          </g>
        </g>

        <!-- =================== CIRCULAR GAUGE (right side) =================== -->
        <g class="csa-gauge-group" transform="translate(355 110)">
          <circle r="34" fill="white" stroke="hsl(265 30% 90%)" stroke-width="1"/>
          <!-- background ring -->
          <circle r="26" fill="none" stroke="hsl(265 30% 92%)" stroke-width="6"/>
          <!-- progress ring (animated stroke-dashoffset) -->
          <circle class="csa-gauge-ring" r="26" fill="none"
                  stroke="url(#csa-bar-grad)" stroke-width="6" stroke-linecap="round"
                  transform="rotate(-90)"/>
          <!-- center number -->
          <text class="csa-gauge-num" text-anchor="middle" y="2"
                font-family="'DM Sans', sans-serif" font-size="14" font-weight="700"
                fill="hsl(265 85% 45%)">92<tspan font-size="8" fill="hsl(265 60% 55%)">%</tspan></text>
          <text text-anchor="middle" y="14"
                font-family="ui-monospace, monospace" font-size="6"
                fill="hsl(265 30% 55%)" letter-spacing="0.12em">STP</text>
        </g>

        <!-- =================== FLOATING IMPACT CHIPS =================== -->
        <g class="csa-chips">
          <g class="csa-chip csa-chip-1" transform="translate(312 230)">
            <rect x="0" y="0" width="84" height="32" rx="9" fill="white" stroke="hsl(265 30% 88%)"/>
            <circle cx="14" cy="16" r="6" fill="hsl(150 60% 92%)"/>
            <path d="M 11 16 L 13 18 L 17 14" stroke="hsl(150 65% 38%)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="25" y="14" font-family="ui-monospace, monospace" font-size="6" fill="hsl(265 30% 55%)" letter-spacing="0.08em">RELEASE</text>
            <text x="25" y="24" font-family="'DM Sans', sans-serif" font-size="11" font-weight="700" fill="hsl(260 30% 12%)">3.4×</text>
          </g>

          <g class="csa-chip csa-chip-2" transform="translate(308 290)">
            <rect x="0" y="0" width="84" height="32" rx="9" fill="white" stroke="hsl(265 30% 88%)"/>
            <circle cx="14" cy="16" r="6" fill="hsl(265 85% 95%)"/>
            <path d="M 10 18 L 13 15 L 16 17 L 19 13" stroke="hsl(265 85% 45%)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="25" y="14" font-family="ui-monospace, monospace" font-size="6" fill="hsl(265 30% 55%)" letter-spacing="0.08em">PIPELINE</text>
            <text x="25" y="24" font-family="'DM Sans', sans-serif" font-size="11" font-weight="700" fill="hsl(260 30% 12%)">+2.6×</text>
          </g>

          <g class="csa-chip csa-chip-3" transform="translate(36 330)">
            <rect x="0" y="0" width="92" height="32" rx="9" fill="white" stroke="hsl(265 30% 88%)"/>
            <circle cx="14" cy="16" r="6" fill="hsl(40 90% 92%)"/>
            <path d="M 14 12 L 14 16 L 17 18" stroke="hsl(40 85% 40%)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            <text x="25" y="14" font-family="ui-monospace, monospace" font-size="6" fill="hsl(265 30% 55%)" letter-spacing="0.08em">CYCLE TIME</text>
            <text x="25" y="24" font-family="'DM Sans', sans-serif" font-size="11" font-weight="700" fill="hsl(260 30% 12%)">−45<tspan font-size="8" fill="hsl(265 60% 55%)">%</tspan></text>
          </g>

          <g class="csa-chip csa-chip-4" transform="translate(150 30)">
            <rect x="0" y="0" width="94" height="30" rx="9" fill="white" stroke="hsl(265 30% 88%)"/>
            <circle cx="13" cy="15" r="5.5" fill="hsl(265 85% 58%)"/>
            <text x="13" y="18" text-anchor="middle" font-family="ui-monospace, monospace" font-size="7" font-weight="700" fill="white">$</text>
            <text x="24" y="13" font-family="ui-monospace, monospace" font-size="6" fill="hsl(265 30% 55%)" letter-spacing="0.08em">CLOUD SPEND</text>
            <text x="24" y="23" font-family="'DM Sans', sans-serif" font-size="11" font-weight="700" fill="hsl(260 30% 12%)">−38<tspan font-size="8" fill="hsl(265 60% 55%)">%</tspan></text>
          </g>
        </g>

        <!-- spark particles drifting up -->
        <g class="csa-particles" fill="hsl(280 95% 70%)">
          <circle class="csa-sp s1" cx="60"  cy="350" r="1.4"/>
          <circle class="csa-sp s2" cx="200" cy="360" r="1.6"/>
          <circle class="csa-sp s3" cx="280" cy="350" r="1.2"/>
          <circle class="csa-sp s4" cx="380" cy="360" r="1.5"/>
        </g>
      </svg>
    </div>
  `;
}

function caseCover(slug) {
  return `<img src="${BASE_PATH}/assets/case-studies/covers/${slug}.png" alt="" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />`;
}

function pageCaseStudies() {
  const studies = CASE_STUDIES;
  return `
  <section class="py-10 pb-12">
    <div class="container-x">
      <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="space-y-6 lg:col-span-7">
          ${eyebrow("Case Studies")}
          <h1 class="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Real systems. <span class="text-gradient">Real outcomes.</span></h1>
          <p class="text-lg leading-relaxed text-muted-foreground">A selection of recent engagements across Agentic AI, cloud, and platform engineering — each one a production system delivering measurable outcomes. Click any study to read the full architecture and results.</p>
        </div>
        <div class="lg:col-span-5">
          ${caseStudiesHeroAnim()}
        </div>
      </div>
    </div>
  </section>

  <section class="pb-20 lg:pb-28">
    <div class="container-x">
      <div class="grid gap-6 md:grid-cols-2">
        ${studies.map(s => {
          const highlights = (s.metrics || []).filter(m => m.value !== "✓").slice(0, 2);
          return `
          <a href="/case-studies/${s.slug}" class="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg">
            <div class="relative aspect-[16/9] w-full overflow-hidden bg-primary/5">
              <div class="h-full w-full transition-transform duration-500 group-hover:scale-[1.02]">${caseCover(s.slug)}</div>
              <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent"></div>
              <span class="absolute left-5 top-5 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-white ring-1 ring-white/25 backdrop-blur-sm">${s.tag}</span>
            </div>
            <div class="relative flex flex-1 flex-col p-8">
              <div class="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20"></div>
              <div class="relative flex flex-1 flex-col">
                <div class="flex items-start justify-between gap-4">
                  <h3 class="text-2xl font-semibold leading-snug tracking-tight">${s.title}</h3>
                  <div class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary">${icon("arrow-up-right","!w-4 !h-4")}</div>
                </div>
                <p class="mt-3 text-[15px] leading-relaxed text-muted-foreground">${s.subtitle}</p>
                ${highlights.length ? `
                <div class="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                  ${highlights.map(m => `
                    <div>
                      <p class="text-2xl font-semibold tracking-tight text-gradient">${m.value}</p>
                      <p class="mt-1 text-xs leading-snug text-muted-foreground max-w-[150px]">${m.label}</p>
                    </div>
                  `).join("")}
                </div>` : ""}
                <div class="mt-auto pt-6">
                  <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">Read case study ${icon("arrow-right","!w-4 !h-4")}</span>
                </div>
              </div>
            </div>
          </a>
        `;}).join("")}
      </div>
    </div>
  </section>

  ${ctaBlock()}
  `;
}

function blogHeroAnim() {
  return `
    <div class="bha-wrap" aria-hidden="true">
      <svg class="bha-svg" viewBox="0 0 460 420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bha-bg" cx="50%" cy="46%" r="62%">
            <stop offset="0%"   stop-color="hsl(280 95% 70%)" stop-opacity="0.22"/>
            <stop offset="55%"  stop-color="hsl(265 85% 58%)" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="hsl(265 85% 58%)" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="bha-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stop-color="hsl(0 0% 100%)"/>
            <stop offset="100%" stop-color="hsl(265 30% 98%)"/>
          </linearGradient>
          <linearGradient id="bha-hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stop-color="hsl(265 85% 58%)"/>
            <stop offset="55%"  stop-color="hsl(275 90% 64%)"/>
            <stop offset="100%" stop-color="hsl(280 95% 72%)"/>
          </linearGradient>
          <linearGradient id="bha-accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stop-color="hsl(265 85% 58%)"/>
            <stop offset="100%" stop-color="hsl(280 95% 70%)"/>
          </linearGradient>
          <linearGradient id="bha-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="hsl(0 0% 100%)" stop-opacity="0"/>
            <stop offset="50%"  stop-color="hsl(0 0% 100%)" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="hsl(0 0% 100%)" stop-opacity="0"/>
          </linearGradient>
          <pattern id="bha-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="1.1" fill="hsl(265 60% 70% / 0.18)"/>
          </pattern>
        </defs>

        <!-- ambient backdrop -->
        <rect x="0" y="0" width="460" height="420" fill="url(#bha-dots)"/>
        <rect x="0" y="0" width="460" height="420" fill="url(#bha-bg)"/>

        <!-- ambient sparks -->
        <g>
          <circle class="bha-spark bha-spark-1" cx="58"  cy="200" r="2.2" fill="hsl(280 95% 70%)"/>
          <circle class="bha-spark bha-spark-2" cx="402" cy="178" r="2.6" fill="hsl(265 85% 58%)"/>
          <circle class="bha-spark bha-spark-3" cx="74"  cy="318" r="2.2" fill="hsl(265 85% 58%)"/>
          <circle class="bha-spark bha-spark-4" cx="390" cy="298" r="2.4" fill="hsl(280 95% 70%)"/>
        </g>

        <!-- =========== TOPIC CONSTELLATION (top) =========== -->
        <g class="bha-chips" font-family="'DM Sans', system-ui, sans-serif">
          <!-- Agentic AI -->
          <g transform="translate(50 44)"><g class="bha-chip bha-chip-1">
            <rect x="0" y="0" width="96" height="30" rx="15" fill="white" stroke="hsl(265 30% 88%)"
                  filter="drop-shadow(0 8px 16px hsl(265 60% 30% / 0.10))"/>
            <circle cx="15" cy="15" r="4.5" fill="url(#bha-accent)"/>
            <text x="25" y="19.5" font-size="10.5" font-weight="600" fill="hsl(260 30% 18%)">Agentic AI</text>
          </g></g>
          <!-- Cloud -->
          <g transform="translate(168 30)"><g class="bha-chip bha-chip-2">
            <rect x="0" y="0" width="68" height="30" rx="15" fill="white" stroke="hsl(265 30% 88%)"
                  filter="drop-shadow(0 8px 16px hsl(265 60% 30% / 0.10))"/>
            <circle cx="15" cy="15" r="4.5" fill="hsl(212 90% 60%)"/>
            <text x="25" y="19.5" font-size="10.5" font-weight="600" fill="hsl(260 30% 18%)">Cloud</text>
          </g></g>
          <!-- DevOps -->
          <g transform="translate(254 50)"><g class="bha-chip bha-chip-3">
            <rect x="0" y="0" width="80" height="30" rx="15" fill="white" stroke="hsl(265 30% 88%)"
                  filter="drop-shadow(0 8px 16px hsl(265 60% 30% / 0.10))"/>
            <circle cx="15" cy="15" r="4.5" fill="hsl(150 65% 50%)"/>
            <text x="25" y="19.5" font-size="10.5" font-weight="600" fill="hsl(260 30% 18%)">DevOps</text>
          </g></g>
          <!-- RAG -->
          <g transform="translate(354 32)"><g class="bha-chip bha-chip-4">
            <rect x="0" y="0" width="58" height="30" rx="15" fill="white" stroke="hsl(265 30% 88%)"
                  filter="drop-shadow(0 8px 16px hsl(265 60% 30% / 0.10))"/>
            <circle cx="15" cy="15" r="4.5" fill="hsl(40 95% 58%)"/>
            <text x="25" y="19.5" font-size="10.5" font-weight="600" fill="hsl(260 30% 18%)">RAG</text>
          </g></g>
        </g>

        <!-- =========== TOKENS streaming down into card =========== -->
        <g>
          <g class="bha-tok bha-tok-1" transform="translate(98 80)"><circle r="3" fill="url(#bha-accent)"/></g>
          <g class="bha-tok bha-tok-2" transform="translate(202 66)"><circle r="2.6" fill="hsl(212 90% 60%)"/></g>
          <g class="bha-tok bha-tok-3" transform="translate(294 86)"><circle r="3" fill="hsl(150 65% 50%)"/></g>
          <g class="bha-tok bha-tok-4" transform="translate(383 70)"><circle r="2.6" fill="hsl(40 95% 58%)"/></g>
          <g class="bha-tok bha-tok-5" transform="translate(148 78)"><circle r="2.2" fill="hsl(280 95% 70%)"/></g>
          <g class="bha-tok bha-tok-6" transform="translate(338 78)"><circle r="2.2" fill="hsl(280 95% 70%)"/></g>
        </g>

        <!-- =========== CARD STACK (back → mid → front) =========== -->
        <!-- back card -->
        <g class="bha-card-back" transform="translate(0 0)">
          <rect x="86" y="156" width="288" height="206" rx="18"
                fill="hsl(265 30% 99%)" stroke="hsl(265 30% 88%)"
                transform="rotate(-3 230 259)"/>
        </g>
        <!-- mid card -->
        <g class="bha-card-mid">
          <rect x="76" y="150" width="308" height="214" rx="18"
                fill="hsl(0 0% 100%)" stroke="hsl(265 30% 90%)"
                transform="rotate(-1.5 230 257)"/>
        </g>

        <!-- =========== FRONT CARD (featured article) =========== -->
        <g class="bha-card-front">
          <!-- card body -->
          <rect x="64" y="142" width="332" height="232" rx="20"
                fill="url(#bha-card-grad)" stroke="hsl(265 25% 90%)"/>

          <!-- meta row: date dot + category pill + read time -->
          <g transform="translate(80 162)">
            <rect x="0" y="0" width="78" height="20" rx="10" fill="hsl(265 85% 58% / 0.10)"/>
            <circle cx="11" cy="10" r="3" fill="url(#bha-accent)"/>
            <text x="19" y="13.5" font-family="'DM Sans', system-ui, sans-serif"
                  font-size="9.5" font-weight="600" fill="hsl(265 75% 40%)" letter-spacing="0.04em">AGENTIC AI</text>

            <text x="92" y="13.5" font-family="ui-monospace, 'SF Mono', monospace"
                  font-size="9" fill="hsl(265 25% 55%)">MAY 17 · 8 MIN READ</text>
          </g>

          <!-- hero image block -->
          <g transform="translate(80 192)">
            <rect x="0" y="0" width="300" height="78" rx="12" fill="url(#bha-hero-grad)"/>
            <!-- decorative inner lines suggesting an article hero -->
            <g opacity="0.35" stroke="hsl(0 0% 100%)" stroke-width="1" fill="none">
              <circle cx="44" cy="42" r="22"/>
              <circle cx="44" cy="42" r="32"/>
              <path d="M 88 24 L 280 24" stroke-dasharray="3 5"/>
              <path d="M 88 56 L 280 56" stroke-dasharray="3 5"/>
            </g>
            <circle cx="44" cy="42" r="10" fill="hsl(0 0% 100%)" opacity="0.85"/>
            <circle cx="44" cy="42" r="4"  fill="url(#bha-accent)"/>

            <!-- shimmer sweep -->
            <g clip-path="inset(0 0 0 0 round 12px)">
              <rect class="bha-shimmer" x="-60" y="0" width="70" height="78" fill="url(#bha-shimmer)"/>
            </g>
          </g>

          <!-- title — type-in bars -->
          <g transform="translate(80 286)">
            <!-- placeholder tracks -->
            <rect x="0" y="0"  width="246" height="10" rx="3" fill="hsl(265 25% 94%)"/>
            <rect x="0" y="16" width="186" height="10" rx="3" fill="hsl(265 25% 94%)"/>
            <!-- typed title -->
            <rect class="bha-title bha-title-1" x="0" y="0"  width="246" height="10" rx="3" fill="hsl(260 30% 14%)"/>
            <rect class="bha-title bha-title-2" x="0" y="16" width="186" height="10" rx="3" fill="hsl(260 30% 14%)"/>
            <!-- caret -->
            <rect class="bha-caret" x="-2" y="-1" width="2" height="12" fill="url(#bha-accent)"/>
          </g>

          <!-- excerpt lines -->
          <g transform="translate(80 314)">
            <rect class="bha-line bha-line-1" x="0" y="0"  width="280" height="5" rx="2.5" fill="hsl(265 20% 78%)"/>
            <rect class="bha-line bha-line-2" x="0" y="10" width="260" height="5" rx="2.5" fill="hsl(265 20% 78%)"/>
            <rect class="bha-line bha-line-3" x="0" y="20" width="220" height="5" rx="2.5" fill="hsl(265 20% 78%)"/>
          </g>

          <!-- footer: author + progress -->
          <g transform="translate(80 350)">
            <circle cx="9" cy="9" r="9" fill="url(#bha-accent)"/>
            <text x="9" y="12.5" text-anchor="middle" font-family="'DM Sans', system-ui, sans-serif"
                  font-size="9" font-weight="700" fill="white">A</text>
            <text x="24" y="6" font-family="'DM Sans', system-ui, sans-serif"
                  font-size="9" font-weight="600" fill="hsl(260 30% 18%)">Algorims Engineering</text>
            <text x="24" y="17" font-family="ui-monospace, monospace"
                  font-size="7.5" fill="hsl(265 25% 55%)">reading…</text>

            <!-- progress track + fill -->
            <rect x="160" y="7" width="140" height="4" rx="2" fill="hsl(265 25% 92%)"/>
            <rect class="bha-progress" x="160" y="7" width="140" height="4" rx="2" fill="url(#bha-accent)"/>
          </g>
        </g>

        <!-- =========== TOP-RIGHT BROADCAST / FEED SIGNAL =========== -->
        <g transform="translate(420 120)" stroke="hsl(265 85% 58%)" fill="none" stroke-width="1.6" stroke-linecap="round">
          <circle class="bha-sig-dot" cx="0" cy="0" r="2.6" fill="hsl(265 85% 58%)" stroke="none"/>
          <path class="bha-sig-arc bha-sig-arc-1" d="M -6 -6 A 8.5 8.5 0 0 1 6 -6" />
          <path class="bha-sig-arc bha-sig-arc-2" d="M -12 -10 A 14 14 0 0 1 12 -10" />
          <path class="bha-sig-arc bha-sig-arc-3" d="M -18 -14 A 20 20 0 0 1 18 -14" />
        </g>
      </svg>
    </div>
  `;
}

/* ============================================================
   BLOG: data + hero art + listing + detail page
   ============================================================ */
/* Blog post data lives in /assets/js/content.js. */
function blogArt(kind) {
  const defs = `
    <defs>
      <!-- Gradients -->
      <linearGradient id="bp-purple" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"  stop-color="hsl(258 88% 50%)"/>
        <stop offset="55%" stop-color="hsl(275 90% 62%)"/>
        <stop offset="100%" stop-color="hsl(290 95% 74%)"/>
      </linearGradient>
      <linearGradient id="bp-purple-2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"  stop-color="hsl(275 90% 65%)"/>
        <stop offset="100%" stop-color="hsl(258 80% 48%)"/>
      </linearGradient>
      <linearGradient id="bp-coral" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"  stop-color="hsl(330 85% 65%)"/>
        <stop offset="100%" stop-color="hsl(290 90% 70%)"/>
      </linearGradient>
      <linearGradient id="bp-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"  stop-color="hsl(195 85% 60%)"/>
        <stop offset="100%" stop-color="hsl(265 85% 65%)"/>
      </linearGradient>
      <linearGradient id="bp-card" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"  stop-color="white"/>
        <stop offset="100%" stop-color="hsl(265 40% 97%)"/>
      </linearGradient>
      <linearGradient id="bp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"  stop-color="hsl(265 50% 97%)"/>
        <stop offset="100%" stop-color="hsl(280 50% 94%)"/>
      </linearGradient>
      <radialGradient id="bp-glow" cx="50%" cy="50%" r="60%">
        <stop offset="0%"   stop-color="hsl(280 95% 70% / 0.55)"/>
        <stop offset="55%"  stop-color="hsl(265 85% 58% / 0.18)"/>
        <stop offset="100%" stop-color="hsl(265 85% 58% / 0)"/>
      </radialGradient>
      <radialGradient id="bp-glow-coral" cx="50%" cy="50%" r="60%">
        <stop offset="0%"   stop-color="hsl(325 90% 70% / 0.45)"/>
        <stop offset="100%" stop-color="hsl(325 90% 70% / 0)"/>
      </radialGradient>

      <!-- Subtle dot pattern -->
      <pattern id="bp-dots" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="11" cy="11" r="0.9" fill="hsl(265 60% 55% / 0.13)"/>
      </pattern>
      <!-- Cross-hatch grid (sparse) -->
      <pattern id="bp-grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="hsl(265 60% 65% / 0.08)" stroke-width="0.8"/>
      </pattern>

      <!-- Shadows -->
      <filter id="bp-shadow-sm" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="hsl(265 70% 25%)" flood-opacity="0.10"/>
      </filter>
      <filter id="bp-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="hsl(265 70% 30%)" flood-opacity="0.18"/>
      </filter>
      <filter id="bp-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5"/>
      </filter>
    </defs>`;

  const wrap = (inner) => `
    <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" class="h-full w-full block" preserveAspectRatio="xMidYMid slice" role="img">
      ${defs}
      <rect width="600" height="360" fill="url(#bp-bg)"/>
      <rect width="600" height="360" fill="url(#bp-grid)"/>
      ${inner}
    </svg>`;

  // ---------- AI / ML ----------
  if (kind === "ai") {
    // Deep, glowing neural cluster with one prominent "core" node
    const orbit = (cx, cy, r, count, phase = 0) =>
      Array.from({length: count}, (_, i) => {
        const a = (Math.PI * 2 * i) / count + phase;
        return [cx + r*Math.cos(a), cy + r*Math.sin(a)];
      });
    const ring1 = orbit(370, 180, 92, 8, 0.2);
    const ring2 = orbit(370, 180, 145, 12, 0.5);

    const lines = ring1.map(([x,y]) =>
      `<line x1="370" y1="180" x2="${x}" y2="${y}" stroke="url(#bp-purple)" stroke-width="1.2" opacity="0.55"/>`).join("");
    const links2 = ring2.map(([x,y], i) => {
      const [x2,y2] = ring1[i % ring1.length];
      return `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="hsl(265 60% 65% / 0.32)" stroke-width="0.8"/>`;
    }).join("");

    return wrap(`
      <!-- ambient washes -->
      <circle cx="370" cy="180" r="220" fill="url(#bp-glow)"/>
      <circle cx="120" cy="280" r="120" fill="url(#bp-glow-coral)" opacity="0.55"/>

      <!-- outer ring connections -->
      ${links2}
      <!-- ring 2 small nodes -->
      ${ring2.map(([x,y], i) => `<circle cx="${x}" cy="${y}" r="${3 + (i%3)}" fill="hsl(265 50% 70%)" opacity="${0.45 + (i%3)*0.15}"/>`).join("")}

      <!-- spokes to inner ring -->
      ${lines}
      <!-- ring 1 medium nodes -->
      ${ring1.map(([x,y], i) => `
        <circle cx="${x}" cy="${y}" r="${8 + (i%2)*2}" fill="url(#bp-purple)" filter="url(#bp-shadow-sm)"/>
        <circle cx="${x-2}" cy="${y-2}" r="2" fill="white" opacity="0.8"/>
      `).join("")}

      <!-- core node -->
      <g filter="url(#bp-shadow)">
        <circle cx="370" cy="180" r="42" fill="url(#bp-purple)"/>
        <circle cx="370" cy="180" r="42" fill="url(#bp-glow)" opacity="0.6"/>
        <circle cx="370" cy="180" r="28" fill="hsl(280 95% 78%)" opacity="0.5"/>
        <circle cx="358" cy="168" r="8" fill="white" opacity="0.85"/>
        <circle cx="384" cy="190" r="4" fill="white" opacity="0.5"/>
      </g>

      <!-- corner mark -->
      <g transform="translate(36,36)">
        <rect width="92" height="26" rx="13" fill="white" filter="url(#bp-shadow-sm)"/>
        <circle cx="14" cy="13" r="4" fill="url(#bp-purple)"/>
        <text x="24" y="17" font-family="ui-monospace,SFMono-Regular,monospace" font-size="10" font-weight="700" letter-spacing="1.5" fill="hsl(265 35% 30%)">AI · ML</text>
      </g>

      <!-- small floating chips for life -->
      <g transform="translate(70,80)" filter="url(#bp-shadow-sm)">
        <rect width="62" height="20" rx="10" fill="white"/>
        <rect x="8" y="6" width="46" height="3" rx="1.5" fill="hsl(265 30% 80%)"/>
        <rect x="8" y="12" width="28" height="3" rx="1.5" fill="hsl(265 30% 88%)"/>
      </g>
      <g transform="translate(440,290)" filter="url(#bp-shadow-sm)">
        <rect width="80" height="24" rx="12" fill="white"/>
        <circle cx="14" cy="12" r="4" fill="url(#bp-coral)"/>
        <rect x="24" y="9" width="44" height="6" rx="3" fill="hsl(265 30% 90%)"/>
      </g>
    `);
  }

  // ---------- AWS ----------
  if (kind === "aws") {
    // Isometric stack of service tiles + cloud silhouette
    const tile = (x, y, w, h, label, accent = "url(#bp-purple)") => `
      <g transform="translate(${x},${y})" filter="url(#bp-shadow-sm)">
        <path d="M 0 ${h*0.25} L ${w*0.5} 0 L ${w} ${h*0.25} L ${w} ${h*0.85} L ${w*0.5} ${h*1.1} L 0 ${h*0.85} Z"
              fill="url(#bp-card)" stroke="hsl(265 30% 88%)" stroke-width="1"/>
        <path d="M 0 ${h*0.25} L ${w*0.5} 0 L ${w} ${h*0.25} L ${w*0.5} ${h*0.5} Z" fill="${accent}" opacity="0.92"/>
        <text x="${w*0.5}" y="${h*0.85}" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="13" font-weight="700" fill="hsl(265 35% 25%)">${label}</text>
      </g>
    `;

    return wrap(`
      <!-- ambient -->
      <ellipse cx="380" cy="200" rx="240" ry="160" fill="url(#bp-glow)"/>
      <!-- soft cloud silhouette behind -->
      <path d="M 70 280 Q 80 215 140 215 Q 160 165 220 175 Q 270 130 340 155 Q 410 120 460 165 Q 520 155 540 215 Q 575 230 555 280 Z"
            fill="hsl(265 60% 90%)" opacity="0.55"/>

      <!-- isometric tile cluster -->
      ${tile(170, 210, 110, 70, "S3", "url(#bp-cyan)")}
      ${tile(290, 180, 110, 70, "Bedrock", "url(#bp-purple)")}
      ${tile(410, 200, 110, 70, "Lambda", "url(#bp-coral)")}
      ${tile(230, 110, 110, 70, "Nova", "url(#bp-purple-2)")}
      ${tile(350, 100, 110, 70, "Kendra", "url(#bp-cyan)")}

      <!-- partner stamp -->
      <g transform="translate(36,36)" filter="url(#bp-shadow-sm)">
        <rect width="160" height="32" rx="16" fill="white"/>
        <circle cx="18" cy="16" r="6" fill="url(#bp-purple)"/>
        <text x="32" y="20" font-family="DM Sans, sans-serif" font-size="11" font-weight="700" letter-spacing="0.8" fill="hsl(265 35% 25%)">AWS · ADVANCED PARTNER</text>
      </g>
    `);
  }

  // ---------- Azure ----------
  if (kind === "azure") {
    const hex = (cx, cy, r, fill, opacity = 1) => {
      const pts = Array.from({length: 6}, (_, i) => {
        const a = (Math.PI/3)*i - Math.PI/2;
        return `${cx + r*Math.cos(a)},${cy + r*Math.sin(a)}`;
      }).join(" ");
      return `<polygon points="${pts}" fill="${fill}" stroke="hsl(265 30% 88%)" stroke-width="1" opacity="${opacity}"/>`;
    };

    // tight honeycomb with featured large hex
    const cells = [];
    const cols = 7, rows = 5;
    const hr = 30;
    const dx = hr * Math.sqrt(3);
    const dy = hr * 1.5;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = 110 + c*dx + (r%2)*(dx/2);
        const y = 90 + r*dy;
        const accent = (c === 3 && r === 2);
        const purple = (c+r) % 4 === 0;
        cells.push({x,y,accent,purple});
      }
    }
    const small = cells.filter(c => !c.accent).map(c => hex(c.x, c.y, hr-3,
      c.purple ? "url(#bp-purple)" : "url(#bp-card)",
      c.purple ? 0.95 : 1
    )).join("");
    const featured = cells.find(c => c.accent);

    return wrap(`
      <ellipse cx="300" cy="200" rx="260" ry="180" fill="url(#bp-glow)"/>
      ${small}
      <!-- featured hex with shadow -->
      <g filter="url(#bp-shadow)">
        ${hex(featured.x, featured.y, hr+8, "url(#bp-purple)")}
        ${hex(featured.x, featured.y, hr+2, "url(#bp-purple-2)", 0.95)}
        <circle cx="${featured.x}" cy="${featured.y - 6}" r="5" fill="white" opacity="0.85"/>
        <circle cx="${featured.x + 6}" cy="${featured.y + 4}" r="3" fill="white" opacity="0.5"/>
      </g>

      <g transform="translate(36,36)" filter="url(#bp-shadow-sm)">
        <rect width="118" height="32" rx="16" fill="white"/>
        <rect x="12" y="11" width="10" height="10" fill="url(#bp-purple)"/>
        <text x="30" y="20" font-family="DM Sans, sans-serif" font-size="11" font-weight="700" letter-spacing="0.8" fill="hsl(265 35% 25%)">AZURE CLOUD</text>
      </g>
    `);
  }

  // ---------- DevOps ----------
  if (kind === "devops") {
    // Cleaner infinity with thicker gradient stroke and a few key stages
    const stages = [
      [195, 180, "Plan"],
      [300, 180, "Build"],
      [405, 180, "Deploy"],
      [248, 240, "Monitor"]
    ];
    return wrap(`
      <ellipse cx="300" cy="180" rx="260" ry="170" fill="url(#bp-glow)"/>

      <!-- back glow path -->
      <path d="M 195 180 C 195 100, 295 100, 300 180 C 305 260, 405 260, 405 180 C 405 100, 305 100, 300 180 C 295 260, 195 260, 195 180 Z"
            fill="none" stroke="url(#bp-purple)" stroke-width="22" stroke-linecap="round" opacity="0.18"/>

      <!-- main loop -->
      <path d="M 195 180 C 195 100, 295 100, 300 180 C 305 260, 405 260, 405 180 C 405 100, 305 100, 300 180 C 295 260, 195 260, 195 180 Z"
            fill="none" stroke="url(#bp-purple)" stroke-width="5" stroke-linecap="round"/>

      <!-- traveling dots -->
      <circle cx="240" cy="135" r="4" fill="hsl(290 95% 75%)"/>
      <circle cx="360" cy="225" r="4" fill="hsl(290 95% 75%)"/>

      <!-- stage nodes -->
      ${stages.map(([x,y,label]) => `
        <g filter="url(#bp-shadow-sm)">
          <circle cx="${x}" cy="${y}" r="22" fill="white"/>
          <circle cx="${x}" cy="${y}" r="22" fill="url(#bp-purple)" opacity="0.08"/>
          <circle cx="${x}" cy="${y}" r="8" fill="url(#bp-purple)"/>
          <circle cx="${x-2}" cy="${y-2}" r="2" fill="white" opacity="0.7"/>
        </g>
        <text x="${x}" y="${y+44}" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="12" font-weight="700" fill="hsl(265 35% 25%)">${label}</text>
      `).join("")}

      <g transform="translate(36,36)" filter="url(#bp-shadow-sm)">
        <rect width="112" height="28" rx="14" fill="white"/>
        <circle cx="14" cy="14" r="4" fill="url(#bp-coral)"/>
        <text x="24" y="18" font-family="ui-monospace,SFMono-Regular,monospace" font-size="10" font-weight="700" letter-spacing="1.5" fill="hsl(265 35% 25%)">DEVOPS</text>
      </g>
    `);
  }

  // ---------- Migration ----------
  if (kind === "migration") {
    // Server rack → flowing particles → soft cloud
    const particles = Array.from({length: 12}, (_, i) => {
      const t = i/11;
      const x = 240 + t*230;
      const y = 195 + Math.sin(t * Math.PI * 2) * (18 - t*14);
      const r = 4 - t*2.5;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#bp-purple)" opacity="${1 - t*0.55}"/>`;
    }).join("");

    return wrap(`
      <ellipse cx="460" cy="190" rx="170" ry="140" fill="url(#bp-glow)"/>

      <!-- server rack (single, detailed) -->
      <g transform="translate(80,90)" filter="url(#bp-shadow)">
        <rect width="120" height="190" rx="14" fill="url(#bp-card)" stroke="hsl(265 30% 85%)"/>
        <rect width="120" height="22" rx="14" fill="hsl(265 30% 30%)"/>
        <rect width="120" height="22" rx="14" fill="url(#bp-purple)" opacity="0.85"/>
        <text x="60" y="15" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,monospace" font-size="9" font-weight="700" letter-spacing="1.5" fill="white">ON-PREM</text>
        ${[0,1,2,3,4,5].map(j => `
          <g transform="translate(10,${36 + j*24})">
            <rect width="100" height="18" rx="4" fill="hsl(265 30% 96%)"/>
            <rect x="6" y="6" width="50" height="6" rx="3" fill="hsl(265 30% 84%)"/>
            <circle cx="88" cy="9" r="3" fill="${j === 1 || j === 3 ? "url(#bp-purple)" : "hsl(265 30% 80%)"}"/>
            <circle cx="78" cy="9" r="2" fill="hsl(140 60% 55%)" opacity="${j===0?1:0.5}"/>
          </g>
        `).join("")}
      </g>

      <!-- flow particles -->
      ${particles}

      <!-- target cloud -->
      <g transform="translate(380,120)" filter="url(#bp-shadow)">
        <path d="M 20 110 Q 30 60 80 60 Q 100 25 145 35 Q 195 15 215 65 Q 255 70 240 115 Q 250 145 215 145 L 50 145 Q 10 145 20 110 Z"
              fill="url(#bp-card)" stroke="hsl(265 30% 85%)"/>
        <path d="M 30 95 Q 40 55 85 60 Q 105 30 145 40 Q 180 25 200 65" fill="none" stroke="url(#bp-purple)" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        <text x="130" y="110" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="20" font-weight="700" fill="url(#bp-purple)">CLOUD</text>
      </g>

      <g transform="translate(36,36)" filter="url(#bp-shadow-sm)">
        <rect width="118" height="28" rx="14" fill="white"/>
        <circle cx="14" cy="14" r="4" fill="url(#bp-purple)"/>
        <text x="24" y="18" font-family="ui-monospace,SFMono-Regular,monospace" font-size="10" font-weight="700" letter-spacing="1.5" fill="hsl(265 35% 25%)">MIGRATION</text>
      </g>
    `);
  }

  // ---------- Agent (multi-agent system) ----------
  if (kind === "agent") {
    const spokes = [
      [160, 110, "DB",  "url(#bp-cyan)"],
      [180, 250, "API", "url(#bp-purple-2)"],
      [420, 95,  "LLM", "url(#bp-coral)"],
      [470, 200, "Tool","url(#bp-purple)"],
      [380, 290, "User","url(#bp-cyan)"]
    ];
    return wrap(`
      <ellipse cx="310" cy="190" rx="250" ry="170" fill="url(#bp-glow)"/>
      <!-- spoke connectors -->
      ${spokes.map(([x,y]) => `
        <path d="M 310 190 Q ${(310+x)/2} ${(190+y)/2 - 20} ${x} ${y}"
              fill="none" stroke="url(#bp-purple)" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>
      `).join("")}

      <!-- satellite nodes -->
      ${spokes.map(([x,y,label,fill]) => `
        <g filter="url(#bp-shadow-sm)">
          <circle cx="${x}" cy="${y}" r="28" fill="white"/>
          <circle cx="${x}" cy="${y}" r="28" fill="${fill}" opacity="0.12"/>
          <circle cx="${x}" cy="${y}" r="18" fill="${fill}"/>
          <text x="${x}" y="${y+4}" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" font-weight="700" fill="white">${label}</text>
        </g>
      `).join("")}

      <!-- central agent core -->
      <g filter="url(#bp-shadow)">
        <circle cx="310" cy="190" r="62" fill="url(#bp-purple)"/>
        <circle cx="310" cy="190" r="62" fill="url(#bp-glow)" opacity="0.55"/>
        <circle cx="310" cy="190" r="42" fill="url(#bp-purple-2)" opacity="0.7"/>
        <!-- agent face: dots -->
        <circle cx="294" cy="184" r="5" fill="white"/>
        <circle cx="326" cy="184" r="5" fill="white"/>
        <path d="M 292 204 Q 310 218 328 204" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
      </g>

      <g transform="translate(36,36)" filter="url(#bp-shadow-sm)">
        <rect width="116" height="28" rx="14" fill="white"/>
        <circle cx="14" cy="14" r="4" fill="url(#bp-purple)"/>
        <text x="24" y="18" font-family="ui-monospace,SFMono-Regular,monospace" font-size="10" font-weight="700" letter-spacing="1.5" fill="hsl(265 35% 25%)">AGENTIC AI</text>
      </g>
    `);
  }

  // ---------- RAG ----------
  if (kind === "rag") {
    // Document stack → vector cloud → answer card
    return wrap(`
      <ellipse cx="300" cy="200" rx="270" ry="170" fill="url(#bp-glow)"/>

      <!-- doc stack -->
      <g transform="translate(80,110)" filter="url(#bp-shadow)">
        <rect x="12" y="12" width="100" height="130" rx="8" fill="hsl(265 30% 92%)"/>
        <rect x="6"  y="6"  width="100" height="130" rx="8" fill="hsl(265 30% 96%)"/>
        <rect width="100" height="130" rx="8" fill="url(#bp-card)" stroke="hsl(265 30% 85%)"/>
        ${[18, 38, 58, 72, 86, 100].map((y, i) => `
          <rect x="14" y="${y}" width="${i%2 === 0 ? 70 : 56}" height="5" rx="2.5" fill="hsl(265 30% ${82 - i*3}%)"/>
        `).join("")}
        <circle cx="84" cy="22" r="6" fill="url(#bp-coral)"/>
      </g>

      <!-- arrow 1 -->
      <path d="M 200 200 L 245 200" stroke="hsl(265 30% 65%)" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 5"/>
      <polygon points="245,194 257,200 245,206" fill="hsl(265 30% 65%)"/>

      <!-- vector cloud -->
      <g transform="translate(270,120)">
        <!-- vector points -->
        ${Array.from({length: 22}, (_, i) => {
          const a = (i / 22) * Math.PI * 2 + (i*1.7);
          const r = 25 + (i % 5) * 8;
          const x = 60 + r * Math.cos(a);
          const y = 75 + r * Math.sin(a);
          return `<circle cx="${x}" cy="${y}" r="${2 + (i%3)*0.8}" fill="url(#bp-purple)" opacity="${0.45 + (i%4)*0.13}"/>`;
        }).join("")}
        <!-- center -->
        <circle cx="60" cy="75" r="14" fill="url(#bp-purple)" filter="url(#bp-shadow-sm)"/>
        <text x="60" y="79" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,monospace" font-size="9" font-weight="700" fill="white">VEC</text>
      </g>

      <!-- arrow 2 -->
      <path d="M 405 200 L 442 200" stroke="hsl(265 30% 65%)" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 5"/>
      <polygon points="442,194 454,200 442,206" fill="hsl(265 30% 65%)"/>

      <!-- answer card -->
      <g transform="translate(450,130)" filter="url(#bp-shadow)">
        <rect width="110" height="140" rx="14" fill="url(#bp-card)" stroke="hsl(265 30% 85%)"/>
        <rect width="110" height="32" rx="14" fill="url(#bp-purple)"/>
        <text x="55" y="20" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" font-weight="700" fill="white">ANSWER</text>
        ${[44, 60, 76, 92, 108].map((y, i) => `
          <rect x="12" y="${y}" width="${[80, 64, 84, 50, 70][i]}" height="5" rx="2.5" fill="hsl(265 30% ${80 - i*3}%)"/>
        `).join("")}
      </g>

      <g transform="translate(36,36)" filter="url(#bp-shadow-sm)">
        <rect width="100" height="28" rx="14" fill="white"/>
        <circle cx="14" cy="14" r="4" fill="url(#bp-purple)"/>
        <text x="24" y="18" font-family="ui-monospace,SFMono-Regular,monospace" font-size="10" font-weight="700" letter-spacing="1.5" fill="hsl(265 35% 25%)">RAG</text>
      </g>
    `);
  }

  // ---------- Code / Development ----------
  if (kind === "code") {
    // Stylized code window
    return wrap(`
      <ellipse cx="300" cy="195" rx="260" ry="160" fill="url(#bp-glow)"/>

      <!-- editor window -->
      <g transform="translate(110,80)" filter="url(#bp-shadow)">
        <rect width="380" height="220" rx="16" fill="hsl(265 30% 16%)"/>
        <!-- title bar -->
        <rect width="380" height="34" rx="16" fill="hsl(265 30% 22%)"/>
        <rect y="20" width="380" height="14" fill="hsl(265 30% 22%)"/>
        <circle cx="20" cy="17" r="5" fill="hsl(0 70% 60%)"/>
        <circle cx="38" cy="17" r="5" fill="hsl(40 90% 60%)"/>
        <circle cx="56" cy="17" r="5" fill="hsl(140 60% 55%)"/>
        <text x="200" y="22" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,monospace" font-size="11" fill="hsl(265 20% 70%)">agent.ts</text>

        <!-- gutter -->
        <rect x="0" y="34" width="36" height="186" fill="hsl(265 30% 12%)"/>
        ${Array.from({length: 8}, (_, i) => `
          <text x="22" y="${60 + i*20}" text-anchor="end" font-family="ui-monospace,SFMono-Regular,monospace" font-size="10" fill="hsl(265 20% 45%)">${i+1}</text>
        `).join("")}

        <!-- code lines -->
        ${[
          // [indent, [token widths and colors]]
          [44, [[20,"hsl(290 80% 70%)"], [4,"transparent"], [50,"hsl(195 80% 65%)"], [4,"transparent"], [70,"hsl(40 80% 65%)"]]],
          [60, [[40,"hsl(40 80% 65%)"], [4,"transparent"], [80,"hsl(140 60% 70%)"]]],
          [60, [[36,"hsl(290 80% 70%)"], [4,"transparent"], [30,"hsl(195 80% 65%)"], [4,"transparent"], [90,"hsl(40 80% 65%)"]]],
          [60, [[50,"hsl(140 60% 70%)"], [4,"transparent"], [40,"hsl(265 20% 70%)"]]],
          [44, [[6,"hsl(265 20% 70%)"]]],
          [44, [[30,"hsl(195 80% 65%)"], [4,"transparent"], [70,"hsl(290 80% 70%)"], [4,"transparent"], [50,"hsl(40 80% 65%)"], [4,"transparent"], [3,"hsl(265 20% 70%)"]]],
          [60, [[40,"hsl(290 80% 70%)"], [4,"transparent"], [120,"hsl(40 80% 65%)"]]],
          [44, [[6,"hsl(265 20% 70%)"]]]
        ].map(([indent, tokens], i) => {
          let x = indent;
          return tokens.map(([w, color]) => {
            const out = color === "transparent" ? "" : `<rect x="${x}" y="${52 + i*20}" width="${w}" height="7" rx="2" fill="${color}" opacity="0.85"/>`;
            x += w;
            return out;
          }).join("");
        }).join("")}

        <!-- cursor blink (static) -->
        <rect x="180" y="51" width="2" height="9" fill="white"/>
      </g>

      <!-- floating chips -->
      <g transform="translate(60,260)" filter="url(#bp-shadow-sm)">
        <rect width="120" height="36" rx="18" fill="white"/>
        <circle cx="20" cy="18" r="6" fill="url(#bp-coral)"/>
        <text x="34" y="22" font-family="ui-monospace,SFMono-Regular,monospace" font-size="10" font-weight="700" letter-spacing="0.6" fill="hsl(265 35% 25%)">CI PASSED</text>
      </g>

      <g transform="translate(36,36)" filter="url(#bp-shadow-sm)">
        <rect width="118" height="28" rx="14" fill="white"/>
        <circle cx="14" cy="14" r="4" fill="url(#bp-purple)"/>
        <text x="24" y="18" font-family="ui-monospace,SFMono-Regular,monospace" font-size="10" font-weight="700" letter-spacing="1.5" fill="hsl(265 35% 25%)">DEVELOPMENT</text>
      </g>
    `);
  }

  // ---------- Platform stack ----------
  if (kind === "platform") {
    // Layered platform slabs (isometric)
    const slab = (y, label, fill) => `
      <g transform="translate(150,${y})" filter="url(#bp-shadow-sm)">
        <path d="M 0 16 L 150 0 L 300 16 L 300 50 L 150 66 L 0 50 Z" fill="${fill}" stroke="hsl(265 30% 80%)" stroke-width="1"/>
        <path d="M 0 16 L 150 0 L 300 16 L 150 32 Z" fill="white" opacity="0.55"/>
        <text x="150" y="50" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="13" font-weight="700" fill="white">${label}</text>
      </g>`;

    return wrap(`
      <ellipse cx="300" cy="200" rx="270" ry="160" fill="url(#bp-glow)"/>

      ${slab(220, "Infrastructure", "url(#bp-purple-2)")}
      ${slab(165, "Runtime",        "url(#bp-purple)")}
      ${slab(110, "Platform APIs",  "url(#bp-coral)")}
      ${slab(55,  "Developer UI",   "url(#bp-cyan)")}

      <!-- person on top -->
      <g transform="translate(285,30)" filter="url(#bp-shadow-sm)">
        <circle cx="15" cy="8" r="8" fill="hsl(265 30% 30%)"/>
        <path d="M -2 30 Q 15 14 32 30 Z" fill="hsl(265 30% 30%)"/>
      </g>

      <g transform="translate(36,36)" filter="url(#bp-shadow-sm)">
        <rect width="110" height="28" rx="14" fill="white"/>
        <circle cx="14" cy="14" r="4" fill="url(#bp-cyan)"/>
        <text x="24" y="18" font-family="ui-monospace,SFMono-Regular,monospace" font-size="10" font-weight="700" letter-spacing="1.5" fill="hsl(265 35% 25%)">PLATFORM</text>
      </g>
    `);
  }

  return wrap("");
}

function blogCard(p, idx = 0) {
  return `
    <a href="/blog/${p.slug}" class="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
      <div class="aspect-[16/10] overflow-hidden">${blogArt(p.art)}</div>
      <div class="p-7 flex flex-col flex-1">
        <div class="flex items-center gap-3 text-xs">
          <span class="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">${p.category}</span>
          <span class="text-muted-foreground">${p.read}</span>
        </div>
        <h3 class="mt-3 text-xl font-semibold tracking-tight">${p.title}</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted-foreground">${p.excerpt}</p>
        <span class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">Read article ${icon("arrow-up-right")}</span>
      </div>
    </a>
  `;
}

function pageBlog() {
  const featured = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
  const rest = BLOG_POSTS.filter(p => p !== featured);
  return `
  <section class="py-10 pb-8">
    <div class="container-x">
      <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="space-y-6 lg:col-span-7">
          ${eyebrow("Insights")}
          <h1 class="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Field notes from the <span class="text-gradient">agentic frontier</span>.</h1>
          <p class="text-lg leading-relaxed text-muted-foreground">Practical writing from our engineers and architects on building AI-first, cloud-native systems.</p>
        </div>
        <div class="lg:col-span-5">
          ${blogHeroAnim()}
        </div>
      </div>
    </div>
  </section>

  <section class="pt-4 pb-12">
    <div class="container-x">
      <article class="group relative overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg">
        <a href="/blog/${featured.slug}" class="block">
          <div class="grid gap-0 md:grid-cols-12 md:items-stretch">
            <div class="md:col-span-7 p-10 md:p-14 space-y-5 flex flex-col justify-center">
              <div class="flex items-center gap-3 text-xs flex-wrap">
                <span class="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">Featured · ${featured.category}</span>
                <span class="flex items-center gap-1 text-muted-foreground">${icon("clock","!w-3 !h-3")} ${featured.read}</span>
              </div>
              <h2 class="text-3xl font-semibold tracking-tight md:text-4xl text-balance">${featured.title}</h2>
              <p class="text-base leading-relaxed text-muted-foreground md:text-lg">${featured.excerpt}</p>
              <span class="inline-flex items-center gap-2 text-sm font-medium text-primary">Read article ${icon("arrow-up-right")}</span>
            </div>
            <div class="md:col-span-5 min-h-[260px]">${blogArt(featured.art)}</div>
          </div>
        </a>
      </article>
    </div>
  </section>

  <section class="pb-20 lg:pb-28">
    <div class="container-x">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h3 class="text-2xl font-semibold tracking-tight">More from the team</h3>
        <span class="font-mono text-xs text-muted-foreground">${rest.length} ARTICLE${rest.length === 1 ? "" : "S"}</span>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${rest.map((p, i) => blogCard(p, i)).join("")}
      </div>
    </div>
  </section>

  ${ctaBlock()}
  `;
}

/* ---------- Blog post detail page ---------- */
function pageBlogPost(slug) {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) {
    return `
      <section class="py-24">
        <div class="container-x text-center space-y-6">
          <p class="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">404 · Article not found</p>
          <h1 class="text-4xl font-semibold tracking-tight">We couldn't find that article.</h1>
          <a href="/blog" class="btn btn-primary btn-lg">${icon("arrow-left")} Back to all articles</a>
        </div>
      </section>
      ${ctaBlock()}
    `;
  }

  const related = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  const renderBlock = (b) => {
    if (b.type === "h")  return `<h2 class="mt-12 mb-4 text-2xl font-semibold tracking-tight md:text-3xl">${b.text}</h2>`;
    if (b.type === "p")  return `<p class="mt-5 text-[17px] leading-[1.75] text-foreground/85">${b.text}</p>`;
    if (b.type === "ul") return `<ul class="mt-5 space-y-3 text-[17px] leading-[1.75] text-foreground/85">${b.items.map(it => `
      <li class="flex gap-3"><span class="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-primary"></span><span>${it}</span></li>
    `).join("")}</ul>`;
    return "";
  };

  return `
  <section class="pt-8 pb-4">
    <div class="container-x">
      <a href="/blog" class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        ${icon("arrow-left","!w-4 !h-4")} All articles
      </a>
    </div>
  </section>

  <section class="pt-6 pb-10">
    <div class="container-x max-w-3xl">
      <div class="flex items-center gap-3 text-xs flex-wrap">
        <span class="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">${post.category}</span>
        <span class="flex items-center gap-1 text-muted-foreground">${icon("clock","!w-3 !h-3")} ${post.read}</span>
      </div>
      <h1 class="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">${post.title}</h1>
      <p class="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">${post.excerpt}</p>
      <div class="mt-7 flex items-center gap-3 border-t border-b border-border py-4">
        <div class="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-white text-xs font-bold">A</div>
        <div>
          <p class="text-sm font-semibold">${post.author}</p>
          <p class="text-xs text-muted-foreground">Algorims · Field notes</p>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <button onclick="navigator.clipboard?.writeText(location.href)" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors" aria-label="Copy link">${icon("link","!w-4 !h-4")}</button>
          <a href="https://www.linkedin.com/company/algorims/" target="_blank" rel="noopener" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors" aria-label="LinkedIn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>

  <section class="pb-10">
    <div class="container-x max-w-5xl">
      <div class="aspect-[21/9] overflow-hidden rounded-3xl border border-border">${blogArt(post.art)}</div>
    </div>
  </section>

  <section class="pb-16">
    <div class="container-x max-w-3xl">
      <article class="blog-prose">
        ${post.body.map(renderBlock).join("")}
      </article>

      <div class="mt-14 rounded-3xl border border-border bg-secondary/30 p-8 md:p-10">
        <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">Work with us</p>
            <h3 class="mt-2 text-2xl font-semibold tracking-tight">Have a problem that looks like this one?</h3>
            <p class="mt-2 text-sm text-muted-foreground max-w-xl">Most of our engagements start with a 30-minute conversation. No slideware, no obligation.</p>
          </div>
          <a href="/contact" class="btn btn-primary btn-lg shrink-0">Get in touch ${icon("arrow-right")}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="pb-20 lg:pb-28">
    <div class="container-x">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h3 class="text-2xl font-semibold tracking-tight">Keep reading</h3>
        <a href="/blog" class="text-sm font-medium text-primary inline-flex items-center gap-1">All articles ${icon("arrow-right","!w-4 !h-4")}</a>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        ${related.map(p => blogCard(p)).join("")}
      </div>
    </div>
  </section>
  `;
}

/* ============================================================
   CASE STUDIES — full detail pages
   Rendered via the dynamic route  #/case-studies/<slug>
   ============================================================ */
/* ============================================================
   SOLUTIONS / CASE-STUDY DETAIL PAGES (ACO · IDP · OA)
   Rendered via the dynamic route  #/solutions/<slug>
   ============================================================ */
/* Case study and solution data lives in /assets/js/content.js. */

function findDetail(slug) {
  return (typeof CASE_STUDIES !== "undefined" ? CASE_STUDIES.find(x => x.slug === slug) : null)
      || (typeof SOLUTIONS !== "undefined" ? SOLUTIONS.find(x => x.slug === slug) : null)
      || (typeof PRODUCTS !== "undefined" ? PRODUCTS.find(x => x.slug === slug) : null)
      || null;
}
function detailHref(slug) {
  const isCase = (typeof CASE_STUDIES !== "undefined") && CASE_STUDIES.some(x => x.slug === slug);
  const isProduct = (typeof PRODUCTS !== "undefined") && PRODUCTS.some(x => x.slug === slug);
  return `${isCase ? "/case-studies" : isProduct ? "/products" : "/solutions"}/${slug}`;
}
function detailNotFound() {
  return `
    <section class="py-24">
      <div class="container-x text-center space-y-6">
        <p class="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">404 · Page not found</p>
        <h1 class="text-4xl font-semibold tracking-tight">We couldn't find that page.</h1>
        <a href="/case-studies" class="btn btn-primary btn-lg">${icon("arrow-left")} Back to case studies</a>
      </div>
    </section>
    ${ctaBlock()}
  `;
}
function pageProductDetail(slug) {
  const rec = (typeof PRODUCTS !== "undefined") ? PRODUCTS.find(p => p.slug === slug) : null;
  return rec ? renderDetailPage(rec) : detailNotFound();
}
function pageSolution(slug) {
  const rec = (typeof SOLUTIONS !== "undefined") ? SOLUTIONS.find(s => s.slug === slug) : null;
  return rec ? renderDetailPage(rec) : detailNotFound();
}
function pageCaseStudy(slug) {
  const rec = (typeof CASE_STUDIES !== "undefined") ? CASE_STUDIES.find(s => s.slug === slug) : null;
  return rec ? renderDetailPage(rec) : detailNotFound();
}
function renderDetailPage(sol) {
  const related = (sol.related || []).map(s => findDetail(s)).filter(Boolean);
  const menuItem = (sol.slug && typeof PRODUCT_MENU !== "undefined") ? PRODUCT_MENU.find(p => p.slug === sol.slug) : null;

  const metricCard = (m) => `
    <div class="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md">
      ${m.value === "✓"
        ? `<div class="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">${icon("check","!w-5 !h-5")}</div>`
        : `<p class="text-3xl font-semibold tracking-tight text-gradient md:text-4xl">${m.value}</p>`}
      <p class="mt-3 text-sm leading-relaxed text-muted-foreground">${m.label}</p>
    </div>`;

  return `
  <section class="pt-8 pb-4">
    <div class="container-x">
      <a href="${sol.source.href}" class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        ${icon("arrow-left","!w-4 !h-4")} ${sol.source.label}
      </a>
    </div>
  </section>

  <!-- Hero -->
  <section class="pt-6 pb-10">
    <div class="container-x">
      <div class="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div class="space-y-6 lg:col-span-7">
          <div class="flex flex-wrap items-center gap-3">
            ${eyebrow(sol.kind)}
            <span class="text-xs font-medium uppercase tracking-widest text-muted-foreground">${sol.tag}</span>
          </div>
          ${menuItem ? `<div class="flex items-center gap-3 pt-4">
            <div class="relative h-14 w-14 rounded-2xl flex items-center justify-center" style="background:${sol.accent}15;border:1px solid ${sol.accent}30">
              <div class="absolute inset-0 rounded-2xl animate-pulse" style="background:${sol.accent}10"></div>
              <div class="relative grid place-items-center" style="color:${sol.accent}">${icon(sol.glyph,"!w-7 !h-7")}</div>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">Product</p>
              <p class="text-xl font-semibold text-foreground">Algorims ${menuItem.name}</p>
            </div>
          </div>` : ""}
          <h1 class="text-balance text-4xl font-semibold leading-[1.06] tracking-tight md:text-5xl">${sol.title}</h1>
          <p class="text-pretty text-lg leading-relaxed text-muted-foreground">${sol.subtitle}</p>
          <div class="flex flex-wrap gap-3 pt-1">
            <a href="/contact" class="btn btn-hero btn-lg">Talk to an architect ${icon("arrow-right")}</a>
            <a href="${sol.source.href}" class="btn btn-outline btn-lg">${sol.source.label}</a>
          </div>
        </div>
        <div class="lg:col-span-5">
          <div class="relative overflow-hidden rounded-3xl border border-border bg-gradient-dark p-8 text-white shadow-lg">
            <div class="absolute inset-0 surface-mesh opacity-50"></div>
            <div class="absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl" style="background:hsl(var(--primary-glow) / .3)"></div>
            <div class="relative">
              <div class="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-white">${icon(sol.glyph,"!w-6 !h-6")}</div>
              <dl class="mt-6 divide-y divide-white/10">
                ${sol.meta.map(m => `
                  <div class="flex items-start justify-between gap-4 py-3">
                    <dt class="text-xs uppercase tracking-widest text-white/55">${m.label}</dt>
                    <dd class="text-right text-sm font-medium text-white/90">${m.value}</dd>
                  </div>
                `).join("")}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Key metrics band -->
  ${sol.metrics && sol.metrics.length ? `
  <section class="pb-12">
    <div class="container-x">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        ${sol.metrics.map(metricCard).join("")}
      </div>
    </div>
  </section>` : ""}

  <!-- Introduction -->
  ${sol.intro && sol.intro.length ? `
  <section class="pb-4">
    <div class="container-x max-w-3xl">
      ${eyebrow("Overview")}
      <div class="mt-5 space-y-5">
        ${sol.intro.map(p => `<p class="text-[17px] leading-[1.75] text-foreground/85">${p}</p>`).join("")}
      </div>
    </div>
  </section>` : ""}

  <!-- How it fits flow diagram -->
  ${sol.flow ? `
  <section class="py-12">
    <div class="container-x">
      ${eyebrow("How it fits")}
      <h2 class="mt-6 text-3xl font-semibold leading-[1.1] tracking-tight md:text-4xl text-balance">${sol.flow.title}</h2>
      <p class="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">${sol.flow.desc}</p>
      <div class="mt-10 rounded-3xl p-8 md:p-10" style="background:linear-gradient(135deg, hsl(220 30% 10%), hsl(220 40% 8%));border:1px solid hsl(220 50% 25%)">
        <div class="grid gap-20 md:grid-cols-3 md:gap-32">
          ${sol.flow.stages.map((stage, i) => `
            <div class="relative">
              <div class="rounded-2xl p-6" style="background:hsl(220 30% 15%);border:1px solid hsl(220 40% 30%)">
                <div class="grid h-12 w-12 place-items-center rounded-xl mb-4" style="background:hsl(220 60% 40%);color:white">${icon(stage.icon,"!w-6 !h-6")}</div>
                <h3 class="text-lg font-semibold text-white">${stage.title}</h3>
                <p class="mt-2 text-sm text-blue-200">${stage.subtitle}</p>
                ${stage.items ? `<ul class="mt-4 space-y-2">${stage.items.map(item => `<li class="text-sm text-white/80 border-t border-blue-500/20 pt-2 first:border-0 first:pt-0">${item}</li>`).join("")}</ul>` : ""}
              </div>
              ${i === 0 ? `<div class="hidden md:absolute md:flex md:-right-20 md:top-1/2 md:-translate-y-1/2 z-10 flex-col items-center gap-1"><div class="text-xs font-medium text-center whitespace-nowrap" style="color:hsl(220 60% 55%)">Document<br>Submitted</div><div style="color:hsl(220 60% 55%)">${icon("arrow-right","!w-8 !h-8")}</div></div>` : i === 1 ? `<div class="hidden md:absolute md:flex md:-right-20 md:top-1/2 md:-translate-y-1/2 z-10 flex-col items-center gap-2" style="left: 350px"><div class="text-xs font-medium text-center whitespace-nowrap" style="color:hsl(220 60% 55%)">Auto-Approved<br>or Routed to<br>Reviewer</div><div style="color:hsl(220 60% 55%)">${icon("arrow-right","!w-8 !h-8")}</div></div>` : ""}
            </div>
          `).join("")}
        </div>
        ${sol.flow.footer ? `<p class="mt-8 text-center text-sm text-white/70">${sol.flow.footer}</p>` : ""}
      </div>
    </div>
  </section>` : ""}

  <!-- Product visual -->
  ${(typeof CASE_SCENES !== "undefined" && CASE_SCENES[sol.slug]) ? `
  <section class="pt-2 pb-6">
    <div class="container-x">
      <figure>
        <img src="${BASE_PATH}/assets/case-studies/scenes/${sol.slug}.png" alt="${CASE_SCENES[sol.slug].alt}" loading="lazy" class="w-full h-auto rounded-3xl border border-border shadow-sm" />
        <figcaption class="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">${CASE_SCENES[sol.slug].caption}</figcaption>
      </figure>
    </div>
  </section>` : ""}

  <!-- Challenge -->
  ${sol.challenge ? `
  <section class="py-12">
    <div class="container-x max-w-3xl">
      ${eyebrow("The challenge")}
      <p class="mt-5 text-[17px] leading-[1.75] text-foreground/85">${sol.challenge.lead}</p>
      <ul class="mt-6 space-y-3">
        ${sol.challenge.items.map(it => `
          <li class="flex gap-3 rounded-2xl border border-border bg-card p-4">
            <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">${icon("x","!w-3.5 !h-3.5")}</span>
            <span class="text-[15px] leading-relaxed text-muted-foreground">${it}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  </section>` : ""}

  <!-- Solution -->
  ${sol.solution && sol.solution.length ? `
  <section class="py-12 bg-secondary/40">
    <div class="container-x">
      <div class="max-w-3xl">
        ${eyebrow(sol.solutionTitle || "The solution")}
        ${sol.solutionLead ? `<p class="mt-5 text-[17px] leading-[1.75] text-foreground/85">${sol.solutionLead}</p>` : ""}
      </div>
      <div class="mt-10 space-y-5">
        ${sol.solution.map((s, i) => `
          <div class="grid gap-5 rounded-3xl border border-border bg-card p-7 md:grid-cols-12 md:items-start md:p-8">
            <div class="md:col-span-4">
              <div class="flex items-center gap-3">
                <span class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-sm font-bold text-white shadow-glow">${String(i + 1).padStart(2, "0")}</span>
                <h3 class="text-xl font-semibold tracking-tight">${s.h}</h3>
              </div>
            </div>
            <p class="text-[15px] leading-relaxed text-muted-foreground md:col-span-8">${s.p}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>` : ""}

  <!-- AWS services -->
  ${sol.aws && sol.aws.length ? `
  <section class="py-12">
    <div class="container-x">
      <div class="max-w-3xl">
        ${eyebrow(sol.awsTitle || "AWS services in the solution")}
        ${sol.awsLead ? `<p class="mt-5 text-[17px] leading-[1.75] text-foreground/85">${sol.awsLead}</p>` : ""}
      </div>
      <div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        ${sol.aws.map(a => `
          <div class="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md">
            <div class="flex items-center gap-2.5">
              <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">${icon(awsIcon(a.name),"!w-4 !h-4")}</span>
              <p class="text-sm font-semibold">${a.name}</p>
            </div>
            <p class="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">${a.desc}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>` : ""}

  <!-- Solution architecture diagram -->
  ${sol.architecture ? `
  <section class="py-12">
    <div class="container-x">
      <div class="max-w-3xl">
        ${eyebrow("Solution architecture")}
        ${sol.architecture.caption ? `<p class="mt-5 text-[17px] leading-[1.75] text-foreground/85">${sol.architecture.caption}</p>` : ""}
      </div>
      <figure class="mt-8 overflow-hidden rounded-3xl border border-border bg-white p-4 shadow-sm md:p-8">
        <img src="${sol.architecture.src}" alt="${sol.architecture.alt || (sol.title + ' solution architecture')}" class="mx-auto h-auto w-full max-w-4xl" loading="lazy" />
      </figure>
    </div>
  </section>` : ""}

  <!-- Technology stack -->
  ${sol.tech && sol.tech.length ? `
  <section class="py-12">
    <div class="container-x max-w-4xl">
      ${eyebrow("Technology stack")}
      <div class="mt-6 flex flex-wrap gap-2.5">
        ${sol.tech.map(t => `<span class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80 transition-all hover:border-primary/40 hover:-translate-y-0.5"><span class="h-1.5 w-1.5 rounded-full bg-primary"></span>${t}</span>`).join("")}
      </div>
    </div>
  </section>` : ""}

  <!-- Results -->
  ${sol.results && sol.results.length ? `
  <section class="py-12 bg-secondary/40">
    <div class="container-x">
      <div class="max-w-3xl">
        ${eyebrow(sol.resultsTitle || "Results & benefits")}
      </div>
      <div class="mt-8 grid gap-4 md:grid-cols-2">
        ${sol.results.map(r => `
          <div class="flex gap-3 rounded-2xl border border-border bg-card p-5">
            <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">${icon("check","!w-3.5 !h-3.5")}</span>
            <span class="text-[15px] leading-relaxed text-foreground/85">${r}</span>
          </div>
        `).join("")}
      </div>
    </div>
  </section>` : ""}

  <!-- FAQ -->
  ${sol.faqs && sol.faqs.length ? `
  <section class="py-12">
    <div class="container-x max-w-3xl">
      ${eyebrow("Frequently asked questions")}
      <div class="mt-8 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
        ${sol.faqs.map(f => `
          <details class="group">
            <summary class="flex cursor-pointer items-center justify-between gap-4 p-6 text-left font-semibold transition-colors hover:bg-secondary/40">
              <span>${f.q}</span>
              <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-45">${icon("plus","!w-4 !h-4")}</span>
            </summary>
            <p class="px-6 pb-6 text-[15px] leading-relaxed text-muted-foreground">${f.a}</p>
          </details>
        `).join("")}
      </div>
    </div>
  </section>` : ""}

  ${related.length ? `
  <section class="pb-16">
    <div class="container-x">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h3 class="text-2xl font-semibold tracking-tight">Related work</h3>
      </div>
      <div class="grid gap-6 md:grid-cols-2">
        ${related.map(r => `
          <a href="${detailHref(r.slug)}" class="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:border-primary/30 hover:shadow-lg">
            <div class="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20"></div>
            <div class="relative">
              <div class="flex items-center justify-between gap-4">
                <span class="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">${icon(r.glyph,"!w-5 !h-5")}</span>
                <div class="grid h-10 w-10 place-items-center rounded-full border border-border transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary">${icon("arrow-up-right","!w-4 !h-4")}</div>
              </div>
              <p class="mt-4 text-xs font-medium uppercase tracking-widest text-primary">${r.kind}</p>
              <h4 class="mt-2 text-xl font-semibold tracking-tight">${r.title}</h4>
            </div>
          </a>
        `).join("")}
      </div>
    </div>
  </section>` : ""}

  ${ctaBlock()}
  `;
}

function radialOrbital() {
  const nodes = [
    {
      id: "planning",
      title: "Planning",
      date: "Jan 2024",
      status: "live",
      statusLabel: "Complete",
      body: "Project planning and requirements gathering phase.",
      icon: "calendar",
      energy: 100,
      relatedIds: ["design"],
    },
    {
      id: "design",
      title: "Design",
      date: "Feb 2024",
      status: "live",
      statusLabel: "Complete",
      body: "UI/UX design and system architecture.",
      icon: "file-text",
      energy: 90,
      relatedIds: ["planning", "development"],
    },
    {
      id: "development",
      title: "Development",
      date: "Mar 2024",
      status: "practice",
      statusLabel: "In Progress",
      body: "Core features implementation and testing.",
      icon: "code",
      energy: 60,
      relatedIds: ["design", "testing"],
    },
    {
      id: "testing",
      title: "Testing",
      date: "Apr 2024",
      status: "soon",
      statusLabel: "Pending",
      body: "User testing and bug fixes.",
      icon: "user",
      energy: 30,
      relatedIds: ["development", "release"],
    },
    {
      id: "release",
      title: "Release",
      date: "May 2024",
      status: "soon",
      statusLabel: "Pending",
      body: "Final deployment and release.",
      icon: "clock",
      energy: 10,
      relatedIds: ["testing"],
    },
  ];

  const nodeHtml = (n) => `
    <div class="rot-node" data-rot-node="${n.id}" data-related-ids="${n.relatedIds.join(',')}" role="button" tabindex="0" aria-label="${n.title}">
      <div class="rot-node-halo"></div>
      <div class="rot-node-chip">
        ${n.logo ? `<img src="${n.logo}" alt="${n.title}" />` : `<i data-lucide="${n.icon}"></i>`}
      </div>
      <div class="rot-node-label">${n.title}</div>
      <div class="rot-card" role="dialog" aria-label="${n.title} details">
        <div class="rot-card-head">
          <span class="rot-card-badge" data-status="${n.status}">${n.statusLabel}</span>
          <span class="rot-card-date">${n.date}</span>
        </div>
        <h4>${n.title}</h4>
        <p>${n.body}</p>
        <div class="rot-card-meter-row">
          <span class="rot-meter-label"><i data-lucide="zap"></i>Energy</span>
          <span style="font-family:ui-monospace,monospace;">${n.energy}%</span>
        </div>
        <div class="rot-card-meter"><span style="width:${n.energy}%"></span></div>
        ${n.relatedIds.length ? `
          <div class="rot-card-related">
            <h5><i data-lucide="link"></i>Connected</h5>
            <div class="rot-card-related-list">
              ${n.relatedIds.map(rid => {
                const r = nodes.find(x => x.id === rid);
                return r ? `<button data-rot-jump="${rid}" type="button">${r.title}<i data-lucide="arrow-right"></i></button>` : "";
              }).join("")}
            </div>
          </div>` : ""}
      </div>
    </div>
  `;

  return `
    <div class="rot-stage" data-rot-stage aria-label="Algorims orbital timeline">
      <img class="rot-center-icon" src="${BASE_PATH}/assets/algorims-icon-transparent.png" alt="Algorims" />
      ${nodes.map(nodeHtml).join("")}
    </div>
  `;
}

function pageProducts() {
  const products = [
    {
      id: "cxiq",
      name: "CXIQ",
      status: "Conversational admin automation · AWS-native",
      live: true,
      tagline: "Every conversation handled. Every dollar approved.",
      body: "An AI layer on top of the WhatsApp and email you already use — no migration — that answers routine questions automatically, and always puts a human in the loop the moment a conversation touches money.",
      glyph: "message-square-text",
      bgFrom: "hsl(345 60% 55% / 0.18)",
      bgTo:   "hsl(345 40% 40% / 0.16)",
      accent: "hsl(345 60% 48%)",
      logoBg: "linear-gradient(135deg, hsl(345 60% 96%), hsl(345 40% 96%))",
      features: [
        { icon: "message-square-text", label: "Conversational AI",  desc: "Bedrock + Lex v2 answer routine questions on WhatsApp and email." },
        { icon: "lock",                label: "Approval-gated",     desc: "Every money action routes to a human before it moves." },
        { icon: "headset",             label: "Voice escalation",   desc: "Complex queries hand off to Amazon Connect with full context." },
      ],
      readMore: "/products/cxiq",
    },
    {
      id: "dociq",
      name: "DocIQ",
      status: "Intelligent document processing · AWS-native",
      live: true,
      tagline: "Documents in. Decisions out.",
      body: "A cost-tiered AI pipeline on AWS that replaces manual document keying with confidence-routed extraction — cutting document processing cost by up to 97%, hosted entirely in your own region.",
      glyph: "scan-text",
      bgFrom: "hsl(219 85% 60% / 0.18)",
      bgTo:   "hsl(262 70% 58% / 0.16)",
      accent: "hsl(219 85% 55%)",
      logoBg: "linear-gradient(135deg, hsl(219 70% 96%), hsl(262 60% 96%))",
      features: [
        { icon: "scan-text",  label: "Textract → Bedrock", desc: "Cheapest tier that meets the accuracy bar, escalating only when needed." },
        { icon: "shield-check", label: "Human boundary",   desc: "Below-threshold documents always route to a reviewer." },
        { icon: "webhook",    label: "ERP delivery",       desc: "HMAC-signed webhook into SAP, Oracle, or NetSuite." },
      ],
      readMore: "/products/dociq",
    },
    {
      id: "opsiq",
      name: "OpsIQ",
      status: "Autonomous L1 service desk · AWS-native",
      live: true,
      tagline: "Tickets in. Resolutions out.",
      body: "An agentic AIOps layer on Amazon Bedrock that classifies, resolves, and closes the majority of L1 service-desk tickets directly in your existing ITSM platform — with every Active Directory, firewall, or bulk-impact action gated behind a human decision.",
      glyph: "server-cog",
      bgFrom: "hsl(191 85% 40% / 0.18)",
      bgTo:   "hsl(199 60% 25% / 0.16)",
      accent: "hsl(191 85% 35%)",
      logoBg: "linear-gradient(135deg, hsl(191 60% 95%), hsl(199 40% 95%))",
      features: [
        { icon: "server-cog", label: "3-tier autonomy",  desc: "Tier 1/2 resolve automatically; Tier 3 pauses for approval." },
        { icon: "key",        label: "No domain-admin",  desc: "A scoped service account only — least privilege throughout." },
        { icon: "rotate-ccw", label: "Auto-rollback",    desc: "Multi-step runbooks roll back automatically on failure." },
      ],
      readMore: "/products/opsiq",
    },
    {
      id: "payiq",
      name: "PayIQ",
      status: "AI-native accounts payable · AWS-native",
      live: true,
      tagline: "Your invoices post themselves. Safely.",
      body: "AI reads every invoice and posts the ones it's confident about straight into Xero or Zoho Books. The rest come to you for a one-click review. And the moment a vendor's bank details change, PayIQ always stops and asks a human first.",
      glyph: "receipt",
      bgFrom: "hsl(158 75% 35% / 0.18)",
      bgTo:   "hsl(158 50% 22% / 0.16)",
      accent: "hsl(158 75% 30%)",
      logoBg: "linear-gradient(135deg, hsl(158 60% 95%), hsl(158 40% 95%))",
      features: [
        { icon: "receipt",      label: "Touchless posting", desc: "Confident invoices post straight into Xero or Zoho Books." },
        { icon: "shield-alert", label: "Fraud hard-stop",   desc: "A vendor bank-detail change always requires human sign-off." },
        { icon: "link-2",       label: "Xero + Zoho",       desc: "Both connectors live from day one." },
      ],
      readMore: "/products/payiq",
    },
    {
      id: "operations-automation",
      name: "GenAI Operations Automation",
      status: "Enterprise platform · AWS-native",
      live: true,
      tagline: "Less manual work. More finished work.",
      body: "An AWS-native platform that automates the end-to-end document lifecycle across finance, HR, and operations — built for Singapore with UEN validation, GST checks, and PayNow matching, all inside your own AWS account.",
      glyph: "workflow",
      bgFrom: "hsl(265 85% 60% / 0.18)",
      bgTo:   "hsl(280 95% 70% / 0.16)",
      accent: "hsl(265 85% 58%)",
      logoBg: "linear-gradient(135deg, hsl(265 60% 96%), hsl(280 70% 96%))",
      features: [
        { icon: "scan-text",           label: "Document processing", desc: "Invoices, claims, and POs extracted with Singapore UEN & GST validation." },
        { icon: "calculator",          label: "AR/AP reconciliation", desc: "AI GL coding and bank matching posted to Xero, QuickBooks, SAP." },
        { icon: "message-square-text", label: "Conversational assistant", desc: "Natural-language queries over finance, HR, and ops — with cited answers." },
      ],
      readMore: "/solutions/operations-automation",
    },
  ];

  const moreProducts = [
    {
      id: "algokisan",
      name: "Algokisan",
      status: "Live on Play Store",
      live: true,
      tagline: "A direct line from farm to buyer.",
      body: "Farmers list their produce. Buyers reach out directly — no middlemen, no markup. When either side needs it, transport is built right into the app.",
      logo: `${BASE_PATH}/assets/products/algokisan.png`,
      bgFrom: "hsl(140 60% 55% / 0.18)",
      bgTo:   "hsl(215 80% 55% / 0.18)",
      accent: "hsl(140 50% 38%)",
      logoBg: "linear-gradient(135deg, hsl(140 50% 95%), hsl(215 60% 95%))",
      features: [
        { icon: "store",        label: "Direct listings",        desc: "Farmers post produce with photos, quantity, and asking price." },
        { icon: "message-square-text", label: "Buyer ↔ seller chat", desc: "Negotiate and confirm orders inside the app." },
        { icon: "truck",        label: "Optional transport",     desc: "Either party can request in-app transport for the load." },
      ],
      cta: { label: "Get on Google Play", href: "#" },
    },
    {
      id: "algoride",
      name: "Algoride",
      status: "Live on Play Store",
      live: true,
      tagline: "Intercity travel, two ways.",
      body: "Carpool with people heading the same way, or hire a full vehicle and driver for the trip. Built for the long haul between cities — not for hopping across town.",
      logo: `${BASE_PATH}/assets/products/algoride.png`,
      bgFrom: "hsl(212 90% 60% / 0.18)",
      bgTo:   "hsl(195 90% 60% / 0.18)",
      accent: "hsl(212 90% 48%)",
      logoBg: "linear-gradient(135deg, hsl(212 70% 95%), hsl(195 70% 95%))",
      modes: [
        { icon: "users-round",  title: "Carpooling",   desc: "Intercity rides only — riders match with drivers going the same route. Not designed for intra-city trips." },
        { icon: "car-front",    title: "For-Hire",     desc: "Hire a vehicle along with its driver for a planned trip. Owners can publish their vehicles to earn." },
      ],
      safety: [
        { icon: "shield-check", label: "KYC verified" },
        { icon: "phone-call",   label: "Emergency contact" },
        { icon: "map-pin",      label: "Live tracking share" },
      ],
      cta: { label: "Get on Google Play", href: "#" },
    },
    {
      id: "algomart",
      name: "Algomart",
      status: "Coming Soon",
      live: false,
      tagline: "Something's taking flight.",
      body: "We're not ready to talk about this one yet — but it's moving fast and it's almost here. Drop your email and we'll tell you the moment it lands.",
      logo: `${BASE_PATH}/assets/products/algomart.png`,
      bgFrom: "hsl(140 70% 55% / 0.15)",
      bgTo:   "hsl(30 95% 60% / 0.15)",
      accent: "hsl(140 50% 40%)",
      logoBg: "linear-gradient(135deg, hsl(140 60% 95%), hsl(30 80% 95%))",
      comingSoon: true,
    },
  ];

  const statusBadge = (live, status) => `
    <span class="inline-flex items-center gap-2 rounded-full border ${live ? 'border-green-500/30 bg-green-500/10 text-green-700' : 'border-amber-500/30 bg-amber-500/10 text-amber-700'} px-3 py-1 text-xs font-semibold">
      <span class="relative grid h-1.5 w-1.5 place-items-center">
        <span class="absolute inset-0 rounded-full ${live ? 'bg-green-500' : 'bg-amber-500'}"></span>
        <span class="absolute inset-0 rounded-full ${live ? 'bg-green-500' : 'bg-amber-500'} animate-ping"></span>
      </span>
      ${status}
    </span>`;

  const playStoreBtn = (href, label) => `
    <a href="${href}" class="inline-flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3 text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <svg viewBox="0 0 512 512" class="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id="ps-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00C3FF"/><stop offset="100%" stop-color="#0070FF"/>
          </linearGradient>
          <linearGradient id="ps-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FFCE00"/><stop offset="100%" stop-color="#FFB300"/>
          </linearGradient>
          <linearGradient id="ps-c" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FF3A44"/><stop offset="100%" stop-color="#C31162"/>
          </linearGradient>
          <linearGradient id="ps-d" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00F076"/><stop offset="100%" stop-color="#00A05B"/>
          </linearGradient>
        </defs>
        <path d="M48 32 L304 256 L48 480 C42 472 38 462 38 450 V62 C38 50 42 40 48 32 Z" fill="url(#ps-a)"/>
        <path d="M48 32 C56 24 68 24 80 32 L378 200 L304 256 Z" fill="url(#ps-d)"/>
        <path d="M48 480 C56 488 68 488 80 480 L378 312 L304 256 Z" fill="url(#ps-c)"/>
        <path d="M378 200 L460 246 C476 254 476 258 460 266 L378 312 L304 256 Z" fill="url(#ps-b)"/>
      </svg>
      <span class="flex flex-col items-start leading-tight">
        <span class="text-[10px] uppercase tracking-widest opacity-75">${label.startsWith("Get") ? "Get it on" : ""}</span>
        <span class="text-base font-semibold">${label.replace(/^Get on /, "")}</span>
      </span>
    </a>`;

  const productCard = (p, idx) => {
    const reverse = idx % 2 === 1;
    return `
    <article id="${p.id}" data-reverse="${reverse}" class="pp-card group relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-lg">
      <!-- soft brand halo -->
      <div class="pp-halo pointer-events-none absolute inset-0 -z-0 opacity-90"
           style="background: radial-gradient(circle at ${reverse ? '85%' : '15%'} 30%, ${p.bgFrom}, transparent 55%), radial-gradient(circle at ${reverse ? '15%' : '85%'} 80%, ${p.bgTo}, transparent 60%)"></div>

      <div class="relative grid gap-10 p-8 md:p-12 lg:grid-cols-12 lg:items-center lg:gap-14">
        <!-- Media -->
        <div class="pp-media product-media relative lg:col-span-5 ${reverse ? 'lg:order-2' : ''}">
          <div class="relative mx-auto aspect-square w-full max-w-[360px]">
            <div class="absolute inset-0 rounded-[2rem]" style="background:${p.logoBg};border:1px solid hsl(0 0% 100% / 0.6);box-shadow:0 30px 80px -30px ${p.accent}40, inset 0 1px 0 hsl(0 0% 100% / 0.8)"></div>
            <!-- decorative orbiting ring -->
            <div class="absolute inset-2 rounded-[2rem] opacity-60" style="border:1px dashed ${p.accent}33"></div>
            <div class="absolute inset-0 grid place-items-center p-10">
              ${p.logo
                ? `<img src="${p.logo}" alt="${p.name} logo" class="pp-logo h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 ${p.comingSoon ? 'opacity-90' : ''}" />`
                : `<div class="pp-logo grid h-full w-full place-items-center transition-transform duration-500 group-hover:scale-105" style="color:${p.accent}">${icon(p.glyph, "!w-28 !h-28")}</div>`}
            </div>
            ${p.comingSoon ? `
              <span class="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-500/30 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 shadow-sm">In development</span>
            ` : ''}
          </div>
        </div>

        <!-- Copy -->
        <div class="lg:col-span-7 space-y-6">
          <div class="pp-fade flex flex-wrap items-center gap-3" style="--pp-delay:.05s">
            ${statusBadge(p.live, p.status)}
            <span class="pp-eyebrow text-muted-foreground">Algorims product</span>
          </div>
          <div class="pp-fade space-y-3" style="--pp-delay:.15s">
            <h2 class="text-4xl font-semibold tracking-tight md:text-5xl">${p.name}</h2>
            <p class="text-xl font-medium" style="color:${p.accent}">${p.tagline}</p>
          </div>
          <p class="pp-fade max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg" style="--pp-delay:.25s">${p.body}</p>

          ${p.features ? `
            <div class="grid gap-3 sm:grid-cols-3 pt-2">
              ${p.features.map((f, i) => `
                <div class="pp-fade rounded-2xl border border-border bg-background/80 p-4 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md" style="--pp-delay:${0.35 + i * 0.1}s">
                  <div class="grid h-9 w-9 place-items-center rounded-xl" style="background:${p.accent}1a;color:${p.accent}">${icon(f.icon, "!w-4 !h-4")}</div>
                  <p class="mt-3 text-sm font-semibold">${f.label}</p>
                  <p class="mt-1 text-xs leading-relaxed text-muted-foreground">${f.desc}</p>
                </div>
              `).join("")}
            </div>
          ` : ''}

          ${p.modes ? `
            <div class="grid gap-4 sm:grid-cols-2 pt-2">
              ${p.modes.map((m, i) => `
                <div class="pp-fade rounded-2xl border border-border bg-background/80 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md" style="--pp-delay:${0.35 + i * 0.12}s">
                  <div class="flex items-center gap-3">
                    <div class="grid h-10 w-10 place-items-center rounded-xl" style="background:${p.accent}1a;color:${p.accent}">${icon(m.icon, "!w-5 !h-5")}</div>
                    <p class="text-base font-semibold">${m.title}</p>
                  </div>
                  <p class="mt-3 text-sm leading-relaxed text-muted-foreground">${m.desc}</p>
                </div>
              `).join("")}
            </div>
            <div class="pp-fade pt-2" style="--pp-delay:.65s">
              <p class="pp-eyebrow text-muted-foreground">Built-in safety</p>
              <div class="mt-3 flex flex-wrap gap-2">
                ${p.safety.map((s, i) => `
                  <span class="pp-fade inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium" style="--pp-delay:${0.75 + i * 0.08}s">
                    <span style="color:${p.accent}">${icon(s.icon, "!w-3.5 !h-3.5")}</span>${s.label}
                  </span>
                `).join("")}
              </div>
            </div>
          ` : ''}

          <div class="pp-fade flex flex-wrap items-center gap-3 pt-3" style="--pp-delay:.55s">
            ${p.cta ? playStoreBtn(p.cta.href, p.cta.label) : ''}
            ${p.readMore ? `<a href="${p.readMore}" class="btn btn-hero btn-lg">Read more ${icon("arrow-right")}</a>` : ''}
            ${p.comingSoon ? `
              <form class="flex w-full max-w-md flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap" onsubmit="event.preventDefault(); this.querySelector('[data-msg]').classList.remove('hidden'); this.querySelector('input').value='';">
                <input type="email" required placeholder="you@company.com" class="field flex-1" maxlength="120" />
                <button class="btn btn-hero btn-default whitespace-nowrap">Notify me ${icon("arrow-right")}</button>
                <span data-msg class="hidden text-xs font-medium text-green-700">Thanks — we'll be in touch.</span>
              </form>
            ` : ''}
          </div>
        </div>
      </div>
    </article>`;
  };

  return `
  <!-- Sticky brand rail (desktop only) -->
  <nav class="pp-rail" aria-label="Product navigation" id="pp-rail">
    ${products.map(p => `
      <a href="#${p.id}" data-pp-rail-target="${p.id}" aria-label="${p.name}">
        ${p.logo ? `<img src="${p.logo}" alt="" />` : `<span class="grid place-items-center" style="color:${p.accent}">${icon(p.glyph,"!w-[22px] !h-[22px]")}</span>`}
        <span class="pp-rail-label">${p.name}</span>
      </a>
    `).join("")}
  </nav>

  <section class="py-10 pb-6">
    <div class="container-x">
      <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div class="space-y-6 lg:col-span-6">
          ${eyebrow("Our Products")}
          <h1 class="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Built by Algorims, <span class="text-gradient">used in the wild</span>.</h1>
          <p class="text-lg leading-relaxed text-muted-foreground">Beyond consulting, we ship our own products — from an AWS-native operations automation platform for businesses to practical apps for farmers, travellers, and small businesses. Some are live today; one's almost ready.</p>

          <!-- Quick index -->
          <div class="flex flex-wrap gap-3 pt-2">
            ${products.map(p => `
              <a href="#${p.id}" class="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
                ${p.logo ? `<img src="${p.logo}" alt="" class="h-5 w-5 object-contain" />` : `<span class="grid h-5 w-5 place-items-center" style="color:${p.accent}">${icon(p.glyph,"!w-4 !h-4")}</span>`}
                ${p.name}
                <span class="inline-flex h-1.5 w-1.5 rounded-full ${p.live ? 'bg-green-500' : 'bg-amber-500'}"></span>
              </a>
            `).join("")}
          </div>
        </div>

        <div class="lg:col-span-6">
          ${radialOrbital()}
        </div>
      </div>
    </div>
  </section>

  <section class="py-8 lg:py-12">
    <div class="container-x space-y-8 lg:space-y-10">
      ${products.map((p, i) => productCard(p, i)).join("")}

      <div id="pp-more" class="hidden space-y-8 lg:space-y-10">
        ${moreProducts.map((p, i) => productCard(p, products.length + i)).join("")}
      </div>

      <div id="pp-more-trigger" class="flex justify-center pt-4">
        <button type="button" class="btn btn-outline btn-lg" onclick="document.getElementById('pp-more').classList.remove('hidden'); document.getElementById('pp-more-trigger').remove(); if(window.lucide) lucide.createIcons();">
          Load more products ${icon("chevron-down")}
        </button>
      </div>
    </div>
  </section>

  ${ctaBlock()}
  `;
}

function pageCCAF() {
  const DOMAIN_COLORS = [
    { h:"265 85% 58%", light:"265 85% 95%", name:"purple" },
    { h:"210 85% 52%", light:"210 85% 94%", name:"blue"   },
    { h:"155 65% 40%", light:"155 65% 93%", name:"green"  },
    { h:"38 90% 50%",  light:"38 90% 93%",  name:"amber"  },
    { h:"320 65% 52%", light:"320 65% 94%", name:"pink"   },
  ];
  const domains = [
    {
      num:"01", name:"Agentic Architecture & Orchestration", weight:27, tasks:7,
      summary:"Design agentic loops, orchestrate multi-agent systems with coordinator-subagent patterns, implement task decomposition, and manage session state and workflow enforcement.",
      taskStatements:[
        { id:"1.1", title:"Design and implement agentic loops", topics:"Agentic loop lifecycle · stop_reason (tool_use vs end_turn) · tool result appending · loop termination anti-patterns" },
        { id:"1.2", title:"Orchestrate multi-agent systems", topics:"Hub-and-spoke coordinator architecture · task decomposition · subagent delegation · result aggregation" },
        { id:"1.3", title:"Configure subagent invocation and context passing", topics:"Task tool · AgentDefinition · allowedTools · explicit context injection · parallel subagent spawning" },
        { id:"1.4", title:"Implement multi-step workflows with enforcement", topics:"Programmatic prerequisite gates · structured handoff summaries · enforcement vs prompt-based guidance" },
        { id:"1.5", title:"Apply Agent SDK hooks", topics:"PostToolUse hooks · tool call interception · data normalisation · deterministic compliance guarantees" },
        { id:"1.6", title:"Design task decomposition strategies", topics:"Prompt chaining vs dynamic decomposition · per-file analysis passes · open-ended investigation planning" },
        { id:"1.7", title:"Manage session state, resumption, and forking", topics:"--resume flag · fork_session · stale context detection · structured summary injection" },
      ]
    },
    {
      num:"02", name:"Tool Design & MCP Integration", weight:18, tasks:5,
      summary:"Design effective tool interfaces with clear boundaries, implement structured error responses, integrate MCP servers, and distribute tools appropriately across agents.",
      taskStatements:[
        { id:"2.1", title:"Design effective tool interfaces", topics:"Tool descriptions for LLM selection · input formats · edge cases · eliminating tool overlap · boundary explanations" },
        { id:"2.2", title:"Implement structured error responses for MCP tools", topics:"isError flag · errorCategory (transient/validation/permission) · isRetryable metadata · partial results" },
        { id:"2.3", title:"Distribute tools across agents and configure tool choice", topics:"Scoped tool access · tool_choice (auto / any / forced) · cross-role specialisation · constrained alternatives" },
        { id:"2.4", title:"Integrate MCP servers into Claude Code and agent workflows", topics:".mcp.json scoping · environment variable expansion · MCP resources · tool description enhancement" },
        { id:"2.5", title:"Select and apply built-in tools effectively", topics:"Grep vs Glob distinction · Read/Write vs Edit · incremental codebase exploration patterns" },
      ]
    },
    {
      num:"03", name:"Claude Code Configuration & Workflows", weight:20, tasks:6,
      summary:"Configure CLAUDE.md hierarchies, create custom slash commands, apply path-specific rules, know when to use plan mode, and integrate into CI/CD pipelines.",
      taskStatements:[
        { id:"3.1", title:"Configure CLAUDE.md files with hierarchy and modular organisation", topics:"User-level vs project-level vs directory-level · @import syntax · .claude/rules/ organisation" },
        { id:"3.2", title:"Create and configure custom slash commands and skills", topics:".claude/commands/ vs ~/.claude/commands/ · context: fork · allowed-tools · argument-hint frontmatter" },
        { id:"3.3", title:"Apply path-specific rules for conditional convention loading", topics:".claude/rules/ YAML frontmatter · glob patterns · cross-directory convention spanning" },
        { id:"3.4", title:"Determine when to use plan mode vs direct execution", topics:"Plan mode for architectural decisions · direct execution for well-scoped changes · Explore subagent" },
        { id:"3.5", title:"Apply iterative refinement techniques", topics:"Concrete examples · test-driven iteration · interview pattern · interacting vs independent issue handling" },
        { id:"3.6", title:"Integrate Claude Code into CI/CD pipelines", topics:"-p flag (non-interactive) · --output-format json · --json-schema · session isolation for code review" },
      ]
    },
    {
      num:"04", name:"Prompt Engineering & Structured Output", weight:20, tasks:6,
      summary:"Design prompts with explicit criteria, apply few-shot techniques, enforce structured output with JSON schemas, and implement validation and retry loops.",
      taskStatements:[
        { id:"4.1", title:"Design prompts with explicit criteria to reduce false positives", topics:"Specific categorical criteria · severity definitions with code examples · disabling high-FP categories" },
        { id:"4.2", title:"Apply few-shot prompting for consistency and quality", topics:"2–4 targeted examples · ambiguous-case demonstrations · hallucination reduction · format specification" },
        { id:"4.3", title:"Enforce structured output using tool use and JSON schemas", topics:"tool_use for schema compliance · tool_choice (auto/any/forced) · optional nullable fields · enum + detail patterns" },
        { id:"4.4", title:"Implement validation, retry, and feedback loops", topics:"Retry-with-error-feedback · retry effectiveness limits · semantic vs schema errors · detected_pattern tracking" },
        { id:"4.5", title:"Design efficient batch processing strategies", topics:"Message Batches API · 50% cost savings · 24h window · custom_id correlation · latency-tolerant workloads" },
        { id:"4.6", title:"Design multi-instance and multi-pass review architectures", topics:"Independent review instances · multi-pass local + cross-file analysis · self-review limitations" },
      ]
    },
    {
      num:"05", name:"Context Management & Reliability", weight:15, tasks:4,
      summary:"Preserve critical information across long interactions, design escalation patterns, manage error propagation in multi-agent systems, and handle uncertainty with confidence calibration.",
      taskStatements:[
        { id:"5.1", title:"Manage conversation context across long interactions", topics:"Case facts blocks · 'lost in the middle' mitigation · tool output trimming · progressive summarisation risks" },
        { id:"5.2", title:"Design escalation and ambiguity resolution patterns", topics:"Explicit escalation triggers · customer-requested escalation · multiple-match disambiguation · policy gap handling" },
        { id:"5.3", title:"Implement error propagation strategies across multi-agent systems", topics:"Structured error context · access failures vs empty results · local recovery · coverage annotations" },
        { id:"5.4", title:"Manage context in large codebase exploration", topics:"Context degradation · scratchpad files · subagent delegation · structured state persistence for crash recovery" },
      ]
    },
  ];

  const scenarios = [
    { num:"01", name:"Support automation",        domains:"1 · 2 · 5", desc:"Practice designing agents that resolve user requests, call tools, and escalate when confidence is low." },
    { num:"02", name:"Developer workflow",        domains:"3 · 5",     desc:"Practice configuring Claude Code, team conventions, and context management for codebase work." },
    { num:"03", name:"Research orchestration",    domains:"1 · 2 · 5", desc:"Practice coordinating specialist agents, tool access, source handling, and synthesis." },
    { num:"04", name:"Productivity automation",   domains:"2 · 3 · 1", desc:"Practice choosing tool boundaries, prompts, and workflows for repeated knowledge-work tasks." },
    { num:"05", name:"CI/CD assistance",          domains:"3 · 4",     desc:"Practice using structured output, review criteria, and non-interactive execution in pipelines." },
    { num:"06", name:"Document extraction",       domains:"4 · 5",     desc:"Practice schema design, validation, retry handling, and reliable context use for messy inputs." },
  ];

  const roadmap = [
    { step:"01", title:"Understand what Claude actually is", domains:[], desc:"Claude is Anthropic's AI model. This certification tests whether you can architect real systems with it — not just chat. Start at Anthropic Academy." },
    { step:"02", title:"Work through the Anthropic Skilljar catalog", domains:[], desc:"Skilljar hosts the full Academy catalog — from L100 foundations (Claude 101, AI Fluency) through L200 intermediate (MCP, Claude Code in Action, Bedrock, Vertex AI) to L300 advanced topics. Complete the tracks relevant to your role before attempting the certification." },
    { step:"03", title:"Deep-dive Domain 1 first (27%)", domains:[0], desc:"Agentic Architecture is the biggest slice of the certification. Master agentic loops, coordinator-subagent patterns, hooks, and session management." },
    { step:"04", title:"Study Domains 3 & 4 together (20% each)", domains:[2,3], desc:"Claude Code workflows and Prompt Engineering together cover 40% of scored content. Practice CI/CD integration and structured output with JSON schemas." },
    { step:"05", title:"Cover Domain 2 & 5 (18% + 15%)", domains:[1,4], desc:"Tool design, MCP integration, context management, and reliability patterns. Study scenario 1 (Customer Support) — it covers all three." },
    { step:"06", title:"Practice scenario-style questions", domains:[0,1,2,3,4], desc:"Use the scenario prompts below to test domain combinations. Build mini-projects for at least two workflows before sitting the certification." },
  ];

  const resources = [
    { icon:"key",            badge:"Register",  title:"Request Certification Access",  text:"Exclusive for Anthropic Partners. Register here to access the CCA-F — 60 MCQ, 120 min, $125/attempt.", href:"https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-access-request" },
    { icon:"award",          badge:"Skilljar",  title:"Take the Certification",        text:"Official CCA-F page on Anthropic's Partner Skilljar platform. Register and pay here, then watch for two Pearson VUE emails (username + temporary password) to schedule your exam — the test itself is delivered by Pearson, not on Skilljar.", href:"https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification" },
    { icon:"calendar-check", badge:"Pearson",   title:"Schedule Your Exam (Pearson VUE)", text:"After registering on Skilljar, sign in here to set your password and book online proctoring or an in-person test center slot. 60 MCQ, 120 minutes.", href:"https://pearsonvue.com/us/en/anthropic" },
    { icon:"sparkles",       badge:"L100",      title:"AI Fluency: Framework & Foundations", text:"Learn to collaborate with AI systems effectively, efficiently, ethically, and safely. For professionals and personal use.", href:"https://anthropic.skilljar.com/ai-fluency-framework-foundations" },
    { icon:"message-circle", badge:"L100",      title:"Claude 101",                    text:"Learn how to use Claude for everyday work tasks, understand core features, and explore resources for more advanced learning.", href:"https://anthropic.skilljar.com/claude-101" },
    { icon:"cloud",          badge:"L100",      title:"Claude with Amazon Bedrock",    text:"Introduction to Anthropic models on Bedrock — setup, authentication, prompt engineering and evaluations. First 4 sections.", href:"https://anthropic.skilljar.com/claude-in-amazon-bedrock" },
    { icon:"cloud",          badge:"L100",      title:"Claude with Google Cloud Vertex AI", text:"Introduction to Anthropic models on Vertex AI — setup, authentication, prompt engineering and evaluations. First 4 sections.", href:"https://anthropic.skilljar.com/claude-with-google-vertex" },
    { icon:"book-open",      badge:"L100",      title:"Building with the Claude API (Foundations)", text:"Authentication, basic prompting, and core functionality including prompt engineering and evaluations. First 4 sections.", href:"https://anthropic.skilljar.com/claude-with-the-anthropic-api" },
    { icon:"server",         badge:"L200",      title:"Introduction to Model Context Protocol", text:"Build MCP servers and clients from scratch using Python. Master tools, resources, and prompts to connect Claude with external services.", href:"https://anthropic.skilljar.com/introduction-to-model-context-protocol" },
    { icon:"cloud",          badge:"L200",      title:"Claude with Amazon Bedrock (Advanced)", text:"Advanced Bedrock topics including tool use, RAG, building agents, production patterns and optimization techniques.", href:"https://anthropic.skilljar.com/claude-in-amazon-bedrock" },
    { icon:"cloud",          badge:"L200",      title:"Claude with Google Cloud Vertex AI (Advanced)", text:"Advanced Vertex AI topics including tool use, RAG, building agents, production patterns and optimization techniques.", href:"https://anthropic.skilljar.com/claude-with-google-vertex" },
    { icon:"book-open",      badge:"L200",      title:"Building with the Claude API (Advanced)", text:"Advanced API topics including tool use, RAG, building agents, production patterns and optimization techniques.", href:"https://anthropic.skilljar.com/claude-with-the-anthropic-api" },
    { icon:"terminal",       badge:"L200",      title:"Claude Code in Action",         text:"Practical guide to integrating Claude Code into development workflows — context management, hooks, custom commands and the Agent SDK.", href:"https://anthropic.skilljar.com/claude-code-in-action" },
    { icon:"layers",         badge:"L300",      title:"Model Context Protocol: Advanced Topics", text:"Advanced MCP patterns including sampling, notifications, file system access, and transport mechanisms for production server development.", href:"https://anthropic.skilljar.com/model-context-protocol-advanced-topics" },
    { icon:"graduation-cap", badge:"Academy",   title:"Anthropic Academy",             text:"Official learning hub. Start here — complete the free course before anything else.", href:"https://www.anthropic.com/learn" },
    { icon:"code-2",         badge:"Docs",      title:"Claude API Documentation",      text:"Complete API reference for messages, tools, streaming, and model configuration.", href:"https://docs.anthropic.com" },
    { icon:"terminal",       badge:"Docs",      title:"Claude Code Docs",              text:"CLAUDE.md, slash commands, skills, plan mode, and CI/CD integration guide.", href:"https://docs.anthropic.com/en/docs/claude-code" },
    { icon:"network",        badge:"Spec",      title:"Model Context Protocol (MCP)",  text:"Official MCP specification — tool and resource interfaces for backend integration.", href:"https://modelcontextprotocol.io" },
    { icon:"cpu",            badge:"SDK",       title:"Claude Agent SDK",              text:"Build multi-agent systems with coordinator-subagent patterns and lifecycle hooks.", href:"https://docs.anthropic.com/en/docs/claude-code/sdk" },
  ];

  const examFacts = [
    { icon:"list-checks",     label:"Format",     value:"60 MCQ" },
    { icon:"clock",           label:"Duration",   value:"120 minutes" },
    { icon:"shield-check",    label:"Delivery",   value:"Pearson VUE — online or test center" },
    { icon:"trophy",          label:"Pass score", value:"720 (scaled 100–1,000)" },
    { icon:"dollar-sign",     label:"Price",      value:"$125 / attempt" },
    { icon:"layers",          label:"Domains",    value:"5 domains" },
  ];

  let showNotice = true;
  try {
    showNotice = localStorage.getItem("algorims-ccaf-notice-dismissed") !== "1";
  } catch (_) {}

  return `
  ${showNotice ? `
  <!-- ========== INDEPENDENCE NOTICE ========== -->
  <section data-ccaf-notice class="sticky top-16 z-30 border-y border-primary/20 bg-primary/10 backdrop-blur-md">
    <div class="container-x">
      <div class="flex items-start justify-between gap-4 py-3 text-sm leading-relaxed text-foreground">
        <div class="flex items-start gap-3">
        <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">${icon("info","!w-3.5 !h-3.5")}</span>
        <p><strong>Independent study overview.</strong> Algorims is not affiliated with or endorsed by Anthropic; trademarks belong to their owners.</p>
        </div>
        <button type="button" onclick="window.ccafDismissNotice()" class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground" aria-label="Dismiss notice">
          ${icon("x","!w-4 !h-4")}
        </button>
      </div>
    </div>
  </section>
  ` : ""}

  <!-- ========== HERO ========== -->
  <section class="relative ${showNotice ? "" : "-mt-24"} overflow-hidden pt-24 pb-16 lg:pt-28 lg:pb-24" style="background:radial-gradient(ellipse at 70% 0%, hsl(265 85% 58% / 0.10) 0%, transparent 55%), radial-gradient(ellipse at 20% 100%, hsl(280 95% 70% / 0.08) 0%, transparent 50%)">
    <div class="pointer-events-none absolute inset-0 grid-bg opacity-40"></div>
    <div class="container-x relative">
      <div class="grid items-start gap-12 lg:grid-cols-[1fr_auto]">
        <div class="max-w-2xl space-y-6 pt-6">
          ${eyebrow("CCA-F · Claude Certified Architect Foundations")}
          <h1 class="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Your <span class="text-gradient">passport</span> to building production AI with Claude.
          </h1>
          <p class="text-pretty text-lg leading-relaxed text-muted-foreground">
            CCA-F is designed to assess foundational Claude architecture knowledge for practitioners at Anthropic Partner companies. This overview summarizes the public study areas and points you to official Anthropic resources.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a href="#domains" onclick="event.preventDefault();document.getElementById('domains').scrollIntoView({behavior:'smooth',block:'start'})" class="btn btn-hero btn-xl">
              Explore the syllabus ${icon("arrow-down","!w-4 !h-4")}
            </a>
            <a href="#resources" onclick="event.preventDefault();document.getElementById('resources').scrollIntoView({behavior:'smooth',block:'start'})" class="btn btn-outline btn-xl">
              Study resources ${icon("arrow-right","!w-4 !h-4")}
            </a>
          </div>
        </div>
        <!-- Exam card visual -->
        <div class="hidden lg:block">
          <div class="relative w-96 rounded-3xl border border-border bg-card p-6 shadow-lg" style="box-shadow:0 0 60px hsl(265 85% 58% / 0.12)">
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-xl text-white" style="background:#d97757">
                ${icon("award","!w-5 !h-5")}
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Study overview</p>
                <p class="text-sm font-bold">CCA-F resources</p>
              </div>
            </div>
            <div class="my-5 h-px bg-border"></div>
            <div class="space-y-3">
              ${examFacts.map(f => `
                <div class="flex items-center justify-between text-sm">
                  <span class="flex items-center gap-2 text-muted-foreground">${icon(f.icon,"!w-3.5 !h-3.5")} ${f.label}</span>
                  <span class="font-semibold">${f.value}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ========== DOMAINS + SCENARIOS BOXES ========== -->
  <section class="pb-4 lg:pb-6">
    <div class="container-x">
      <div class="grid gap-5 md:grid-cols-2 items-stretch">
        <!-- Certification Domains box -->
        <div class="rounded-3xl border border-border bg-card p-5 flex flex-col">
          <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">Certification domains</p>
          <div class="flex flex-col flex-1 justify-between gap-2">
            ${domains.map((d,i) => `
              <div class="group/dcard rounded-xl px-3 py-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                style="background:hsl(${DOMAIN_COLORS[i].h} / 0.06);border:1px solid hsl(${DOMAIN_COLORS[i].h} / 0.15)"
                onclick="document.getElementById('domains').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>window.ccafToggle(${i}),600)">
                <div class="mb-1.5 flex items-center justify-between">
                  <span class="text-xs font-semibold">${d.name}</span>
                  <span class="text-xs font-bold opacity-0 group-hover/dcard:opacity-100 transition-opacity duration-200" style="color:hsl(${DOMAIN_COLORS[i].h})">${d.weight}%</span>
                </div>
                <div class="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div class="h-full rounded-full transition-all duration-500" style="width:${d.weight}%;background:hsl(${DOMAIN_COLORS[i].h})"></div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        <!-- Scenarios box -->
        <div class="rounded-3xl border border-border bg-card p-5 flex flex-col">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-xs font-semibold uppercase tracking-widest text-foreground">Scenarios</p>
            <span class="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">Practice prompts</span>
          </div>
          <div class="flex flex-col flex-1 justify-between gap-2">
            ${scenarios.map((s,i) => {
              const domainNums = s.domains.split("·").map(x => parseInt(x.trim()) - 1);
              const domainChips = domainNums.map(di => {
                return `<span class="rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap cursor-pointer transition-all duration-150 hover:scale-105 hover:shadow-sm"
                  style="background:hsl(${DOMAIN_COLORS[di].h} / 0.12);color:hsl(${DOMAIN_COLORS[di].h});border:1px solid hsl(${DOMAIN_COLORS[di].h} / 0.25)"
                  onclick="event.stopPropagation();document.getElementById('domains').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>window.ccafToggle(${di}),600)"
                >${domains[di].name.split(" ").slice(0,2).join(" ")}</span>`;
              }).join("");
              return `
              <div class="group/scard flex flex-col gap-1.5 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md border border-border bg-secondary/50"
                onclick="document.getElementById('scenario-${i}').scrollIntoView({behavior:'smooth',block:'center'})">
                <div class="flex items-center gap-2">
                  <span class="shrink-0 text-xs font-bold tabular-nums" style="color:hsl(${DOMAIN_COLORS[i % DOMAIN_COLORS.length].h})">${s.num}</span>
                  <p class="text-xs font-semibold leading-snug">${s.name}</p>
                </div>
                <div class="flex flex-wrap gap-1 pl-5">${domainChips}</div>
              </div>`;
            }).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ========== PLAIN ENGLISH ========== -->
  <section class="py-12 lg:py-16">
    <div class="container-x">
      ${eyebrow("In plain English")}
      <h2 class="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">What is the CCA-F certification, really?</h2>
      <p class="mt-3 max-w-2xl text-muted-foreground">No jargon. If you're new to AI certifications, start here.</p>
      <div class="mt-10 grid gap-5 md:grid-cols-3">
        <div class="rounded-3xl border border-border bg-card p-7">
          <div class="flex items-center gap-3 mb-4">
            <div class="shrink-0 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">${icon("award","!w-6 !h-6")}</div>
            <h3 class="text-lg font-semibold">What is Claude?</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">Claude is Anthropic's AI model — similar to ChatGPT but built for developers who want to embed AI into real products. Think of it as a very capable digital brain you can program to do complex tasks.</p>
        </div>
        <div class="rounded-3xl border border-border bg-card p-7">
          <div class="flex items-center gap-3 mb-4">
            <div class="shrink-0 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">${icon("shield-check","!w-6 !h-6")}</div>
            <h3 class="text-lg font-semibold">What does this certification assess?</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">It focuses on the systems <em>behind</em> an AI product — not just day-to-day chatbot use. Think: agent workflows, tool boundaries, structured output, and reliability tradeoffs.</p>
        </div>
        <div class="rounded-3xl border border-border bg-card p-7">
          <div class="flex items-center gap-3 mb-4">
            <div class="shrink-0 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">${icon("building-2","!w-6 !h-6")}</div>
            <h3 class="text-lg font-semibold">Who is this for?</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">Practitioners at <strong>Anthropic Partner companies</strong> ready to demonstrate applied expertise. Think developers, architects, and technical leads — ~301 level, hands-on Claude experience required.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ========== EXAM AT A GLANCE ========== -->

  <!-- ========== DOMAIN WEIGHT MAP ========== -->
  <section id="domains" class="py-12 lg:py-16">
    <div class="container-x">
      ${eyebrow("5 certification domains")}
      <div class="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <h2 class="text-3xl font-semibold tracking-tight md:text-4xl">Where your study time should go.</h2>
        <p class="text-sm text-muted-foreground">Weightages published by Anthropic</p>
      </div>
      <!-- Weight bars -->
      <div class="mt-10 space-y-4">
        ${domains.map((d,i) => `
          <button
            data-ccaf-domain="${i}"
            onclick="window.ccafToggle(${i})"
            class="group w-full rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            style="--dc:hsl(${DOMAIN_COLORS[i].h})"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-4 min-w-0">
                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white" style="background:hsl(${DOMAIN_COLORS[i].h})">${d.num}</span>
                <div class="min-w-0">
                  <p class="truncate font-semibold">${d.name}</p>
                  <p class="text-xs text-muted-foreground mt-0.5">${d.tasks} task statements</p>
                </div>
              </div>
              <div class="flex items-center gap-4 sm:shrink-0">
                <div class="w-32 lg:w-48">
                  <div class="h-2 overflow-hidden rounded-full bg-secondary">
                    <div class="h-full rounded-full transition-all duration-700" style="width:${d.weight}%;background:hsl(${DOMAIN_COLORS[i].h})"></div>
                  </div>
                </div>
                <span class="w-10 shrink-0 text-right text-lg font-bold" style="color:hsl(${DOMAIN_COLORS[i].h})">${d.weight}%</span>
                <span data-ccaf-chevron="${i}" class="shrink-0 text-muted-foreground transition-transform duration-200">${icon("chevron-down","!w-5 !h-5")}</span>
              </div>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground pl-14">${d.summary}</p>
            <!-- Expandable task statements -->
            <div data-ccaf-panel="${i}" class="ccaf-panel hidden mt-4 pl-14">
              <div class="rounded-xl border overflow-hidden" style="border-color:hsl(${DOMAIN_COLORS[i].h} / 0.25)">
                ${d.taskStatements.map((ts,ti) => `
                  <div class="border-b p-4 last:border-b-0 text-sm" style="border-color:hsl(${DOMAIN_COLORS[i].h} / 0.15);background:hsl(${DOMAIN_COLORS[i].h} / 0.04)">
                    <div class="flex items-start gap-3">
                      <span class="shrink-0 rounded px-1.5 py-0.5 text-xs font-bold text-white" style="background:hsl(${DOMAIN_COLORS[i].h})">${ts.id}</span>
                      <div>
                        <p class="font-semibold">${ts.title}</p>
                        <p class="mt-1 text-xs leading-relaxed text-muted-foreground">${ts.topics}</p>
                      </div>
                    </div>
                  </div>
                `).join("")}
              </div>
              <p class="mt-3 text-xs text-muted-foreground">Click anywhere on the card to collapse.</p>
            </div>
          </button>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- ========== EXAM SCENARIOS ========== -->
  <section class="py-12 lg:py-16 bg-secondary/40">
    <div class="container-x">
      ${eyebrow("Certification scenarios")}
      <h2 class="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Practice common production scenarios.</h2>
      <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Use these as study prompts for the major domain combinations. The official certification page remains the source of truth for exam structure.</p>
      <style>
        .ccaf-badge-wrap { position:relative; display:inline-block; }
        .ccaf-domain-tooltip {
          opacity:0;
          transform:translateY(6px) scale(0.97);
          pointer-events:none;
          transition:opacity 0.18s ease, transform 0.18s ease;
        }
        .ccaf-badge-wrap:hover .ccaf-domain-tooltip {
          opacity:1;
          transform:translateY(0) scale(1);
          pointer-events:auto;
        }
      </style>
      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        ${scenarios.map((s,i) => {
          const c = DOMAIN_COLORS[i % DOMAIN_COLORS.length];
          const domainNums = s.domains.split(' · ').map(n => parseInt(n.trim()) - 1);
          const tooltipRows = domainNums.map(di => `
            <div class="flex items-center gap-2.5 py-1">
              <span class="shrink-0 h-2 w-2 rounded-full" style="background:hsl(${DOMAIN_COLORS[di].h})"></span>
              <span class="shrink-0 text-xs font-bold" style="color:hsl(${DOMAIN_COLORS[di].h})">D${di+1}</span>
              <span class="text-xs leading-snug" style="color:hsl(${DOMAIN_COLORS[di].h} / 0.85)">${domains[di].name}</span>
            </div>
          `).join('');
          return `
          <div id="scenario-${i}" class="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md">
            <div class="flex items-start justify-between gap-3">
              <span class="text-3xl font-bold tracking-tight" style="color:hsl(${c.h})">${s.num}</span>
              <div class="ccaf-badge-wrap">
                <span class="cursor-help rounded-full border px-2.5 py-1 text-xs font-semibold select-none" style="color:hsl(${c.h});border-color:hsl(${c.h} / 0.3);background:hsl(${c.h} / 0.07)">Domain ${s.domains}</span>
                <div class="ccaf-domain-tooltip absolute right-0 top-full mt-2 z-50 min-w-max rounded-2xl border bg-card p-3 shadow-xl" style="border-color:hsl(${c.h} / 0.25);box-shadow:0 8px 32px hsl(${c.h} / 0.12)">
                  <p class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Domains tested</p>
                  ${tooltipRows}
                </div>
              </div>
            </div>
            <h3 class="mt-3 font-semibold leading-snug">${s.name}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">${s.desc}</p>
          </div>
          `;
        }).join("")}
      </div>
    </div>
  </section>

  <!-- ========== STUDY ROADMAP ========== -->
  <section class="py-12 lg:py-16">
    <div class="container-x">
      ${eyebrow("Study roadmap")}
      <h2 class="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">A practical study path, step by step.</h2>
      <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">No matter your background — developer, tech lead, or just curious — here's a study path that prioritises the highest-weight topics first.</p>
      <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        ${roadmap.map((r,i) => {
          const chips = r.domains.map(di =>
            `<span class="rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap cursor-pointer transition-all duration-150 hover:scale-105"
              style="background:hsl(${DOMAIN_COLORS[di].h} / 0.12);color:hsl(${DOMAIN_COLORS[di].h});border:1px solid hsl(${DOMAIN_COLORS[di].h} / 0.25)"
              onclick="document.getElementById('domains').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>window.ccafToggle(${di}),600)"
            >${domains[di].name.split(" ").slice(0,2).join(" ")}</span>`
          ).join("");
          return `
          <div class="relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md">
            <div class="flex items-start justify-between gap-3">
              <span class="text-4xl font-bold tracking-tight text-primary/20">${r.step}</span>
              ${chips ? `<div class="flex flex-wrap gap-1 justify-end">${chips}</div>` : ""}
            </div>
            <h3 class="mt-2 font-semibold leading-snug">${r.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">${r.desc}</p>
          </div>`;
        }).join("")}
      </div>
    </div>
  </section>

  <!-- ========== RESOURCES ========== -->
  <section id="resources" class="py-12 lg:py-16 bg-secondary/40">
    <div class="container-x">
      ${eyebrow("Study resources")}
      <h2 class="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Everything you need to prepare.</h2>
      <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">All links go to official Anthropic sources. Start with the access request, then the Academy course — everything else builds on those.</p>
      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        ${resources.map(r => {
          const highlightClass = r.badge === "Register" || r.badge === "Skilljar" ? "border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10" : "border-border bg-card";
          return `
          <a href="${r.href}" target="_blank" rel="noopener noreferrer" class="group flex flex-col rounded-2xl border ${highlightClass} p-6 transition-all hover:border-primary/40 hover:shadow-md">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="shrink-0 grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">${icon(r.icon,"!w-5 !h-5")}</div>
                <h3 class="font-semibold leading-snug">${r.title}</h3>
              </div>
              <div class="shrink-0 flex flex-col items-end gap-1">
                ${r.badge.startsWith("L") ? `
                  <span class="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">Skilljar</span>
                  <span class="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">${r.badge}</span>
                ` : `
                  <span class="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">${r.badge}</span>
                `}
              </div>
            </div>
            <p class="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">${r.text}</p>
            <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">Open ${icon("arrow-up-right","!w-4 !h-4")}</span>
          </a>
          `;
        }).join("")}
      </div>
    </div>
  </section>

  <!-- ========== PREREQUISITES ========== -->
  <section class="py-12 lg:py-16">
    <div class="container-x">
      <div class="rounded-3xl border border-border bg-card p-8 lg:p-10">
        <div class="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            ${eyebrow("Before you register")}
            <h2 class="mt-3 text-2xl font-semibold tracking-tight">Who is this certification built for?</h2>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">The CCA-F is exclusive to practitioners at <strong>Anthropic Partner companies</strong> — a ~301 level certification for those with foundational knowledge who are ready to demonstrate deeper, applied expertise in Claude systems.</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            ${[
              { icon:"code-2",     title:"Python or TypeScript", desc:"The exam scenarios assume you can read and reason about code. You don't need to memorise syntax, but you need to understand it." },
              { icon:"braces",     title:"Comfortable with JSON", desc:"Tool schemas, API payloads, and structured output all use JSON. You should be able to read and write it without looking it up." },
              { icon:"hard-hat",   title:"Anthropic Partner company", desc:"Access is restricted to practitioners at verified Anthropic Partner organisations. Not yet a partner? Apply at anthropic.com/partners." },
              { icon:"lightbulb",  title:"Architectural thinking", desc:"This exam is about tradeoffs and decisions, not memorisation. If you've designed systems — even small ones — you'll find this natural." },
            ].map(p => `
              <div class="flex gap-4 rounded-2xl border border-border bg-background/60 p-5">
                <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">${icon(p.icon,"!w-5 !h-5")}</div>
                <div>
                  <p class="font-semibold text-sm">${p.title}</p>
                  <p class="mt-1 text-xs leading-relaxed text-muted-foreground">${p.desc}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ========== CTA BAND ========== -->
  <section class="py-12 lg:py-16">
    <div class="container-x">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-dark p-10 text-white shadow-lg md:p-14">
        <style>
          .ccaf-dark-outline:hover {
            background: rgba(255, 255, 255, 0.14) !important;
            border-color: rgba(255, 255, 255, 0.55) !important;
            color: #fff !important;
          }
        </style>
        <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20" style="background:radial-gradient(circle, hsl(var(--primary-glow)), transparent)"></div>
        <div class="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div class="max-w-lg">
            <div class="flex items-center gap-3 mb-3">
              <div class="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                ${icon("award","!w-5 !h-5")}
              </div>
              <p class="text-xs font-semibold uppercase tracking-widest opacity-60">Certification resource</p>
            </div>
            <h2 class="text-3xl font-semibold leading-snug md:text-4xl">Use the official Skilljar pages when you register.</h2>
            <div class="mt-5 flex flex-wrap gap-2">
              ${[
                ["users", "Anthropic Partners"],
                ["list-checks", "60 MCQ"],
                ["clock", "120 minutes"],
                ["shield-check", "Pearson VUE — online or test center"],
                ["dollar-sign", "$125 per attempt"],
                ["award", "Digital certificate"],
              ].map(([ic, label]) => `
                <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85 backdrop-blur">
                  ${icon(ic,"!w-3.5 !h-3.5")}
                  ${label}
                </span>
              `).join("")}
            </div>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row">
            <a href="https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-access-request" target="_blank" rel="noopener noreferrer" class="btn btn-hero btn-xl whitespace-nowrap">
              Request access ${icon("arrow-up-right","!w-4 !h-4")}
            </a>
            <a href="https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xl whitespace-nowrap ccaf-dark-outline" style="color:white;border-color:rgba(255,255,255,0.3)">
              Take the certification ${icon("award","!w-4 !h-4")}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  `;
}

// Domain accordion — defined at module level so onclick="window.ccafToggle(i)" works
// after innerHTML injection (inline <script> tags in injected HTML don't execute).
window.ccafDismissNotice = function() {
  try {
    localStorage.setItem("algorims-ccaf-notice-dismissed", "1");
  } catch (_) {}
  var notice = document.querySelector("[data-ccaf-notice]");
  if (notice) notice.remove();
};

window.ccafOpen = new Set();
window.ccafToggle = function(i) {
  var panel = document.querySelector('[data-ccaf-panel="'+i+'"]');
  var chevron = document.querySelector('[data-ccaf-chevron="'+i+'"]');
  if (!panel) return;
  var isOpen = !panel.classList.contains('hidden');
  // Close all open panels first
  window.ccafOpen.forEach(function(j) {
    var p = document.querySelector('[data-ccaf-panel="'+j+'"]');
    var c = document.querySelector('[data-ccaf-chevron="'+j+'"]');
    if (p) p.classList.add('hidden');
    if (c) c.style.transform = '';
  });
  window.ccafOpen.clear();
  // If it wasn't open, open it
  if (!isOpen) {
    panel.classList.remove('hidden');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
    window.ccafOpen.add(i);
  }
};

function pageContact() {
  return `
  <section class="py-10 pb-0">
    <div class="container-x">
      <div class="max-w-3xl space-y-6">
        ${eyebrow("Contact")}
        <h1 class="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Let's build your <span class="text-gradient">agentic future</span>.</h1>
        <p class="text-lg leading-relaxed text-muted-foreground">Tell us about your goals. We'll get back within one business day with next steps and a recommended consultation.</p>
      </div>
    </div>
  </section>

  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="grid gap-10 md:grid-cols-12">
        <aside class="md:col-span-4 space-y-4">
          ${[
            {icon:"mail",   title:"Email",       value:"contactus@algorims.com", href:"mailto:contactus@algorims.com"},
            {icon:"phone",  title:"Phone",       value:"+65 8345 9599",         href:"tel:+6583459599"},
          ].map(c => `
            <a href="${c.href}" class="block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md">
              <div class="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">${icon(c.icon,"!w-5 !h-5")}</div>
              <p class="mt-4 text-xs uppercase tracking-widest text-muted-foreground">${c.title}</p>
              <p class="mt-1 font-medium">${c.value}</p>
            </a>
          `).join("")}

          <div class="rounded-2xl border border-border bg-card p-6">
            <div class="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">${icon("building-2","!w-5 !h-5")}</div>
            <p class="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Headquarters</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">Singapore</p>
            <p class="mt-1 text-sm leading-relaxed text-muted-foreground">2 Central Boulevard, #32-01<br/>IOI Central Boulevard Towers<br/>Singapore 018916</p>
          </div>

          <div class="rounded-2xl border border-border bg-card p-6">
            <div class="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">${icon("map-pin","!w-5 !h-5")}</div>
            <p class="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Branches</p>
            <ul class="mt-3 space-y-4 text-sm">
              <li>
                <p class="text-xs font-semibold uppercase tracking-wider text-primary">Tirupati, India</p>
                <p class="mt-1 leading-relaxed text-muted-foreground">STPI, Survey No. 234, Padmavathipuram, Beside Mahilapranganam, Tiruchanur Road, Tirupati, AP 517503</p>
              </li>
              <li>
                <p class="text-xs font-semibold uppercase tracking-wider text-primary">Bengaluru, India</p>
                <p class="mt-1 leading-relaxed text-muted-foreground">2nd Floor, No 29/1, SK Mapple Hoskote Rd, Whitefield, Kadugodi, Bengaluru, Karnataka 560067</p>
              </li>
            </ul>
          </div>

          <div class="rounded-2xl border border-primary/30 bg-primary/5 p-6">
            <p class="text-sm font-semibold text-primary">Free consultation</p>
            <p class="mt-2 text-sm text-muted-foreground">A 30-minute working session with one of our principal engineers to scope your initiative.</p>
          </div>
        </aside>

        <div class="md:col-span-8">
          <form id="contact-form" class="rounded-3xl border border-border bg-card p-8 md:p-10" novalidate>
            <div id="contact-success" class="hidden py-10 text-center">
              <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">${icon("check","!w-7 !h-7")}</div>
              <h3 class="mt-5 text-2xl font-semibold">Thanks — message received</h3>
              <p class="mt-2 text-muted-foreground">We'll reply within one business day.</p>
              <button type="button" id="contact-reset" class="btn btn-outline btn-default mt-6 rounded-full">Send another message</button>
            </div>
            <div id="contact-fields" class="space-y-5">
              <div class="grid gap-5 md:grid-cols-2">
                <div class="space-y-2">
                  <label for="name" class="text-sm font-medium">Name</label>
                  <input id="name" name="name" class="field" placeholder="Your full name" maxlength="100" />
                  <p data-error="name" class="text-xs text-destructive hidden"></p>
                </div>
                <div class="space-y-2">
                  <label for="email" class="text-sm font-medium">Work email</label>
                  <input id="email" name="email" type="email" class="field" placeholder="you@company.com" maxlength="255" />
                  <p data-error="email" class="text-xs text-destructive hidden"></p>
                </div>
              </div>
              <div class="grid gap-5 md:grid-cols-2">
                <div class="space-y-2">
                  <label for="company" class="text-sm font-medium">Company (optional)</label>
                  <input id="company" name="company" class="field" placeholder="Company name" maxlength="120" />
                </div>
                <div class="space-y-2">
                  <label for="service" class="text-sm font-medium">Service you're interested in</label>
                  <select id="service" name="service" class="field">
                    <option value="">Select a service…</option>
                    <option value="Cloud">Cloud</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Development">Development</option>
                    <option value="AI">AI</option>
                    <option value="Data and ML">Data and ML</option>
                  </select>
                  <p data-error="service" class="text-xs text-destructive hidden"></p>
                </div>
              </div>
              <div class="space-y-2">
                <label for="message" class="text-sm font-medium">How can we help?</label>
                <textarea id="message" name="message" rows="9" maxlength="1000" class="field" placeholder="Tell us about your goals, timelines, and stack."></textarea>
                <p data-error="message" class="text-xs text-destructive hidden"></p>
              </div>
              <button type="submit" class="btn btn-hero btn-lg w-full md:w-auto">Send message ${icon("send")}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `;
}

/* ---------- Support ---------- */
const SUPPORT_PORTAL = "https://algorims.zohodesk.com.au/portal";
const SUPPORT_EMAIL  = "support@algorims.com";

function pageSupport() {
  const options = [
    { icon:"mail", title:"Email Support", text:"For technical issues and service requests.",
      foot:`<a href="mailto:${SUPPORT_EMAIL}" class="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">${SUPPORT_EMAIL}</a>` },
    { icon:"log-in", title:"Customer Portal", text:"Track tickets, reply to engineers, and view ticket status.",
      foot:`<a href="${SUPPORT_PORTAL}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-default rounded-full">Client Login ${icon("arrow-up-right","!w-4 !h-4")}</a>` },
    { icon:"ticket", title:"Submit a Ticket", text:"Create a support request directly from the website.",
      foot:`<a href="/support#support-form" class="btn btn-hero btn-default">Create Ticket ${icon("arrow-right","!w-4 !h-4")}</a>` },
  ];

  const categories = ["AlgoRide","AlgoKisan","AI & Generative AI","Data & Analytics","AWS Cloud Services","DevOps & Platform Engineering","Application Development","Managed Services","Security & Compliance","Billing & Subscription","Sales Inquiry","General Inquiry"];
  const priorities = ["Low","Medium","High","Critical"];

  const sla = [
    { level:"Critical", dot:"0 84% 60%",  desc:"Production outage or direct business impact." },
    { level:"High",     dot:"30 95% 55%", desc:"A major function is affected." },
    { level:"Medium",   dot:"265 85% 58%",desc:"Partial issue with a workaround available." },
    { level:"Low",      dot:"260 10% 55%",desc:"General query or information request." },
  ];

  return `
  <!-- Hero -->
  <section class="relative overflow-hidden py-12 lg:py-16">
    <div class="pointer-events-none absolute inset-0 grid-bg opacity-60"></div>
    <div class="container-x relative">
      <div class="max-w-3xl space-y-6">
        ${eyebrow("Support")}
        <h1 class="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Need technical <span class="text-gradient">support</span>?</h1>
        <p class="text-pretty text-lg leading-relaxed text-muted-foreground">Reach the Algorims support team for AWS, DevOps, Kubernetes, security, backup, cloud migration, and infrastructure issues.</p>
        <div class="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
          <a href="/support#support-form" class="btn btn-hero btn-xl">Raise a Support Ticket ${icon("arrow-right","!w-4 !h-4")}</a>
          <a href="${SUPPORT_PORTAL}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xl">${icon("log-in","!w-4 !h-4")} Client Login</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Support options -->
  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="grid gap-6 md:grid-cols-3">
        ${options.map(o => `
          <div class="flex flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:border-primary/30 hover:shadow-md">
            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">${icon(o.icon,"!w-6 !h-6")}</div>
            <h3 class="mt-5 text-xl font-semibold">${o.title}</h3>
            <p class="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">${o.text}</p>
            <div class="mt-5 pt-1">${o.foot}</div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Support request form -->
  <section id="support-form" class="scroll-mt-28 py-10 lg:py-14">
    <div class="container-x">
      <div class="grid gap-10 lg:grid-cols-12">
        <div class="lg:col-span-5 space-y-6">
          ${sectionHeader({ eyebrow:"Submit a ticket", title:"Tell us what's going on", align:"left",
            description:"Fill out the form and our engineers will get back to you within the SLA for the priority you select." })}
          <ul class="space-y-4">
            ${[
              {icon:"shield-check", t:"Secure handling", d:"Your request is routed straight to the Algorims support queue."},
              {icon:"users", t:"Real engineers", d:"Tickets are triaged and answered by the team that runs your infrastructure."},
              {icon:"clock", t:"Tracked end-to-end", d:"Follow status, replies, and resolution in the customer portal."},
            ].map(f => `
              <li class="flex gap-3.5">
                <span class="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">${icon(f.icon,"!w-5 !h-5")}</span>
                <div><p class="font-medium">${f.t}</p><p class="text-sm leading-relaxed text-muted-foreground">${f.d}</p></div>
              </li>
            `).join("")}
          </ul>
        </div>

        <div class="lg:col-span-7">
          <form id="support-form-el" class="rounded-3xl border border-border bg-card p-7 md:p-9" novalidate>
            <div id="support-success" class="hidden py-10 text-center">
              <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">${icon("check","!w-7 !h-7")}</div>
              <h3 class="mt-5 text-2xl font-semibold">Ticket details ready</h3>
              <p class="mx-auto mt-2 max-w-md text-muted-foreground">We've prepared your request for <span class="font-medium text-foreground">${SUPPORT_EMAIL}</span>. You can also track everything in the customer portal.</p>
              <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="${SUPPORT_PORTAL}" target="_blank" rel="noopener noreferrer" class="btn btn-hero btn-default">Open customer portal ${icon("arrow-up-right","!w-4 !h-4")}</a>
                <button type="button" id="support-reset" class="btn btn-outline btn-default rounded-full">Submit another ticket</button>
              </div>
            </div>

            <div id="support-fields" class="space-y-5">
              <div class="grid gap-5 md:grid-cols-2">
                <div class="space-y-2">
                  <label for="s-name" class="text-sm font-medium">Full name <span class="text-destructive">*</span></label>
                  <input id="s-name" name="name" class="field" placeholder="Your full name" maxlength="100" />
                  <p data-error="name" class="text-xs text-destructive hidden"></p>
                </div>
                <div class="space-y-2">
                  <label for="s-company" class="text-sm font-medium">Company name <span class="text-destructive">*</span></label>
                  <input id="s-company" name="company" class="field" placeholder="Company name" maxlength="120" />
                  <p data-error="company" class="text-xs text-destructive hidden"></p>
                </div>
              </div>

              <div class="grid gap-5 md:grid-cols-2">
                <div class="space-y-2">
                  <label for="s-email" class="text-sm font-medium">Email address <span class="text-destructive">*</span></label>
                  <input id="s-email" name="email" type="email" class="field" placeholder="you@company.com" maxlength="255" />
                  <p data-error="email" class="text-xs text-destructive hidden"></p>
                </div>
                <div class="space-y-2">
                  <label for="s-phone" class="text-sm font-medium">Phone number</label>
                  <input id="s-phone" name="phone" type="tel" class="field" placeholder="+1 555 000 0000" maxlength="40" />
                </div>
              </div>

              <div class="space-y-2">
                <label for="s-subject" class="text-sm font-medium">Subject <span class="text-destructive">*</span></label>
                <input id="s-subject" name="subject" class="field" placeholder="Short summary of the issue" maxlength="160" />
                <p data-error="subject" class="text-xs text-destructive hidden"></p>
              </div>

              <div class="grid gap-5 md:grid-cols-2">
                <div class="space-y-2">
                  <label for="s-category" class="text-sm font-medium">Category <span class="text-destructive">*</span></label>
                  <select id="s-category" name="category" class="field">
                    <option value="">Select a category…</option>
                    ${categories.map(c => `<option value="${c}">${c}</option>`).join("")}
                  </select>
                  <p data-error="category" class="text-xs text-destructive hidden"></p>
                </div>
                <div class="space-y-2">
                  <label for="s-priority" class="text-sm font-medium">Priority <span class="text-destructive">*</span></label>
                  <select id="s-priority" name="priority" class="field">
                    <option value="">Select a priority…</option>
                    ${priorities.map(p => `<option value="${p}">${p}</option>`).join("")}
                  </select>
                  <p data-error="priority" class="text-xs text-destructive hidden"></p>
                </div>
              </div>

              <div class="space-y-2">
                <label for="s-description" class="text-sm font-medium">Description <span class="text-destructive">*</span></label>
                <textarea id="s-description" name="description" rows="7" maxlength="2000" class="field" placeholder="Describe the issue, when it started, affected systems, and any error messages."></textarea>
                <p data-error="description" class="text-xs text-destructive hidden"></p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Attachment</label>
                <label for="s-attachment" class="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-3.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                  ${icon("paperclip","!w-4 !h-4")}
                  <span id="s-attachment-label">Attach a screenshot, log, or document (optional)</span>
                  <input id="s-attachment" name="attachment" type="file" class="hidden" />
                </label>
              </div>

              <button type="submit" class="btn btn-hero btn-lg w-full md:w-auto">Create Support Ticket ${icon("send","!w-4 !h-4")}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Support hours + SLA -->
  <section class="py-10 lg:py-14">
    <div class="container-x">
      <div class="grid gap-6 lg:grid-cols-12">
        <!-- Hours -->
        <div class="lg:col-span-4">
          <div class="h-full rounded-3xl border border-border bg-card p-7">
            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">${icon("clock","!w-6 !h-6")}</div>
            <h3 class="mt-5 text-xl font-semibold">Support hours</h3>
            <dl class="mt-5 space-y-4 text-sm">
              <div class="flex items-center justify-between border-b border-border pb-4">
                <dt class="text-muted-foreground">Monday – Friday</dt>
                <dd class="font-medium">9:00 AM – 6:00 PM IST</dd>
              </div>
              <div class="flex items-start gap-2.5 text-muted-foreground">
                ${icon("zap","!w-4 !h-4 mt-0.5 text-primary")}
                <span class="text-pretty">Emergency support available around the clock for active support customers.</span>
              </div>
            </dl>
          </div>
        </div>

        <!-- SLA / priority -->
        <div class="lg:col-span-8">
          <div class="h-full rounded-3xl border border-border bg-card p-7">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold">Priority &amp; response</h3>
                <p class="mt-1 text-sm text-muted-foreground">How we classify and respond to incoming tickets.</p>
              </div>
              <span class="hidden shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary sm:grid sm:place-items-center">${icon("gauge","!w-5 !h-5")}</span>
            </div>
            <div class="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border">
              ${sla.map(s => `
                <div class="flex items-center gap-4 px-5 py-4">
                  <span class="inline-flex w-24 shrink-0 items-center gap-2 text-sm font-semibold">
                    <span class="h-2.5 w-2.5 rounded-full" style="background:hsl(${s.dot})"></span>${s.level}
                  </span>
                  <span class="text-sm leading-relaxed text-muted-foreground">${s.desc}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact strip -->
  <section class="py-10 lg:py-16">
    <div class="container-x">
      <div class="relative overflow-hidden rounded-3xl border border-border bg-gradient-dark p-8 md:p-12">
        <div class="pointer-events-none absolute inset-0 surface-mesh opacity-40"></div>
        <div class="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div class="space-y-3 text-white">
            <h3 class="text-balance text-3xl font-semibold leading-tight md:text-4xl">Still need a hand?</h3>
            <p class="max-w-xl text-pretty leading-relaxed text-white/70">Email us directly or visit the Algorims website to learn more about what we do.</p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row">
            <a href="mailto:${SUPPORT_EMAIL}" class="btn btn-hero btn-lg">${icon("mail","!w-4 !h-4")} ${SUPPORT_EMAIL}</a>
            <a href="https://algorims.com" target="_blank" rel="noopener noreferrer" class="btn btn-lg rounded-full border border-white/25 text-white transition-colors hover:bg-white/10">algorims.com ${icon("arrow-up-right","!w-4 !h-4")}</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}

/* ---------- Router ---------- */
const SITE_ORIGIN = "https://www.algorims.com";
const DEFAULT_DESC = "Algorims builds autonomous, agentic AI systems for the enterprise — AI & Generative AI, Data & Analytics, AWS cloud, DevOps, and managed services that unlock the value buried in your data.";
const ROUTES = {
  "/":            { title: "Algorims — The Future of Enterprise Is Autonomous. We Build It.", description: DEFAULT_DESC, render: pageHome },
  "/about":       { title: "About — Algorims",        description: "Algorims is an AWS Advanced Consulting Partner engineering autonomous AI, data, and cloud systems for the enterprise.", render: pageAbout },
  "/services":    { title: "Services — Algorims",     description: "AI & Generative AI, Data & Analytics, AWS cloud engineering, DevOps, application development and managed services from Algorims.", render: pageServices },
  "/products":    { title: "Products — Algorims",     description: "Explore Algorims products — AI-powered platforms that turn enterprise data into autonomous, measurable outcomes.", render: pageProducts },
  "/agentic-ai":  { title: "Agentic AI — Algorims",   description: "Beyond automation: Algorims builds agentic AI systems that reason, decide, and act autonomously on Amazon Nova, Kendra and S3 Vectors.", render: pageAgenticAI },
  "/case-studies":{ title: "Case Studies — Algorims", description: "Real-world results from Algorims — agentic AI, cloud, and data engineering case studies with measured business impact.", render: pageCaseStudies },
  "/blog":        { title: "Blog — Algorims",         description: "Insights on agentic AI, MLOps, AWS cloud, and DevOps engineering from the Algorims team.", render: pageBlog },
  "/cca-f":       { title: "CCA-F Study Overview — Algorims", description: "Independent CCA-F study overview with domain summaries, preparation roadmap, and official Anthropic learning links.", render: pageCCAF },
  "/contact":     { title: "Contact — Algorims",      description: "Get in touch with Algorims to scope your AI, cloud, or DevOps initiative. Most engagements start with a 30-minute conversation.", render: pageContact },
  "/support":     { title: "Support — Algorims",      description: "Algorims support — submit a ticket or reach our engineers for AWS, DevOps, security, and infrastructure issues.", render: pageSupport },
};

const NAV_LINKS = [
  { to: "/",            label: "Home" },
  { to: "/services",    label: "Services" },
  { to: "/products",    label: "Products", hasDropdown: "products" },
  { to: "/agentic-ai",  label: "Agentic AI" },
  { to: "/cca-f",       label: "Claude" },
  { to: "/case-studies",label: "Resources", hasDropdown: "resources" },
  { to: "/about",       label: "Company", hasDropdown: "company" },
];

const PRODUCT_MENU = [
  { name: "CXIQ", slug: "cxiq", desc: "Conversational admin automation on WhatsApp & email" },
  { name: "DocIQ", slug: "dociq", desc: "Intelligent document processing with confidence routing" },
  { name: "OpsIQ", slug: "opsiq", desc: "Autonomous L1 service desk and IT operations" },
  { name: "PayIQ", slug: "payiq", desc: "AI-native accounts payable for Xero & Zoho Books" },
];

const RESOURCES_MENU = [
  { name: "Case Studies", href: "/case-studies", desc: "Real deployments, real outcomes", icon: "layout-grid" },
  { name: "Blog", href: "/blog", desc: "Ideas, guides, and updates", icon: "newspaper" },
];

const COMPANY_MENU = [
  { name: "About", href: "/about", desc: "Who we are and what we build", icon: "building-2" },
  { name: "Support", href: "/support", desc: "Get help or open a ticket", icon: "life-buoy" },
];

function currentPath() {
  let path = location.pathname || "/";
  // Treat /services/ the same as /services
  if (path.length > 1) path = path.replace(/\/+$/, "");
  if (path === "") path = "/";
  if (ROUTES[path]) return path;
  // Dynamic blog post route: /blog/<slug>
  const blogIdx = path.indexOf("/blog/");
  if (blogIdx !== -1) return path.slice(blogIdx).replace(/\/index\.html$/, "").replace(/\/+$/, "");
  // Dynamic solution detail route: /solutions/<slug>
  const solIdx = path.indexOf("/solutions/");
  if (solIdx !== -1) return path.slice(solIdx).replace(/\/index\.html$/, "").replace(/\/+$/, "");
  // Dynamic product detail route: /products/<slug>
  const prodIdx = path.indexOf("/products/");
  if (prodIdx !== -1) return path.slice(prodIdx).replace(/\/index\.html$/, "").replace(/\/+$/, "");
  // Dynamic case study detail route: /case-studies/<slug>
  const csIdx = path.indexOf("/case-studies/");
  if (csIdx !== -1) return path.slice(csIdx).replace(/\/index\.html$/, "").replace(/\/+$/, "");
  // When served from a sandboxed/nested origin (preview), pathname carries a
  // prefix before the real site path — match by suffix against known routes.
  for (const route of Object.keys(ROUTES)) {
    if (route === "/") continue;
    if (path.endsWith(route) || path.endsWith(route + "/index.html") || path.endsWith(route + "/")) return route;
  }
  return "/";
}

function currentAnchor() {
  return location.hash.replace(/^#/, "");
}

/* Programmatic navigation via the History API (real URLs, no page reload) */
function navigateTo(href) {
  const url = new URL(href, location.href);
  if (url.origin !== location.origin) { window.location.href = href; return; }
  const samePage = url.pathname === location.pathname;
  history.pushState({}, "", url.pathname + url.search + url.hash);
  navigate();
}

function renderNav() {
  const path = currentPath();
  const activeKey = path.startsWith("/blog") || path.startsWith("/case-studies") ? "/case-studies"
    : path.startsWith("/support") ? "/about"
    : path;
  const navLabel = (l) => l.to === "/cca-f"
    ? `${l.label}<span class="nav-new-badge" aria-label="New content">New</span>`
    : l.label;
  document.getElementById("nav-links").innerHTML = NAV_LINKS.map(l => {
    if (l.hasDropdown === "products") {
      const menuItems = PRODUCT_MENU.map(pm => {
        const prod = (typeof PRODUCTS !== "undefined") ? PRODUCTS.find(p => p.slug === pm.slug) : null;
        const accent = prod ? prod.accent : "hsl(var(--primary))";
        return `<a href="/products/${pm.slug}" class="flex flex-col gap-2 rounded-lg px-3 py-3 hover:bg-secondary/50 transition-colors">
          <span class="grid h-8 w-8 place-items-center rounded-lg" style="background:${accent}1a;color:${accent}">
            ${prod && prod.logo ? `<img src="${prod.logo}" alt="" class="h-4 w-4 object-contain" />` : prod ? icon(prod.glyph, "!w-4 !h-4") : ""}
          </span>
          <div class="font-medium text-sm text-foreground">${pm.name}</div>
          <div class="text-xs leading-snug text-muted-foreground">${pm.desc}</div>
        </a>`;
      }).join("");
      return `
        <div class="group relative">
          <a href="${l.to}" class="nav-link inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${activeKey === l.to ? "nav-link-active" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"}">
            ${navLabel(l)} <i data-lucide="chevron-down" class="!w-4 !h-4 transition-transform group-hover:rotate-180"></i>
          </a>
          <div class="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div class="grid grid-cols-2 gap-1 rounded-lg border border-border bg-card shadow-lg overflow-hidden p-1 w-96">
              ${menuItems}
            </div>
          </div>
        </div>
      `;
    }
    if (l.hasDropdown === "resources") {
      const menuItems = RESOURCES_MENU.map(rm => `
        <a href="${rm.href}" class="flex flex-col gap-2 rounded-lg px-3 py-3 hover:bg-secondary/50 transition-colors">
          <span class="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">${icon(rm.icon, "!w-4 !h-4")}</span>
          <div class="font-medium text-sm text-foreground">${rm.name}</div>
          <div class="text-xs leading-snug text-muted-foreground">${rm.desc}</div>
        </a>
      `).join("");
      return `
        <div class="group relative">
          <a href="${l.to}" class="nav-link inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${activeKey === l.to ? "nav-link-active" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"}">
            ${navLabel(l)} <i data-lucide="chevron-down" class="!w-4 !h-4 transition-transform group-hover:rotate-180"></i>
          </a>
          <div class="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div class="grid grid-cols-2 gap-1 rounded-lg border border-border bg-card shadow-lg overflow-hidden p-1 w-72">
              ${menuItems}
            </div>
          </div>
        </div>
      `;
    }
    if (l.hasDropdown === "company") {
      const menuItems = COMPANY_MENU.map(cm => `
        <a href="${cm.href}" class="flex flex-col gap-2 rounded-lg px-3 py-3 hover:bg-secondary/50 transition-colors">
          <span class="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">${icon(cm.icon, "!w-4 !h-4")}</span>
          <div class="font-medium text-sm text-foreground">${cm.name}</div>
          <div class="text-xs leading-snug text-muted-foreground">${cm.desc}</div>
        </a>
      `).join("");
      return `
        <div class="group relative">
          <a href="${l.to}" class="nav-link inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${activeKey === l.to ? "nav-link-active" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"}">
            ${navLabel(l)} <i data-lucide="chevron-down" class="!w-4 !h-4 transition-transform group-hover:rotate-180"></i>
          </a>
          <div class="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div class="grid grid-cols-2 gap-1 rounded-lg border border-border bg-card shadow-lg overflow-hidden p-1 w-72">
              ${menuItems}
            </div>
          </div>
        </div>
      `;
    }
    return `
      <a href="${l.to}" class="nav-link inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${activeKey === l.to ? "nav-link-active" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"}">${navLabel(l)}</a>
    `;
  }).join("");
  document.getElementById("mobile-nav-links").innerHTML = NAV_LINKS.map(l => `
    <a href="${l.to}" class="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${activeKey === l.to ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}">${navLabel(l)}</a>
  `).join("");
}

function bindJourneyTimeline() {
  const els = document.querySelectorAll('[data-journey]');
  if (!els.length) return;
  // Set per-element line height so the spark knows how far to travel
  els.forEach(el => {
    el.style.setProperty('--journey-h', el.offsetHeight + 'px');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.setProperty('--journey-h', e.target.offsetHeight + 'px');
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });
  els.forEach(el => io.observe(el));
}

function navigate() {
  const path = currentPath();
  let route = ROUTES[path];
  let renderFn;
  let title;
  let description;
  if (route) {
    title = route.title;
    description = route.description || DEFAULT_DESC;
    renderFn = route.render;
  } else if (path.startsWith("/blog/")) {
    const slug = path.slice("/blog/".length);
    const post = (typeof BLOG_POSTS !== "undefined") ? BLOG_POSTS.find(p => p.slug === slug) : null;
    title = post ? `${post.title} — Algorims` : "Article — Algorims";
    description = post ? (post.excerpt || DEFAULT_DESC) : DEFAULT_DESC;
    renderFn = () => pageBlogPost(slug);
  } else if (path.startsWith("/solutions/")) {
    const slug = path.slice("/solutions/".length);
    const sol = (typeof SOLUTIONS !== "undefined") ? SOLUTIONS.find(s => s.slug === slug) : null;
    title = sol ? `${sol.title} — Algorims` : "Solution — Algorims";
    description = sol ? (sol.subtitle || DEFAULT_DESC) : DEFAULT_DESC;
    renderFn = () => pageSolution(slug);
  } else if (path.startsWith("/products/")) {
    const slug = path.slice("/products/".length);
    const prod = (typeof PRODUCTS !== "undefined") ? PRODUCTS.find(p => p.slug === slug) : null;
    title = prod ? `${prod.title} — Algorims ${prod.slug.toUpperCase()}` : "Product — Algorims";
    description = prod ? (prod.subtitle || DEFAULT_DESC) : DEFAULT_DESC;
    renderFn = () => pageProductDetail(slug);
  } else if (path.startsWith("/case-studies/")) {
    const slug = path.slice("/case-studies/".length);
    const cs = (typeof CASE_STUDIES !== "undefined") ? CASE_STUDIES.find(s => s.slug === slug) : null;
    title = cs ? `${cs.title} — Algorims` : "Case Study — Algorims";
    description = cs ? (cs.subtitle || DEFAULT_DESC) : DEFAULT_DESC;
    renderFn = () => pageCaseStudy(slug);
  } else {
    route = ROUTES["/"];
    title = route.title;
    description = route.description || DEFAULT_DESC;
    renderFn = route.render;
  }
  document.title = title;
  // Keep SEO meta in sync with the active route
  const canonicalPath = (path === "/" ? "/" : path);
  const setMeta = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  setMeta('meta[name="description"]', "content", description);
  setMeta('link[rel="canonical"]', "href", SITE_ORIGIN + canonicalPath);
  setMeta('meta[property="og:url"]', "content", SITE_ORIGIN + canonicalPath);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);
  const main = document.getElementById("main");
  main.innerHTML = renderFn();
  renderNav();
  // re-bind contact form if present
  bindContactForm();
  // re-bind support form if present
  bindSupportForm();
  // bind spline scene loader if present
  bindSplineScene();
  // bind hero node click-to-inspect interactions
  bindHeroNodes();
  // bind products page scroll reveals + rail
  bindProductsPage();
  // bind radial orbital timeline on products page
  bindRadialOrbital();
  // bind journey timeline reveal animation
  bindJourneyTimeline();
  // refresh lucide icons (sweep all new <i data-lucide>)
  if (window.lucide) window.lucide.createIcons();
  // scroll to top on route change, or to anchor if specified
  const anchor = currentAnchor();
  if (anchor) {
    const el = document.getElementById(anchor);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  } else {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  // close mobile menu
  document.getElementById("mobile-menu").classList.add("hidden");
}

/* ---------- Products page: reveal-on-scroll + brand rail ---------- */
function bindProductsPage() {
  const cards = Array.from(document.querySelectorAll('.pp-card'));
  if (!cards.length) {
    // Clean up scroll listener from a previous products visit, if any.
    if (window.__ppScrollHandler) {
      window.removeEventListener('scroll', window.__ppScrollHandler);
      window.__ppScrollHandler = null;
    }
    return;
  }

  // Reveal on scroll
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        reveal.unobserve(en.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
  cards.forEach(c => reveal.observe(c));

  // Brand-rail "current" indicator follows scroll
  const railLinks = Array.from(document.querySelectorAll('[data-pp-rail-target]'));
  if (railLinks.length) {
    const setCurrent = (id) => {
      railLinks.forEach(a => {
        a.setAttribute('aria-current', a.getAttribute('data-pp-rail-target') === id ? 'true' : 'false');
      });
    };
    const active = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) setCurrent(en.target.id); });
    }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });
    cards.forEach(c => active.observe(c));

    // Smooth-scroll to the product card on click (without triggering SPA router via hash)
    railLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('data-pp-rail-target');
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const navOffset = 96; // sticky navbar clearance
        const y = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setCurrent(id);
      });
    });
  }

  // Subtle parallax on product logos
  const logos = Array.from(document.querySelectorAll('.pp-logo'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (logos.length && !reduce) {
    const onScroll = () => {
      logos.forEach(img => {
        const card = img.closest('.pp-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const progress = 1 - Math.min(Math.max((rect.top + rect.height / 2) / vh, 0), 1);
        const offset = (progress - 0.5) * -24;
        img.style.transform = `translateY(${offset.toFixed(2)}px)`;
      });
    };
    onScroll();
    if (window.__ppScrollHandler) window.removeEventListener('scroll', window.__ppScrollHandler);
    window.__ppScrollHandler = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

/* ---------- Radial Orbital Timeline (Products hero) ---------- */
function bindRadialOrbital() {
  const stage = document.querySelector('[data-rot-stage]');
  if (!stage || stage.__rotBound) return;
  stage.__rotBound = true;

  const nodes = Array.from(stage.querySelectorAll('[data-rot-node]'));
  if (!nodes.length) return;
  const total = nodes.length;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Responsive orbit radius
  const getRadius = () => {
    const w = stage.clientWidth;
    if (w < 480) return 150;
    if (w < 768) return 195;
    if (w < 1100) return 220;
    return 260;
  };
  let radius = getRadius();

  let rotation = -90; // start with first node at top
  let autoRotate = true;
  let activeId = null;
  let raf = 0;

  function place() {
    nodes.forEach((node, i) => {
      const angle = ((i / total) * 360 + rotation) % 360;
      const rad = (angle * Math.PI) / 180;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      const z = Math.round(100 + 50 * Math.cos(rad));
      const op = Math.max(0.55, Math.min(1, 0.55 + 0.45 * ((1 + Math.sin(rad)) / 2)));
      node.style.setProperty('--x', x.toFixed(2) + 'px');
      node.style.setProperty('--y', y.toFixed(2) + 'px');
      node.style.setProperty('--z', String(z));
      node.style.setProperty('--op', op.toFixed(3));
    });
  }

  function tick() {
    if (autoRotate && !reduce) {
      rotation = (rotation + 0.16) % 360;
      place();
    }
    raf = requestAnimationFrame(tick);
  }

  function setActive(id) {
    const node = nodes.find(n => n.dataset.rotNode === id);
    if (!node) return;
    activeId = id;
    autoRotate = false;
    stage.dataset.paused = 'true';

    const related = (node.dataset.relatedIds || '').split(',').filter(Boolean);
    nodes.forEach(n => {
      n.removeAttribute('data-active');
      n.removeAttribute('data-related');
    });
    node.dataset.active = 'true';
    related.forEach(rid => {
      const r = nodes.find(n => n.dataset.rotNode === rid);
      if (r) r.dataset.related = 'true';
    });

    // Rotate so the active node lands at the top
    const idx = nodes.indexOf(node);
    rotation = -90 - (idx / total) * 360;
    place();
  }

  function clear() {
    activeId = null;
    autoRotate = true;
    delete stage.dataset.paused;
    nodes.forEach(n => {
      n.removeAttribute('data-active');
      n.removeAttribute('data-related');
    });
  }

  // Node clicks
  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      // ignore clicks bubbling up from the card itself
      if (e.target.closest('.rot-card') && !e.target.closest('[data-rot-jump]')) return;
      const id = node.dataset.rotNode;
      if (activeId === id) clear();
      else setActive(id);
    });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = node.dataset.rotNode;
        if (activeId === id) clear();
        else setActive(id);
      }
    });
  });

  // Background click = clear
  stage.addEventListener('click', (e) => {
    if (e.target === stage || e.target.classList.contains('rot-orbit') || e.target.classList.contains('rot-rings')) {
      clear();
    }
  });

  // Related "jump" buttons
  stage.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-rot-jump]');
    if (!btn) return;
    e.stopPropagation();
    setActive(btn.dataset.rotJump);
  });

  // Responsive: re-place on resize
  const onResize = () => {
    const r = getRadius();
    if (r !== radius) { radius = r; place(); }
  };
  window.addEventListener('resize', onResize);
  stage.__rotCleanup = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
  };

  place();
  raf = requestAnimationFrame(tick);
}

/* ---------- Hero node click-to-inspect ---------- */
function bindHeroNodes() {
  const wrappers = document.querySelectorAll('[data-ai-hero]');
  wrappers.forEach(wrapper => {
    if (wrapper.__nodesBound) return;
    wrapper.__nodesBound = true;

    const svg     = wrapper.querySelector('svg');
    const cards   = wrapper.querySelectorAll('[data-node-card]');
    const detail  = wrapper.querySelector('[data-node-detail]');
    const dLabel  = wrapper.querySelector('[data-detail-label]');
    const dDesc   = wrapper.querySelector('[data-detail-desc]');
    const dIcon   = wrapper.querySelector('[data-detail-icon]');
    const dClose  = wrapper.querySelector('[data-detail-close]');
    const dataEl  = wrapper.querySelector('[data-node-data]');
    if (!detail || !dataEl) return;

    let NODES_DATA = [];
    try { NODES_DATA = JSON.parse(dataEl.textContent || '[]'); } catch (e) { return; }

    const pause = () => {
      wrapper.setAttribute('data-paused', 'true');
      if (svg && typeof svg.pauseAnimations === 'function') {
        try { svg.pauseAnimations(); } catch (e) {}
      }
    };
    const resume = () => {
      wrapper.removeAttribute('data-paused');
      cards.forEach(c => c.removeAttribute('data-active'));
      detail.classList.remove('is-visible');
      if (svg && typeof svg.unpauseAnimations === 'function') {
        try { svg.unpauseAnimations(); } catch (e) {}
      }
    };

    const activate = (n) => {
      const node = NODES_DATA.find(x => String(x.n) === String(n));
      if (!node) return;
      cards.forEach(c => {
        c.toggleAttribute('data-active', String(c.getAttribute('data-node-card')) === String(n));
      });
      dLabel.textContent = node.label;
      dDesc.textContent  = node.desc;
      dIcon.innerHTML    = `<i data-lucide="${node.icon}" class="!w-5 !h-5"></i>`;
      if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide' });
      detail.classList.add('is-visible');
      pause();
    };

    cards.forEach(card => {
      const trigger = (e) => {
        e.stopPropagation();
        activate(card.getAttribute('data-node-card'));
      };
      card.addEventListener('mouseenter', trigger);
      card.addEventListener('focus', trigger, true);
      // keep click working too (handy on touch devices)
      card.addEventListener('click', trigger);
    });

    if (dClose) {
      dClose.addEventListener('click', (e) => {
        e.stopPropagation();
        resume();
      });
    }

    // Resume rotation when the cursor leaves the visual.
    wrapper.addEventListener('mouseleave', resume);

    // Touch / keyboard escape support.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wrapper.hasAttribute('data-paused')) resume();
    });
  });
}

/* ---------- Spline scene loader ---------- */
function bindSplineScene() {
  const viewer = document.getElementById("hero-spline");
  const loader = document.getElementById("spline-loader");
  if (!viewer) return;

  const hideLoader = () => {
    if (!loader) return;
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 700);
  };

  // Strip the Spline watermark out of the viewer's shadow DOM.
  const stripWatermark = () => {
    const sr = viewer.shadowRoot;
    if (!sr) return false;
    // Common selectors Spline uses for the badge / logo link
    const sel = "#logo, a[href*='spline'], #spline-logo, .spline-logo";
    sr.querySelectorAll(sel).forEach(el => el.remove());
    // Belt-and-suspenders: inject a style rule into the shadow DOM in case the
    // watermark is re-rendered after our removal.
    if (!sr.getElementById("__strip-spline-logo")) {
      const style = document.createElement("style");
      style.id = "__strip-spline-logo";
      style.textContent = "#logo, a[href*='spline'], #spline-logo, .spline-logo { display:none !important; visibility:hidden !important; opacity:0 !important; pointer-events:none !important; }";
      sr.appendChild(style);
    }
    return true;
  };

  viewer.addEventListener("load", () => { hideLoader(); stripWatermark(); }, { once: true });
  viewer.addEventListener("load-complete", () => { hideLoader(); stripWatermark(); }, { once: true });

  // Poll for the shadow root (it's not always available on the same tick as
  // the element is connected), then keep trying for a few seconds since the
  // watermark can appear after the scene finishes loading.
  let tries = 0;
  const poll = setInterval(() => {
    tries++;
    stripWatermark();
    if (tries > 60) clearInterval(poll); // ~12s @ 200ms
  }, 200);

  // Safety net: hide loader after 8s even if event never fires.
  setTimeout(hideLoader, 8000);
}

/* ---------- Direct email submission (Web3Forms) ----------
   To send messages straight to your inbox WITHOUT opening the visitor's
   mail app, create free access keys at https://web3forms.com — one for
   each inbox below — and paste them in.
   Until a real key is set, that form safely falls back to opening the
   visitor's mail client (the original behaviour).                         */
const WEB3FORMS_ENDPOINT     = "https://api.web3forms.com/submit";
// Get Started / Contact form  →  delivered to contactus@algorims.com
const WEB3FORMS_CONTACT_KEY  = "9366535b-74bb-44f4-b639-7c8fd4378461";
// Submit a Ticket / Support form  →  delivered to support@algorims.com
const WEB3FORMS_SUPPORT_KEY  = "4e0799bc-f90e-4ea0-8e9c-f9d6698cd565";
const web3formsReady = (key) => key && !key.startsWith("YOUR-");

/* Sends the form directly via Web3Forms. Returns true on success.
   When no key is configured, opens a pre-filled mail draft instead and
   returns "fallback" so the caller can still show the success state.     */
async function sendFormDirect(form, { key, subject, fallbackEmail, fallbackBody }) {
  if (!web3formsReady(key)) {
    window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fallbackBody)}`;
    return "fallback";
  }
  const fd = new FormData(form);
  fd.append("access_key", key);
  fd.append("subject", subject);
  fd.append("from_name", "Algorims Website");
  const res = await fetch(WEB3FORMS_ENDPOINT, { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!(res.ok && json.success !== false)) throw new Error(json.message || "Submission failed");
  return true;
}

/* Small helper to flip a submit button into a loading state */
function setBtnLoading(btn, loading, idleHTML) {
  if (!btn) return;
  if (loading) {
    btn.dataset.idle = idleHTML != null ? idleHTML : btn.innerHTML;
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.style.pointerEvents = "none";
    btn.innerHTML = `<i data-lucide="loader-2" class="!w-4 !h-4 animate-spin"></i> Sending…`;
    if (window.lucide) window.lucide.createIcons();
  } else {
    btn.disabled = false;
    btn.style.opacity = "";
    btn.style.pointerEvents = "";
    if (btn.dataset.idle != null) { btn.innerHTML = btn.dataset.idle; if (window.lucide) window.lucide.createIcons(); }
  }
}

/* ---------- Contact form ---------- */
function bindContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const success = document.getElementById("contact-success");
  const fields = document.getElementById("contact-fields");
  const reset = document.getElementById("contact-reset");

  function setError(name, msg) {
    const el = form.querySelector(`[data-error="${name}"]`);
    if (!el) return;
    if (msg) { el.textContent = msg; el.classList.remove("hidden"); }
    else { el.textContent = ""; el.classList.add("hidden"); }
  }
  // inline status line for network errors (created once)
  let statusEl = form.querySelector("#contact-status");
  if (!statusEl) {
    statusEl = document.createElement("p");
    statusEl.id = "contact-status";
    statusEl.className = "text-sm text-destructive hidden";
    const sb = form.querySelector('button[type="submit"]');
    if (sb && sb.parentNode) sb.parentNode.insertBefore(statusEl, sb);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    let ok = true;
    if (!data.name || data.name.trim().length < 2) { setError("name", "Please enter your name"); ok = false; } else setError("name", "");
    if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) { setError("email", "Please enter a valid email"); ok = false; } else setError("email", "");
    if (!data.message || data.message.trim().length < 10) { setError("message", "Please share a few more details"); ok = false; } else setError("message", "");
    if (!data.service) { setError("service", "Please select a service"); ok = false; } else setError("service", "");
    if (!ok) return;
    statusEl.classList.add("hidden");

    const subject = `New enquiry from ${data.name}${data.company ? ` (${data.company})` : ""}${data.service ? ` — ${data.service}` : ""}`;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.company ? `Company: ${data.company}` : null,
      data.service ? `Service: ${data.service}` : null,
      "",
      "Message:",
      data.message,
    ].filter(Boolean).join("\n");

    const submitBtn = form.querySelector('button[type="submit"]');
    setBtnLoading(submitBtn, true);
    try {
      await sendFormDirect(form, { key: WEB3FORMS_CONTACT_KEY, subject, fallbackEmail: "contactus@algorims.com", fallbackBody: body });
      fields.classList.add("hidden");
      success.classList.remove("hidden");
    } catch (err) {
      statusEl.textContent = "Sorry — we couldn't send that just now. Please email contactus@algorims.com directly.";
      statusEl.classList.remove("hidden");
    } finally {
      setBtnLoading(submitBtn, false);
    }
  });
  if (reset) reset.addEventListener("click", () => {
    success.classList.add("hidden");
    fields.classList.remove("hidden");
    form.reset();
  });
}

/* ---------- Support form ---------- */
function bindSupportForm() {
  const form = document.getElementById("support-form-el");
  if (!form) return;
  const success = document.getElementById("support-success");
  const fields  = document.getElementById("support-fields");
  const reset   = document.getElementById("support-reset");
  const fileIn  = document.getElementById("s-attachment");
  const fileLbl = document.getElementById("s-attachment-label");

  if (fileIn && fileLbl) {
    fileIn.addEventListener("change", () => {
      fileLbl.textContent = fileIn.files && fileIn.files.length
        ? fileIn.files[0].name
        : "Attach a screenshot, log, or document (optional)";
    });
  }

  function setError(name, msg) {
    const el = form.querySelector(`[data-error="${name}"]`);
    if (!el) return;
    if (msg) { el.textContent = msg; el.classList.remove("hidden"); }
    else { el.textContent = ""; el.classList.add("hidden"); }
  }

  // inline status line for network errors (created once)
  let statusEl = form.querySelector("#support-status");
  if (!statusEl) {
    statusEl = document.createElement("p");
    statusEl.id = "support-status";
    statusEl.className = "text-sm text-destructive hidden";
    const sb = form.querySelector('button[type="submit"]');
    if (sb && sb.parentNode) sb.parentNode.insertBefore(statusEl, sb);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    let ok = true;
    if (!data.name || data.name.trim().length < 2) { setError("name", "Please enter your full name"); ok = false; } else setError("name", "");
    if (!data.company || data.company.trim().length < 2) { setError("company", "Please enter your company name"); ok = false; } else setError("company", "");
    if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) { setError("email", "Please enter a valid email"); ok = false; } else setError("email", "");
    if (!data.subject || data.subject.trim().length < 3) { setError("subject", "Please add a subject"); ok = false; } else setError("subject", "");
    if (!data.category) { setError("category", "Please select a category"); ok = false; } else setError("category", "");
    if (!data.priority) { setError("priority", "Please select a priority"); ok = false; } else setError("priority", "");
    if (!data.description || data.description.trim().length < 10) { setError("description", "Please describe the issue in a little more detail"); ok = false; } else setError("description", "");
    if (!ok) {
      const firstErr = form.querySelector('[data-error]:not(.hidden)');
      if (firstErr) { const top = firstErr.getBoundingClientRect().top + window.scrollY - 140; window.scrollTo({ top, behavior: "smooth" }); }
      return;
    }
    statusEl.classList.add("hidden");

    const subject = `[${data.priority}] ${data.category} — ${data.subject}`;
    const body = [
      `Full name: ${data.name}`,
      `Company: ${data.company}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      `Category: ${data.category}`,
      `Priority: ${data.priority}`,
      "",
      "Description:",
      data.description,
      "",
      (fileIn && fileIn.files && fileIn.files.length) ? `Attachment to follow: ${fileIn.files[0].name}` : null,
    ].filter(Boolean).join("\n");

    const submitBtn = form.querySelector('button[type="submit"]');
    setBtnLoading(submitBtn, true);
    try {
      await sendFormDirect(form, { key: WEB3FORMS_SUPPORT_KEY, subject, fallbackEmail: SUPPORT_EMAIL, fallbackBody: body });
      fields.classList.add("hidden");
      success.classList.remove("hidden");
    } catch (err) {
      statusEl.textContent = `Sorry — we couldn't submit your ticket just now. Please email ${SUPPORT_EMAIL} directly.`;
      statusEl.classList.remove("hidden");
    } finally {
      setBtnLoading(submitBtn, false);
    }
  });

  if (reset) reset.addEventListener("click", () => {
    success.classList.add("hidden");
    fields.classList.remove("hidden");
    form.reset();
    if (fileLbl) fileLbl.textContent = "Attach a screenshot, log, or document (optional)";
  });
}

/* ---------- Navbar scroll state ---------- */
function bindNavbar() {
  const shell = document.getElementById("nav-shell");
  const bg = document.getElementById("nav-bg");
  if (!shell || !bg) return;
  const onScroll = () => {
    const s = window.scrollY > 12;
    bg.style.opacity = s ? "1" : "0";
    shell.classList.toggle("py-2", s);
    shell.classList.toggle("py-4", !s);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
  }
}

async function loadFooter() {
  const target = document.querySelector("[data-footer]");
  if (!target) return;

  try {
    const res = await fetch(`${BASE_PATH}/footer.html`);
    if (!res.ok) throw new Error(`footer.html ${res.status}`);
    const footerHtml = (await res.text()).replace(/src="\.\/assets\//g, `src="${BASE_PATH}/assets/`);
    target.outerHTML = footerHtml;
    const year = document.getElementById("copy-year");
    if (year) year.textContent = new Date().getFullYear();
  } catch (error) {
    console.error("Footer failed to load", error);
  }
}

/* ---------- Boot ---------- */
loadFooter();

// Legacy support: redirect old hash URLs (e.g. /#/services) to real paths so
// any previously-shared or Google-indexed hash links still land correctly.
(function redirectLegacyHash() {
  if (location.hash.startsWith("#/")) {
    const target = location.hash.slice(1); // drop leading '#', keep '/services' etc.
    history.replaceState({}, "", target);
  }
})();

// A handful of product pages are hand-built static HTML (their own header/
// footer swapped for the shared ones) rather than rendered by the router's
// PRODUCTS/pageProductDetail() data. Client-side routing into them would just
// re-render the old generic product template into #main instead of actually
// loading their file, so these paths must always go through a real
// navigation instead of the History API shortcut below.
const STATIC_ROUTES = ["/products/cxiq", "/products/dociq", "/products/opsiq", "/products/payiq"];

// Intercept clicks on internal links and route them through the History API
// (no full page reload), while letting external links, new-tab clicks,
// downloads, and modified clicks behave normally.
document.addEventListener("click", (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest("a");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href) return;
  if (a.target && a.target !== "_self") return;
  if (a.hasAttribute("download")) return;
  // Only handle same-origin, path-based links (start with "/" but not "//")
  if (!href.startsWith("/") || href.startsWith("//")) return;
  // Let these fall through to a normal browser navigation
  if (STATIC_ROUTES.includes(href.replace(/\/+$/, ""))) return;
  e.preventDefault();
  navigateTo(href);
});

// Back/forward buttons
window.addEventListener("popstate", navigate);

// Boot — wrapped in DOMContentLoaded to guarantee the DOM is fully parsed
// before bindNavbar() and navigate() run, even if defer order shifts.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { bindNavbar(); navigate(); });
} else {
  bindNavbar();
  navigate();
}
