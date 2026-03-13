# AI Video Pipeline — Automation for Game Master Clips

> Use pipelines and automation to generate Game Master videos at scale instead of one-by-one.

---

## Why pipelines?

- **Scale:** 10 mysteries × 50 clips = 500 videos. Manual = painful. Automated = manageable.
- **Consistency:** Same character, same style, same prompt structure.
- **Reproducibility:** Re-run when models improve or you change a line.
- **Cost control:** Batch jobs, rate limits, retry logic.

---

## Pipeline flow

```
Script (JSON/YAML)
    → Prompt builder (character + line + expression)
    → API calls (Runway / Kling / Sora)
    → Store outputs (Supabase Storage / R2)
    → Map clip IDs to game logic
```

---

## 1. Script format

Define all GM lines in one place. Example:

```json
{
  "mystery_slug": "stolen-painting",
  "gm_character": {
    "name": "Sherlock Holmes",
    "prompt_base": "Victorian detective, Baker Street, serious expression..."
  },
  "clips": [
    {
      "id": "intro",
      "scene": "intro",
      "text": "London, 1977. A bitter winter night...",
      "expression": "serious",
      "duration_sec": 15
    },
    {
      "id": "room1_intro",
      "scene": "room_1",
      "text": "Observe carefully, Detective. The culprit forced entry...",
      "expression": "focused"
    },
    {
      "id": "room1_success",
      "scene": "room_1",
      "text": "Excellent deduction. You show promise.",
      "expression": "smile"
    }
  ]
}
```

---

## 2. Automation options

| Tool | Use case |
|------|----------|
| **GitHub Actions** | Scheduled or manual batch jobs |
| **Node/TS script** | Local or CI: read script → call APIs → upload |
| **n8n / Zapier** | Low-code: trigger on new script, call APIs |
| **Inngest / Trigger.dev** | Serverless jobs: queue, retries, rate limits |

**Recommendation:** Start with a Node/TS script in `scripts/generate-gm-clips.ts`. Run locally or in CI. Later move to Inngest if you need on-demand generation.

---

## 3. Pseudocode

```ts
// scripts/generate-gm-clips.ts
const script = loadScript('content/mysteries/stolen-painting/video-script.json');

for (const clip of script.clips) {
  const prompt = buildPrompt(script.gm_character, clip);
  const videoUrl = await runway.textToVideo(prompt, { duration: clip.duration_sec });
  await supabase.storage.upload(`gm-clips/${clip.id}.mp4`, videoUrl);
  await db.insert('gm_clips', { id: clip.id, url: videoUrl });
}
```

---

## 4. What to automate

| Step | Automatable |
|------|-------------|
| Read script | ✅ |
| Build prompts | ✅ (with templates) |
| Call API | ✅ |
| Store files | ✅ |
| Map to game | ✅ (clip IDs in game data) |
| **Review / QC** | ⚠️ Manual (spot-check outputs) |

---

## 5. Cost & rate limits

- Runway: ~$0.05–0.10 per second of video. Batch overnight.
- Kling: Check API pricing. Good for longer clips.
- Add `sleep(1000)` between calls to avoid rate limits.
- Retry with exponential backoff on 429.

---

## 6. MVP vs later

- **MVP:** Skip video; use avatar + text.
- **Phase 3:** Add 1 mystery with pre-generated clips. Manual script → manual API calls.
- **Phase 3+:** Build the pipeline for mystery #2 onwards.
