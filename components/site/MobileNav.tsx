"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { navItems } from "./nav-items";

const activeNavHref = (pathname: string) => {
  if (pathname.startsWith("/blog")) return "/blog";
  if (pathname.startsWith("/case-studies")) return "/case-studies";
  return pathname === "" ? "/" : pathname;
};

export function MobileNav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const activeHref = activeNavHref(pathname);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white/40 backdrop-blur"
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="mt-2 rounded-2xl glass p-4 shadow-lg animate-fade-in">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              className={`nav-link rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeHref === "/"
                  ? "nav-link-active"
                  : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
              }`}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  activeHref === item.href
                    ? "nav-link-active"
                    : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
                {"badge" in item ? (
                  <span className="ml-2 nav-new-badge" aria-label="New content">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
          <Link href="/contact" className="btn btn-hero btn-default mt-2 w-full" onClick={() => setOpen(false)}>
            Get Started
          </Link>
        </div>
      ) : null}
    </div>
  );
}
