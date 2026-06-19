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

  // ---- Leveling & XP ----
  // After reaching level L, the XP needed for the NEXT level is
  // round(XP_BASE * L ^ XP_GROWTH), so each level costs a bit more. Tweak these
  // two numbers to make leveling faster (lower) or slower (higher).
  XP_BASE: 12,          // XP needed to reach level 2
  XP_GROWTH: 1.5,       // how much steeper each level gets
  HP_PER_LEVEL: 6,      // max HP gained per level (also fully heals on level up)
  DAMAGE_PER_LEVEL: 2,  // attack damage gained per level

  // ---- Healing ----
  // Default HP restored by a healing item. Individual items in the map can set
  // their own "heal" value to override this (our berries use 8).
  HEAL_ITEM_AMOUNT: 8,  // HP restored by a healing item (e.g. a berry)

  // ---- Collision ----
  // Solid decorations (rocks, bushes, fences) sit in the LOWER part of their
  // tile. We ignore this many pixels of "air" at the top of a solid tile so the
  // player can stand right up against the visible art instead of an empty gap.
  SOLID_TOP_INSET: 16,

  // ---- Animation ----
  ANIM_FPS: 8,          // Sprite animations play 8 frames per second.

  // ---- Audio ----
  MUSIC_VOLUME: 0.4,
  SFX_VOLUME: 0.6,
};

// Computed values (don't edit these directly - they come from the ones above).
CONFIG.SCALED_TILE = CONFIG.TILE_SIZE * CONFIG.SCALE; // 48px on screen
CONFIG.CANVAS_WIDTH = CONFIG.VIEW_TILES_X * CONFIG.SCALED_TILE;
CONFIG.CANVAS_HEIGHT = CONFIG.VIEW_TILES_Y * CONFIG.SCALED_TILE;
