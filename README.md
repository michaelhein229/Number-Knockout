# Number Knockout

Number Knockout is a fast-paced Phaser prototype for a math dodgeball game. Players solve equations by physically choosing a numbered ball, aiming, and throwing it into an incoming robot-thrown ball before the round timer expires.

The goal is to make math fluency feel like an arcade sports challenge first and a worksheet never.

## Current Prototype

- Single-player 60-second round
- Top-down gym dodgeball court
- `WASD` movement
- `Space` dash with cooldown meter
- Mouse click to aim and throw
- Five numbered pickup balls per problem
- Robot opponent throws numbered balls automatically
- Addition, subtraction, multiplication, and division problems
- Score, streak, combo, timer, hit feedback, particles, and sound effects

For subtraction and division, the player-selected number is always the first operand:

```text
? - 7 = 15
? / 6 = 9
```

## Gameplay Loop

1. Start a solo round from the title screen.
2. Read the target equation at the top of the screen.
3. Run over the correct numbered ball to pick it up.
4. Swap balls by running over a different pickup ball.
5. Aim with the cursor and click to throw.
6. Score by colliding the correct player ball with the robot's incoming ball.
7. Keep building streaks before the 60-second timer runs out.

Correct hits award points and build streak pressure. Wrong values, missed collisions, or letting the robot ball pass break the streak.

## Controls

- `WASD`: move
- `Space`: dash
- Mouse / trackpad click: throw the held ball toward the pointer

## Built With

- Phaser 3
- Vanilla JavaScript
- Static HTML/CSS
- AI-assisted ideation, asset planning, implementation, and iteration with Codex

This prototype was built through a conversational design process: first defining the educational gameplay loop, then creating visual and asset briefs, manually prompting Ludo.ai for assets, importing those generated assets, building the Phaser prototype, and rapidly tuning the feel through playtest feedback.

Ludo.ai was used manually because API/MCP access requires the higher paid tier, so the asset brief was optimized for copy/paste prompting instead of automated generation.

## File Structure

```text
.
├── index.html
├── package.json
├── README.md
├── src/
│   ├── main.js
│   └── styles.css
├── assets/
│   ├── audio/
│   ├── backgrounds/
│   ├── raw/
│   ├── sheets/
│   ├── sprites/
│   └── ui/
├── GAMEPLAY_LOOP.md
├── DOM_UI_UX_BRIEF.md
├── LUDO_ASSET_BRIEF.md
└── AGENT.md
```

## Key Files

- `src/main.js`: Phaser scenes, math generation, movement, dash, robot throws, collisions, scoring, and round flow.
- `src/styles.css`: page-level layout around the Phaser canvas.
- `index.html`: static entry point and Phaser CDN load.
- `assets/`: game art, animation sheets, music, and sound effects.
- `GAMEPLAY_LOOP.md`: current prototype rules plus future full-game scope.
- `DOM_UI_UX_BRIEF.md`: UI/UX notes for current and future screens.
- `LUDO_ASSET_BRIEF.md`: asset generation brief and manifest planning.

## Running Locally

You can open `index.html` directly in a browser, or serve the folder locally:

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:5174/
```

## Deploying To GitHub Pages

This is a static site, so GitHub Pages can deploy it from the repository root.

1. Push the project to GitHub.
2. Open the repository settings.
3. Go to `Pages`.
4. Choose `Deploy from a branch`.
5. Select `main` and `/root`.
6. Save.

GitHub will publish the game at a URL like:

```text
https://your-username.github.io/number-knockout/
```

## Asset Notes

Visual assets were generated and organized for prototype use. All prototype SFX are sourced from Pixabay. The title art, court, robot mascot, player sheets, dodgeball art, and audio live under `assets/`.

## Future Scope

The current build is single-player only. Future versions may add:

- Up to 8-player multiplayer matches
- Shared live leaderboard
- Diagnostic math mode
- Grade/topic selection
- Trap balls that should be dodged instead of solved
- Server-authoritative scoring
- More polished animation, UI, and accessibility states

See `GAMEPLAY_LOOP.md` for the fuller future-game breakdown.
