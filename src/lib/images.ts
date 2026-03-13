export const IMAGES = {
  heroBackground: "/images/hero-background.png",
  mysteries: {
    "stolen-painting": {
      cover: "/images/mysteries/stolen-painting/stolen-painting-cover.png",
      rooms: {
        1: "/images/mysteries/stolen-painting/room-1.png",
        2: "/images/mysteries/stolen-painting/room-2.png",
        3: "/images/mysteries/stolen-painting/room-3.png",
      },
    },
  },
  characters: {
    "sherlock-holmes": "/images/characters/sherlock-holmes.png",
  },
  themes: {
    horror: "/images/themes/horror.png",
    mystery: "/images/themes/Mystery.png",
    medieval: "/images/themes/Medieval.png",
    scifi: "/images/themes/Sci-Fi.png",
    sports: "/images/themes/Sci-Fi.png", // fallback
  },
  badges: {
    "escape-the-museum": "/images/badges/escape-the-museum.png",
  },
} as const;
