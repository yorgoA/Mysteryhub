# Tech Stack — MysteriaHub

> Choices to make before coding. Fill in as you decide.

---

## Frontend


| Layer       | Options                                     | Notes                                                   |
| ----------- | ------------------------------------------- | ------------------------------------------------------- |
| Framework   | Next.js / Remix / Vite+React                | SSR helps SEO for landing; Vite is simpler for pure SPA |
| Styling     | Tailwind CSS                                | Fast, consistent, good for carousels and layouts        |
| i18n        | next-intl / react-i18next                   | For EN/FR                                               |
| Video/Media | HTML5 video, maybe Mux or Cloudflare Stream | For GM clips when you add them                          |


**Recommendation (flexible):** Next.js + Tailwind — good SEO, API routes, widely used.

---

## Backend


| Layer    | Options                                        | Notes                                              |
| -------- | ---------------------------------------------- | -------------------------------------------------- |
| API      | Next.js API routes / Express / Fastify         | Next.js keeps it simple if you use it for frontend |
| Auth     | NextAuth / Clerk / Supabase Auth               | Clerk/Supabase = fast setup                        |
| Database | PostgreSQL (Supabase / Vercel Postgres / Neon) | Relational, good for users, progress, leaderboards |
| Storage  | Supabase Storage / S3 / Cloudflare R2          | Images, video, documents                           |


**Recommendation:** Supabase — auth + Postgres + storage in one, generous free tier.

---

## Hosting & infra


| Service | Options                               |
| ------- | ------------------------------------- |
| App     | Vercel / Netlify / Railway            |
| DB      | Supabase / Neon / PlanetScale         |
| Domain  | Any registrar                         |
| CDN     | Vercel/Netlify built-in or Cloudflare |


---

## AI video (Phase 3+)


| Need       | Options                                                |
| ---------- | ------------------------------------------------------ |
| Generation | Runway API, Kling API, Sora API                        |
| Storage    | R2 / S3 (video files can be large)                     |
| Playback   | HLS/DASH for longer videos; simple MP4 for short clips |


---

## Decisions to make

- Framework
- Auth provider
- Database
- Hosting
- Monorepo vs separate frontend/backend?

