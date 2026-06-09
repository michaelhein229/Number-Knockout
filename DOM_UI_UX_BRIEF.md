# Number Knockout DOM UI/UX Design Brief

This brief describes the current prototype UI and the future full-game UI direction. It is intended to keep the HUD and screen design aligned with the playable Phaser prototype.

## Current Prototype

### Game Summary

- Title: Number Knockout.
- Current mode: single-player prototype.
- Match length: 60 seconds.
- Theme: school gym dodgeball math game.
- Camera: slightly angled gym court.
- Opponent: static robot gym mascot across the court.
- Player action: move with `WASD`, run over a numbered ball to pick it up, click/aim to throw.
- Math rule: the player-selected number is always the missing first operand.
- Current operations: addition, subtraction, multiplication, division.

Examples:

- `? x 5 = 15` means pick up `3`.
- `? - 7 = 15` means pick up `22`.
- `? / 6 = 9` means pick up `54`.

### Current Screen Flow

1. Loading screen.
2. Title/menu screen.
3. Solo gameplay screen.
4. Game-over/results screen.

### Current Title/Menu Screen

The title art already contains the game name, so do not duplicate a large text title above it.

Current menu elements:

- Centered title/key art image.
- `START SOLO` button.
- Instruction box with: `WASD to grab a number. Click and aim to throw.`

Future full-game menu elements:

- Solo start.
- Multiplayer start.
- Diagnostic mode start.
- Grade/topic selection.
- Sound toggle.
- Settings/options.

### Current In-Game HUD

Current HUD elements:

- Equation stem at the top center.
- Instruction box under the equation.
- Score at top left.
- Timer at top right.
- Streak/combo panel at upper right.
- Court/player/robot gameplay in the canvas.
- Five numbered pickup balls on the court.
- Aim line after the player picks up a ball.
- Code-driven feedback text such as `KNOCKOUT!`, `MISS`, `AIM MISS`, and `WRONG BALL`.

Current instruction states:

- No ball held: `WASD to grab a number. Click and aim to throw.`
- Ball held: `Carrying N. Swap by running over another ball. Click and aim to throw.`

Current pickup behavior:

- Five balls spawn in fixed lower-court positions.
- Running over a ball picks it up.
- Running over another ball while carrying swaps to the new ball.
- The previously held ball returns to its original spawn position.

### Current Results Screen

Current results elements:

- `ROUND OVER`
- Final score.
- `Thanks for playing this math game prototype!`
- `PLAY AGAIN`
- `MENU`

## Visual Language

- Sports-first, education-second.
- Bright school gym, polished court, robot mascot, red dodgeballs, arcade feedback.
- Use high contrast for the active equation.
- Keep controls readable and classroom-friendly.
- Use cyan/yellow accents for instructions, score, combo, and positive feedback.
- Use red feedback for wrong/miss states.

Current palette:

- Court wood: `#D9903D`
- Scoreboard dark: `#18212B`
- Scoreboard green: `#74F26D`
- Team blue: `#2F80ED`
- Team red: `#EB5757`
- Combo yellow: `#FFD84D`
- Energy cyan: `#45D7FF`
- Panel white: `#FFF8EA`
- Ink: `#17202A`

## Future Full-Game Scope

The following features are intended for the full Stratacademy game, not the current prototype.

### Multiplayer / `vs-score`

- Up to 8 players in one match.
- Each player has an independent arena and robot opponent.
- Shared live leaderboard.
- Lobby/matchmaking screen with player slots, ready states, selected grade/topic, and countdown.
- Results screen with final rank, score, accuracy, and best streak.

### Diagnostic / `flat`

- Lower-pressure assessment mode.
- No timer pressure or failure state unless explicitly configured.
- Track missed facts, response times, accuracy, and common error patterns.
- Results should emphasize growth data and next-practice suggestions.

### Trap Ball / Dodge

Future mechanic, not currently implemented.

- Some incoming balls may be impossible to solve with available options.
- Correct action is to dodge/hold fire.
- UI should support a dodge/hold-fire state without making the math decision automatic.

### Future HUD Additions

- Opponent leaderboard with up to 8 entries.
- Grade/topic picker.
- Sound toggle.
- Accuracy display.
- Best streak display.
- Diagnostic detail panel.
- Multiplayer rank changes.
- Ready/countdown/lobby states.

## Technical Notes

- Base canvas is 1280x720 and scales to fit.
- Prototype HUD is currently Phaser-rendered text/shapes rather than separate DOM.
- Audio attribution: all prototype SFX are sourced from Pixabay.
- A future production port may translate HUD pieces into Phaser DOM or a platform UI layer.
- Every future DOM interactive element should use `data-testid`.
- KaTeX may be used in the production version for math rendering; the current prototype uses plain Phaser text.

## Future Data Test IDs

Use these if/when the UI is moved into DOM:

- `start-solo-button`
- `start-vs-score-button`
- `start-flat-button`
- `grade-topic-select`
- `sound-toggle`
- `ready-button`
- `leave-lobby-button`
- `stem-container`
- `answer-input`
- `answer-choice-1`
- `answer-choice-2`
- `answer-choice-3`
- `answer-choice-4`
- `answer-choice-5`
- `throw-button`
- `dodge-button`
- `score-display`
- `timer-display`
- `streak-display`
- `combo-display`
- `pressure-display`
- `leaderboard`
- `play-again-button`
- `results-menu-button`
