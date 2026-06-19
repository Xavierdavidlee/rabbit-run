# Week 1 Checkpoint - "It moves!"

By the end of Week 1 your game should match this folder.

## What this checkpoint contains
A walkable meadow: the tilemap draws, the camera follows a bunny, and you
can move smoothly with the arrow keys / WASD.

## Files and what each does
| File | Job |
|------|-----|
| `index.html` | The web page that holds the `<canvas>` and loads the game |
| `js/config.js` | All game settings (tile size, scale, speed) in one place |
| `js/assets.js` | Pre-loads images before the game starts |
| `js/input.js` | Tracks which keys are pressed |
| `js/tilesets.js` | Knows how to slice one tile out of a tileset sheet |
| `js/tilemap.js` | Loads the map data and draws the ground & decor layers |
| `js/camera.js` | Follows the player and stops at the map edges |
| `js/player.js` | The bunny: moves with delta time, draws one still frame |
| `js/game.js` | The **game loop** - update + draw, over and over |

## Key ideas introduced
- The **game loop** and `requestAnimationFrame`
- **Delta time (`dt`)** for framerate-independent movement
- Drawing a **tilemap** and a **camera** that follows the player
- **Preloading** images with Promises / `async`/`await`

## How to run it
You need a local web server (because ES modules don't work from `file://`).
In this folder run:  `python3 -m http.server 8000`
then open `http://localhost:8000` in your browser. (See the Student Workbook
for the full setup.)

## Not yet (coming later)
No animation, no collision, no NPCs/enemies - those are Weeks 2 - 4.
