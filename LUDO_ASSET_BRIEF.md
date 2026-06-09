# Number Knockout Ludo Asset Brief

This brief is for generating the in-canvas visual and audio assets for **Number Knockout** with Ludo AI. It is separate from the DOM UI/UX brief. Claude Design owns HUD/screens/DOM chrome; Ludo owns gameplay art, sprites, backgrounds, VFX, animation sheets, audio, and key art.

## Creative North Star

**Game fantasy:** A fast, colorful school-gym dodgeball showdown where kids solve math by throwing the right numbered dodgeball at a robot gym mascot's incoming ball, or dodge impossible trap balls to protect a streak.

**Art direction:** Polished mobile arcade sports game with Saturday-morning cartoon energy. Bright, readable, friendly, and exciting. The game should feel like a sports game first and an educational game second.

**Target audience:** Grades 3-8. The visuals should be kid-friendly without feeling babyish. Use exaggerated shapes, clean silhouettes, confident colors, and high readability.

**Camera:** Slightly angled top-down arcade camera, low enough to see the player's back, legs, and throwing stance. The player should appear near the bottom of the court in a three-quarter rear view, while the robot opponent appears across the court near the top.

**Style anchor:** Colorful cartoon school gym, polished wooden court, bold court markings, classic red rubber dodgeballs with large white numbers, rear-view student athlete at the near side of the court, friendly robot mascot opponent across the court, energetic combo effects.

## Global Prompt Anchor

Use this anchor across all generated assets for consistency:

> Bright polished 2D arcade sports game, slightly angled top-down school gym dodgeball arena, colorful cartoon style, rear-view student athlete near the bottom of the court, friendly robot gym mascot opponent across the court, clean readable silhouettes, soft cel-shaded shapes, high-contrast details, energetic kid-friendly mood, polished wooden gym floor, bold court lines, classic red rubber dodgeballs, modern mobile game quality, crisp edges, no gritty realism, no horror, no clutter, no text except requested numbers.

## Palette

- Court wood: `#D9903D`
- Court shadow: `#8B4A22`
- Scoreboard dark: `#18212B`
- Scoreboard green: `#74F26D`
- Team blue: `#2F80ED`
- Team red: `#EB5757`
- Combo yellow: `#FFD84D`
- Energy cyan: `#45D7FF`
- Panel white: `#FFF8EA`
- Ink: `#17202A`

Palette rule: keep the gameplay area warm and sporty, then use blue/cyan/yellow for action readability and combo hype.

## Asset Set Strategy

This is a prototype, so generate a strong but contained v1 set:

1. One gym court background.
2. One default player athlete.
3. One friendly robot gym mascot opponent.
4. One set of red numbered dodgeballs.
5. Essential player, robot, ball, dodge, trap-ball, and VFX animations.
6. Classroom-friendly arcade sports SFX.
7. One thumbnail/key art image.

All assets should be high quality, but the set should stay focused enough to integrate quickly.

## Backgrounds / Tiles

### `gym_court_background`

**Type:** Full-canvas gameplay background  
**Recommended size:** 1280x720  
**Prompt:**

> Slightly angled top-down school gym dodgeball court for a colorful 2D arcade sports game, camera low enough to support a rear-view player at the near bottom side and a robot opponent across the far top side, polished wooden floor, bold white and blue court lines, center dodgeball lane, red team side and blue team side accents, wall mats, bleachers in the background edges, small cheering crowd silhouettes, scoreboard on far wall, bright gym lighting, clean empty central play area, readable at gameplay scale, kid-friendly polished mobile game style, no text, no UI panels.

**Notes:**
- Keep the center playable area clear.
- Bleachers/crowd should stay near edges and not fight the ball readability.
- Leave room for DOM HUD around the edges.

### `gym_court_hot_streak_overlay`

**Type:** Transparent overlay / VFX background accent  
**Recommended size:** 1280x720 PNG with transparency  
**Prompt:**

> Transparent hot streak arena overlay for a top-down cartoon gym dodgeball game, subtle golden spotlight beams, energetic court-edge glow, speed-line accents near edges, combo hype atmosphere, readable center left mostly transparent, polished arcade sports style, no text, no characters.

**Notes:** Use sparingly in-game during streak 10+.

## Characters / Sprites

### `player_athlete_default`

**Type:** Character sprite sheet  
**Recommended perspective:** three-quarter rear view from a slightly angled top-down camera  
**Recommended frame size:** 384x384  
**Animations:** rear idle, rear ready, rear throw, side dodge, rear celebrate, rear stunned  
**Prompt:**

> Default student dodgeball athlete for a colorful slightly angled top-down 2D arcade sports game, shown from behind in a three-quarter rear view, blue gym jersey, sneakers, wristbands, visible back and legs, athletic throwing stance, kid-friendly stylized proportions, readable silhouette at gameplay scale, polished cartoon mobile game quality, clean cel-shaded shapes, transparent background.

**Design calls:**
- Use blue as the player's default team color.
- Keep the character readable when scaled down.
- Avoid too many tiny outfit details.
- Do not use a face-forward top-down pose for the main gameplay sprite; the player should read as standing near the bottom of the court facing the robot across the court.

### `robot_gym_mascot`

**Type:** Static character sprite for prototype  
**Recommended frame size:** 384x384  
**Animations:** none required for prototype; use tweening, squash/stretch, rotation, and simple VFX in Phaser to fake windup/throw/hot-streak states  
**Prompt:**

> Friendly robot gym mascot dodgeball opponent for a colorful school gym arcade game, slightly angled top-down view from across the court, rounded robot body facing downward toward the player, whistle lanyard, small coach visor, red team accents, expressive LED eyes, one dodgeball launcher arm, funny competitive personality, safe and friendly, polished cartoon mobile game style, transparent background.

**Design calls:**
- The robot should be charming and slightly mischievous, not scary.
- It can glow red/yellow during streak pressure.
- It should read clearly as an AI opponent/mascot.

## Dodgeballs

### `numbered_dodgeballs_red`

**Type:** Still sprite set  
**Recommended size:** 256x256 per ball  
**Numbers needed:** 0-20 for prototype, with room to expand later  
**Prompt:**

> Classic red rubber dodgeball sprite for a colorful top-down arcade sports game, large bold white number on the ball, slight shine, black rubber seam lines, clean readable silhouette, transparent background, mobile game polish.

**Generation note:** Generate a clean base ball and numbered variants. Numbers must be very readable at small sizes. If Ludo struggles with exact text, generate blank balls and add numbers later in code or post-processing.

### `selected_ball_glow`

**Type:** Transparent VFX sprite  
**Recommended size:** 256x256  
**Prompt:**

> Transparent selection glow ring for a red dodgeball in a cartoon arcade sports game, electric cyan and yellow outline, soft pulsing aura, clean circle shape, no text, transparent background.

### `incoming_ball_warning`

**Type:** Transparent VFX sprite  
**Recommended size:** 384x384  
**Prompt:**

> Transparent incoming dodgeball warning effect, red-orange motion streaks and alert ring, cartoon arcade sports style, readable but not scary, no text, transparent background.

### `trap_ball_warning`

**Type:** Transparent VFX sprite  
**Recommended size:** 384x384  
**Prompt:**

> Transparent trap ball warning effect for a top-down cartoon dodgeball math game, subtle purple-orange danger shimmer, abstract question-mark energy without readable text, quick dodge cue, kid-friendly arcade sports style, transparent background.

## Animation Sheets

Use the highest-quality practical Ludo defaults:

- Model: `eagle`
- Frames: `25`
- Frame size: `384`
- Duration: `1`
- In code: animation frame rate should be `25 fps`.

Use `36` or `49` frames only for hero/key-art style animations if needed.

### Required Character Animations

1. `player_idle`
   - Subtle athletic bounce, hands ready, readable loop.
2. `player_ready`
   - Leans forward and tracks the incoming ball.
3. `player_throw`
   - Snappy dodgeball throw with strong follow-through.
4. `player_dodge`
   - Quick side-step movement.
5. `player_celebrate`
   - Small victory pump, kid-friendly energy.
6. `player_stunned`
   - Brief dizzy/miss reaction, not humiliating.
7. `player_successful_dodge`
   - Quick athletic sidestep as a trap ball passes safely.
8. `robot_idle`
   - Mascot bounce, blinking LED eyes.
9. `robot_windup`
   - Launcher arm charges a throw.
10. `robot_throw`
   - Normal dodgeball launch.
11. `robot_fast_throw`
   - Faster throw with motion streaks.
12. `robot_hot_streak_powerup`
   - Robot glows red/yellow and spins up.
13. `robot_malfunction_stunned`
   - Friendly wobble/sparks after a correct hit.

### Required Ball Animations

1. `ball_spin`
   - Red ball spinning with visible seam movement.
2. `ball_throw_trail`
   - Ball traveling with motion streaks.
3. `ball_correct_collision`
   - Two balls collide with yellow/cyan burst.
4. `ball_wrong_bounce`
   - Dull bounce, small red-orange puff.
5. `ball_combo_trail`
   - Hot streak ball trail, yellow flames plus cyan sparks.
6. `trap_ball_pass`
   - Incoming ball streaks by with a near-miss dodge cue.

## VFX

### `correct_hit_burst`

**Type:** Transparent sprite sheet or VFX still sequence  
**Prompt:**

> Correct answer dodgeball collision burst for a colorful arcade sports game, yellow starburst, cyan sparks, tiny confetti flecks, energetic impact ring, transparent background, no text.

### `wrong_hit_puff`

**Type:** Transparent sprite sheet or VFX still sequence  
**Prompt:**

> Wrong answer dodgeball impact puff for a colorful school gym arcade game, soft red-orange smoke puff, small wobble lines, gentle failure feedback, transparent background, no harsh symbols, no text.

### `combo_up_effect`

**Type:** Transparent sprite sheet  
**Prompt:**

> Combo up energy effect for kid-friendly arcade sports game, golden burst, cyan electric accents, upward motion lines, celebratory but readable, transparent background, no text.

### `hot_streak_effect`

**Type:** Transparent sprite sheet  
**Prompt:**

> Hot streak aura effect for a dodgeball athlete, golden flame trail mixed with cyan sparks, energetic sports arcade style, transparent background, readable at small size, no text.

### `successful_dodge_effect`

**Type:** Transparent sprite sheet  
**Prompt:**

> Successful dodge effect for a colorful arcade dodgeball game, clean whoosh arc, small blue speed lines, subtle gold streak-preserved sparkle, transparent background, no text.

### `rank_up_spark`

**Type:** Transparent sprite sheet  
**Prompt:**

> Leaderboard rank-up sparkle effect, green scoreboard glow, yellow stars, quick celebratory pop, transparent background, no text.

## UI-Support Art From Ludo

Claude Design owns the DOM UI, but these Ludo-generated assets can support branding and thumbnails.

### `number_knockout_thumbnail`

**Type:** Game card / store thumbnail  
**Recommended size:** 1024x576  
**Prompt:**

> Key art for Number Knockout, a colorful school gym dodgeball math arcade game, smiling student athlete throwing a red numbered dodgeball, friendly robot gym mascot opponent launching another ball, polished wooden court, bright scoreboard glow, energetic combo sparks, kid-friendly competitive mood, mobile game promotional art, no readable text.

### `number_knockout_logo_mark`

**Type:** Optional transparent logo art without final typography  
**Recommended size:** 1024x512 PNG transparent  
**Prompt:**

> Logo mark for a colorful dodgeball math arcade game, red dodgeball colliding with a golden number burst, gym scoreboard energy, playful sports badge shape, transparent background, no readable text.

## Audio

Audio should be classroom-friendly: energetic but not chaotic, short, clean, and easy to mute.

Prototype note: all current prototype SFX are sourced from Pixabay. Future generated or replaced audio should keep equivalent attribution notes in the project docs.

### Music

#### `music_arcade_gym_loop`

**Prompt:**

> Upbeat classroom-friendly arcade sports music loop, school gym pep rally energy, playful drums, claps, light electronic bass, bright synth hooks, competitive but not aggressive, seamless 60-75 second loop.

### SFX

Generate these short effects:

1. `sfx_throw`
   - Quick rubber ball whoosh.
2. `sfx_ball_impact`
   - Satisfying rubber dodgeball pop.
3. `sfx_correct_hit`
   - Bright sports impact plus sparkle.
4. `sfx_wrong_hit`
   - Soft thud and wobble, not harsh.
5. `sfx_combo_up`
   - Rising arcade chime.
6. `sfx_hot_streak`
   - Short energetic power-up.
7. `sfx_countdown_tick`
   - Clean scoreboard tick.
8. `sfx_final_buzzer`
   - Gym scoreboard buzzer, brief and friendly.
9. `sfx_rank_up`
   - Quick celebratory blip.
10. `sfx_robot_windup`
   - Friendly mechanical spin-up.
11. `sfx_successful_dodge`
   - Quick whoosh and light sparkle for a clean dodge.
12. `sfx_trap_ball_warning`
   - Short subtle warning shimmer, classroom-friendly.

## Asset Manifest Draft

```ts
export const TILES = [
  "gym_court_background",
  "gym_court_hot_streak_overlay",
] as const;

export const SPRITES = [
  "player_athlete_default",
  "robot_gym_mascot",
  "numbered_dodgeballs_red",
  "selected_ball_glow",
  "incoming_ball_warning",
  "trap_ball_warning",
] as const;

export const SHEETS = [
  "player_idle",
  "player_ready",
  "player_throw",
  "player_dodge",
  "player_celebrate",
  "player_stunned",
  "player_successful_dodge",
  "robot_idle",
  "robot_windup",
  "robot_throw",
  "robot_fast_throw",
  "robot_hot_streak_powerup",
  "robot_malfunction_stunned",
  "ball_spin",
  "ball_throw_trail",
  "ball_correct_collision",
  "ball_wrong_bounce",
  "ball_combo_trail",
  "trap_ball_pass",
  "correct_hit_burst",
  "wrong_hit_puff",
  "combo_up_effect",
  "hot_streak_effect",
  "successful_dodge_effect",
  "rank_up_spark",
] as const;

export const UI = [
  "number_knockout_thumbnail",
  "number_knockout_logo_mark",
] as const;

export const SFX = [
  "sfx_throw",
  "sfx_ball_impact",
  "sfx_correct_hit",
  "sfx_wrong_hit",
  "sfx_combo_up",
  "sfx_hot_streak",
  "sfx_countdown_tick",
  "sfx_final_buzzer",
  "sfx_rank_up",
  "sfx_robot_windup",
  "sfx_successful_dodge",
  "sfx_trap_ball_warning",
] as const;

export const MUSIC = [
  "music_arcade_gym_loop",
] as const;
```

## QA Requirements

Before integration, validate:

- All transparent sprites have clean alpha edges.
- Top-down character silhouettes read clearly at gameplay scale.
- Red numbered balls are readable; if numbers are unreliable, use blank ball art and render numbers in-game.
- Background center stays uncluttered.
- Effects do not obscure the equation or answer choice readability.
- Hot streak visuals increase excitement without making the playfield hard to parse.
- Trap-ball cues should support quick recognition without making the math decision feel automatic.
- Audio is short, friendly, and classroom-safe.
- Sprite sheets use consistent frame sizes and enough padding to avoid cropping.

## Prototype Priority Order

Generate and integrate in this order:

1. `gym_court_background`
2. `player_athlete_default`
3. `robot_gym_mascot`
4. `numbered_dodgeballs_red` or blank red ball base
5. `player_throw`, `robot_throw`, `ball_correct_collision`, `wrong_hit_puff`
6. `combo_up_effect`, `hot_streak_effect`
7. `trap_ball_warning`, `player_successful_dodge`, `successful_dodge_effect`
8. Core SFX
9. Thumbnail/key art
10. Extra animations and polish
