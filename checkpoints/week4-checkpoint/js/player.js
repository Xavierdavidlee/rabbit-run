// =============================================================
//  player.js - The bunny you control.
// =============================================================
//  The player can:
// - walk in 4 directions (with smooth, framerate-independent speed)
// - animate (idle vs running) and face the right way
// - bump into solid tiles (collision)
// - swing a sword to attack
// - take damage and have hit-points (HP)
// =============================================================

import { CONFIG } from "./config.js";
import { Input } from "./input.js";
import { SpriteAnimator, DIR } from "./sprite.js";
import { Sound } from "./audio.js";

// How many animation columns each bunny sheet has.
const FRAMES = { idle: 5, run: 8, sword: 9 };

export class Player {
  constructor(x, y) {
    this.x = x; // world position in pixels (top-left of the COLLISION BODY)
    this.y = y;
    // The collision body now matches the bunny's FULL visible footprint (its
    // whole body), so you bump into things wherever any part of the bunny is.
    // The big 144px sprite is drawn centered over this body.
    this.width = 42;
    this.height = 52;
    const spriteSize = CONFIG.PLAYER_FRAME_SIZE * CONFIG.SCALE; // 144
    // Center the sprite over the body. The bunny's drawn pixels sit at roughly
    // y 42..96 of the 144px frame, so offset the sprite to line its body up with
    // the collision box.
    this.spriteOffsetX = (spriteSize - this.width) / 2;
    this.spriteOffsetY = 42; // sprite's visible body starts ~42px down in the frame

    this.dir = DIR.DOWN;
    this.moving = false;
    this.anim = new SpriteAnimator();

    this.hp = CONFIG.PLAYER_MAX_HP;
    this.maxHp = CONFIG.PLAYER_MAX_HP;

    // ---- Leveling & XP ----
    this.level = 1;
    this.xp = 0;                       // XP earned toward the next level
    this.xpToNext = CONFIG.XP_BASE;    // XP needed to reach the next level
    this.attackDamage = CONFIG.PLAYER_ATTACK_DAMAGE;
    this.justLeveledTimer = 0;         // shows a brief "LEVEL UP!" flash

    this.attacking = false;
    this.attackTimer = 0;
    this.attackHasHit = false; // so one swing only hits once
    this.invincibleTimer = 0;  // brief mercy time after taking a hit
  }

  // ---- XP & leveling ----
  // Grant XP and level up as many times as the XP allows.
  gainXP(amount) {
    this.xp += amount;
    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.levelUp();
    }
  }

  levelUp() {
    this.level += 1;
    this.maxHp += CONFIG.HP_PER_LEVEL;
    this.attackDamage += CONFIG.DAMAGE_PER_LEVEL;
    this.hp = this.maxHp;            // level up fully heals you
    this.justLeveledTimer = 1.6;     // flash "LEVEL UP!" for a moment
    // Each level needs more XP than the last.
    this.xpToNext = Math.round(CONFIG.XP_BASE * Math.pow(this.level, CONFIG.XP_GROWTH));
    Sound.play("quest");             // reuse the happy fanfare
  }

  // Restore HP (from a healing item), never above max.
  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    Sound.play("pickup");
  }

  // The body rectangle, used for collisions with the world.
  get body() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }

  update(dt, map) {
    // ----- Count down timers -----
    if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
    if (this.justLeveledTimer > 0) this.justLeveledTimer -= dt;

    // ----- Attacking -----
    if (this.attacking) {
      this.attackTimer -= dt;
      this.anim.update(dt, FRAMES.sword);
      if (this.attackTimer <= 0) {
        this.attacking = false;
        this.anim.reset();
      }
      return; // can't walk while mid-swing (keeps it simple & readable)
    }

    // Start an attack when the player presses the attack key (Space).
    if (Input.wasPressed("Space")) {
      this.startAttack();
      return;
    }

    // ----- Movement -----
    let dx = 0, dy = 0;
    if (Input.left)  { dx -= 1; this.dir = DIR.LEFT; }
    if (Input.right) { dx += 1; this.dir = DIR.RIGHT; }
    if (Input.up)    { dy -= 1; this.dir = DIR.UP; }
    if (Input.down)  { dy += 1; this.dir = DIR.DOWN; }

    this.moving = (dx !== 0 || dy !== 0);

    if (this.moving) {
      // Normalize diagonals so you don't move faster going corner-to-corner.
      const len = Math.hypot(dx, dy);
      dx /= len; dy /= len;

      // Multiply by speed AND by dt (delta time). This is the key trick:
      // distance = speed * time, so movement is the same at any frame rate.
      const stepX = dx * CONFIG.PLAYER_SPEED * dt;
      const stepY = dy * CONFIG.PLAYER_SPEED * dt;

      // Move on each axis separately so we can slide along walls.
      this.moveAxis(stepX, 0, map);
      this.moveAxis(0, stepY, map);

      this.anim.update(dt, FRAMES.run);
    } else {
      this.anim.update(dt, FRAMES.idle);
    }
  }

  // Try to move by (mx, my); cancel the move if it hits a solid tile.
  moveAxis(mx, my, map) {
    const nextX = this.x + mx;
    const nextY = this.y + my;

    // Check the four corners of the body at the new spot.
    const corners = [
      [nextX,                nextY],
      [nextX + this.width-1, nextY],
      [nextX,                nextY + this.height-1],
      [nextX + this.width-1, nextY + this.height-1],
    ];
    for (const [cx, cy] of corners) {
      if (map.isSolidAtPixel(cx, cy)) return; // blocked - don't move
    }
    this.x = nextX;
    this.y = nextY;
  }

  startAttack() {
    this.attacking = true;
    this.attackTimer = FRAMES.sword / CONFIG.ANIM_FPS; // length of the swing
    this.attackHasHit = false;
    this.anim.reset();
    Sound.play("attack");
  }

  // Where the sword reaches - a point in front of the player.
  getAttackPoint() {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const r = CONFIG.PLAYER_ATTACK_RANGE;
    if (this.dir === DIR.LEFT)  return { x: cx - r, y: cy };
    if (this.dir === DIR.RIGHT) return { x: cx + r, y: cy };
    if (this.dir === DIR.UP)    return { x: cx, y: cy - r };
    return { x: cx, y: cy + r }; // down
  }

  // Called by the battle system when an enemy hits us.
  takeDamage(amount) {
    if (this.invincibleTimer > 0) return; // still in mercy time
    this.hp = Math.max(0, this.hp - amount);
    this.invincibleTimer = 0.8; // 0.8s of invincibility
    Sound.play("hit");
  }

  get isDead() { return this.hp <= 0; }

  draw(ctx, camera) {
    // Blink while invincible so the player can see they got hit.
    if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer * 12) % 2 === 0) {
      return;
    }
    const screenX = Math.round(this.x - this.spriteOffsetX - camera.x);
    const screenY = Math.round(this.y - this.spriteOffsetY - camera.y);
    const sheet = this.attacking ? "bunny_sword" : (this.moving ? "bunny_run" : "bunny_idle");
    this.anim.draw(ctx, sheet, this.dir, screenX, screenY);
  }
}
