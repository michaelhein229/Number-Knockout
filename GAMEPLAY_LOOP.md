# Number Knockout Gameplay Loop

This file captures the current Phaser prototype loop and separates it from future full-game scope.

## Current Prototype Scope

- Mode: single-player only.
- Match length: 60 seconds.
- Controls: `WASD` to move, mouse/touch click to aim and throw.
- Math: the player always solves for the first operand.
- Operations: addition, subtraction, multiplication, and division.
- For subtraction and division, the player-selected number is always the first operand:
  - `? - 7 = 15`
  - `? / 6 = 9`
- Opponent: one static robot gym mascot across the court.
- Scoring: local-only score, streak, and combo.
- Feedback: code-driven flashes, shake, fire particles, and SFX.
- Audio attribution: all prototype SFX are sourced from Pixabay.
- No multiplayer, lobby, diagnostics, trap balls, or server-authoritative grading yet.

## Current Core Loop

1. Start a 60-second solo round from the title screen.
2. The player spawns above five numbered pickup balls near the bottom of the court.
3. A target equation appears at the top of the screen, such as `? x 5 = 15`.
4. The robot automatically throws a numbered ball from across the court.
5. The player uses `WASD` to run over the correct pickup ball.
6. Running over a ball picks it up.
7. If already carrying a ball, running over another ball swaps to the new one and returns the previous ball to its original spawn position.
8. The player clicks/aims into the court to throw the held ball.
9. A correct throw requires:
   - the selected pickup number equals the missing first operand, and
   - the thrown player ball collides with the robot's incoming ball.
10. Correct hits award points, increase streak, and increase combo pressure.
11. Wrong values, missed collisions, or allowing the robot ball to pass break the streak.
12. The loop repeats until time expires.

## Current Pickup Ball Model

The prototype uses five pickup balls instead of the earlier bottom answer-button row.

- Pickup balls spawn in fixed positions every problem.
- They are arranged in a lower-court arc behind/below the player.
- The answer set includes one correct number and four distractors.
- Pickup collision is intentionally smaller than the visual ball spacing, so the player has to actually run over a ball.
- The old answer-button mode remains in code as a fallback by changing `INPUT_MODE` in `src/main.js` from `"pickup"` to `"buttons"`.

## Current Aiming Model

- The player must be carrying a ball before throwing.
- The cursor controls the throw target.
- A subtle aim line appears after a ball is picked up.
- The player clicks the court to throw.
- Collision is checked continuously while the thrown ball is in flight.
- The current hitbox is intentionally close to the visible ball size.

## Current Robot Pressure

- The first robot ball launches automatically shortly after each new problem appears.
- Robot throws can travel straight or diagonally.
- Robot throw speed ramps over the 60-second match:
  - early throws are slower and easier to read,
  - late throws are faster but should remain doable.
- Streak pressure adds a small additional speed increase.
- Fire particles trail the robot ball.
- More match pressure means more fire particles.

## Current Scoring And Feedback

Correct hit:

- Award points.
- Increase streak.
- Increase combo display.
- Play ball-contact SFX.
- Show `KNOCKOUT!` feedback.

Wrong value or missed collision:

- Break streak.
- Reset combo display.
- Play ball-contact SFX only if the player ball physically collides with the robot ball.
- Shake/flash the screen.

End of round:

- Show final score.
- Show the message: `Thanks for playing this math game prototype!`
- Offer play-again and menu buttons.

## Future Full-Game Scope

These features are part of the intended full game, not the current prototype.

### Multiplayer / `vs-score`

- Up to 8 players in one timed match.
- Each player has an independent arena and robot opponent.
- All players compete on a shared live leaderboard.
- The winner is the highest score when time expires.
- Fairness should come from comparable problem streams, shared scoring rules, and equivalent robot-pressure tuning.

### Diagnostic / `flat`

- Lower-pressure assessment mode.
- No failure state and no live leaderboard pressure.
- Track missed facts, response times, accuracy, and common error patterns.
- Use results to personalize future practice.

### Trap Ball / Dodge Mechanic

Trap balls are future scope. They are not currently implemented.

A trap ball is an incoming robot ball that cannot complete the current equation with any available pickup/answer ball. The correct action would be to dodge or let it pass.

Potential future tuning:

- Grades 3-4: no trap balls in standard play, except optional tutorial examples.
- Grades 5-6: rare obvious trap balls.
- Grades 7-8: more frequent trap balls, especially during streak pressure.
- Diagnostic mode: include trap balls only when assessing divisibility, factor recognition, or number sense.

### Server-Authoritative Grading

The current prototype grades locally in the browser. The future Stratacademy version should submit attempts to the server and apply score/streak/combo only from the returned verdict.

Future action shape:

```ts
type PlayerAction =
  | {
      kind: "throw";
      selectedValue: number;
      targetX: number;
      targetY: number;
      collision: boolean;
    }
  | { kind: "dodge"; timingQuality: "early" | "clean" | "late" };
```

Future verdicts should decide score, streak, combo, diagnostics, and leaderboard updates.
