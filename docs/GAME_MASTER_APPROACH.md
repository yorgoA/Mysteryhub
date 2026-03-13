# Game Master Implementation Strategy

> How to bring the AI Game Master to life across phases.

---

## MVP (Phase 1) — No AI Video

**Format:** Static image or simple avatar + text bubbles

### Options
1. **Illustrated avatar** — One character image per GM (e.g. Sherlock), different expressions (neutral, smile, frown). Swap based on feedback.
2. **Animated avatar** — D-ID, HeyGen, or similar: one face, TTS voice. Cheaper than full AI video.
3. **Text-only** — GM dialogue as styled chat bubbles. Fastest, least immersive.

**Recommendation for MVP:** Option 1 — illustrated avatar + expressions. Good balance of polish and effort.

---

## Phase 2–3 — Add Video

### Pre-generated clips (recommended first)
- Script each line per mystery
- Generate 20–50 short clips per GM (5–15 sec each) using Runway/Kling/Sora
- Store and play based on scene/outcome
- Pros: Stable, consistent, predictable cost
- Cons: Not dynamic; need to cover many branches

### Hybrid
- Pre-generate intros, room transitions, win/lose
- Use TTS + avatar for hints and “try again”
- Pros: Best of both worlds
- Cons: Slightly more logic

### Fully dynamic (future)
- Generate GM reactions in real time from player input
- Pros: Most flexible
- Cons: Latency, cost, consistency risk

---

## Video pipeline (when ready)

1. **Script** — All GM lines per mystery
2. **Prompt** — Character description, costume, expression, background
3. **Generate** — Runway/Kling/Sora
4. **Review** — Manual QC
5. **Store** — CDN
6. **Trigger** — Map scene/answer to clip ID

---

## Cost estimate (rough)

| Approach | Cost per mystery | Notes |
|----------|------------------|-------|
| Illustrated avatar | ~$0 | One-time art |
| TTS + avatar (D-ID) | ~$20–50 | Per character, subscription |
| Pre-gen AI video | ~$50–150 | 30–50 clips, Runway/Kling |
| Dynamic AI video | High, variable | Not for MVP |
