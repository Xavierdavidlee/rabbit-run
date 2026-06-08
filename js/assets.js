const IMAGE_FILES = {
  grass_dirt: "assets/tilesets/grass_dirt.png",
  nature:     "assets/tilesets/nature.png",
  bunny_idle: "assets/sprites/bunny_idle.png",
};
export const Images = {};

function loadImage(name, src) {
  return new Promise ((resolve, reject) => {
    const img = new Image ();
    img.onload = () => {Images[name] = img; resolve(); };
    img.onerror = () => reject(new Error("Could not load image: " + src));
    img.src = src;
  });
}
export async function loadAllAssets () {
  const jobs = [];
  for (const [name, src] of Object.entries(IMAGE_FILES)) {
    jobs.push(loadImage(name, src));
  }
  await Promise.all(jobs);
}