# Week 3 Checkpoint - "It feels like an RPG"

By the end of Week 3 your game should match this folder.

## What's new since Week 2
- **NPCs** you can walk up to and **talk** to (press **T**; the sword is **Space**). Dialogue types out letter by
  letter and some lines let you **choose an answer**.
- **Items** you can collect; they go into your **Inventory** (press **I**).
- **Quests** with objectives and a **toggleable HUD** (press **Q**).
- Background **music**.

## New / changed files
| File | What changed |
|------|--------------|
| `js/npc.js` | **NEW** - a friendly character that holds dialogue & can give a quest |
| `js/dialogue.js` | **NEW** - typewriter text + answer choices |
| `js/item.js` | **NEW** - collectible items + the `Inventory` |
| `js/quest.js` | **NEW** - quests, objectives, and progress tracking |
| `js/ui.js` | **NEW** - draws the quest HUD, dialogue box, inventory, prompts |
| `js/game.js` | Now has simple **states**: PLAYING / DIALOGUE / INVENTORY |
| `js/assets.js` | Loads NPC sprites, crops (items), and more sounds |

## Key ideas introduced
- **States** (the game behaves differently when you're talking vs. walking)
- **Callbacks** (the dialogue tells the game what you chose)
- Designing small cooperating **systems** (quests listen for "collect"/"talk" events)
- **Depth sorting** (drawing things lower on screen in front)

## Not yet
No enemies, battle, health, title/win/game-over screens - that's Week 4.
