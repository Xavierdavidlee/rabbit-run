// =============================================================
//  assets.js - Load images BEFORE the game starts. (Week 1)
// =============================================================
//  Images take time to load. If we draw one before it's ready we
//  get a blank space. So we load everything first ("preloading"),
//  THEN start the game.
// =============================================================

// Each image with a short nickname we'll use in code.
const IMAGE_FILES = {
  grass_dirt: "assets/tilesets/grass_dirt.png",
  nature:     "assets/tilesets/nature.png",
  bunny_idle: "assets/sprites/bunny_idle.png",
};

export const Images = {}; // gets filled in once loading finishes

function loadImage(name, src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { Images[name] = img; resolve(); };
    img.onerror = () => reject(new Error("Could not load image: " + src));
    img.src = src;
  });
}

// Load EVERYTHING, then resolve. Used like: await loadAllAssets();
export async function loadAllAssets() {
  const jobs = [];
  for (const [name, src] of Object.entries(IMAGE_FILES)) {
    jobs.push(loadImage(name, src));
  }
  await Promise.all(jobs);
}
