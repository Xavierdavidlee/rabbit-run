// =============================================================
//  enemy.js - Monsters with simple AI.
// =============================================================
//  Our enemies use a tiny "state machine". At any moment an enemy
//  is in ONE of these states:
//      IDLE - sitting still, waiting
//      CHASE - player got close, walk toward them
//      HURT - just got hit, flash briefly
//      DEAD - defeated, play death animation then disappear
//  A state machine keeps AI easy to read: each state has clear rules
//  for what to do and when to switch to another state.
// =============================================================

import { CONFIG } from "./config.js";
import { SpriteAnimator } from "./sprite.js";
import { Sound } from "./audio.js";

const STATE = { IDLE: "idle", CHASE: "chase", HURT: "hurt", DEAD: "dead" };

// Per-enemy-type settings. Add new monsters by adding entries here.
const TYPES = {
  slime: {
    idleSheet: "slime_idle", hurtSheet: "slime_hurt", deathSheet: "slime_death",
    idleFrames: 8, hurtFrames: 2, deathFrames: 4,
    hp: 10, speed: 35, damage: 3, sightRange: 120, attackRange: 30,
    xp: 5,  // XP the player earns for defeating one
  },
  bat: {
    idleSheet: "bat_idle", hurtSheet: "bat_hurt", deathSheet: "bat_death",
    idleFrames: 4, hurtFrames: 2, deathFrames: 5,
    hp: 6, speed: 60, damage: 2, sightRange: 160, attackRange: 28,
    xp: 4,
  },
};

export class Enemy {
  constructor(data) {
    this.type = data.type || "slime";
    const t = TYPES[this.type];
    this.def = t;

    this.x = data.x;
    this.y = data.y;
    this.homeX = data.x; // remembers where it started
    this.homeY = data.y;
    this.width = CONFIG.SCALED_TILE;
    this.height = CONFIG.SCALED_TILE;

    this.hp = t.hp;
    this.xpReward = t.xp || 3;  // XP granted to the player when defeated
    this.state = STATE.IDLE;
    this.dir = 0;
    this.anim = new SpriteAnimator();
    this.hurtTimer = 0;
    this.deadTimer = 0;
    this.attackCooldown = 0;
    this.dead = false;     // when true, the game removes this enemy
  }

  get centerX() { return this.x + this.width/2; }
  get centerY() { return this.y + this.height/2; }

  distanceTo(player) {
    return Math.hypot(this.centerX - (player.x+player.width/2),
                      this.centerY - (player.y+player.height/2));
  }

  update(dt, player, map) {
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    switch (this.state) {
      case STATE.DEAD: {
        this.deadTimer -= dt;
        this.anim.update(dt, this.def.deathFrames);
        if (this.deadTimer <= 0) this.dead = true; // remove me
        break;
      }
      case STATE.HURT: {
        this.hurtTimer -= dt;
        this.anim.update(dt, this.def.hurtFrames);
        if (this.hurtTimer <= 0) {
          this.state = (this.hp <= 0) ? STATE.DEAD : STATE.CHASE;
          if (this.state === STATE.DEAD) this.startDeath();
        }
        break;
      }
      case STATE.IDLE: {
        this.anim.update(dt, this.def.idleFrames);
        // Wake up if the player comes into view.
        if (this.distanceTo(player) < this.def.sightRange) this.state = STATE.CHASE;
        break;
      }
      case STATE.CHASE: {
        this.anim.update(dt, this.def.idleFrames);
        const dist = this.distanceTo(player);
        // Lose interest if the player runs far away.
        if (dist > this.def.sightRange * 1.5) { this.state = STATE.IDLE; break; }

        // Walk toward the player (framerate-independent).
        const dx = (player.x+player.width/2) - this.centerX;
        const dy = (player.y+player.height/2) - this.centerY;
        const len = Math.hypot(dx, dy) || 1;
        const stepX = (dx/len) * this.def.speed * dt;
        const stepY = (dy/len) * this.def.speed * dt;
        this.moveAxis(stepX, 0, map);
        this.moveAxis(0, stepY, map);

        // Close enough? Bite the player (on a cooldown so it's fair).
        if (dist < this.def.attackRange && this.attackCooldown <= 0) {
          player.takeDamage(this.def.damage);
          this.attackCooldown = 1.0; // one bite per second
        }
        break;
      }
    }
  }

  moveAxis(mx, my, map) {
    const nx = this.x + mx, ny = this.y + my;
    if (!map.isSolidAtPixel(nx + this.width/2, ny + this.height/2)) {
      this.x = nx; this.y = ny;
    }
  }

  // Called by the battle system when the player's sword connects.
  takeDamage(amount) {
    if (this.state === STATE.DEAD) return;
    this.hp -= amount;
    this.hurtTimer = 0.25;
    this.state = STATE.HURT;
    this.anim.reset();
    Sound.play(this.hp <= 0 ? "enemy_down" : "hit");
  }

  startDeath() {
    this.state = STATE.DEAD;
    this.deadTimer = this.def.deathFrames / CONFIG.ANIM_FPS;
    this.anim.reset();
  }

  draw(ctx, camera) {
    const offset = (CONFIG.PLAYER_FRAME_SIZE * CONFIG.SCALE - this.width) / 2;
    const sx = this.x - offset - camera.x;
    const sy = this.y - (CONFIG.PLAYER_FRAME_SIZE*CONFIG.SCALE - this.height) + 6 - camera.y;

    let sheet = this.def.idleSheet, frames = this.def.idleFrames, row = 0;
    if (this.state === STATE.HURT) { sheet = this.def.hurtSheet; frames = this.def.hurtFrames; }
    if (this.state === STATE.DEAD) { sheet = this.def.deathSheet; frames = this.def.deathFrames; row = 0; }

    this.anim.draw(ctx, sheet, row, sx, sy);

    // Tiny health bar above living enemies.
    if (this.state !== STATE.DEAD) {
      const barW = this.width, barX = this.x - camera.x, barY = this.y - camera.y - 8;
      ctx.fillStyle = "#3a2e3f"; ctx.fillRect(barX, barY, barW, 4);
      ctx.fillStyle = "#e85d75"; ctx.fillRect(barX, barY, barW * (this.hp/this.def.hp), 4);
    }
  }
}
