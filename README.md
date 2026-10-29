# sakura

An original, single-screen Japanese shrine sanctuary website concept built with HTML, CSS, and JavaScript. Open `index.html` directly or serve this folder with any static web server (`python -m http.server`). The multi-layer parallax landscape, day/night switch, drifting sakura petals, night fireflies, and breathing ritual dialog are self-contained with no backend dependencies.

## Layered Composition & Asset Dimensions

The scene is built from four independent visual planes plus dual-depth canvas petals and night fireflies, rendered at 2K high definition (`2752 × 1536`) with sub-pixel mathematical alpha matting:

1. **Sky & Distant Mountains (`assets/sky-day.webp`, `assets/sky-night.webp`)** — 2K (`2752 × 1536`) panoramic landscape featuring a gentle cerulean spring sky, morning clouds, Mount Fuji, and misty blue mountain ridges, transitioning to deep sapphire moonlight with stars and a luminous full moon.
2. **Wordmark (`sakura`)** — Set in `Cormorant Garamond` at `clamp(118px, 23.5vw, 390px)` with letter-by-letter arrival and subtle breathing drift, sitting behind the middle-ground shrine and cherry blossom canopies.
3. **Shrine, Red Arched Bridge & Sakura Trees (`assets/shrine-day.webp`, `assets/shrine-night.webp`)** — 2K (`2752 × 1536`) RGBA layer with clean sub-pixel alpha matting along the blooming cherry blossom canopies and curved temple roof tiles. At night, shrine lanterns and shoji screens glow with warm golden-amber light that reflects onto the pond.
4. **Foreground Garden Bank (`assets/foreground-day.webp`, `assets/foreground-night.webp`)** — 2K (`2752 × 1536`) RGBA layer featuring close-up mossy grass, wildflowers, stepping stones, and fallen sakura petals at 1:1 natural aspect ratio.
5. **Interactive Atmosphere** — Dual-depth HTML5 canvas cherry blossom petals with 3D tumble, pointer breeze response, and diffuse warm night fireflies.
