"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { MobileNav } from "./MobileNav";
import { navItems } from "./nav-items";

const activeNavHref = (pathname: string) => {
  if (pathname.startsWith("/blog")) return "/blog";
  if (pathname.startsWith("/case-studies")) return "/case-studies";
  return pathname === "" ? "/" : pathname;
};

export function Header() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeHref = activeNavHref(pathname);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-500">
      <div className="container-x">
        <div className="relative">
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: "hsl(0 0% 100% / 0.6)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid hsl(var(--border) / 0.6)",
              boxShadow: "0 12px 32px -16px hsl(265 60% 30% / 0.22)",
            }}
          />
          <div className="relative flex items-center justify-between px-4 py-4 transition-all duration-500">
            <Link href="/" className="group inline-flex items-center">
              <Image
                src="/assets/algorims-logo.png"
                alt="Algorims"
                width={168}
                height={32}
                className="h-8 w-auto transition-transform duration-500 group-hover:scale-[1.03]"
                style={{
                  filter: "drop-shadow(0 1px 0 hsl(0 0% 100% / 0.4))",
                }}
                priority
              />
            </Link>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
              <Link
                href="/"
                className={`nav-link inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  activeHref === "/"
                    ? "nav-link-active"
                    : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                Home
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    activeHref === item.href
                      ? "nav-link-active"
                      : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {item.label}
                  {"badge" in item ? (
                    <span className="nav-new-badge" aria-label="New content">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/contact" className="btn btn-hero btn-default">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
