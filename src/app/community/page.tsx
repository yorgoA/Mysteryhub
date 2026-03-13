import Link from "next/link";

export default function CommunityPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Community
        </h1>
        <p className="text-neutral-400 mb-12">
          Join detectives worldwide. Share stories, tips, and compete.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <a
            href="#"
            className="rounded-xl border border-mystery-border bg-mystery-card p-8 hover:border-mystery-accent transition"
          >
            <h2 className="font-display text-xl font-semibold text-white">About</h2>
            <p className="mt-2 text-neutral-400 text-sm">
              Our story, mission, and roadmap.
            </p>
          </a>
          <a
            href="#"
            className="rounded-xl border border-mystery-border bg-mystery-card p-8 hover:border-mystery-accent transition"
          >
            <h2 className="font-display text-xl font-semibold text-white">Discord</h2>
            <p className="mt-2 text-neutral-400 text-sm">
              Chat with fellow detectives.
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
