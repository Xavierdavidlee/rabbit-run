// =============================================================
//  config.js - All our game's settings in one place. (Week 1)
// =============================================================
//  Putting numbers here (instead of scattered through the code)
//  means you change them in ONE spot. Try changing SCALE to 4!
// =============================================================

export const CONFIG = {
  TILE_SIZE: 16,        // each tile in the art is 16x16 pixels
  SCALE: 3,             // zoom everything 3x so pixels look chunky & cute
  VIEW_TILES_X: 16,     // tiles across the screen
  VIEW_TILES_Y: 12,     // tiles down the screen
  PLAYER_SPEED: 90,     // pixels per SECOND (delta-time makes this smooth)
  PLAYER_FRAME_SIZE: 48,// bunny frames are 48x48 pixels,
  SOLID_TOP_INSET: 16,  // ignore this much "air" at the top of a solid tile
};

// Computed from the values above - don't edit these directly.
CONFIG.SCALED_TILE = CONFIG.TILE_SIZE * CONFIG.SCALE;     // 48
CONFIG.CANVAS_WIDTH = CONFIG.VIEW_TILES_X * CONFIG.SCALED_TILE;
CONFIG.CANVAS_HEIGHT = CONFIG.VIEW_TILES_Y * CONFIG.SCALED_TILE;
