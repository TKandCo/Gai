// Tạo icon PNG cho PWA từ một hình SVG. Chạy: npm run icons -w @gai/web
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");
mkdirSync(out, { recursive: true });

// Ma trận 2×2, ô cân bằng được tô sáng
const svg = (pad) => {
  const s = 512;
  const inner = s - pad * 2;
  const gap = inner * 0.06;
  const cell = (inner - gap) / 2;
  const r = cell * 0.18;
  const x0 = pad;
  const x1 = pad + cell + gap;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="#0f766e"/>
  <rect x="${x0}" y="${x0}" width="${cell}" height="${cell}" rx="${r}" fill="#ffffff" fill-opacity="0.22"/>
  <rect x="${x1}" y="${x0}" width="${cell}" height="${cell}" rx="${r}" fill="#ffffff" fill-opacity="0.22"/>
  <rect x="${x0}" y="${x1}" width="${cell}" height="${cell}" rx="${r}" fill="#ffffff" fill-opacity="0.22"/>
  <rect x="${x1}" y="${x1}" width="${cell}" height="${cell}" rx="${r}" fill="#facc15"/>
</svg>`;
};

const jobs = [
  ["icon-192.png", 192, 96],
  ["icon-512.png", 512, 96],
  ["apple-touch-icon.png", 180, 96],
  ["icon-maskable-512.png", 512, 150],
];

for (const [name, size, pad] of jobs) {
  await sharp(Buffer.from(svg(pad))).resize(size, size).png().toFile(join(out, name));
  console.log("✓", name);
}
