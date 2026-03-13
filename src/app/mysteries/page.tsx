import Link from "next/link";
import Image from "next/image";

const MYSTERY_IMAGES: Record<string, string> = {
  "stolen-painting": "/images/mysteries/stolen-painting/stolen-painting-cover.png",
};

const mysteries = [
  {
    slug: "stolen-painting",
    title: "The Stolen Painting",
    teaser: "London, 1977. A priceless work of art has vanished from the museum. Sherlock needs your wits.",
    theme: "Mystery",
    difficulty: "Medium",
  },
  {
    slug: "midnight-express",
    title: "Midnight Express",
    teaser: "Coming soon. A train. A murder. One hour to find the killer.",
    theme: "Horror",
    difficulty: "Hard",
    disabled: true,
  },
  {
    slug: "castle-cipher",
    title: "The Castle Cipher",
    teaser: "Coming soon. Medieval secrets lie behind these stone walls.",
    theme: "Medieval",
    difficulty: "Medium",
    disabled: true,
  },
];

export default function MysteriesPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Mysteries
        </h1>
        <p className="text-neutral-400 mb-12">
          Every case has a story… are you ready to solve it?
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mysteries.map((m) => (
            <Link
              key={m.slug}
              href={m.disabled ? "#" : `/game/${m.slug}`}
              className={`rounded-xl border bg-mystery-card overflow-hidden transition ${
                m.disabled
                  ? "border-mystery-border opacity-60 cursor-not-allowed"
                  : "border-mystery-border hover:border-mystery-accent"
              }`}
            >
              <div className="aspect-video bg-mystery-dark relative overflow-hidden">
                {MYSTERY_IMAGES[m.slug] ? (
                  <Image src={MYSTERY_IMAGES[m.slug]} alt={m.title} fill className="object-cover" />
                ) : null}
              </div>
              <div className="p-6">
                <span className="text-xs text-mystery-accent">{m.theme} · {m.difficulty}</span>
                <h2 className="font-display text-xl font-semibold text-white mt-1">
                  {m.title}
                </h2>
                <p className="text-sm text-neutral-400 mt-2 line-clamp-2">
                  {m.teaser}
                </p>
                {!m.disabled && (
                  <span className="mt-4 inline-block text-mystery-accent text-sm font-medium">
                    Play Now →
                  </span>
                )}
                {m.disabled && (
                  <span className="mt-4 inline-block text-neutral-500 text-sm">
                    Coming Soon
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
