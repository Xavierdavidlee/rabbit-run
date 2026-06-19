// =============================================================
//  game.js - The conductor. Ties every system together.
// =============================================================
//  This file:
//    1. Loads assets, then the map.
//    2. Runs the GAME LOOP (update + draw, many times a second).
//    3. Keeps track of the current STATE (title, playing, dialogue,
//       inventory, gameover, win) and behaves differently in each.
//
//  THE GAME LOOP & "DELTA TIME"
//  ----------------------------
//  Computers run at different speeds. If we moved the player "2px
//  per frame", a fast computer would zoom and a slow one would crawl.
//  Instead we measure how many SECONDS passed since the last frame
//  (we call it `dt`, for "delta time") and move "speed * dt" pixels.
//  Now everyone moves the same real-world speed. That's what
//  "framerate independent" means.
// =============================================================

import { CONFIG } from "./config.js";
import { loadAllAssets } from "./assets.js";
import { Input } from "./input.js";
import { Sound } from "./audio.js";
import { TileMap } from "./tilemap.js";
import { Camera } from "./camera.js";
import { Player } from "./player.js";
import { NPC } from "./npc.js";
import { Enemy } from "./enemy.js";
import { Item, Inventory } from "./item.js";
import { QuestLog } from "./quest.js";
import { Dialogue } from "./dialogue.js";
import { Battle } from "./battle.js";
import { UI } from "./ui.js";

// The possible states the game can be in.
const STATE = {
  LOADING: "loading",
  TITLE: "title",
  PLAYING: "playing",
  DIALOGUE: "dialogue",
  INVENTORY: "inventory",
  GAMEOVER: "gameover",
  WIN: "win",
};

class Game {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false; // keep pixel art crisp
    this.state = STATE.LOADING;
    this.lastTime = 0;
  }

  async boot() {
    await loadAllAssets();                 // wait for images + sound
    const res = await fetch("assets/map_meadow.json");
    this.mapData = await res.json();
    this.state = STATE.TITLE;
    // Start the loop. We bind so 'this' still means the Game inside it.
    requestAnimationFrame(this.loop.bind(this));
  }

  // Build a fresh game world from the map data.
  loadWorld() {
    this.map = new TileMap(this.mapData);
    this.camera = new Camera();
    this.player = new Player(this.mapData.playerStart.x, this.mapData.playerStart.y);
    this.inventory = new Inventory();
    this.dialogue = new Dialogue();
    this.questLog = new QuestLog();
    this.questLog.define(this.mapData.quests || []);

    // Turn entity data into real objects.
    this.npcs = [];
    this.enemies = [];
    this.items = [];
    for (const e of this.mapData.entities) {
      if (e.kind === "npc") this.npcs.push(new NPC(e));
      else if (e.kind === "enemy") this.enemies.push(new Enemy(e));
      else if (e.kind === "item") this.items.push(new Item(e));
    }
    Sound.playMusic(this.mapData.music || "town_theme");
  }

  // ---------- THE GAME LOOP ----------
  loop(timestamp) {
    // Compute delta time in seconds. Cap it so a lag spike (or the
    // player switching browser tabs) can't teleport everything.
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    if (dt > 0.05) dt = 0.05;

    this.update(dt);
    this.draw();

    Input.clearFrame(); // forget "just pressed" keys for next frame
    requestAnimationFrame(this.loop.bind(this));
  }

  // ---------- UPDATE (game logic) ----------
  update(dt) {
    switch (this.state) {
      case STATE.TITLE:
        if (Input.wasPressed("Space") || Input.wasPressed("Enter")) {
          this.loadWorld();
          this.state = STATE.PLAYING;
        }
        break;

      case STATE.PLAYING:
        this.updatePlaying(dt);
        break;

      case STATE.DIALOGUE:
        this.dialogue.update(dt);
        if (!this.dialogue.active) this.state = STATE.PLAYING;
        break;

      case STATE.INVENTORY:
        if (Input.wasPressed("KeyI") || Input.wasPressed("Escape")) {
          Sound.play("select");
          this.state = STATE.PLAYING;
        }
        break;

      case STATE.GAMEOVER:
      case STATE.WIN:
        if (Input.wasPressed("Space") || Input.wasPressed("Enter")) {
          this.state = STATE.TITLE;
        }
        break;
    }
  }

  updatePlaying(dt) {
    // ----- Open inventory -----
    if (Input.wasPressed("KeyI")) {
      Sound.play("select");
      this.state = STATE.INVENTORY;
      return;
    }
    // ----- Toggle the quest HUD on/off -----
    if (Input.wasPressed("KeyQ")) {
      Sound.play("blip");
      this.questLog.toggleHud();
    }

    // ----- Talk to a nearby NPC -----
    // Talk and attack are now separate keys: T talks, Space attacks. We still
    // figure out who is nearby first so we can show the "Press T" prompt.
    this.nearbyNpc = this.npcs.find(n => n.isNear(this.player));
    if (this.nearbyNpc && !this.player.attacking && Input.wasPressed("KeyT")) {
      this.startConversation(this.nearbyNpc);
      return; // skip the rest of this frame's logic, we are talking now
    }

    // ----- Player -----
    this.player.update(dt, this.map);
    if (this.player.isDead) {
      Sound.stopMusic();
      Sound.play("gameover");
      this.state = STATE.GAMEOVER;
      return;
    }

    // ----- Sword vs enemies -----
    Battle.resolvePlayerAttack(this.player, this.enemies, this.questLog);

    // ----- Enemies -----
    for (const enemy of this.enemies) enemy.update(dt, this.player, this.map);
    // Remove enemies whose death animation finished.
    this.enemies = this.enemies.filter(e => !e.dead);

    // ----- NPCs -----
    for (const npc of this.npcs) npc.update(dt);

    // ----- Items: pick up on overlap -----
    for (const item of this.items) {
      item.update(dt);
      if (!item.collected && item.overlaps(this.player)) {
        item.collected = true;
        this.inventory.add(item.id, item.name);
        this.questLog.onCollect(item.id);
        // Healing items restore HP right away (e.g. a berry).
        if (item.heal) this.player.heal(item.heal);
      }
    }
    this.items = this.items.filter(i => !i.collected);

    // ----- Did the player win? (all quests complete) -----
    const all = Object.values(this.questLog.quests);
    if (all.length > 0 && all.every(q => q.completed)) {
      Sound.stopMusic();
      Sound.play("quest");
      this.state = STATE.WIN;
    }

    // ----- Camera follows player -----
    this.camera.follow(this.player, this.map);
  }

  startConversation(npc) {
    this.state = STATE.DIALOGUE;
    this.questLog.onTalk(npc.name);

    // Pick which dialogue to show based on the quest this NPC cares about.
    // - not started yet  -> the intro dialogue (which offers the quest)
    // - started, not done -> the "in progress" lines
    // - all objectives met -> the "complete" lines (and hand in the quest once)
    const quest = npc.givesQuest ? this.questLog.quests[npc.givesQuest] : null;
    let pages = npc.dialogue;
    let offersQuest = true;          // only the intro dialogue offers the quest
    let handInNow = false;           // are we completing the quest this talk?

    if (quest && quest.started) {
      offersQuest = false;           // already accepted; don't re-offer
      const objectivesDone = quest.objectives.every(o => o.current >= o.needed);
      if (objectivesDone && npc.dialogueComplete && !quest.turnedIn) {
        pages = npc.dialogueComplete; // objectives met -> thank-you lines
        handInNow = true;
      } else if (objectivesDone && quest.turnedIn) {
        // Already thanked the player before - keep it short and friendly.
        pages = npc.dialogueComplete || npc.dialogueInProgress || npc.dialogue;
      } else {
        pages = npc.dialogueInProgress || npc.dialogue; // still working on it
      }
    }

    this.dialogue.start(
      npc.name,
      pages,
      // onFinish:
      () => {
        if (offersQuest && npc.givesQuest && !npc._declined) {
          this.questLog.start(npc.givesQuest);
        }
        if (handInNow && quest) {
          quest.turnedIn = true;     // remember we've handed it in
          quest.checkComplete();     // play the completion fanfare once
        }
        npc._declined = false;
      },
      // onChoice: choice 1 ("Maybe later") declines the quest.
      (choiceIndex) => { if (choiceIndex === 1) npc._declined = true; }
    );
  }

  // ---------- DRAW (paint the screen) ----------
  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = "#bfe0f2";
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    if (this.state === STATE.LOADING) {
      UI.drawScreen(ctx, "Loading...", "Gathering carrots and courage");
      return;
    }
    if (this.state === STATE.TITLE) {
      UI.drawScreen(ctx, "Rabbit Run: Tales of the Warren", "Press SPACE to begin", "#ffd98a");
      return;
    }

    // ----- Draw the world -----
    // Order: ground (grass/dirt/water) first, then flat "overlay" details
    // (grass tufts, flowers, pebbles) that the player walks OVER, then the
    // moving things sorted by Y, then tall "decor" (tree tops, roofs) on top.
    this.map.drawLayer(ctx, "ground", this.camera);
    this.map.drawLayer(ctx, "overlay", this.camera);

    // Collect all "things" and sort by Y so lower ones draw in front
    // (this gives a nice sense of depth - classic top-down trick).
    const things = [...this.items, ...this.npcs, ...this.enemies, this.player];
    things.sort((a, b) => (a.y + a.height) - (b.y + b.height));
    for (const t of things) t.draw(ctx, this.camera);

    this.map.drawLayer(ctx, "decor", this.camera);

    // ----- Draw the UI on top -----
    UI.drawHealth(ctx, this.player);
    UI.drawQuests(ctx, this.questLog);

    if (this.state === STATE.PLAYING && this.nearbyNpc) {
      UI.drawPrompt(ctx, `Press T to talk to ${this.nearbyNpc.name}`);
    }
    if (this.state === STATE.DIALOGUE) {
      UI.drawDialogue(ctx, this.dialogue);
    }
    if (this.state === STATE.INVENTORY) {
      UI.drawInventory(ctx, this.inventory);
    }
    if (this.state === STATE.GAMEOVER) {
      UI.drawScreen(ctx, "Game Over", "Press ENTER to try again", "#f08a8a");
    }
    if (this.state === STATE.WIN) {
      UI.drawScreen(ctx, "You Win!", "Every quest complete! ENTER for title", "#9ad9b0");
    }
  }
}

// ---------- Start everything once the page is ready ----------
window.addEventListener("load", () => {
  const canvas = document.getElementById("game");
  canvas.width = CONFIG.CANVAS_WIDTH;
  canvas.height = CONFIG.CANVAS_HEIGHT;
  const game = new Game(canvas);
  // Exposed on purpose: open the browser console and type `game` to poke at
  // the live game while it runs (e.g. `game.player.hp = 1`). Great for learning!
  window.game = game;
  game.boot();
});
