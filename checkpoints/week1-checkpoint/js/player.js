// =============================================================
//  player.js - The bunny you control. (Week 1 version)
// =============================================================
//  This week the player can MOVE smoothly using "delta time".
//  Next week we'll add animation, collision, and attacking.
//  For now we draw a single (still) frame of the idle bunny.
// =============================================================

import { CONFIG } from "./config.js";
import { Input } from "./input.js";
import { Images } from "./assets.js";

export class Player {
  constructor(x, y) {
    this.x = x;  // world position in pixels
    this.y = y;
    this.width = CONFIG.SCALED_TILE;
    this.height = CONFIG.SCALED_TILE;
  }

  update(dt) {
    // Figure out the direction from the arrow keys.
    let dx = 0, dy = 0;
    if (Input.left)  dx -= 1;
    if (Input.right) dx += 1;
    if (Input.up)    dy -= 1;
    if (Input.down)  dy += 1;

    // THE DELTA-TIME TRICK:
    // distance = speed * time. We multiply by `dt` (seconds since the
    // last frame) so the bunny moves the same real speed on any computer.
    this.x += dx * CONFIG.PLAYER_SPEED * dt;
    this.y += dy * CONFIG.PLAYER_SPEED * dt;
  }

  draw(ctx, camera) {
    const img = Images.bunny_idle;
    // Draw the first 48x48 frame (top-left of the sheet) for now.
    const size = CONFIG.PLAYER_FRAME_SIZE * CONFIG.SCALE;
    const screenX = this.x - camera.x - (size - this.width) / 2;
    const screenY = this.y - camera.y - (size - this.height);
    // Draw the front-facing frame. The sheet's rows are directions; row 1
    // faces the viewer (we add full direction handling in Week 2).
    ctx.drawImage(img, 0, 48, 48, 48, screenX, screenY, size, size);
  }
}
