// =============================================================
//  config.js - All the "magic numbers" for Rabbit Run: Tales of the Warren RPG live here.
// =============================================================
//  Keeping settings in ONE place means you never have to hunt
//  through the whole project to change how fast the player walks
//  or how big a tile is. Change a value here, save, refresh.
// =============================================================

export const CONFIG = {
  // ---- Display ----
  TILE_SIZE: 16,        // Each tile in our maps is 16x16 pixels (matches the art).
  SCALE: 3,             // We zoom everything 3x so the pixel art looks chunky & cute.
  VIEW_TILES_X: 16,     // How many tiles fit across the screen.
  VIEW_TILES_Y: 12,     // How many tiles fit down the screen.

  // ---- Player ----
  PLAYER_SPEED: 90,     // Pixels per SECOND (not per frame!). This is what makes
                        // movement smooth no matter the frame rate.
  PLAYER_FRAME_SIZE: 48,// The bunny sprite frames are 48x48 pixels each.
  PLAYER_MAX_HP: 20,

  // ---- Combat ----
  PLAYER_ATTACK_DAMAGE: 5,
  PLAYER_ATTACK_RANGE: 24,   // How close (pixels) an enemy must be to get hit.

  // ---- Animation ----
  ANIM_FPS: 8,          // Sprite animations play 8 frames per second.

  // ---- Audio ----
  MUSIC_VOLUME: 0.4,
  SFX_VOLUME: 0.6,
  SOLID_TOP_INSET: 16,  // ignore this much "air" at the top of a solid tile
};

// Computed values (don't edit these directly - they come from the ones above).
CONFIG.SCALED_TILE = CONFIG.TILE_SIZE * CONFIG.SCALE; // 48px on screen
CONFIG.CANVAS_WIDTH = CONFIG.VIEW_TILES_X * CONFIG.SCALED_TILE;
CONFIG.CANVAS_HEIGHT = CONFIG.VIEW_TILES_Y * CONFIG.SCALED_TILE;
