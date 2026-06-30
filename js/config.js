// =============================================================
//  config.js - All the "magic numbers" for Rabbit Run: Tales of the Warren RPG live here.
// =============================================================
//  Keeping settings in ONE place means you never have to hunt
//  through the whole project to change how fast the player walks
//  or how big a tile is. Change a value here, save, refresh.
// =============================================================

// ============================================================================
// STARTER STUB - you write this file during the code-along (Week 1, Day 1).
// Follow the slides / Coding Companion for this week. If you fall behind,
// the complete version is in the matching weekN-checkpoint/js/config.js.
// ============================================================================

// TODO: build this file here.
export const CONFIG = {
    TILE_SIZE : 16,
    SCALE : 3,
    VIEW_TILES_X : 16,
    VIEW_TILES_Y : 12,
    PLAYER_SPEED : 400,
    PLAYER_FRAME_SIZE : 48,
    PLAYER_MAX_HP : 999999,
    PLAYER_ATTACK_DAMAGE : 5,
    PLAYER_ATTACK_RANGE : 15,
    XP_BASE: 5,
    XP_GROWTH: 2,
    HP_PER_LEVEL : 2,
    DAMAGE_PER_LEVEL : 2,
    HEAL_ITEM_AMOUNT : 10,
    SOLID_TOP_INSET : 16,
    ANIM_FPS : 8,
    ATTACK_ANIM_FPS : 16,
    PLAYER_ATTACK_RANGE: 30,
    SFX_VOLUME : 0.6,
    MUSIC_VOLUME : 0.3
};
CONFIG.SCALED_TILE = CONFIG.TILE_SIZE * CONFIG.SCALE;
CONFIG.CANVAS_WIDTH = CONFIG.VIEW_TILES_X * CONFIG.SCALED_TILE //gives width of canvas in pixels
CONFIG.CANVAS_HEIGHT = CONFIG.VIEW_TILES_Y * CONFIG.SCALED_TILE //height of canvas in pixels