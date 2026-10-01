# WhichDevAreYou

A small, single-page quiz that reveals what "type" of developer you are, based on your mindset, how you solve problems, how you handle bugs, and how you work day to day.

---

## 1. Concept

The user answers 5 short questions. Each answer secretly scores a point toward one of 5 developer archetypes. At the end, the app reveals the archetype with the highest score, with a detailed explanation (strengths, blind spot, tip).

No accounts, no backend, no database: fully static, client-side, hardcoded content.

---

## 2. Developer Archetypes (Results)

| Icon | Archetype | Core trait | Flavor line |
|---|---|---|---|
| 📐 | **The Architect** | Plans before writing a single line | "You plan before you build." |
| 🚒 | **The Firefighter** | Thrives in chaos, fixes things live | "Production down at 2am is where you feel useful." |
| 🧪 | **The Tinkerer** | Learns by breaking things, chases new tools | "Four side projects open right now." |
| 💎 | **The Perfectionist** | Obsessed with clean, reviewed, refactored code | "You've rewritten that function six times." |
| ⚡ | **The Pragmatist** | Ships fast, working beats elegant | "If it works and it's Friday, it ships." |

Each result screen shows: icon, name, flavor line, a longer explanation, and three short sections: **Superpower**, **Blind spot** and **Tip**. All copy lives in the `ARCHETYPES` object in `js/main.js`.

---

## 3. Questions (final, hardcoded)

5 questions, each with 5 answer options (one per archetype). The answer order is deliberately different per question, so no archetype is always first.

1. 🚀 **Mindset:** "A new project lands on your desk. What's your first move?"
2. 🧩 **Coding solutions:** "You hit a tricky problem you've never solved before. Your approach?"
3. 🔥 **Errors & fixes:** "Production breaks at 5:55 PM on a Friday. What do you do?"
4. ⏰ **Work style:** "How do you feel about deadlines?"
5. 🗂️ **Wildcard:** "Pick the browser tab you most likely have open right now."

Each answer button carries a `data-archetype` attribute, which is what gets scored. Result = archetype with the most points. **Ties are broken by a fixed order**: Architect, Firefighter, Tinkerer, Perfectionist, Pragmatist (deterministic, no randomness).

---

## 4. Visual Design

**Theme:** Dark, minimal, steel-gray-to-black.

| Role | Color | Hex |
|---|---|---|
| Background (gradient) | Charcoal → near-black | `#1c1f24` → `#0a0b0d` |
| Primary text | Off-white | `#eceef0` |
| Secondary text / muted | Cool gray | `#868d94` |
| Borders / dividers | Subtle steel gray | `#2a2e34` |
| Accent | Steel blue | `#5b8fb0` (bright: `#7fb3d1`) |

Everything is grayscale by default; the accent shows up on interactive elements, the progress bar, and **highlighted key phrases** (`<strong>` inside answers, intro and result text).

**Icons:** emoji (no image files, no dependencies, works offline). One per archetype, one per question, and one next to each answer.

**Typography:** system sans-serif stack with a monospace touch for progress and small labels.

**Motion:** subtle `spapp` page transitions, plus a fade + scale-in reveal on the result card.

---

## 5. Features

- Intro screen, 5 question screens, 1 result screen
- Progress bar (Q01 / 05)
- Icons on the intro, questions, answers and result
- Detailed result: explanation, Superpower, Blind spot, Tip
- Retake button (resets scores, returns to intro, replays the reveal)
- **Share as image:** client-side `<canvas>` → `.jpg` card (icon, name, flavor line) with a Download button
- No persistence across refresh: state lives in memory only

---

## 6. Technical Approach

- **Framework:** jQuery + `spapp` (hash-based SPA router)
- **Routing:** each screen is a `<section>` in `<main id="spapp">`, loaded via `data-load` and navigated via `#hash`
- **State:** in-memory `scores` object, reset on retake
- **Styling:** `css/styles.css` (theme/layout) + `css/spapp.css` (show/hide + transitions)
- **No build step**

### File structure
```
index.html            → shell, mounts #spapp
css/styles.css        → theme/layout
css/spapp.css         → SPA show/hide + transition logic
js/jquery.min.js
js/jquery.spapp.min.js
js/main.js            → archetype data, scoring, routing, jpg export
views/intro.html
views/q1.html ... q5.html
views/result.html
```

---

## 7. Decisions (locked in)

- **Intro screen:** yes
- **Persistence:** none
- **Share:** `.jpg` generated client-side via canvas
- **Content:** all questions and results hardcoded in the repo
- **Icons:** emoji, no external assets

---

## 8. Running It Locally

`spapp` loads each view via AJAX, which browsers block over `file://`. Serve the folder instead:

```
cd whichdevareyou
python3 -m http.server 8080
# then open http://localhost:8080
```
