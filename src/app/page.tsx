import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen pt-14">
      {/* Hero */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4">
        <Image
          src="/images/hero-background.png"
          alt=""
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mystery-card/80 to-mystery-dark -z-[1]" />
        <div className="relative z-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-mystery-accent to-mystery-accentDim bg-clip-text text-transparent">
              The world&apos;s mysteries
            </span>
            <br />
            <span className="text-white">waiting for you to solve them</span>
          </h1>
          <p className="mt-6 text-xl text-neutral-400">
            Investigate. Compete. Conquer.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-lg bg-mystery-accent px-8 py-3 font-medium text-mystery-dark transition hover:bg-mystery-accentDim"
            >
              Get Started
            </Link>
            <Link
              href="/mysteries"
              className="rounded-lg border border-mystery-border px-8 py-3 font-medium text-white transition hover:border-mystery-accent hover:text-mystery-accent"
            >
              Discover Mysteries
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 animate-bounce text-mystery-accent">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Gameplay */}
      <section className="border-t border-mystery-border bg-mystery-card/30 py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">
                Solve mysteries. Rank up. Earn badges.
              </h2>
              <p className="mt-4 text-neutral-400">
                Each mystery is hosted by a Game Master who guides you through the case.
                Follow clues, answer questions, and unlock the next room. Your progress
                is tracked on global leaderboards.
              </p>
              <Link
                href="/mysteries"
                className="mt-6 inline-block text-mystery-accent hover:underline"
              >
                Discover Mysteries →
              </Link>
            </div>
            <div className="rounded-xl border border-mystery-border bg-mystery-dark overflow-hidden">
              <Image
                src="/images/mysteries/stolen-painting/stolen-painting-cover.png"
                alt="The Stolen Painting"
                width={640}
                height={360}
                className="w-full aspect-video object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard teaser */}
      <section className="border-t border-mystery-border py-24 px-4">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-display text-3xl font-bold text-white">
            Can you make it to the top?
          </h2>
          <p className="mt-4 text-neutral-400">
            Compete with detectives worldwide on the leaderboard.
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-block rounded bg-mystery-accent px-6 py-2 font-medium text-mystery-dark hover:bg-mystery-accentDim"
          >
            View Leaderboards
          </Link>
        </div>
      </section>

      {/* Creator mode teaser */}
      <section className="border-t border-mystery-border bg-mystery-card/50 py-24 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-wider text-mystery-accent">
            Coming Soon
          </p>
          <h2 className="font-display mt-2 text-2xl font-bold text-white">
            Create your own mysteries
          </h2>
          <p className="mt-4 text-neutral-400">
            Soon you&apos;ll be able to create professional mysteries with AI-assisted tools.
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-block text-mystery-accent hover:underline"
          >
            Get Notified
          </Link>
        </div>
      </section>

      <footer className="border-t border-mystery-border py-8 px-4">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 text-sm text-neutral-500">
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Contact</Link>
          </div>
          <div>EN | FR</div>
        </div>
      </footer>
    </main>
  );
}
