// =============================================================
//  assets.js - Load images and sounds first. (Week 3)
// =============================================================
//  We add NPC/animal sprites and more sound effects this week.
// =============================================================

const IMAGE_FILES = {
  grass_dirt: "assets/tilesets/grass_dirt.png",
  nature:     "assets/tilesets/nature.png",
  crops:      "assets/tilesets/crops.png",      // carrots & crops for items
  bunny_idle: "assets/sprites/bunny_idle.png",
  bunny_run:  "assets/sprites/bunny_run.png",
  bunny_sword:"assets/sprites/bunny_sword.png",
  cow:        "assets/sprites/cow_idle.png",     // NEW: NPC sprite
  chicken:    "assets/sprites/chicken_idle.png", // NEW: NPC sprite
};

const AUDIO_FILES = {
  attack: "assets/audio/attack.mp3",
  pickup: "assets/audio/pickup.mp3",   // NEW: item pickup
  select: "assets/audio/select.mp3",   // NEW: menu/dialogue confirm
  blip:   "assets/audio/blip.mp3",     // NEW: menu move
  text:   "assets/audio/text.mp3",     // NEW: dialogue typing tick
  quest:  "assets/audio/quest.mp3",    // NEW: quest complete fanfare
  town_theme: "assets/audio/town_theme.mp3",
};

export const Images = {};
export const Audio = {};

function loadImage(name, src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { Images[name] = img; resolve(); };
    img.onerror = () => reject(new Error("Could not load image: " + src));
    img.src = src;
  });
}
function loadAudio(name, src) {
  return new Promise((resolve) => {
    const audio = new window.Audio();
    audio.addEventListener("canplaythrough", () => { Audio[name] = audio; resolve(); }, { once: true });
    audio.addEventListener("error", () => { console.warn("Audio missing:", src); resolve(); });
    audio.src = src; audio.load();
  });
}
export async function loadAllAssets() {
  const jobs = [];
  for (const [n, s] of Object.entries(IMAGE_FILES)) jobs.push(loadImage(n, s));
  for (const [n, s] of Object.entries(AUDIO_FILES)) jobs.push(loadAudio(n, s));
  await Promise.all(jobs);
}
