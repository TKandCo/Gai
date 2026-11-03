// Build website tĩnh cho GitHub Pages (chạy được trên Windows lẫn Linux).
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const r = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, STATIC_EXPORT: "1" },
});
if (r.status !== 0) process.exit(r.status ?? 1);

// Không cho GitHub xử lý bằng Jekyll (để thư mục _next được phục vụ)
writeFileSync("out/.nojekyll", "");
console.log("✓ Website tĩnh nằm trong apps/web/out");
