# Week 2 Checkpoint - "A real character"

By the end of Week 2 your game should match this folder.

## What's new since Week 1
- The bunny is now **animated** (idle vs. running) and **faces** the way it walks.
- **Collision**: you bump into bushes and rocks instead of walking through them.
- **Attacking**: press **Space** to swing the sword, with a sound effect.

## New / changed files
| File | What changed |
|------|--------------|
| `js/sprite.js` | **NEW** - `SpriteAnimator` steps through animation frames over time |
| `js/audio.js` | **NEW** - plays sound effects |
| `js/assets.js` | Now also loads the run + sword sheets and two sounds |
| `js/config.js` | Added `ANIM_FPS` and `PLAYER_ATTACK_RANGE` |
| `js/player.js` | Big update: animation, facing, collision, attacking |
| `js/game.js` | Passes the map into `player.update()` so collision works |

## Key ideas introduced
- **Sprite sheets** and frame-by-frame animation (framerate-independent)
- **Tile collision** with the "move each axis separately" trick (wall sliding)
- Reading a **single key press** vs. a **held key** (`wasPressed` vs `isDown`)

## Not yet
No NPCs, items, quests (Week 3) and no enemies/HP (Week 4).
