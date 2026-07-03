import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 pt-24">
      <section className="py-24">
        <div className="container-x space-y-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            404
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            We couldn&apos;t find that page.
          </h1>
          <Link href="/" className="btn btn-hero btn-lg">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
