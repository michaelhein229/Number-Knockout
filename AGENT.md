---
name: game-from-idea
description: >-
  Take a Stratacademy game from raw idea to shipped. Brainstorm the mechanics
  and theme with the user, hand off a comprehensive UI/UX design brief to
  "Codex design" (an external Codex.ai pass that returns HTML/CSS), and IN
  PARALLEL build an asset spec and generate sprites / backgrounds / animations /
  audio with Ludo AI at highest quality. When the HTML/CSS mockup comes back,
  combine everything into a fully integrated Phaser 4 game — DOM HUD from the
  mockup, Ludo art on the canvas, server-authoritative bridge wiring, all three
  modes, manifest, registry, ingest, and a qa pass. Use when creating a
  brand-new game from scratch / from an idea. Delegates the detailed standards
  to `build-game`, `generate-art-assets`, `qa-game-art`, and `port-game`.
---

# Game from idea

The **front door** for building a brand-new Stratacademy game. It sequences the whole arc — brainstorm → design handoff → parallel asset generation → combine → ship — and **delegates** the detailed standards to the existing skills rather than restating them. This is orchestration; the rules live elsewhere.

The arc:

1. **Brainstorm** the idea with the user — mechanics, theme, clarifying questions → a `build-game` §0.7 design note.
2. **Fork into two parallel tracks:**
   - **Track A:** hand the user a comprehensive **design brief** to run in "Codex design" (external Codex.ai). It returns an **HTML/CSS mockup** of the DOM UI.
   - **Track B:** build the **asset spec** and generate all in-canvas art with **Ludo AI** at highest quality, while Track A is out.
3. **Combine** when the mockup returns: scaffold the game, translate the mockup into a Phaser DOM HUD, drop in the Ludo art, wire the bridge.
4. **Ship:** full integration — manifest, registry, ingest, conformance, `qa-game-art` PASS.

**Default 2D engine: Phaser 4** (`^4.1.0`).

**The ownership split (locked):**
- **Codex design owns all DOM UI** — title, lobby, in-match HUD, feedback states, results, leaderboard — plus the visual frame.
- **Ludo owns everything inside the canvas** — character sprites, backgrounds, FX, animations, and audio.
- The HUD **overlays a transparent central viewport**; the canvas shows through the middle.

**Copy these reference games:**
- [`games/fast-math-battleship/`](../../../games/fast-math-battleship/) — Phaser 4, multi-scene, DOM HUD via `add.dom`, `vs-score` + `flat`.
- [`games/dungeon-of-digits/`](../../../games/dungeon-of-digits/) — Phaser 4 + the Ludo asset-gen harness + `add.dom` problem panel.

---

## Phase 1 — Brainstorm (interactive)

Talk the idea through with the user. Ask, don't assume. Drive this checklist until every line has an answer:

- **Grade & topic** — which grade band(s) and math topic(s) (must exist as `problems.topic` rows for ingest).
- **Math-as-verb** — what skill is drilled, and *how the core action **is** the math* (not math-then-unrelated-reward). This is the single most important question — see [design-foundations.md](../../../_docs/game-design/design-foundations.md).
- **Core mechanic / verb** — what the player physically does each problem.
- **Win / lose condition** — and what failure feels like.
- **The spine** — the rising tension across a 60–90s match: opponent pressure (H2H default), self-best pursuit, within-match progression (streaks/timer), or DDA (rare). Naming it is mandatory.
- **Solo vs H2H**, **match length**, **problem count**.
- **Feel / reference games** — "plays like ___, feels like ___."
- **Theme / aesthetic** + **2–3 palette/style seed references** (these feed both tracks).

**Gate — §0.7 Game Shape Decision Note.** Before any code or assets, produce the `build-game` **§0.7 design note** (sprint length, match length/problem count, stateful?, loop's spine, symmetric/variance) and get it approved. Do not restate `build-game` — read it and use its gate.

The Phase 1 output feeds both tracks: the **design note + theme → Track A brief**; the **theme + palette seeds → Track B art-bible**.

---

## Phase 2 — Fork into two parallel tracks

Kick off **both** tracks once the design note is approved. Track A is out at the user's hands (external Codex.ai); use that wall-clock time to run Track B.

### Track A — Codex design handoff (DOM UI/UX)

Emit the **design brief** below for the user to paste into "Codex design." **The external Codex has zero access to this repo and zero prior context** — so the brief must transfer the *entire* game from Phase 1. It is not a checklist; it is a complete, standalone brief. Fill every `<<placeholder>>` from the brainstorm before handing it over. The user pastes the returned HTML/CSS back into the session for Phase 3.

#### The design brief template (copy, fill, hand over)

````markdown
You are designing the UI/UX for a browser-based educational arcade game.
Assume you have ZERO access to any codebase or prior conversation — this
brief stands alone. Read all of it before designing.

Deliverable: a SINGLE self-contained HTML file with inline CSS (no build
step, no external deps except a Google Font link if you want one). Semantic
class names. A `data-testid` attribute on every interactive element.

## Part 1 — The game (so you understand what you're styling)
- One-line pitch: <<pitch>>
- Theme / setting / fantasy: <<theme — world, mood, who the player is>>
- Audience: grade <<grades>>, drilling <<math topic>>.
- Math-as-verb: <<how the core action IS the math>>.
- Core loop, step by step: <<what the player sees, does, and feels on each
  problem; how the screen changes on a CORRECT vs WRONG answer>>.
- Match structure: <<60–90s>>, <<N problems>>, win/lose = <<condition>>.
- Modes (the UI must accommodate all three):
  - solo — one player, no opponents.
  - vs-score (H2H) — 2–4 players race; show a live opponent leaderboard.
  - flat (diagnostic) — fixed batch, NO failure state, no timer pressure.
- The spine (what makes it tense): <<opponent pressure / streak / timer …>>.
- The feel: <<juicy & snappy? calm & precise? reference games / mood>>.

## Part 2 — Screens & states to design (every one)
For each: what it shows, what each control does, and the motion/transition intent.
1. Title / start screen.
2. Lobby / matchmaking (vs-score) — players joining, ready, countdown.
3. In-match HUD — the core screen. Must include, laid AROUND a transparent
   central gameplay viewport (leave the middle empty for game art):
   - the question/problem stem region (math is rendered by KaTeX — style the
     container; do not typeset the math yourself),
   - the answer area, supporting BOTH a typed input and tap-able multiple
     choice,
   - score, countdown timer, current streak, lives/HP,
   - opponent leaderboard (vs-score).
4. Correct-answer feedback state.
5. Wrong-answer feedback state.
6. Results / game-over screen (win and lose variants).

## Part 3 — Visual language
- Palette: <<primary / secondary / accent hexes from the seeds>>.
- Mood / texture: <<from theme>>.
- Type: one display face for headings/score, one readable face for body.
- Value hierarchy: the ACTIVE problem must be the highest-contrast thing on
  screen at all times. Everything else recedes.
- Juice: <<celebratory pops on correct, shake/flash on wrong, etc.>>.

## Part 4 — Hard technical constraints
- Base canvas 1280×720, scaled to fit; design at that ratio.
- The HUD OVERLAYS a game canvas — the center must be transparent / empty so
  the canvas art shows through. Anchor UI to the edges/corners.
- KaTeX renders the stem; give the stem container room for one or two lines of
  math without reflowing the layout.
- `data-testid` on every interactive element (buttons, inputs, choices).

## Part 5 — Out of scope (do NOT do this)
- Do NOT design or draw sprites, characters, backgrounds, particles, or any
  in-canvas art. Those are generated separately. Design ONLY the DOM chrome
  that frames and overlays the canvas.
````

### Track B — Asset spec + Ludo generation

Run this while Track A is out. Follow the `generate-art-assets` *discipline* (mood → palette → seed → lock → batch → QA handoff), but the **generation backend is Ludo AI** — that's what every shipping game actually uses. Cite [art-direction.md](../../../_docs/game-design/art-direction.md) and [asset-pipeline.md](../../../_docs/game-design/asset-pipeline.md) for the craft floor.

1. **Art-bible.** Write `games/<slug>/_docs/art-bible.md` — palette derived from the seed references, style tokens, and a reusable prompt anchor.
2. **Asset spec.** Declare what to generate in `games/<slug>/src/assets-manifest.ts` as const arrays: `SPRITES`, `SHEETS` (animations), `TILES` (backgrounds), `FX`, `UI`, `SFX`, `MUSIC`. Mirror [`dungeon-of-digits/src/assets-manifest.ts`](../../../games/dungeon-of-digits/src/assets-manifest.ts).
3. **Copy the Ludo harness** from [`games/dungeon-of-digits/tools/asset-gen/`](../../../games/dungeon-of-digits/tools/asset-gen/) — `ludo-client.ts`, `gen-anchor.ts`, `batch.ts`, `gen-animations.ts`, `remove-bgs.ts`, `integrate.ts` — and adapt to the spec.
4. **Generate at highest quality** (defaults below). Stills via `ludo.createImage` / `ludo.generateWithStyle`; animations via `ludo.animateSprite`; sprite cutouts via `ludo.removeBackground`; audio via `ludo.createSoundEffect` / `ludo.createMusic`. Run as `node --env-file=.env.local games/<slug>/tools/asset-gen/<script>.ts` — requires `LUDO_API_KEY`; call `ludo.validateApiKey()` first.
5. **QA gate.** Hand the generated set to `qa-game-art`. Generation is not done until validation is done.

#### Ludo highest-quality defaults (always use these)

Per the user's standing preference — highest-quality model and highest practical frame count; don't optimize for credit cost unless asked.

```
animateSprite:
  model:      "eagle"   # 8/10 quality. "eagle-audio" only if audio is also needed. Never "blitz" except prototyping.
  frames:     25        # 5×5 grid default. 36 or 49 for hero animations. Never 4 except prototyping.
  frame_size: 384       # character sheets → 25@384 = 1920×1920. Watch the 4096 WebGL texture cap.
  duration:   1         # lowest valid for eagle → 25 frames / 1s = 25 fps.

Then in code: set BootScene frameWidth/frameHeight = frame_size, and
anims.create({ frameRate }) = frames / duration.

Valid enums (MCP introspection):
  frames     {4, 9, 16, 25, 36, 49, 64}
  frame_size {32, 64, 96, 128, 192, 256, 384, 0(max), -1(1.5×), -9(match input)}
  duration   eagle/eagle-audio {1,2,3,4}; blitz {1.2,1.5,2,2.5,3,3.5,4}; chaos {4}
```

Sprites are non-POT after generation → apply POT-resize + `mipmapFilter` so they don't render pixelated in-game (this bites every game).

---

## Phase 3 — Combine (when the HTML/CSS mockup returns)

1. **Scaffold** per `port-game`: create `games/<slug>/` with `package.json` (`@stratacademy/game-<slug>`; deps `@stratacademy/game-bridge`, `@stratacademy/game-ui`, `@stratacademy/types`), `tsconfig.json`, `vitest.config.ts`, and `src/`: `main.ts` (`mount()`), `game.ts` (pure sim, no Phaser/DOM deps), `phaser-config.ts`, `scenes/` (`BootScene`, `TitleScene`, `PlayScene`, `HudScene`, `GameOverScene`).
2. **Translate the mockup → DOM HUD.** Lift the mockup's CSS into `src/style.css` and inject via `injectStyles()`; rebuild its markup as the HUD and embed it into the Phaser scene with `scene.add.dom(x, y, el).setDepth(...)`. Keep `dom: { createContainer: true }` in the Phaser config. **Gotcha:** `scene.add.dom(el).node` *is* the element, not a wrapper — and a throw inside any scene `update()` freezes the whole render loop (black canvas, DOM stuck top-left). Carry over the mockup's `data-testid` attributes verbatim.
3. **Wire shared UI — never re-implement.** From `@stratacademy/game-ui`: `renderStem()` (KaTeX) into the stem container, `renderChoice()` for choice text, `buildAnswerOptions()` to derive tap/typed options from the server problem (no local distractor synthesis), `sortLeaderboardEntries()` for ranking (platform rule, not per-game).
4. **Wire the bridge** (`@stratacademy/game-bridge`): `connect()`; `fetchProblems()` behind a refill queue; **server-authoritative grading** — always `await submitAttempt()` and apply score/HP/streak only from the returned verdict, never compare answers client-side; phase lifecycle (`pause`/`resume`/`terminate`); `createMatchController` for `vs-score`.
5. **Implement all three modes:** `solo`, `vs-score`, and `flat` (diagnostic — no failure state, `resetForFlatPhase()` + `onBatchDone()`).
6. **Drop in the Ludo assets:** load via `assets-manifest.ts` in `BootScene`; set each animation's `frameRate` to `frames / duration` from generation; apply the POT-resize + `mipmapFilter` fix.

---

## Phase 4 — Integrate & ship

- **`manifest.json`** (v2 schema): `slug` (= folder name), `supports.modes: ["solo","vs-score","flat"]`, topics/grades, `testIds` matching the real `data-testid` attributes from the mockup, `queue`/`lobby`/`cpu` for `vs-score`, `thumbnailUrl`. Start `status: "beta"`.
- **Register:** add the slug→loader in [`apps/portal/src/lib/game-registry.ts`](../../../apps/portal/src/lib/game-registry.ts) and the workspace dep in [`apps/portal/package.json`](../../../apps/portal/package.json); then `pnpm install --no-frozen-lockfile`.
- **Ingest:** `pnpm games:ingest` (dev, reads `.env.local`) to upsert the manifest into Postgres. Re-run after any manifest change.
- **Validate:** `pnpm games:validate`, `pnpm games:typecheck`, `pnpm games:conformance`; run `qa-game-art`; finish with `pnpm ci:quick`.
- **Ship:** branch first — **never push to master**. Defer commit/PR conventions to `Codex-rules` + `pr-review`. Flip `status` → `"live"` and re-ingest with `--prod` only as a deploy step.

---

## Supporting docs

| Doc | Load when |
|---|---|
| [_docs/game-design/README.md](../../../_docs/game-design/README.md) | Starting — indexes the full doc set and the Mandatory/Situational legend. |
| [_docs/game-design/design-foundations.md](../../../_docs/game-design/design-foundations.md) | Brainstorm — core loop, math-as-verb, cognitive budget. |
| [_docs/game-design/head-to-head.md](../../../_docs/game-design/head-to-head.md) | Designing `vs-score` fairness; per-player vs symmetric. |
| [_docs/game-design/difficulty-pacing.md](../../../_docs/game-design/difficulty-pacing.md) | Match pacing, onboarding, seed-driven streams. |
| [_docs/game-design/art-direction.md](../../../_docs/game-design/art-direction.md) | Track B — palette, value hierarchy, asset classes. |
| [_docs/game-design/asset-pipeline.md](../../../_docs/game-design/asset-pipeline.md) | Track B — the production sequence and prompt anatomy. |
| [_docs/game-design/typography.md](../../../_docs/game-design/typography.md) | Design brief — display vs body font roles, KaTeX. |
| [_docs/game-design/game-feel.md](../../../_docs/game-design/game-feel.md) | Tuning juice, response budgets, easing. |
| [_docs/game-design/audio.md](../../../_docs/game-design/audio.md) | SFX/music balance, browser audio gotchas. |
| games/<slug>/_docs/art-bible.md | Per-game palette + style lock + prompt anchor (you write this in Track B). |

## Supporting skills

- `build-game` — the §0.7 design-note gate and the standards orchestration. Read it in Phase 1; this skill delegates to it.
- `generate-art-assets` — the art discipline (mood → palette → seed → lock → batch → QA). Track B follows it, **but swaps the backend to Ludo AI**.
- `qa-game-art` — validate generated assets against the craft floor; mandatory before integration.
- `port-game` — the *how* of scaffolding a game and wiring it to the bridge/rooms/share. Drives Phase 3–4.
- `mobile-port` — optional follow-up to make the finished game touch-ready.
- `pr-review` + `Codex-rules` — ship conventions (branch-first, review protocol).

---

## Done criteria

1. §0.7 design note approved.
2. Codex-design HTML/CSS integrated as the Phaser DOM HUD; its `data-testid`s preserved.
3. Every Ludo asset on disk under `games/<slug>/public/`; `qa-game-art` PASS (or a written remediation plan).
4. Bridge-wired, server-authoritative grading; all three modes (`solo`/`vs-score`/`flat`) work.
5. `manifest.json` + registry entry + `pnpm games:ingest` done.
6. `games:validate` / `games:typecheck` / `games:conformance` + `ci:quick` green.
7. On a branch, not master.

---

# Number Knockout working decisions

This section records the approved Phase 1 game shape for **Number Knockout** so the later DOM UI/UX, art, and Phaser integration passes stay specific to this game.

## §0.7 Game Shape Decision Note

**Working title:** Number Knockout

**One-line pitch:** A competitive multiplayer dodgeball math game where players race to solve equations by throwing the correct numbered ball at AI-thrown targets, building combos and climbing the leaderboard before time runs out.

**Audience / math scope:** Grades 3-8, focused on multiplication, division, missing-factor equations, fact fluency, mental math, and number sense.

Difficulty scales by grade band:
- Grades 3-4: basic multiplication facts, smaller products, visual-friendly factors.
- Grades 5-6: division facts, missing-factor equations, mixed multiplication/division.
- Grades 7-8: larger numbers, faster pacing, mixed operations, and more distractor pressure.

**Core loop:**
1. The AI opponent throws an incoming numbered dodgeball.
2. The player sees a target equation structure, such as `? x 5 = 15`.
3. The player determines whether one of the six available balls can complete the equation.
4. If the incoming ball is solvable, the player selects the correct numbered dodgeball, aims, and throws.
5. If the incoming ball is impossible for the current target and answer set, the correct action is to dodge or let it pass.
6. If the player's ball collides with the AI ball and the chosen number completes the equation, they score.
7. Correct throws and correct dodges build or preserve streaks, combo multipliers, and leaderboard position.
8. Wrong choices, missed throws, failed dodges, or late reactions break momentum and reduce scoring opportunity.

**Math-as-verb:** The math is the physical play. The player answers by selecting, aiming, and throwing the correct numbered ball to complete the equation through collision. Example: target `15`, operation `x`, AI ball `5`, player chooses `3`, collision confirms `3 x 5 = 15`. At higher difficulty, some incoming balls are trap balls with no valid whole-number answer in the current answer set. In those cases, the math action is recognizing impossibility and dodging to preserve the streak.

**Match shape:** Default match length is 75 seconds, with 60-90 seconds supported for tuning and classroom formats. Players solve as many equations as possible before time expires.

**Max players:** `vs-score` supports up to 8 players per match. Each player has an independent arena and AI dodgeball opponent, with one shared live leaderboard.

**Answer set:** Each problem presents six numbered dodgeballs: one correct answer and five plausible distractors. Distractors should come from near misses, related facts, factor swaps, or operation-confusion answers based on grade/topic.

**AI throw cadence:** The bot throws an incoming numbered dodgeball every X seconds. Initial tuning targets:
- Early/easy: every 3.0-3.5 seconds.
- Normal: every 2.25-2.75 seconds.
- Advanced/streak pressure: every 1.5-2.0 seconds.

**Streak pressure mechanic:** When a player builds a streak, their own bot throws faster to create "defend the streak" tension. Faster throws should feel like pressure, not punishment, because the player is also earning higher combo value.

Suggested thresholds:
- Streak 0-2: normal cadence.
- Streak 3-5: slightly faster cadence.
- Streak 6-9: fast cadence with stronger visual pressure.
- Streak 10+: hot-streak state with high combo potential and intense incoming throws.

**Trap ball / dodge mechanic:** At higher grade and difficulty levels, the bot can throw impossible incoming balls. A trap ball is an incoming value that cannot complete the target equation with any of the six available player balls. The correct response is to dodge or let the ball pass. A successful dodge preserves the streak and can award a small timing/discipline bonus; throwing at a trap ball or failing to dodge breaks the streak.

Trap-ball tuning:
- Grades 3-4: no trap balls in standard play, except optional tutorial examples.
- Grades 5-6: rare obvious trap balls to teach divisibility and factor recognition.
- Grades 7-8: more frequent trap balls, especially during streak pressure.
- `flat`: include trap balls only when assessing divisibility, factor recognition, or number sense.

Trap-ball fairness:
- Trap balls must be generated deliberately, not as accidental unsolvable problems.
- The six answer balls must contain no valid solution for a trap ball.
- The same grade/topic/difficulty settings should produce comparable trap frequency for all `vs-score` players.
- Early versions may use subtle visual/audio tells; higher difficulty can reduce those tells.

**Supported modes:**
- `solo`: Practice against AI dodgeball opponents with adjustable difficulty and no live leaderboard pressure.
- `vs-score`: Up to 8 human players race in parallel. Each player has their own arena and AI opponent, but all share a live leaderboard.
- `flat`: Diagnostic mode with no failure state and lower pressure. It tracks missed facts, response time, accuracy, and common error patterns.

**Statefulness:** Mostly stateless per problem, with lightweight match state: score, streak, combo multiplier, timer, accuracy, recent misses, difficulty pacing, and leaderboard rank.

**Loop spine:** Opponent leaderboard pressure plus personal streak pressure. In `vs-score`, players race up the shared leaderboard. In all modes, the AI's incoming dodgeballs create urgency while combos make success feel risky and valuable.

**Symmetric / variance decision:** Multiplayer uses parallel independent arenas. Players do not directly interfere with each other physically. Fairness comes from comparable problem streams, shared scoring rules, and identical streak-pressure thresholds. Variance comes from execution skill, speed, and streak preservation.

**Win / lose condition:** No elimination in standard play. Highest score when time expires wins. Failure feels like choosing the wrong ball, missing the collision, breaking a combo, losing scoring momentum, or sliding on the leaderboard.

**Reference feel:** Sports-first, education-second. The game should feel like top-down arcade dodgeball, air hockey, and a Mario Party-style minigame with Blooket's competitive energy and Rocket League's simple-to-learn, difficult-to-master design philosophy.

**Visual direction:** Top-down cartoon school gym. Bright but not babyish. Numbered dodgeballs, polished gym floor, animated scoreboards, crowd reactions, combo bursts, impact effects, and a readable arena layout.

**Initial product decision:** Proceed with a Phaser 4 top-down arena game where the canvas owns dodgeball action and animation while the DOM HUD owns title, lobby, in-match chrome, feedback states, results, and leaderboard.
