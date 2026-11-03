import { CLASSIC_GAMES, type ClassicGame } from "@gai/gt-core";
import { normalFormFromNumbers, type NormalFormGame } from "@gai/schema";

/** Trạng thái đang chỉnh trong Phòng lab (dạng số thuần, dễ sửa). */
export type LabGame = {
  presetId: string | null;
  title: string;
  players: [string, string];
  rows: string[];
  cols: string[];
  payoffs: [number, number][][];
};

export const MAX_ACTIONS = 4;
export const MIN_ACTIONS = 2;
const STORAGE_KEY = "gai.lab.v1";

export function fromClassic(c: ClassicGame): LabGame {
  return {
    presetId: c.id,
    title: c.title,
    players: [...c.players],
    rows: [...c.rows],
    cols: [...c.cols],
    payoffs: c.payoffs.map((r) => r.map(([a, b]) => [a, b] as [number, number])),
  };
}

export const DEFAULT_GAME = fromClassic(CLASSIC_GAMES[0]);

export function toSchemaGame(g: LabGame): NormalFormGame {
  return normalFormFromNumbers({
    id: g.presetId ?? "custom",
    title: g.title,
    players: g.players,
    rows: g.rows,
    cols: g.cols,
    payoffs: g.payoffs,
  });
}

export function loadLab(): LabGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const g = JSON.parse(raw) as LabGame;
    toSchemaGame(g); // kiểm tra hợp lệ
    return g;
  } catch {
    return null;
  }
}

export function saveLab(g: LabGame) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(g));
  } catch {
    /* bỏ qua: chế độ ẩn danh hoặc bộ nhớ bị chặn */
  }
}

export function addRow(g: LabGame): LabGame {
  if (g.rows.length >= MAX_ACTIONS) return g;
  return {
    ...g,
    presetId: null,
    rows: [...g.rows, `Lựa chọn ${g.rows.length + 1}`],
    payoffs: [...g.payoffs, g.cols.map(() => [0, 0] as [number, number])],
  };
}

export function addCol(g: LabGame): LabGame {
  if (g.cols.length >= MAX_ACTIONS) return g;
  return {
    ...g,
    presetId: null,
    cols: [...g.cols, `Lựa chọn ${g.cols.length + 1}`],
    payoffs: g.payoffs.map((r) => [...r, [0, 0] as [number, number]]),
  };
}

export function removeRow(g: LabGame, i: number): LabGame {
  if (g.rows.length <= MIN_ACTIONS) return g;
  return {
    ...g,
    presetId: null,
    rows: g.rows.filter((_, k) => k !== i),
    payoffs: g.payoffs.filter((_, k) => k !== i),
  };
}

export function removeCol(g: LabGame, j: number): LabGame {
  if (g.cols.length <= MIN_ACTIONS) return g;
  return {
    ...g,
    presetId: null,
    cols: g.cols.filter((_, k) => k !== j),
    payoffs: g.payoffs.map((r) => r.filter((_, k) => k !== j)),
  };
}

export function setPayoff(g: LabGame, i: number, j: number, who: 0 | 1, value: number): LabGame {
  const payoffs = g.payoffs.map((r) => r.map((c) => [...c] as [number, number]));
  payoffs[i][j][who] = value;
  return { ...g, presetId: null, payoffs };
}

export function rename(g: LabGame, target: "row" | "col" | "player", index: number, name: string): LabGame {
  const clean = name.trim() || "?";
  if (target === "row") return { ...g, rows: g.rows.map((r, k) => (k === index ? clean : r)) };
  if (target === "col") return { ...g, cols: g.cols.map((c, k) => (k === index ? clean : c)) };
  const players = [...g.players] as [string, string];
  players[index] = clean;
  return { ...g, players };
}

export function blankGame(): LabGame {
  return {
    presetId: null,
    title: "Tình huống của tôi",
    players: ["Bên A", "Bên B"],
    rows: ["Lựa chọn 1", "Lựa chọn 2"],
    cols: ["Lựa chọn 1", "Lựa chọn 2"],
    payoffs: [
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
    ],
  };
}
