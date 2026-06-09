const WIDTH = 1280;
const HEIGHT = 720;
const ROUND_SECONDS = 60;
const HIT_RADIUS = 36;
const PICKUP_RADIUS = 46;
const INPUT_MODE = "pickup"; // "pickup" keeps gameplay on-court; "buttons" restores the old bottom answer buttons.
const PICKUP_BALL_COUNT = 5;
const PLAYER_SPEED = 335;
const PLAYER_DISPLAY_WIDTH = 118;
const PLAYER_DISPLAY_HEIGHT = 134;
const PLAYER_THROW_DISPLAY_WIDTH = 178;
const PLAYER_THROW_DISPLAY_HEIGHT = 145;
const DASH_SPEED = 840;
const DASH_DURATION = 190;
const DASH_COOLDOWN = 5000;
const PLAYER_THROW_SPEED = 720;
const ROBOT_BALL_END_Y = HEIGHT - 46;
const PICKUP_SLOTS = [
  { x: 305, y: 555 },
  { x: 470, y: 600 },
  { x: 640, y: 620 },
  { x: 810, y: 600 },
  { x: 975, y: 555 },
];

const ASSET = {
  court: "assets/backgrounds/gym_court_background.png",
  title: "assets/ui/number_knockout_title.png",
  robot: "assets/sprites/robot_gym_mascot.png",
  playerMove: "assets/sheets/player_move_no_outline.png",
  playerThrow: "assets/sheets/player_throw_no_ball.png",
  music: "assets/audio/music_arcade_gym_loop.mp3",
  bounce: "assets/audio/sfx_ball_bounce.mp3",
  contact: "assets/audio/sfx_ball_contact.mp3",
  whoosh: "assets/audio/sfx_throw_whoosh.mp3",
};

const OPERATIONS = ["+", "-", "x", "÷"];

function centeredText(scene, x, y, text, size, color = "#fff", extra = {}) {
  return scene.add
    .text(x, y, text, {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: `${size}px`,
      color,
      align: "center",
      stroke: "#10151c",
      strokeThickness: Math.max(3, Math.floor(size / 12)),
      ...extra,
    })
    .setOrigin(0.5);
}

function makeButton(scene, x, y, label, onClick, width = 260) {
  const box = scene.add
    .rectangle(x, y, width, 64, 0xffd84d, 1)
    .setStrokeStyle(5, 0x17202a)
    .setInteractive({ useHandCursor: true });
  const text = centeredText(scene, x, y, label, 26, "#17202a", {
    strokeThickness: 0,
  });
  box.on("pointerover", () => box.setFillStyle(0xffee83));
  box.on("pointerout", () => box.setFillStyle(0xffd84d));
  box.on("pointerdown", onClick);
  text.setInteractive({ useHandCursor: true }).on("pointerdown", onClick);
  return { box, text };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueOptions(correct, min = 1, max = 20, count = 6) {
  const values = new Set([correct]);
  const near = [-4, -3, -2, -1, 1, 2, 3, 4].map((delta) => correct + delta);
  for (const value of shuffle(near)) {
    if (value >= min && value <= max) values.add(value);
    if (values.size >= count) break;
  }
  while (values.size < count) values.add(randomInt(min, max));
  return shuffle([...values]);
}

function generateProblem(streak) {
  const op = OPERATIONS[randomInt(0, OPERATIONS.length - 1)];
  let answer;
  let incoming;
  let target;

  if (op === "+") {
    answer = randomInt(2, 20);
    incoming = randomInt(1, 15);
    target = answer + incoming;
  } else if (op === "-") {
    incoming = randomInt(1, 15);
    target = randomInt(1, 20);
    answer = target + incoming;
  } else if (op === "x") {
    incoming = randomInt(2, streak >= 8 ? 12 : 10);
    answer = randomInt(2, streak >= 8 ? 12 : 10);
    target = answer * incoming;
  } else {
    incoming = randomInt(2, 10);
    target = randomInt(2, 12);
    answer = target * incoming;
  }

  const maxOption = Math.max(20, answer + 5);
  return {
    op,
    answer,
    incoming,
    target,
    options: uniqueOptions(answer, 1, maxOption, INPUT_MODE === "pickup" ? PICKUP_BALL_COUNT : 6),
    stem: `? ${op} ${incoming} = ${target}`,
  };
}

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.cameras.main.setBackgroundColor("#121923");
    centeredText(this, WIDTH / 2, HEIGHT / 2 - 40, "NUMBER KNOCKOUT", 48, "#45d7ff");
    const barBg = this.add.rectangle(WIDTH / 2, HEIGHT / 2 + 40, 440, 28, 0x263344);
    const bar = this.add.rectangle(WIDTH / 2 - 220, HEIGHT / 2 + 40, 0, 28, 0xffd84d).setOrigin(0, 0.5);
    centeredText(this, WIDTH / 2, HEIGHT / 2 + 92, "Loading gym...", 20, "#fff8ea", {
      strokeThickness: 0,
    });

    this.load.on("progress", (value) => {
      bar.width = 440 * value;
    });

    this.load.image("court", ASSET.court);
    this.load.image("title", ASSET.title);
    this.load.image("robot", ASSET.robot);
    this.load.spritesheet("playerMove", ASSET.playerMove, {
      frameWidth: 468,
      frameHeight: 532,
    });
    this.load.spritesheet("playerThrow", ASSET.playerThrow, {
      frameWidth: 640,
      frameHeight: 520,
    });
    this.load.audio("music", ASSET.music);
    this.load.audioSprite("bounceSprite", {
      resources: [ASSET.bounce],
      spritemap: {
        contact: {
          start: 0,
          end: 0.35,
          loop: false,
        },
      },
    });
    this.load.audio("contact", ASSET.contact);
    this.load.audio("whoosh", ASSET.whoosh);
  }

  create() {
    this.scene.start("MenuScene");
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x121923);
    const title = this.add.image(WIDTH / 2, HEIGHT / 2 - 82, "title");
    title.setDisplaySize(560, 420);
    title.setAlpha(0.95);

    makeButton(this, WIDTH / 2, HEIGHT - 190, "START SOLO", () => this.scene.start("PlayScene"), 300);
    this.add
      .rectangle(WIDTH / 2, HEIGHT - 122, 620, 46, 0x1d2a38, 0.92)
      .setStrokeStyle(3, 0x45d7ff);
    centeredText(this, WIDTH / 2, HEIGHT - 122, "WASD to grab. Space to dash. Click and aim to throw.", 18, "#fff8ea", {
      strokeThickness: 0,
    });
  }
}

class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
    this.problem = null;
    this.selected = null;
    this.score = 0;
    this.streak = 0;
    this.timeLeft = ROUND_SECONDS;
    this.activeRobotBall = null;
    this.playerProjectile = null;
    this.robotLaunchEvent = null;
    this.pickupBalls = [];
    this.heldBall = null;
    this.keys = null;
    this.pickupCooldownUntil = 0;
    this.canThrow = true;
    this.dashReadyAt = 0;
    this.dashUntil = 0;
    this.lastMoveVector = { x: 0, y: -1 };
  }

  create() {
    this.score = 0;
    this.streak = 0;
    this.timeLeft = ROUND_SECONDS;
    this.selected = null;
    this.canThrow = true;
    this.pickupBalls = [];
    this.heldBall = null;
    this.dashReadyAt = 0;
    this.dashUntil = 0;
    this.lastMoveVector = { x: 0, y: -1 };

    this.add.image(WIDTH / 2, HEIGHT / 2, "court").setDisplaySize(WIDTH, HEIGHT);
    this.add.rectangle(WIDTH / 2, 0, WIDTH, 98, 0x10151c, 0.78).setOrigin(0.5, 0);
    this.add.rectangle(WIDTH / 2, HEIGHT, WIDTH, 120, 0x10151c, INPUT_MODE === "pickup" ? 0.34 : 0.82).setOrigin(0.5, 1);
    this.add.rectangle(WIDTH - 152, 170, 250, 150, 0x10151c, 0.72).setStrokeStyle(3, 0xffd84d);

    this.createPlayerAnimations();
    this.robot = this.add.image(WIDTH / 2, 160, "robot").setDisplaySize(142, 142);
    this.player = this.add
      .sprite(WIDTH / 2, 455, "playerMove", 0)
      .setDisplaySize(PLAYER_DISPLAY_WIDTH, PLAYER_DISPLAY_HEIGHT);

    this.problemText = centeredText(this, WIDTH / 2, 42, "", 40, "#fff8ea");
    this.instructionBox = this.add
      .rectangle(WIDTH / 2, 84, 590, 34, 0x1d2a38, 0.9)
      .setStrokeStyle(2, 0x45d7ff);
    this.instructionText = centeredText(this, WIDTH / 2, 84, "WASD to grab. Space to dash. Click and aim to throw.", 17, "#dce7f3", {
      strokeThickness: 0,
    });
    this.scoreText = this.add.text(36, 32, "SCORE 0", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "30px",
      color: "#74f26d",
      stroke: "#10151c",
      strokeThickness: 4,
    });
    this.add.rectangle(WIDTH - 172, HEIGHT - 40, 294, 52, 0x10151c, 0.78).setStrokeStyle(3, 0x45d7ff);
    this.add.text(WIDTH - 300, HEIGHT - 48, "DASH", {
      fontFamily: "Arial Black",
      fontSize: "13px",
      color: "#fff8ea",
    });
    this.dashBarBg = this.add
      .rectangle(WIDTH - 248, HEIGHT - 40, 144, 14, 0x263344, 0.96)
      .setOrigin(0, 0.5)
      .setStrokeStyle(2, 0x10151c);
    this.dashBarFill = this.add.rectangle(WIDTH - 246, HEIGHT - 40, 140, 10, 0x45d7ff, 1).setOrigin(0, 0.5);
    this.dashText = this.add.text(WIDTH - 92, HEIGHT - 48, "SPACE", {
      fontFamily: "Arial Black",
      fontSize: "13px",
      color: "#45d7ff",
    });
    this.timerText = centeredText(this, WIDTH - 94, 38, "60", 32, "#ffd84d");
    this.add.text(WIDTH - 126, 66, "TIME", { fontFamily: "Arial Black", fontSize: "15px", color: "#fff8ea" });
    this.streakText = centeredText(this, WIDTH - 152, 140, "STREAK 0", 21, "#45d7ff", { strokeThickness: 1 });
    this.comboText = centeredText(this, WIDTH - 152, 184, "COMBO x1", 21, "#ffd84d", { strokeThickness: 1 });

    this.aimLine = this.add.line(0, 0, this.player.x, this.player.y - 60, this.player.x, 300, 0x45d7ff, 0.45);
    this.aimLine.setLineWidth(4).setVisible(false);
    this.feedbackText = centeredText(this, WIDTH / 2, 270, "", 42, "#fff", { strokeThickness: 7 }).setAlpha(0);

    this.answerGroup = this.add.group();
    if (INPUT_MODE === "buttons") this.spawnAnswerButtons();
    this.keys = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
      dash: "SPACE",
    });
    this.nextProblem();

    this.input.on("pointermove", (pointer) => {
      if (!this.selected) return;
      this.aimLine.setTo(this.player.x, this.player.y - 50, pointer.x, pointer.y).setVisible(true);
    });
    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (gameObjects.length > 0) return;
      if (this.selected && this.canThrow && pointer.y < HEIGHT - 72 && pointer.y > 105) {
        this.throwSelected(pointer.x, pointer.y);
      }
    });

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.timeLeft -= 1;
        this.timerText.setText(String(this.timeLeft));
        if (this.timeLeft <= 0) this.endRound();
      },
    });

    this.music = this.sound.add("music", { volume: 0.24, loop: true });
    this.music.play();
  }

  update(_time, delta) {
    this.updateDashHud();
    this.updatePlayerMovement(delta);
    this.updateHeldBallPosition();
    this.checkPickupCollisions();

    if (!this.playerProjectile || this.playerProjectile.resolved || !this.activeRobotBall) return;

    if (this.distanceBetween(this.playerProjectile.ball, this.activeRobotBall.ball) < HIT_RADIUS) {
      this.resolveThrow(this.playerProjectile.ball, this.playerProjectile.label, true);
    }
  }

  createPlayerAnimations() {
    if (this.anims.exists("player-throw")) return;
    this.anims.create({
      key: "player-throw",
      frames: this.anims.generateFrameNumbers("playerThrow", { start: 0, end: 9 }),
      frameRate: 36,
      repeat: 0,
    });
  }

  updatePlayerMovement(delta) {
    if (!this.keys || !this.player?.active || this.playerProjectile) return;

    let dx = 0;
    let dy = 0;
    if (this.keys.left.isDown) dx -= 1;
    if (this.keys.right.isDown) dx += 1;
    if (this.keys.up.isDown) dy -= 1;
    if (this.keys.down.isDown) dy += 1;

    if (Phaser.Input.Keyboard.JustDown(this.keys.dash)) this.tryDash(dx, dy);

    const isDashing = this.time.now < this.dashUntil;
    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy);
      this.lastMoveVector = { x: dx / length, y: dy / length };
    }

    if (isDashing) {
      const step = (DASH_SPEED * delta) / 1000;
      this.player.x += this.lastMoveVector.x * step;
      this.player.y += this.lastMoveVector.y * step;
      this.emitDashTrail();
    } else if (dx !== 0 || dy !== 0) {
      const step = (PLAYER_SPEED * delta) / 1000;
      this.player.x += this.lastMoveVector.x * step;
      this.player.y += this.lastMoveVector.y * step;
    }

    this.player.x = Phaser.Math.Clamp(this.player.x, 120, WIDTH - 120);
    this.player.y = Phaser.Math.Clamp(this.player.y, 405, HEIGHT - 84);

    if (dx !== 0 || dy !== 0 || isDashing) {
      this.player.setFrame(Math.floor(this.time.now / 110) % 16);
      if (this.lastMoveVector.x !== 0) this.player.setFlipX(this.lastMoveVector.x < 0);
    } else {
      this.player.setFrame(0);
    }
  }

  tryDash(dx, dy) {
    if (this.time.now < this.dashReadyAt) return;

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy);
      this.lastMoveVector = { x: dx / length, y: dy / length };
    }

    this.dashUntil = this.time.now + DASH_DURATION;
    this.dashReadyAt = this.time.now + DASH_COOLDOWN;
    this.player.setTint(0x9df5ff);
    this.cameras.main.shake(70, 0.0015);
    this.time.delayedCall(DASH_DURATION, () => {
      if (this.player?.active) this.player.clearTint();
    });
  }

  updateDashHud() {
    if (!this.dashBarFill) return;
    const remaining = Phaser.Math.Clamp(this.dashReadyAt - this.time.now, 0, DASH_COOLDOWN);
    const readyRatio = 1 - remaining / DASH_COOLDOWN;
    this.dashBarFill.width = 140 * readyRatio;
    const ready = remaining <= 0;
    this.dashBarFill.setFillStyle(ready ? 0x74f26d : 0x45d7ff);
    this.dashText.setText(ready ? "READY" : `${Math.ceil(remaining / 1000)}s`);
    this.dashText.setColor(ready ? "#74f26d" : "#45d7ff");
  }

  emitDashTrail() {
    if (Math.floor(this.time.now / 35) % 2 !== 0) return;
    const puff = this.add.circle(
      this.player.x - this.lastMoveVector.x * 42,
      this.player.y - 18 - this.lastMoveVector.y * 26,
      Phaser.Math.Between(7, 12),
      0x45d7ff,
      0.32,
    );
    puff.setDepth(1);
    this.tweens.add({
      targets: puff,
      alpha: 0,
      scale: 1.7,
      duration: 180,
      ease: "Quad.easeOut",
      onComplete: () => puff.destroy(),
    });
  }

  updateHeldBallPosition() {
    if (!this.heldBall) return;
    this.heldBall.circle.setPosition(this.player.x + 38, this.player.y - 42);
    this.heldBall.text.setPosition(this.player.x + 38, this.player.y - 42);
  }

  checkPickupCollisions() {
    if (INPUT_MODE !== "pickup" || !this.canThrow || this.playerProjectile) return;
    if (this.time.now < this.pickupCooldownUntil) return;

    for (const pickup of this.pickupBalls) {
      if (!pickup.active) continue;
      if (this.distanceBetween(this.player, pickup.circle) < PICKUP_RADIUS) {
        this.pickUpBall(pickup);
        break;
      }
    }
  }

  distanceBetween(a, b) {
    return Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
  }

  spawnAnswerButtons() {
    const startX = WIDTH / 2 - 315;
    for (let i = 0; i < 6; i += 1) {
      const x = startX + i * 126;
      const y = HEIGHT - 58;
      const circle = this.add.circle(x, y, 46, 0xdb1f1f).setStrokeStyle(5, 0x270909);
      const text = centeredText(this, x, y, "?", 30, "#fff8ea");
      circle.setInteractive({ useHandCursor: true });
      circle.on("pointerdown", () => this.selectAnswer(i));
      text.setInteractive({ useHandCursor: true });
      text.on("pointerdown", () => this.selectAnswer(i));
      this.answerGroup.addMultiple([circle, text]);
    }
  }

  answerObjects() {
    return this.answerGroup.getChildren();
  }

  nextProblem() {
    this.clearRobotBall();
    this.clearPlayerProjectile();
    this.clearPickupBalls();
    this.clearHeldBall();
    this.problem = generateProblem(this.streak);
    this.selected = null;
    this.canThrow = true;
    this.problemText.setText(this.problem.stem);
    this.instructionText.setText(
      INPUT_MODE === "pickup"
        ? "WASD to grab. Space to dash. Click and aim to throw."
        : "Select a ball, then click in the court to throw.",
    );
    this.aimLine.setVisible(false);

    if (INPUT_MODE === "pickup") {
      this.spawnPickupBalls();
    } else {
      const objects = this.answerObjects();
      for (let i = 0; i < 6; i += 1) {
        const circle = objects[i * 2];
        const text = objects[i * 2 + 1];
        circle.value = this.problem.options[i];
        circle.setFillStyle(0xdb1f1f);
        circle.setScale(1);
        text.setText(String(this.problem.options[i]));
      }
    }

    this.scheduleRobotBall(650);
  }

  spawnPickupBalls() {
    this.pickupBalls = this.problem.options.map((value, index) => {
      const slot = PICKUP_SLOTS[index];
      const circle = this.add.circle(slot.x, slot.y, 37, 0xdb1f1f).setStrokeStyle(4, 0x270909);
      const text = centeredText(this, slot.x, slot.y, String(value), 22, "#fff8ea", {
        strokeThickness: 2,
      });
      const pickup = { value, circle, text, slot, active: true };
      this.tweens.add({
        targets: [circle, text],
        y: `+=${index % 2 === 0 ? 5 : -5}`,
        duration: 620,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      return pickup;
    });
  }

  clearPickupBalls() {
    for (const pickup of this.pickupBalls) {
      this.tweens.killTweensOf([pickup.circle, pickup.text]);
      pickup.circle.destroy();
      pickup.text.destroy();
    }
    this.pickupBalls = [];
  }

  pickUpBall(pickup) {
    const newValue = pickup.value;
    this.pickupCooldownUntil = this.time.now + 260;
    this.selected = newValue;

    if (this.heldBall?.sourcePickup) this.restorePickup(this.heldBall.sourcePickup);

    pickup.active = false;
    this.tweens.killTweensOf([pickup.circle, pickup.text]);
    pickup.circle.setVisible(false);
    pickup.text.setVisible(false);

    if (!this.heldBall) {
      this.heldBall = {
        circle: this.add.circle(this.player.x + 38, this.player.y - 42, 22, 0xffd84d).setStrokeStyle(4, 0x270909),
        text: centeredText(this, this.player.x + 38, this.player.y - 42, String(newValue), 16, "#17202a", {
          strokeThickness: 0,
        }),
        sourcePickup: pickup,
      };
    } else {
      this.heldBall.text.setText(String(newValue));
      this.heldBall.sourcePickup = pickup;
    }

    this.updateHeldBallPosition();
    this.instructionText.setText(`Carrying ${newValue}. Space to dash. Click and aim to throw.`);
  }

  restorePickup(pickup) {
    pickup.active = true;
    pickup.circle.setFillStyle(0xdb1f1f).setPosition(pickup.slot.x, pickup.slot.y).setVisible(true);
    pickup.text.setText(String(pickup.value)).setPosition(pickup.slot.x, pickup.slot.y).setVisible(true);
    this.tweens.killTweensOf([pickup.circle, pickup.text]);
    this.tweens.add({
      targets: [pickup.circle, pickup.text],
      y: "+=5",
      duration: 620,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  clearHeldBall() {
    if (!this.heldBall) return;
    this.heldBall.circle.destroy();
    this.heldBall.text.destroy();
    this.heldBall = null;
  }

  selectAnswer(index) {
    if (!this.canThrow) return;
    const objects = this.answerObjects();
    for (let i = 0; i < 6; i += 1) {
      objects[i * 2].setFillStyle(0xdb1f1f).setScale(1);
    }
    const circle = objects[index * 2];
    circle.setFillStyle(0xffd84d).setScale(1.12);
    this.selected = circle.value;
    this.instructionText.setText(`Selected ${this.selected}. Click the court to throw.`);
  }

  launchRobotBall() {
    if (this.timeLeft <= 0 || this.activeRobotBall) return;
    const angleOffset = Phaser.Math.Between(-145, 145);
    const matchProgress = Phaser.Math.Clamp((ROUND_SECONDS - this.timeLeft) / ROUND_SECONDS, 0, 1);
    const fireLevel = Math.min(5, 1 + Math.floor(matchProgress * 5));
    const ball = this.add.circle(this.robot.x, this.robot.y + 54, 24, 0xf04b2f).setStrokeStyle(4, 0x3b0808);
    const label = centeredText(this, ball.x, ball.y, String(this.problem.incoming), 18, "#fff8ea", {
      strokeThickness: 2,
    });
    const duration = Math.max(1400, Phaser.Math.Linear(3780, 2025, matchProgress) - this.streak * 65);
    const tween = this.tweens.add({
      targets: [ball, label],
      x: this.player.x + angleOffset,
      y: ROBOT_BALL_END_Y,
      duration,
      ease: "Linear",
      onComplete: () => this.robotBallMissed(),
    });
    this.activeRobotBall = { ball, label, tween, fireLevel, fireEvent: null };
    this.activeRobotBall.fireEvent = this.time.addEvent({
      delay: Math.max(55, 160 - fireLevel * 22),
      loop: true,
      callback: () => this.emitRobotFire(),
    });
    this.tweens.add({
      targets: this.robot,
      angle: { from: -6, to: 0 },
      duration: 180,
      yoyo: true,
    });
  }

  robotBallMissed() {
    if (!this.activeRobotBall) return;
    this.clearRobotBall();
    this.breakStreak("MISS");
    this.nextProblem();
  }

  emitRobotFire() {
    if (!this.activeRobotBall) return;
    const { ball, fireLevel } = this.activeRobotBall;
    for (let i = 0; i < fireLevel; i += 1) {
      const ember = this.add.circle(
        ball.x + Phaser.Math.Between(-14, 14),
        ball.y - Phaser.Math.Between(12, 30),
        Phaser.Math.Between(4, 8 + fireLevel),
        i % 2 === 0 ? 0xff7a1a : 0xffd84d,
        0.82,
      );
      ember.setDepth(2);
      this.tweens.add({
        targets: ember,
        x: ember.x + Phaser.Math.Between(-18, 18),
        y: ember.y + Phaser.Math.Between(12, 34),
        alpha: 0,
        scale: 0.25,
        duration: Phaser.Math.Between(220, 380),
        ease: "Quad.easeOut",
        onComplete: () => ember.destroy(),
      });
    }
  }

  scheduleRobotBall(delay = 900) {
    this.robotLaunchEvent?.remove(false);
    this.robotLaunchEvent = this.time.delayedCall(delay, () => {
      this.robotLaunchEvent = null;
      this.launchRobotBall();
    });
  }

  clearRobotBall() {
    if (!this.activeRobotBall) return;
    this.activeRobotBall.fireEvent?.remove(false);
    this.tweens.killTweensOf([this.activeRobotBall.ball, this.activeRobotBall.label]);
    this.activeRobotBall.ball.destroy();
    this.activeRobotBall.label.destroy();
    this.activeRobotBall = null;
  }

  clearPlayerProjectile() {
    if (!this.playerProjectile) return;
    this.tweens.killTweensOf([this.playerProjectile.ball, this.playerProjectile.label]);
    this.playerProjectile.ball.destroy();
    this.playerProjectile.label.destroy();
    this.playerProjectile = null;
  }

  throwSelected(targetX, targetY) {
    if (!this.selected) return;
    this.canThrow = false;
    this.aimLine.setVisible(false);
    this.sound.play("whoosh", { volume: 0.55 });
    const launchX = this.heldBall?.circle.x ?? this.player.x + 38;
    const launchY = this.heldBall?.circle.y ?? this.player.y - 42;
    this.clearHeldBall();
    this.player.setTexture("playerThrow", 0).setDisplaySize(PLAYER_THROW_DISPLAY_WIDTH, PLAYER_THROW_DISPLAY_HEIGHT);
    this.player.play("player-throw", true);
    this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (this.player?.active) {
        this.player.setTexture("playerMove", 0).setDisplaySize(PLAYER_DISPLAY_WIDTH, PLAYER_DISPLAY_HEIGHT);
      }
    });

    const playerBall = this.add.circle(launchX, launchY, 20, 0xdb1f1f).setStrokeStyle(4, 0x270909);
    const label = centeredText(this, playerBall.x, playerBall.y, String(this.selected), 16, "#fff8ea", {
      strokeThickness: 2,
    });
    this.playerProjectile = { ball: playerBall, label, resolved: false };
    const throwDistance = Phaser.Math.Distance.Between(playerBall.x, playerBall.y, targetX, targetY);
    const throwDuration = Phaser.Math.Clamp((throwDistance / PLAYER_THROW_SPEED) * 1000, 420, 920);

    this.tweens.add({
      targets: [playerBall, label],
      x: targetX,
      y: targetY,
      duration: throwDuration,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.resolveThrow(playerBall, label, false);
      },
    });
  }

  resolveThrow(playerBall, label, forcedHit = false) {
    if (this.playerProjectile?.resolved) return;
    if (this.playerProjectile) this.playerProjectile.resolved = true;

    const correct = this.selected === this.problem.answer;
    const robotBall = this.activeRobotBall;
    const hit = forcedHit || (this.activeRobotBall
      ? Phaser.Math.Distance.Between(
          playerBall.x,
          playerBall.y,
          this.activeRobotBall.ball.x,
          this.activeRobotBall.ball.y,
        ) < HIT_RADIUS
      : false);

    this.tweens.killTweensOf([playerBall, label]);

    if (hit && robotBall) {
      const impactX = (playerBall.x + robotBall.ball.x) / 2;
      const impactY = (playerBall.y + robotBall.ball.y) / 2;
      this.sound.play("contact", { volume: 1.0 });
      this.createCombinedBall(impactX, impactY, correct);
      robotBall.fireEvent?.remove(false);
      this.tweens.killTweensOf([robotBall.ball, robotBall.label]);
      robotBall.ball.destroy();
      robotBall.label.destroy();
      this.activeRobotBall = null;
    }

    playerBall.destroy();
    label.destroy();
    this.playerProjectile = null;

    if (correct && hit) {
      this.score += 100 + this.streak * 15;
      this.streak += 1;
      this.scoreText.setText(`SCORE ${this.score}`);
      this.streakText.setText(`STREAK ${this.streak}`);
      this.comboText.setText(`COMBO x${Math.min(5, 1 + Math.floor(this.streak / 3))}`);
      this.flashFeedback("KNOCKOUT!", "#74f26d");
    } else {
      this.breakStreak(correct ? "AIM MISS" : "WRONG BALL");
      if (!hit && this.activeRobotBall) {
        this.clearRobotBall();
      }
    }

    this.time.delayedCall(520, () => {
      if (this.timeLeft > 0) this.nextProblem();
    });
  }

  createCombinedBall(x, y, correct) {
    const color = correct ? 0xffd84d : 0xf04b2f;
    const stroke = correct ? 0x6d4a00 : 0x3b0808;
    const ball = this.add.circle(x, y, 31, color, 1).setStrokeStyle(5, stroke).setDepth(8);
    const text = centeredText(this, x, y, String(this.problem.target), 18, "#17202a", {
      strokeThickness: 0,
    }).setDepth(9);
    const angle = Phaser.Math.FloatBetween(-Math.PI * 0.92, -Math.PI * 0.08);
    const distance = 760;
    const endX = x + Math.cos(angle) * distance;
    const endY = y + Math.sin(angle) * distance;

    this.tweens.add({
      targets: [ball, text],
      x: endX,
      y: endY,
      scale: 0.7,
      angle: Phaser.Math.Between(-260, 260),
      duration: 1250,
      ease: "Cubic.easeOut",
      onComplete: () => {
        ball.destroy();
        text.destroy();
      },
    });
  }

  breakStreak(message) {
    this.streak = 0;
    this.streakText.setText("STREAK 0");
    this.comboText.setText("COMBO x1");
    this.flashFeedback(message, "#eb5757");
    this.cameras.main.shake(130, 0.004);
  }

  flashFeedback(text, color) {
    this.feedbackText.setText(text).setColor(color).setAlpha(1).setScale(0.8);
    this.tweens.add({
      targets: this.feedbackText,
      alpha: 0,
      scale: 1.14,
      y: 244,
      duration: 520,
      ease: "Quad.easeOut",
      onComplete: () => this.feedbackText.setY(270),
    });
  }

  endRound() {
    this.music?.stop();
    this.scene.start("GameOverScene", { score: this.score, streak: this.streak });
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create(data) {
    this.add.image(WIDTH / 2, HEIGHT / 2, "court").setDisplaySize(WIDTH, HEIGHT).setAlpha(0.5);
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, 620, 390, 0x10151c, 0.9).setStrokeStyle(5, 0xffd84d);
    centeredText(this, WIDTH / 2, 238, "ROUND OVER", 48, "#ffd84d");
    centeredText(this, WIDTH / 2, 318, `Score: ${data.score ?? 0}`, 36, "#74f26d");
    centeredText(this, WIDTH / 2, 370, "Thanks for playing this math game prototype!", 20, "#45d7ff", {
      strokeThickness: 0,
    });
    makeButton(this, WIDTH / 2, 472, "PLAY AGAIN", () => this.scene.start("PlayScene"), 280);
    makeButton(this, WIDTH / 2, 552, "MENU", () => this.scene.start("MenuScene"), 220);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: "#121923",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: {
    disableWebAudio: false,
  },
  scene: [BootScene, MenuScene, PlayScene, GameOverScene],
};

window.addEventListener("load", () => {
  if (!window.Phaser) {
    document.body.innerHTML =
      '<div style="color:white;font:20px Arial;padding:32px">Phaser failed to load. Check your internet connection or add a local Phaser build.</div>';
    return;
  }
  window.numberKnockoutGame = new Phaser.Game(config);
});
