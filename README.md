# MysteriaHub

A 3D first-person escape game platform. Walk through mystery rooms, inspect clues, solve codes, and close the case — with an AI Game Master guiding you.

**[Play the game →](https://mysteryhub-one.vercel.app/)**

---

## Concept

**MysteriaHub** is a browser-based escape game where you play as a detective. Each mystery is split into rooms. You walk around in 3D (WASD + mouse), click on items to inspect them, and solve code puzzles to unlock the next room. Sherlock Holmes narrates your investigation.

- **3D first-person exploration** — Walk through rooms with WASD, look around with the mouse
- **Interactive clues** — Click objects (gloves, logbooks, footprints, etc.) to read descriptions
- **Code locks** — Find answers in the clues and enter codes to progress
- **Hints** — Use hints when stuck (costs XP)
- **Leaderboards** — Track solve times and compete with others

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

## Docs

| Doc | Purpose |
|-----|---------|
| [BUILD_PLAN.md](./BUILD_PLAN.md) | Phases and roadmap |
| [docs/MVP_SCOPE.md](./docs/MVP_SCOPE.md) | MVP scope |
| [docs/TECH_STACK.md](./docs/TECH_STACK.md) | Tech stack details |
