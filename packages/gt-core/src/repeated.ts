/**
 * Song đề tù nhân lặp lại: các chiến lược chơi nhiều vòng với nhau.
 * C = hợp tác (Chia), D = phản bội (Giành).
 */
export type Move = "C" | "D";

/** Điểm mỗi vòng giống trò Chia kẹo: cùng chia 3/3, bị giành 0/5, cùng giành 1/1. */
export function pdPayoff(a: Move, b: Move): [number, number] {
  if (a === "C" && b === "C") return [3, 3];
  if (a === "C" && b === "D") return [0, 5];
  if (a === "D" && b === "C") return [5, 0];
  return [1, 1];
}

export type Strategy = {
  id: string;
  name: string;
  emoji: string;
  /** Mô tả ngắn, dễ hiểu */
  description: string;
  next: (mine: Move[], theirs: Move[], rand: () => number) => Move;
};

const last = <T,>(a: T[]) => a[a.length - 1];

export const STRATEGIES: Strategy[] = [
  {
    id: "luon-chia",
    name: "Luôn chia",
    emoji: "😇",
    description: "Lúc nào cũng hợp tác, dù bị giành bao nhiêu lần.",
    next: () => "C",
  },
  {
    id: "luon-gianh",
    name: "Luôn giành",
    emoji: "😈",
    description: "Lúc nào cũng giành, không bao giờ hợp tác.",
    next: () => "D",
  },
  {
    id: "an-mieng-tra-mieng",
    name: "Ăn miếng trả miếng",
    emoji: "🪞",
    description: "Vòng đầu hợp tác, sau đó làm giống hệt điều bạn làm ở vòng trước.",
    next: (_m, t) => (t.length === 0 ? "C" : last(t)),
  },
  {
    id: "thu-dai",
    name: "Thù dai",
    emoji: "😠",
    description: "Hợp tác cho đến khi bị giành một lần, từ đó giành mãi mãi.",
    next: (_m, t) => (t.includes("D") ? "D" : "C"),
  },
  {
    id: "bao-dung",
    name: "Bao dung",
    emoji: "🕊️",
    description: "Chỉ giành lại khi bị giành hai lần liên tiếp. Bỏ qua lỗi một lần.",
    next: (_m, t) => (t.length >= 2 && t[t.length - 1] === "D" && t[t.length - 2] === "D" ? "D" : "C"),
  },
  {
    id: "thang-giu-thua-doi",
    name: "Thắng giữ, thua đổi",
    emoji: "🔄",
    description: "Nếu vòng trước được điểm cao (3 hoặc 5) thì giữ nguyên, điểm thấp thì đổi.",
    next: (m, t) => {
      if (m.length === 0) return "C";
      const [me] = pdPayoff(last(m), last(t));
      return me >= 3 ? last(m) : last(m) === "C" ? "D" : "C";
    },
  },
  {
    id: "ngau-nhien",
    name: "Ngẫu nhiên",
    emoji: "🎲",
    description: "Tung đồng xu mỗi vòng.",
    next: (_m, _t, rand) => (rand() < 0.5 ? "C" : "D"),
  },
];

export function findStrategy(id: string): Strategy | undefined {
  return STRATEGIES.find((s) => s.id === id);
}

export type MatchResult = { movesA: Move[]; movesB: Move[]; scoreA: number; scoreB: number };

/**
 * Cho hai chiến lược đấu nhiều vòng.
 * noise = khả năng một nước đi bị \"lỡ tay\" thành nước ngược lại (mô phỏng hiểu lầm).
 */
export function playMatch(a: Strategy, b: Strategy, rounds: number, rand: () => number = Math.random, noise = 0): MatchResult {
  const movesA: Move[] = [];
  const movesB: Move[] = [];
  let scoreA = 0;
  let scoreB = 0;
  const flip = (m: Move): Move => (noise > 0 && rand() < noise ? (m === "C" ? "D" : "C") : m);
  for (let r = 0; r < rounds; r++) {
    const ma = flip(a.next(movesA, movesB, rand));
    const mb = flip(b.next(movesB, movesA, rand));
    movesA.push(ma);
    movesB.push(mb);
    const [pa, pb] = pdPayoff(ma, mb);
    scoreA += pa;
    scoreB += pb;
  }
  return { movesA, movesB, scoreA, scoreB };
}

export type TournamentRow = { id: string; total: number; perMatch: number };

/** Giải đấu vòng tròn (mỗi cặp đấu một trận, kể cả đấu với bản sao của chính mình). */
export function tournament(
  strategies: Strategy[],
  rounds: number,
  rand: () => number = Math.random,
  noise = 0,
): TournamentRow[] {
  const totals = new Map(strategies.map((s) => [s.id, 0]));
  for (let i = 0; i < strategies.length; i++) {
    for (let j = i; j < strategies.length; j++) {
      const r = playMatch(strategies[i], strategies[j], rounds, rand, noise);
      totals.set(strategies[i].id, totals.get(strategies[i].id)! + r.scoreA);
      if (i !== j) totals.set(strategies[j].id, totals.get(strategies[j].id)! + r.scoreB);
    }
  }
  return strategies
    .map((s) => ({ id: s.id, total: totals.get(s.id)!, perMatch: totals.get(s.id)! / strategies.length }))
    .sort((x, y) => y.total - x.total);
}

/**
 * Hợp tác bền vững (với chiến lược Thù dai) khi khả năng gặp lại ≥ (T − R) / (T − P).
 * Với điểm Chia kẹo (T=5, R=3, P=1) ngưỡng là 0,5.
 */
export function cooperationThreshold(T = 5, R = 3, P = 1): number {
  return (T - R) / (T - P);
}

/** Bộ sinh số ngẫu nhiên có hạt giống, để kết quả lặp lại được. */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
