import { describe, expect, it } from "vitest";
import { normalFormFromNumbers } from "@gai/schema";
import {
  CLASSIC_GAMES,
  isNash,
  solveNormalForm,
  supportEnumeration,
  toBimatrix,
  toFraction,
  type ClassicGame,
} from "./index";

type Expected = {
  pure: [number, number][];
  /** Cân bằng hỗn hợp (không tính thuần): [x, y] */
  mixed: [number[], number[]][];
  dominant?: [number | null, number | null];
  /** Kết quả sau khi loại bỏ chiến lược bị trội: [hàng còn lại, cột còn lại] */
  afterDominance?: [number[], number[]];
};

const EXPECTED: Record<string, Expected> = {
  "tu-nhan": { pure: [[1, 1]], mixed: [], dominant: [1, 1], afterDominance: [[1], [1]] },
  "san-huou": { pure: [[0, 0], [1, 1]], mixed: [[[3 / 4, 1 / 4], [3 / 4, 1 / 4]]], dominant: [null, null] },
  "con-ga": { pure: [[0, 1], [1, 0]], mixed: [[[0.9, 0.1], [0.9, 0.1]]] },
  "chon-diem-hen": { pure: [[0, 0], [1, 1]], mixed: [[[2 / 3, 1 / 3], [1 / 3, 2 / 3]]] },
  "doan-dong-xu": { pure: [], mixed: [[[0.5, 0.5], [0.5, 0.5]]] },
  "oan-tu-ti": { pure: [], mixed: [[[1 / 3, 1 / 3, 1 / 3], [1 / 3, 1 / 3, 1 / 3]]] },
  "chuan-cong-nghe": { pure: [[0, 0], [1, 1]], mixed: [[[1 / 3, 2 / 3], [1 / 3, 2 / 3]]] },
  "be-tac": { pure: [[1, 1]], mixed: [], dominant: [1, 1], afterDominance: [[1], [1]] },
  "loai-tru-lap": { pure: [[0, 1]], mixed: [], afterDominance: [[0], [1]] },
  "dieu-hau-bo-cau": { pure: [[0, 1], [1, 0]], mixed: [[[2 / 3, 1 / 3], [2 / 3, 1 / 3]]] },
};

const toGame = (c: ClassicGame) =>
  normalFormFromNumbers({ id: c.id, title: c.title, players: c.players, rows: c.rows, cols: c.cols, payoffs: c.payoffs });

const sortPairs = (p: [number, number][]) => [...p].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("10 trò chơi kinh điển", () => {
  it("có đủ 10 trò chơi và mỗi trò có đáp án", () => {
    expect(CLASSIC_GAMES).toHaveLength(10);
    for (const c of CLASSIC_GAMES) expect(EXPECTED[c.id], c.id).toBeDefined();
  });

  for (const c of CLASSIC_GAMES) {
    describe(c.title, () => {
      const exp = EXPECTED[c.id];
      const sol = solveNormalForm(toGame(c));

      it("tìm đúng cân bằng Nash thuần", () => {
        expect(sortPairs(sol.pureNash)).toEqual(sortPairs(exp.pure));
      });

      it("tìm đúng cân bằng hỗn hợp", () => {
        const mixed = sol.equilibria.filter((e) => !e.pure);
        expect(mixed).toHaveLength(exp.mixed.length);
        exp.mixed.forEach(([x, y], k) => {
          x.forEach((p, i) => expect(mixed[k].x[i]).toBeCloseTo(p, 9));
          y.forEach((p, j) => expect(mixed[k].y[j]).toBeCloseTo(p, 9));
        });
      });

      it("cân bằng thuần từ hai cách tính khớp nhau", () => {
        const fromSupport = sol.equilibria
          .filter((e) => e.pure)
          .map((e) => [e.x.indexOf(1), e.y.indexOf(1)] as [number, number]);
        expect(sortPairs(fromSupport)).toEqual(sortPairs(sol.pureNash));
      });

      if (exp.dominant) {
        it("nhận diện đúng chiến lược trội", () => {
          expect(sol.dominant).toEqual(exp.dominant);
        });
      }

      if (exp.afterDominance) {
        it("loại bỏ chiến lược bị trội đúng", () => {
          expect(sol.dominance.remainingRows).toEqual(exp.afterDominance![0]);
          expect(sol.dominance.remainingCols).toEqual(exp.afterDominance![1]);
        });
      }
    });
  }

  it("loại trừ từng bước đi đúng thứ tự: Phải → Dưới → Trái", () => {
    const sol = solveNormalForm(toGame(CLASSIC_GAMES.find((c) => c.id === "loai-tru-lap")!));
    expect(sol.dominance.steps).toEqual([
      { player: 1, removed: 2, dominatedBy: 1 },
      { player: 0, removed: 1, dominatedBy: 0 },
      { player: 1, removed: 0, dominatedBy: 1 },
    ]);
  });
});

describe("Kiểm tra trên trò chơi ngẫu nhiên", () => {
  // Bộ sinh số ngẫu nhiên có hạt giống để test lặp lại được
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  it("mọi cân bằng tìm được đều thật sự là Nash, và luôn có ít nhất một", () => {
    for (let t = 0; t < 300; t++) {
      const m = 2 + Math.floor(rand() * 3);
      const n = 2 + Math.floor(rand() * 3);
      const A = Array.from({ length: m }, () => Array.from({ length: n }, () => rand() * 20 - 10));
      const B = Array.from({ length: m }, () => Array.from({ length: n }, () => rand() * 20 - 10));
      const eqs = supportEnumeration({ A, B });
      expect(eqs.length).toBeGreaterThan(0);
      // Trò chơi không suy biến luôn có số cân bằng lẻ
      expect(eqs.length % 2).toBe(1);
      for (const e of eqs) {
        expect(e.x.reduce((s, p) => s + p, 0)).toBeCloseTo(1, 9);
        expect(e.y.reduce((s, p) => s + p, 0)).toBeCloseTo(1, 9);
        expect(isNash({ A, B }, e.x, e.y)).toBe(true);
      }
    }
  });
});

describe("Định dạng", () => {
  it("đổi số sang phân số", () => {
    expect(toFraction(2 / 3)).toBe("2/3");
    expect(toFraction(0.25)).toBe("1/4");
    expect(toFraction(1)).toBe("1");
  });

  it("toBimatrix tách đúng payoff hai bên", () => {
    const bm = toBimatrix(toGame(CLASSIC_GAMES[0]));
    expect(bm.A).toEqual([[3, 0], [5, 1]]);
    expect(bm.B).toEqual([[3, 5], [0, 1]]);
  });
});
