// =============================================================
//  camera.js - Decides which part of the world is on screen.
// =============================================================
//  The world can be bigger than the screen. The camera is like a
//  window that follows the player around. We keep the player
//  centered, but stop the camera at the edges of the map so we
//  never show empty space outside it.
// =============================================================

import { CONFIG } from "./config.js";

export class Camera {
  constructor() {
    this.x = 0; // top-left corner of the camera, in world pixels
    this.y = 0;
  }

  // Center on a target (the player), then clamp to the map bounds.
  follow(target, map) {
    // Center the target on screen.
    this.x = target.x + target.width / 2 - CONFIG.CANVAS_WIDTH / 2;
    this.y = target.y + target.height / 2 - CONFIG.CANVAS_HEIGHT / 2;

    // clamp(value, min, max): keep the camera inside the map.
    this.x = Math.max(0, Math.min(this.x, map.pixelWidth - CONFIG.CANVAS_WIDTH));
    this.y = Math.max(0, Math.min(this.y, map.pixelHeight - CONFIG.CANVAS_HEIGHT));

    // If the map is smaller than the screen, just pin to 0.
    if (map.pixelWidth < CONFIG.CANVAS_WIDTH) this.x = (map.pixelWidth - CONFIG.CANVAS_WIDTH) / 2;
    if (map.pixelHeight < CONFIG.CANVAS_HEIGHT) this.y = (map.pixelHeight - CONFIG.CANVAS_HEIGHT) / 2;
  }
}
