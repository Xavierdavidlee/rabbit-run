// =============================================================
//  assets.js - Load images and sounds first. (Week 2)
// =============================================================

const IMAGE_FILES = {
  grass_dirt: "assets/tilesets/grass_dirt.png",
  nature:     "assets/tilesets/nature.png",
  bunny_idle: "assets/sprites/bunny_idle.png",
  bunny_run:  "assets/sprites/bunny_run.png",   // NEW: walking animation
  bunny_sword:"assets/sprites/bunny_sword.png", // NEW: attack animation
};

const AUDIO_FILES = {
  attack: "assets/audio/attack.mp3",  // NEW: sword swing sound
  hit:    "assets/audio/hit.mp3",
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
