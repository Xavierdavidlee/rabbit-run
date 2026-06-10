// =============================================================
//  audio.js - Play sound effects. (Week 2)
// =============================================================
//  Browsers block sound until the user interacts with the page,
//  so the first key press "unlocks" audio. We catch and ignore
//  the harmless errors before that happens.
// =============================================================

import { Audio } from "./assets.js";

export const Sound = {
  play(name) {
    const a = Audio[name];
    if (!a) return;
    const clip = a.cloneNode();  // clone so sounds can overlap
    clip.volume = 0.6;
    clip.play().catch(() => {}); // ignore "not allowed yet" errors
  },
};
