// =============================================================
//  battle.js - Connects the player's sword to the enemies.
// =============================================================
//  Our combat is "action" style (like Zelda), not turn-based: you
//  swing in real time and hit whatever is in front of you. This file
//  holds the rule for "did the swing connect with an enemy?".
// =============================================================

import { CONFIG } from "./config.js";
import { Sound } from "./audio.js";

export const Battle = {
  // Check the player's active sword swing against every enemy.
  // Returns the type of any enemy that DIED this frame (for quests).
  resolvePlayerAttack(player, enemies, questLog) {
    if (!player.attacking || player.attackHasHit) return;

    // Only land the hit on the middle frames of the swing (feels right).
    const swingProgress = 1 - (player.attackTimer / (9 / CONFIG.ANIM_FPS));
    if (swingProgress < 0.3 || swingProgress > 0.7) return;

    const point = player.getAttackPoint(); // where the sword tip is

    for (const enemy of enemies) {
      if (enemy.state === "dead") continue;
      // Is the sword point inside the enemy's box?
      const inside =
        point.x >= enemy.x && point.x <= enemy.x + enemy.width &&
        point.y >= enemy.y && point.y <= enemy.y + enemy.height;
      if (inside) {
        const wasAlive = enemy.hp > 0;
        enemy.takeDamage(player.attackDamage); // scales as the player levels up
        player.attackHasHit = true; // one swing, one hit
        if (wasAlive && enemy.hp <= 0) {
          questLog.onDefeat(enemy.type); // tell quests an enemy died
          player.gainXP(enemy.xpReward); // reward XP for the kill
        }
        break; // hit one enemy per swing
      }
    }
  },
};
