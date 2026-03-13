# MysteriaHub

A 3D first-person escape game platform. Walk through mystery rooms, inspect clues, solve codes, and close the case — with an AI Game Master guiding you.

---

## Concept

**MysteriaHub** is a browser-based escape game where you play as a detective. Each mystery is split into rooms. You walk around in 3D (WASD + mouse), click on items to inspect them, and solve code puzzles to unlock the next room. Sherlock Holmes narrates your investigation.

- **3D first-person exploration** — Walk through rooms with WASD, look around with the mouse
- **Interactive clues** — Click objects (gloves, logbooks, footprints, etc.) to read descriptions
- **Code locks** — Find answers in the clues and enter codes to progress
- **Hints** — Use hints when stuck (costs XP)
- **Leaderboards** — Track solve times and compete with others

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Run locally

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**First time:** Sign up or sign in, then go to **Mysteries** → **The Stolen Painting** → **Begin Investigation**. Click the 3D view to enable walking (WASD), then explore and solve the case.

---

## Controls (In-Game)

| Action        | Input                  |
|---------------|------------------------|
| Enable walk   | Click the 3D view      |
| Move          | W A S D                |
| Look around   | Mouse                  |
| Inspect item  | Click on 3D object     |
| Exit walk mode| Esc                    |

---

## Supabase (Optional)

For real auth, progress, and leaderboards, set up [Supabase](https://supabase.com):

1. Create a project at [supabase.com](https://supabase.com)
2. Create `.env.local` in the project root with:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run migrations in Supabase → SQL Editor (see `supabase/migrations/` and [SUPABASE_STEPS.md](./SUPABASE_STEPS.md))

Without Supabase, the app uses mock auth (any credentials work) and progress is not persisted.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Three.js + React Three Fiber + Drei** — 3D rooms, first-person controls
- **Supabase** — Auth, progress, leaderboards

---

## Project Structure

```
src/
├── app/              # Next.js pages
├── components/       # UI + 3D game components
│   ├── GameSession3D.tsx   # Game flow, UI, dialog
│   ├── GameRoom3DCanvas.tsx
│   └── RoomScene3D.tsx     # 3D room, items, FPS controls
├── data/             # Mystery content (rooms, items, puzzles)
├── actions/          # Server actions (save progress, etc.)
└── lib/              # Utilities, images
```

---

## Available Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run start`| Run production server    |
| `npm run lint` | Run ESLint               |

---

## Docs

| Doc | Purpose |
|-----|---------|
| [SUPABASE_STEPS.md](./SUPABASE_STEPS.md) | Supabase migration steps |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | Phases and roadmap |
| [docs/MVP_SCOPE.md](./docs/MVP_SCOPE.md) | MVP scope |
| [docs/TECH_STACK.md](./docs/TECH_STACK.md) | Tech stack details |
