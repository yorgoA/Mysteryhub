# MysteriaHub — Build Plan

> Strategic roadmap to build the escape game platform. No code yet — just the blueprint.

---

## 1. Project Summary

**What:** Bilingual (EN/FR) online escape game platform with an AI Game Master, leaderboards, badges, and mystery discovery.

**Core idea:** Players solve mysteries hosted by virtual Game Masters (e.g. Sherlock Holmes). Video-call style interface: clue panel + GM video bubble + input field.

**Target:** Mystery lovers, puzzle fans, escape room enthusiasts, ARG communities (16–45, desktop-first).

---

## 2. Phases Overview

| Phase | Focus | Timeline (rough) |
|-------|--------|------------------|
| **0** | Research, validation, decisions | 2–4 weeks |
| **1** | MVP — Playable mysteries, profiles, leaderboards | 2–4 months |
| **2** | Polish, content, gamification depth | 1–2 months |
| **3** | AI video integration | 1–2 months |
| **4** | Creator tools (future) | 6+ months |

---

## 3. Phase 0 — Foundations (Do This First)

### 3.1 Validation
- [ ] Talk to 10–20 mystery/puzzle fans: would they use this?
- [ ] Check competitors: ReelMind, Gameer, existing escape room sites
- [ ] Decide: personal project vs startup vs side business

### 3.2 Decisions to Lock
- [ ] **Tech stack** (see `docs/TECH_STACK.md`)
- [ ] **First 3 mysteries** — themes, difficulty, scripts
- [ ] **GM approach for MVP** — pre-recorded? Animated avatar? TTS?

### 3.3 Design
- [ ] Wireframes for: Landing, Home, Game session, Profile
- [ ] Core flows: Sign up → Play mystery → See leaderboard

---

## 4. Phase 1 — MVP

**Goal:** Players can sign up, play 2–3 mysteries, earn XP/badges, see leaderboards.

### 4.1 Core Features
- [ ] Auth: Sign up / Sign in
- [ ] Player profile: avatar, nickname, rank
- [ ] Mystery discovery page (carousel/cards)
- [ ] Game session UI:
  - Clue panel (images, text)
  - Input for answers
  - GM presence (can start as image + text, not full video)
- [ ] Puzzle logic: check answers, progress rooms
- [ ] Leaderboard
- [ ] Badges / XP system (basic)
- [ ] Bilingual UI (EN/FR)

### 4.2 Content
- [ ] Write 2–3 full mystery scripts
- [ ] Source/create assets (images, maps)
- [ ] GM dialogue for each scene

### 4.3 What to Skip in MVP
- AI-generated video
- Creator tools
- Mobile app (responsive web first)
- Clue purchases / monetization (add later)

---

## 5. Phase 2 — Polish & Content

- [ ] More mysteries (5–10)
- [ ] Thematic carousels (Horror, Medieval, Sci-Fi)
- [ ] Seasonal events
- [ ] UX refinements
- [ ] Basic analytics (playtime, completion rates)

---

## 6. Phase 3 — AI Video

- [ ] Pick model(s): Runway Gen-4, Kling, or Sora 2
- [ ] Define video pipeline: which clips to generate
- [ ] Pre-generate GM clips for 1–2 mysteries
- [ ] Integrate video player into game session
- [ ] Cost tracking and optimization

---

## 7. Phase 4 — Creator Tools (Future)

- [ ] Mystery editor
- [ ] AI-assisted script/puzzle generation
- [ ] Asset upload
- [ ] Publishing flow
- [ ] Monetization (creator cuts, premium)

---

## 8. Key Files to Create Next

1. `docs/TECH_STACK.md` — Framework, DB, hosting
2. `docs/MVP_SCOPE.md` — Detailed MVP spec
3. `docs/GAME_MASTER_APPROACH.md` — GM implementation strategy
4. `content/` — Mystery scripts, asset list

---

*Update this plan as you make decisions. Start Phase 0 now.*
