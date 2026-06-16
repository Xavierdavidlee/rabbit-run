// =============================================================
//  player.js - The bunny you control. (Week 2 version)
// =============================================================
//  New this week:
// - ANIMATION (idle vs running) using a SpriteAnimator
// - FACING the right direction
// - COLLISION so you bump into solid tiles instead of walking through
// - ATTACKING by swinging the sword (Z or Space)
//  (Hit points & taking damage arrive in Week 4 with enemies.)
// =============================================================

import { CONFIG } from "./config.js";
import { Input } from "./input.js";
import { SpriteAnimator, DIR } from "./sprite.js";
import { Sound } from "./audio.js";

// How many animation columns each bunny sheet has.
const FRAMES = { idle: 5, run: 8, sword: 9 };

export class Player {
  constructor(x, y) {
    this.x = x;
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

    this.attacking = false;
    this.attackTimer = 0;
  }

  update(dt, map) {
    // ----- Attacking takes over until the swing finishes -----
    if (this.attacking) {
      this.attackTimer -= dt;
      this.anim.update(dt, FRAMES.sword);
      if (this.attackTimer <= 0) { this.attacking = false; this.anim.reset(); }
      return; // can't walk mid-swing (keeps it simple)
    }

    // Press Space to start an attack.
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
      // Normalize diagonals so corner-walking isn't faster.
      const len = Math.hypot(dx, dy);
      dx /= len; dy /= len;
      const stepX = dx * CONFIG.PLAYER_SPEED * dt;
      const stepY = dy * CONFIG.PLAYER_SPEED * dt;
      // Move each axis separately so we can slide along walls.
      this.moveAxis(stepX, 0, map);
      this.moveAxis(0, stepY, map);
      this.anim.update(dt, FRAMES.run);
    } else {
      this.anim.update(dt, FRAMES.idle);
    }
  }

  // Try to move; cancel if any corner of the body hits a solid tile.
  moveAxis(mx, my, map) {
    const nextX = this.x + mx;
    const nextY = this.y + my;
    const corners = [
      [nextX, nextY],
      [nextX + this.width - 1, nextY],
      [nextX, nextY + this.height - 1],
      [nextX + this.width - 1, nextY + this.height - 1],
    ];
    for (const [cx, cy] of corners) {
      if (map.isSolidAtPixel(cx, cy)) return; // blocked
    }
    this.x = nextX;
    this.y = nextY;
  }

  startAttack() {
    this.attacking = true;
    this.attackTimer = FRAMES.sword / CONFIG.ANIM_FPS;
    this.anim.reset();
    Sound.play("attack");
  }

  draw(ctx, camera) {
    const screenX = Math.round(this.x - this.spriteOffsetX - camera.x);
    const screenY = Math.round(this.y - this.spriteOffsetY - camera.y);
    const sheet = this.attacking ? "bunny_sword" : (this.moving ? "bunny_run" : "bunny_idle");
    this.anim.draw(ctx, sheet, this.dir, screenX, screenY);
  }
}
