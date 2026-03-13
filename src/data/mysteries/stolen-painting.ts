export type RoomItem = {
  id: string;
  name: string;
  description: string;
  /** If set, selecting this item reveals a code lock */
  lock?: {
    prompt: string;
    answer: string;
    normalizedAnswer?: string;
    hint?: string;
  };
};

export type Room = {
  id: number;
  title: string;
  gmIntro: string;
  /** Items the player can click and inspect. Some have locks (codes). */
  items: RoomItem[];
  /** Number of locks that must be solved to proceed */
  locksRequired: number;
  gmSuccess: string;
};

export type MysteryData = {
  slug: string;
  title: string;
  gmName: string;
  intro: string;
  rooms: Room[];
  completionMessage: string;
  difficulty: "easy" | "medium" | "hard";
  targetTimeSeconds: number;
  badgeSlug: string;
};

export const stolenPainting: MysteryData = {
  slug: "stolen-painting",
  title: "The Stolen Painting",
  gmName: "Sherlock Holmes",
  intro:
    "London, 1977. A bitter winter night. Fog coils through Baker Street like a thief in the dark. Word has just reached me — a priceless work of art, The Lady in Blue, has vanished from the museum. Scotland Yard flounders as always. Come, Detective — your wits are needed. Search the room, inspect items, and solve the codes to uncover the truth.",
  rooms: [
    {
      id: 1,
      title: "Museum Entry Hall",
      gmIntro:
        "Observe carefully, Detective. The culprit forced entry through this hall. Click each item to inspect it. Some hide locks — solve the codes to proceed.",
      locksRequired: 2,
      items: [
        { id: "glove", name: "Torn glove", description: "A discarded leather glove. Not useful." },
        {
          id: "footprint",
          name: "Shoe print",
          description: "A clear footprint. A code is etched beside it: enter the shoe size.",
          lock: { prompt: "Enter the shoe size (number)", answer: "11", normalizedAnswer: "11", hint: "Look at the footprint." },
        },
        {
          id: "logbook",
          name: "Security logbook",
          description: "Last entry: theft discovered at 2:00 AM. A safe nearby needs the time.",
          lock: { prompt: "Enter discovery time as 4 digits (e.g. 0200 for 2:00 AM)", answer: "0200", normalizedAnswer: "0200", hint: "2:00 AM = 0200" },
        },
        { id: "vase", name: "Broken vase", description: "Shattered pottery. Irrelevant." },
        { id: "map", name: "Museum map", description: "Shows restricted areas. No lock." },
        { id: "keyring", name: "Keyring", description: "One key is missing. Noted." },
      ],
      gmSuccess:
        "Excellent deduction. You show promise. Let us proceed to our next room.",
    },
    {
      id: 2,
      title: "Gallery Room",
      gmIntro:
        "The gallery where the Lady in Blue once hung. Inspect the evidence. Solve the codes.",
      locksRequired: 3,
      items: [
        { id: "frame", name: "Empty frame", description: "The painting is gone. Confirmed." },
        {
          id: "ladder",
          name: "Ladder",
          description: "Used to reach the painting. A lock asks how access was gained.",
          lock: { prompt: "How did the thief reach the painting? (one word)", answer: "ladder", normalizedAnswer: "ladder", hint: "They climbed something." },
        },
        {
          id: "visitor-list",
          name: "Visitor list",
          description: "Victor had a private tour at 1:30 AM. A lock asks who had opportunity.",
          lock: { prompt: "Who had the opportunity? (name)", answer: "Victor", normalizedAnswer: "victor", hint: "Check the visitor list." },
        },
        {
          id: "glass-cutter",
          name: "Glass cutter",
          description: "Proves advance planning. The lock asks what tool was used.",
          lock: { prompt: "What tool proves the thief planned ahead? (two words)", answer: "glass cutter", normalizedAnswer: "glass cutter", hint: "A cutting tool." },
        },
        { id: "cigarette", name: "Cigarette butt", description: "Discarded. Irrelevant." },
        { id: "flashlight", name: "Guard's flashlight", description: "Standard issue. No lock." },
      ],
      gmSuccess:
        "Well done. The pieces align. Come, let us proceed.",
    },
    {
      id: 3,
      title: "Storage Room",
      gmIntro:
        "Evidence of Victor's folly must be here. Find the codes and close the case.",
      locksRequired: 2,
      items: [
        {
          id: "crate",
          name: "Wooden crate",
          description: "Suspicious. A lock asks where the painting is.",
          lock: { prompt: "Where is the painting? (one word)", answer: "crate", normalizedAnswer: "crate", hint: "Inside a container." },
        },
        {
          id: "handkerchief",
          name: "Handkerchief with 'V'",
          description: "Ties Victor to the scene. The lock asks which clue incriminates him.",
          lock: { prompt: "Which clue ties Victor to the theft? (one word)", answer: "handkerchief", normalizedAnswer: "handkerchief", hint: "An item with initials." },
        },
        { id: "ticket", name: "Carriage ticket", description: "Victor was leaving town. Noted." },
        { id: "hammer", name: "Hammer", description: "Standard tool. Irrelevant." },
        { id: "seal", name: "Wax seal", description: "Unused. No lock." },
        { id: "morse", name: "Morse code note", description: "Says 'Deliver painting tonight'. Intel only." },
      ],
      gmSuccess:
        "Ha! The truth, as ever, was elementary. Another case closed. Well played.",
    },
  ],
  completionMessage: "Case closed. Well played, Detective.",
  difficulty: "medium",
  targetTimeSeconds: 720,
  badgeSlug: "escape-the-museum",
};
