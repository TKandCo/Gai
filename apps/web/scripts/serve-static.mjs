// Máy chủ thử cho bản tĩnh, mô phỏng cách GitHub Pages phục vụ file:
// /lab → lab.html, /learn/ → learn/index.html, không có → 404.html
// Chạy: npm run build:static && node apps/web/scripts/serve-static.mjs
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..", "out");
const port = Number(process.env.PORT ?? 3200);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
};

async function exists(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const safe = normalize(url).replace(/^(\.\.[/\\])+/, "");
  const candidates = [join(root, safe), join(root, `${safe}.html`), join(root, safe, "index.html")];
  for (const file of candidates) {
    if (file.startsWith(root) && (await exists(file))) {
      res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
      res.end(await readFile(file));
      return;
    }
  }
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(await readFile(join(root, "404.html")));
}).listen(port, () => console.log(`Bản tĩnh: http://localhost:${port}`));
