// =============================================================
//  ui.js  (Week 3 - no health bar yet; that arrives in Week 4)
//  Original header:
//  ui.js - Draws everything that sits ON TOP of the game world:
//  the health bar, the quest objectives HUD, the dialogue box,
//  the inventory screen, and little prompts like "Press T to talk".
// =============================================================
//  All UI is drawn with simple canvas rectangles and text so you
//  can see exactly how each piece is made - no hidden magic.
// =============================================================

import { CONFIG } from "./config.js";

// Our cozy retro color palette (kept in one spot for consistency).
const COLORS = {
  panel:    "#2f4a63",
  panelEdge:"#7fb2dc",
  text:     "#f3f8fd",
  dim:      "#bcd4ea",
  hp:       "#f08a8a",
  hpBack:   "#3a5a70",
  accent:   "#ffd98a",
  done:     "#9ad9b0",
};

// Draw a rounded retro panel with a border.
function panel(ctx, x, y, w, h) {
  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = COLORS.panelEdge;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
}

export const UI = {
  // ---------- Quest objectives HUD (top-right, toggleable) ----------
  drawQuests(ctx, questLog) {
    if (!questLog.hudVisible) {
      // Show a tiny hint that the HUD is hidden.
      ctx.fillStyle = COLORS.dim;
      ctx.font = "11px monospace";
      ctx.textAlign = "right";
      ctx.fillText("Quests hidden (Q)", CONFIG.CANVAS_WIDTH - 12, 22);
      return;
    }
    const active = questLog.activeQuests();
    if (active.length === 0) return;

    const w = 240, x = CONFIG.CANVAS_WIDTH - w - 12, y = 12;
    let lines = 1;
    for (const q of active) lines += 1 + q.objectives.length;
    const h = 14 + lines * 16;
    panel(ctx, x, y, w, h);

    ctx.textAlign = "left";
    let ty = y + 20;
    ctx.fillStyle = COLORS.accent;
    ctx.font = "bold 12px monospace";
    ctx.fillText("QUESTS  (Q to hide)", x + 10, ty);
    ty += 18;

    for (const q of active) {
      ctx.fillStyle = q.completed ? COLORS.done : COLORS.text;
      ctx.font = "bold 12px monospace";
      ctx.fillText((q.completed ? "✓ " : "• ") + q.title, x + 10, ty);
      ty += 16;
      for (const o of q.objectives) {
        const done = o.current >= o.needed;
        ctx.fillStyle = done ? COLORS.done : COLORS.dim;
        ctx.font = "11px monospace";
        const label = o.text || `${o.type} ${o.target}`;
        ctx.fillText(`   ${label}  ${o.current}/${o.needed}`, x + 10, ty);
        ty += 16;
      }
    }
  },

  // ---------- "Press T" style prompt near the player ----------
  drawPrompt(ctx, text) {
    const w = ctx.measureText(text).width + 24;
    const x = CONFIG.CANVAS_WIDTH/2 - w/2, y = CONFIG.CANVAS_HEIGHT - 150;
    panel(ctx, x, y, w, 28);
    ctx.fillStyle = COLORS.text;
    ctx.font = "13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, CONFIG.CANVAS_WIDTH/2, y + 19);
  },

  // ---------- Dialogue box at the bottom ----------
  drawDialogue(ctx, dialogue) {
    const margin = 16;
    const h = 120;
    const x = margin, y = CONFIG.CANVAS_HEIGHT - h - margin;
    const w = CONFIG.CANVAS_WIDTH - margin * 2;
    panel(ctx, x, y, w, h);

    // Speaker name tab.
    ctx.fillStyle = COLORS.accent;
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "left";
    ctx.fillText(dialogue.speakerName, x + 16, y + 24);

    // The typed-so-far text, wrapped to fit.
    const shown = dialogue.currentText.slice(0, dialogue.charIndex);
    ctx.fillStyle = COLORS.text;
    ctx.font = "14px monospace";
    this.wrapText(ctx, shown, x + 16, y + 48, w - 32, 18);

    // Choices (if any, and only after text finished typing).
    const choices = dialogue.currentChoices;
    if (choices && dialogue.fullyTyped) {
      let cy = y + 48 + 22;
      choices.forEach((c, i) => {
        const selected = i === dialogue.choiceIndex;
        ctx.fillStyle = selected ? COLORS.accent : COLORS.dim;
        ctx.fillText((selected ? "▶ " : "   ") + c, x + 24, cy);
        cy += 18;
      });
    } else if (dialogue.fullyTyped) {
      // Little blinking "continue" arrow.
      if (Math.floor(performance.now() / 400) % 2 === 0) {
        ctx.fillStyle = COLORS.accent;
        ctx.fillText("▼", x + w - 28, y + h - 14);
      }
    }
  },

  // ---------- Inventory screen ----------
  drawInventory(ctx, inventory) {
    // Dim the world behind the menu.
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    const w = 360, h = 280;
    const x = CONFIG.CANVAS_WIDTH/2 - w/2, y = CONFIG.CANVAS_HEIGHT/2 - h/2;
    panel(ctx, x, y, w, h);

    ctx.fillStyle = COLORS.accent;
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText("INVENTORY", CONFIG.CANVAS_WIDTH/2, y + 30);

    const items = inventory.list();
    ctx.textAlign = "left";
    ctx.font = "14px monospace";
    if (items.length === 0) {
      ctx.fillStyle = COLORS.dim;
      ctx.fillText("(empty - go find some treasure!)", x + 24, y + 70);
    } else {
      let iy = y + 64;
      for (const it of items) {
        ctx.fillStyle = COLORS.text;
        ctx.fillText(`• ${it.name}`, x + 24, iy);
        ctx.fillStyle = COLORS.accent;
        ctx.textAlign = "right";
        ctx.fillText(`x${it.count}`, x + w - 24, iy);
        ctx.textAlign = "left";
        iy += 24;
      }
    }
    ctx.fillStyle = COLORS.dim;
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Press I or Esc to close", CONFIG.CANVAS_WIDTH/2, y + h - 18);
  },

  // ---------- A full-screen message (title / game over / win) ----------
  drawScreen(ctx, title, subtitle, color = COLORS.accent) {
    ctx.fillStyle = "rgba(28,52,74,0.82)";
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.font = "bold 40px monospace";
    ctx.fillText(title, CONFIG.CANVAS_WIDTH/2, CONFIG.CANVAS_HEIGHT/2 - 10);
    ctx.fillStyle = COLORS.text;
    ctx.font = "16px monospace";
    ctx.fillText(subtitle, CONFIG.CANVAS_WIDTH/2, CONFIG.CANVAS_HEIGHT/2 + 30);
  },

  // Helper: wrap a long string into multiple lines inside maxWidth.
  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxWidth && line !== "") {
        ctx.fillText(line, x, y);
        line = word + " ";
        y += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, y);
  },
};
