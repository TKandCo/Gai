import { backwardInduction, pureNash } from "@gai/gt-core";
import type { Exercise, MiniGame, MiniTree } from "./types";

/** Đọc số người dùng gõ: chấp nhận "0,5", "0.5", "1/2", "50%". */
export function parseAnswer(raw: string): number | null {
  const s = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!s) return null;
  if (s.endsWith("%")) {
    const v = Number(s.slice(0, -1));
    return Number.isFinite(v) ? v / 100 : null;
  }
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (frac) {
    const d = Number(frac[2]);
    return d === 0 ? null : Number(frac[1]) / d;
  }
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

export function nashAnswer(game: MiniGame): [number, number][] {
  return pureNash({
    A: game.payoffs.map((r) => r.map((c) => c[0])),
    B: game.payoffs.map((r) => r.map((c) => c[1])),
  });
}

export function treeAnswer(tree: MiniTree): string {
  return backwardInduction(tree.root).leafId;
}

export type Response = { kind: "choice"; index: number } | { kind: "number"; raw: string } | { kind: "nash"; cells: [number, number][] }
  | { kind: "tree"; leafId: string };

export function checkAnswer(ex: Exercise, r: Response): boolean {
  if (ex.kind === "choice" && r.kind === "choice") return r.index === ex.answer;
  if (ex.kind === "number" && r.kind === "number") {
    const v = parseAnswer(r.raw);
    // Chấp nhận cả dạng phần trăm khi đáp án là xác suất (0,25 hay 25 đều đúng)
    const tol = ex.tolerance ?? 0.01;
    if (v === null) return false;
    if (Math.abs(v - ex.answer) <= tol) return true;
    return ex.answer > 0 && ex.answer < 1 && Math.abs(v / 100 - ex.answer) <= tol;
  }
  if (ex.kind === "nash" && r.kind === "nash") {
    const key = (c: [number, number]) => `${c[0]}-${c[1]}`;
    const want = new Set(nashAnswer(ex.game).map(key));
    const got = new Set(r.cells.map(key));
    return want.size === got.size && [...want].every((k) => got.has(k));
  }
  if (ex.kind === "tree" && r.kind === "tree") return r.leafId === treeAnswer(ex.tree);
  return false;
}
