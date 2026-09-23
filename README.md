# WhichDevAreYou

A small, single-page quiz that reveals what "type" of developer you are, based on your mindset, how you solve problems, how you handle bugs, and how you work day to day.

---

## 1. Concept

The user answers 5 short questions. Each answer secretly scores points toward one of 5 developer archetypes. At the end, the app reveals the archetype with the highest score, with a short, punchy description.

No accounts, no backend, no database — fully static, client-side, hardcoded content.

---

## 2. Developer Archetypes (Results)

| Archetype | Core trait | Flavor line |
|---|---|---|
| **The Architect** | Plans before writing a single line | "You'd rather spend 3 days designing than 1 day redoing." |
| **The Firefighter** | Thrives in chaos, fixes things live | "Production is down? You live for this moment." |
| **The Tinkerer** | Learns by breaking things, chases new tools | "You have 4 side projects and 0 of them are finished." |
| **The Perfectionist** | Obsessed with clean, reviewed, refactored code | "You've rewritten this function 6 times and it's still not 'right'." |
| **The Pragmatist** | Ships fast, working beats elegant | "If it works and it's Friday, it's done." |

These names/descriptions are a first draft — easy to tweak once we see the questions laid out.

---

## 3. Questions (draft structure)

5 questions, each with 4-5 answer options (one per archetype, roughly). Mix of angles:

1. **Mindset** — e.g. "A new project lands on your desk. First move?"
2. **Coding solutions** — e.g. "You need to solve a tricky problem. What's your approach?"
3. **Coding errors & fixes** — e.g. "Something breaks in production. What do you do?"
4. **Work style** — e.g. "How do you feel about deadlines?"
5. **Wildcard/personality** — e.g. "Pick a tab you have open right now."

Each answer option is invisibly tagged to one archetype. Final result = archetype with the most tags. Ties broken by the order the archetype first appeared (keeps it deterministic, no randomness needed).

*(Exact question wording/options to be finalized in the next step — happy to draft all 5 in full before coding, if you want to review copy first.)*

---

## 4. Visual Design

**Theme:** Dark, minimal, steel-gray-to-black — techy without looking like generic "AI gradient" slop.

**Palette:**

| Role | Color | Hex |
|---|---|---|
| Background (gradient) | Charcoal → near-black | `#1c1f24` → `#0a0b0d` |
| Primary text | Off-white | `#eceef0` |
| Secondary text / muted | Cool gray | `#8b9299` |
| Borders / dividers | Subtle steel gray | `#2c3036` |
| Accent (single, used sparingly) | Steel blue | `#5b8fb0` (hover/active states could use a slightly brighter `#79b3d6`) |
| Progress bar fill | Same accent | `#5b8fb0` |

Rule of thumb: everything is grayscale by default; the one accent color only shows up on interactive elements (buttons, progress bar, result highlight) so it actually means something when it appears.

**Typography:** Clean sans-serif for body copy (system font stack is fine — no external font dependency needed), with a monospace touch (e.g. `ui-monospace`/`SFMono`) for question numbers, the progress indicator, or small tech-flavored details (`> question_02.js` style labels), to reinforce the dev vibe without overdoing it.

**Motion:** Subtle. Reuse/extend the existing `spapp.css` `appear` keyframe for page transitions. Result screen gets a slightly more deliberate reveal animation (e.g. fade + slight scale-in) since it's the payoff moment.

---

## 5. Features

- **Intro/landing screen** — title, short blurb, "Start Quiz" button — then 5 hardcoded question screens + 1 result screen
- Progress bar showing question X of 5
- Retake button on the result screen (resets state, returns to intro/question 1)
- **Share as image** — result screen renders a simple `.jpg` card (archetype name + flavor line, on-theme dark background) client-side via `<canvas>`, with a "Download" button. Kept simple: no external image APIs, no server round-trip, just canvas → jpg.
- Small reveal animation on the result screen
- No persistence across refresh — state lives in memory only. This is fine since it's a `spapp` hash-based SPA; a refresh is a deliberate user action, not something that happens mid-quiz from normal navigation.

---

## 6. Technical Approach

Builds on the existing scaffold already in the repo:

- **Framework:** jQuery + `spapp` (lightweight hash-based SPA router already set up in `jquery.spapp.min.js`)
- **Routing:** each screen is a `<section>` inside `<main id="spapp">`, navigated via `#hash` (e.g. `#q1`, `#q2`, `#result`)
- **State:** a simple in-memory JS object tracking scores per archetype, reset on retake (no localStorage needed unless we want to persist across refresh — open question, see below)
- **Styling:** extend `spapp.css` (transitions) and `styles.css` (theme/layout) — no new dependencies
- **No build step:** stays static HTML/CSS/JS, matching the current project structure

### Current file structure (existing scaffold)
```
index.html          → shell, nav, mounts #spapp
css/styles.css       → theme/layout
css/spapp.css        → SPA show/hide + transition logic
assets/js/jquery.min.js
assets/js/jquery.spapp.min.js
views/page1.html, page2.html, page3.html  → per-page content (loaded via data-load)
```

### Planned adaptation
- Replace `page1/2/3` with `q1–q5` + `result` (and maybe `intro`)
- Each question view: question text + 4-5 answer buttons, each button's click handler adds a point to its tagged archetype and advances the hash to the next question
- Result view: reads final scores, renders the winning archetype's name/description/animation, plus Retake and Share buttons

---

## 7. Decisions (locked in)

- **Intro screen:** yes — simple landing view before Q1.
- **Persistence:** none. State resets on manual refresh; not a concern for normal quiz flow.
- **Share:** `.jpg` result card generated client-side via canvas, with a download button. No overcomplication — no external services, no fancy layouts.
