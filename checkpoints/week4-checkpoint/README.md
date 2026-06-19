# Week 4 Checkpoint - "The complete game"

This is the finished Rabbit Run: Tales of the Warren RPG. Your game should match this folder
by the end of the program.

## Controls
- **Arrows / WASD** - move
- **Space** - attack (swing the sword)
- **T** - talk to a nearby NPC
- **I** - open/close inventory
- **Q** - toggle the quest objectives HUD
- **Space / Enter** - advance dialogue, and start / restart from the title and
  end screens

## What's new since Week 3
- **Enemies** with simple **AI** (a state machine: idle, chase, hurt, dead).
- **Battle**: your sword damages enemies; enemies damage you.
- **Health** (HP bar) with brief invincibility after a hit.
- **XP, leveling & healing**: defeating enemies grants XP; filling the XP bar
  levels you up (more max HP and attack damage, plus a full heal); berry items
  restore HP.
- Full **game states**: Title screen, Game Over, and a You-Win screen when all
  quests are complete.
- A full **soundtrack** and all sound effects.
- **Five quests** across five NPCs, with quest-aware dialogue (NPCs react to
  whether a quest is not started / in progress / complete).

## New / changed files since Week 3
| File | What changed |
|------|--------------|
| `js/enemy.js` | NEW - enemies with a state-machine AI; each type has an `xp` reward |
| `js/battle.js` | NEW - decides when your sword hits an enemy; grants XP on a kill |
| `js/player.js` | Adds HP, damage + invincibility, and **XP / level / `gainXP` / `levelUp` / `heal`** |
| `js/ui.js` | Adds the **health bar + XP bar + level**, and the title / game-over / win screens |
| `js/game.js` | Adds enemies, battle, the TITLE / GAMEOVER / WIN states, healing on pickup, and **T-to-talk** |
| `js/config.js` | Adds combat, leveling (`XP_BASE`, `HP_PER_LEVEL`, ...) and healing values |
| `js/item.js` | Items can carry a `heal` value |
| `js/assets.js` | Loads enemy sprites and the rest of the audio |

## Key ideas introduced
- **Finite state machines** for AI
- Real-time **combat** and hit detection
- **Progression systems**: XP, leveling, and healing
- Managing a larger **game state machine** (title, play, win/lose)

## Tip for learners
Open the browser console (F12) and type `game` - the whole live game is exposed
there. Try `game.player.hp = 1`, `game.player.gainXP(50)`, or `game.enemies = []`.
