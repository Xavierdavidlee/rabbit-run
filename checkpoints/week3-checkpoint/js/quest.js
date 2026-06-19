// =============================================================
//  quest.js - Quests and their objectives.
// =============================================================
//  A QUEST is a goal with one or more OBJECTIVES (small steps).
//  Examples of objective types we support:
//      "collect" - gather N of an item   (e.g. collect 3 carrots)
//      "defeat" - beat N enemies of a type (e.g. defeat 2 slimes)
//      "talk" - talk to a specific NPC
//      "reach" - step on a special tile / location
//  The QuestLog holds all active/finished quests and checks progress.
// =============================================================

import { Sound } from "./audio.js";

export class Quest {
  constructor(def) {
    this.id = def.id;
    this.title = def.title;
    this.description = def.description || "";
    // Copy objectives and give each a 'current' counter starting at 0.
    this.objectives = def.objectives.map(o => ({
      type: o.type,
      target: o.target,        // item id, enemy type, npc name, etc.
      needed: o.needed || 1,   // how many to finish this objective
      current: 0,
      text: o.text || "",      // what shows on the HUD
    }));
    this.started = false;
    this.completed = false;
  }

  start() { this.started = true; }

  // True only when every objective is finished.
  checkComplete() {
    const done = this.objectives.every(o => o.current >= o.needed);
    if (done && !this.completed) {
      this.completed = true;
      Sound.play("quest");
    }
    return this.completed;
  }
}

export class QuestLog {
  constructor() {
    this.quests = {};     // id -> Quest
    this.hudVisible = true; // the objectives HUD can be toggled on/off
  }

  // Load quest definitions (from the map) but don't start them yet.
  define(defs) {
    for (const def of defs) this.quests[def.id] = new Quest(def);
  }

  start(id) {
    const q = this.quests[id];
    if (q && !q.started) { q.start(); return q; }
    return null;
  }

  // ---- These get called by the game when things happen ----
  onCollect(itemId) { this.progress("collect", itemId); }
  onDefeat(enemyType) { this.progress("defeat", enemyType); }
  onTalk(npcName) { this.progress("talk", npcName); }
  onReach(locationId) { this.progress("reach", locationId); }

  // Add 1 to any matching, unfinished objective in any started quest.
  progress(type, target) {
    for (const q of Object.values(this.quests)) {
      if (!q.started || q.completed) continue;
      for (const o of q.objectives) {
        if (o.type === type && o.target === target && o.current < o.needed) {
          o.current += 1;
        }
      }
      q.checkComplete();
    }
  }

  // The quests we should show on the HUD (started but maybe done).
  activeQuests() {
    return Object.values(this.quests).filter(q => q.started);
  }

  toggleHud() { this.hudVisible = !this.hudVisible; }
}
