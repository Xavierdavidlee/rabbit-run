// =============================================================
//  game.js - The conductor that runs everything. (Week 1)
// =============================================================
//  This week we build the heart of any game: the GAME LOOP.
//  Over and over, many times a second, we:
//      1. UPDATE - move things, react to keys
//      2. DRAW - paint the new picture on the screen
//
//  DELTA TIME (dt): we measure how many SECONDS passed since the
//  last loop. Moving "speed * dt" makes motion smooth at any frame
//  rate. That's what "framerate independent" means.
// =============================================================

import { CONFIG } from "./config.js";
import { loadAllAssets } from "./assets.js";
import { Input } from "./input.js";
import { TileMap } from "./tilemap.js";
import { Camera } from "./camera.js";
import { Player } from "./player.js";

class Game {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false; // keep pixel art crisp
    this.lastTime = 0;
  }

  async boot() {
    await loadAllAssets();                       // 1. wait for images
    const res = await fetch("assets/map_meadow.json");
    const mapData = await res.json();            // 2. load the map data

    // 3. build the world objects
    this.map = new TileMap(mapData);
    this.camera = new Camera();
    this.player = new Player(mapData.playerStart.x, mapData.playerStart.y);

    // 4. start the loop
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(timestamp) {
    // delta time in seconds, capped so a lag spike can't teleport things.
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    if (dt > 0.05) dt = 0.05;

    this.update(dt);
    this.draw();

    Input.clearFrame();
    requestAnimationFrame(this.loop.bind(this));
  }

  update(dt) {
    this.player.update(dt);
    this.camera.follow(this.player, this.map);
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = "#1a1420";
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Draw order: ground first, then the player, then decor on top.
    this.map.drawLayer(ctx, "ground", this.camera);
    this.player.draw(ctx, this.camera);
    this.map.drawLayer(ctx, "decor", this.camera);
  }
}

window.addEventListener("load", () => {
  const canvas = document.getElementById("game");
  canvas.width = CONFIG.CANVAS_WIDTH;
  canvas.height = CONFIG.CANVAS_HEIGHT;
  new Game(canvas).boot();
});
