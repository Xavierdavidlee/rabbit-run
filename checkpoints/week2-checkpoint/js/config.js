// =============================================================
//  config.js - Game settings in one place. (Week 2)
// =============================================================
//  New this week: animation speed and attack settings.
// =============================================================

export const CONFIG = {
  TILE_SIZE: 16,
  SCALE: 3,
  VIEW_TILES_X: 16,
  VIEW_TILES_Y: 12,
  PLAYER_SPEED: 90,          // pixels per second
  PLAYER_FRAME_SIZE: 48,

  // ---- New in Week 2 ----
  ANIM_FPS: 8,               // sprite animations play 8 frames/second
  PLAYER_ATTACK_RANGE: 24,   // how far the sword reaches (pixels),
  SOLID_TOP_INSET: 16,  // ignore this much "air" at the top of a solid tile
};

CONFIG.SCALED_TILE = CONFIG.TILE_SIZE * CONFIG.SCALE;
CONFIG.CANVAS_WIDTH = CONFIG.VIEW_TILES_X * CONFIG.SCALED_TILE;
CONFIG.CANVAS_HEIGHT = CONFIG.VIEW_TILES_Y * CONFIG.SCALED_TILE;
