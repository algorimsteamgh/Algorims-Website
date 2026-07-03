import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-10 lg:py-14">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-dark p-10 text-white shadow-lg md:p-16">
          <div className="surface-mesh absolute inset-0 opacity-60" />
          <div
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "hsl(var(--primary-glow) / .3)" }}
          />
          <div
            className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "hsl(var(--primary) / .4)" }}
          />
          <div className="relative grid gap-10 md:grid-cols-5 md:items-center">
            <div className="space-y-5 md:col-span-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                Ready when you are
              </div>
              <h2 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
                Let&apos;s architect your Agentic Enterprise.
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-white/75">
                Talk to the team about AI, cloud, or platform engineering
                goals. This Next.js foundation is ready for the remaining route
                migration phases.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:col-span-2 md:items-end">
              <Link
                href="/contact"
                className="btn btn-xl"
                style={{
                  background: "white",
                  color: "hsl(var(--primary-deep))",
                }}
              >
                Book a consultation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/services"
                className="btn btn-ghost btn-lg rounded-full"
                style={{ color: "white" }}
              >
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
