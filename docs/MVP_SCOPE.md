# MVP Scope — MysteriaHub

> Concrete definition of the first playable version. Use this as the contract before coding.

---

## What’s in

### Users
- Sign up (email + password)
- Sign in
- Profile: nickname, avatar (from preset list), rank
- Logout

### Mysteries
- 2–3 playable mysteries
- Discovery page with cards (title, theme, difficulty, teaser)
- Click to start → enter game session

### Game Session
- **Layout:**
  - Main area: clue panel (images, text, documents)
  - GM area: image/avatar + text bubbles (no video in MVP)
  - Input field for answers
- **Flow:**
  - Intro text
  - Room 1 → clues → questions → unlock room 2 → etc.
- **Feedback:**
  - Correct → next room / congrats
  - Wrong → “try again” / optional hint
- Completion screen: solve time, rooms, XP earned, badge

### Progression
- XP per mystery (fixed or by completion time)
- Rank from total XP (e.g. Rookie → Detective → Master)
- Badges: “First Mystery”, “Escape the Museum”, etc.

### Leaderboard
- Top N players (avatar, nickname, rank)
- Global + maybe per-mystery
- “View full leaderboard” page

### UI/UX
- Landing page
- Home (post-login): carousels, leaderboard snippet
- Mysteries page
- Profile / dashboard
- Bilingual: EN + FR (all main UI strings)
- Responsive (desktop-first, usable on tablet/mobile)

---

## What’s out (for later)

- AI-generated video
- Clue purchases / hints for sale
- Creator tools
- Seasonal events
- Full competition / live events
- TV app
- Native mobile app

---

## Success criteria for MVP

1. A new user can sign up, play one full mystery, and see their result on the leaderboard.
2. The experience feels like a real escape-game session (clues, rooms, feedback).
3. EN and FR work for core flows.
