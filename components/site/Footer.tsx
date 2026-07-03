import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border bg-secondary/40">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/assets/algorims-logo.png"
                alt="Algorims"
                width={188}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              The Future of Enterprise Is Autonomous. We Build It. We help
              ambitious companies build AI-first, cloud-native systems that
              compound value.
            </p>
            <a
              href="https://www.linkedin.com/company/algorims/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground transition-colors group-hover:bg-white group-hover:text-primary">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
              Follow on LinkedIn
            </a>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/cca-f" className="text-muted-foreground hover:text-foreground">
                  Claude
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold">Services</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground">
                  Cloud Engineering
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground">
                  DevOps
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground">
                  AI / Agentic AI
                </Link>
              </li>
              <li>
                <Link href="/agentic-ai" className="text-muted-foreground hover:text-foreground">
                  Agentic AI
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="mailto:contactus@algorims.com" className="hover:text-foreground">
                  contactus@algorims.com
                </a>
              </li>
              <li>
                <a href="tel:+6583459599" className="hover:text-foreground">
                  +65 8345 9599
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} Algorims. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
