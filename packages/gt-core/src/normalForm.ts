import type { NormalFormGame } from "@gai/schema";
import { EPS, combinations, solveLinear } from "./linalg";

/** A = lợi ích bên hàng, B = lợi ích bên cột. A[i][j], B[i][j]. */
export type Bimatrix = { A: number[][]; B: number[][] };

export function toBimatrix(game: NormalFormGame): Bimatrix {
  return {
    A: game.payoffs.map((row) => row.map((cell) => cell[0].value)),
    B: game.payoffs.map((row) => row.map((cell) => cell[1].value)),
  };
}

export type BestResponses = {
  /** rowBest[i][j] = true nếu hàng i là phản ứng tốt nhất của bên hàng khi bên cột chọn j. */
  rowBest: boolean[][];
  /** colBest[i][j] = true nếu cột j là phản ứng tốt nhất của bên cột khi bên hàng chọn i. */
  colBest: boolean[][];
};

export function bestResponses({ A, B }: Bimatrix): BestResponses {
  const m = A.length;
  const n = A[0].length;
  const colMaxA = Array.from({ length: n }, (_, j) => Math.max(...A.map((row) => row[j])));
  const rowMaxB = B.map((row) => Math.max(...row));
  return {
    rowBest: A.map((row) => row.map((v, j) => v >= colMaxA[j] - EPS)),
    colBest: Array.from({ length: m }, (_, i) => B[i].map((v) => v >= rowMaxB[i] - EPS)),
  };
}

/** Cân bằng Nash thuần: ô mà cả hai bên đều đang chọn phản ứng tốt nhất. */
export function pureNash(bm: Bimatrix): [number, number][] {
  const { rowBest, colBest } = bestResponses(bm);
  const out: [number, number][] = [];
  rowBest.forEach((row, i) =>
    row.forEach((ok, j) => {
      if (ok && colBest[i][j]) out.push([i, j]);
    }),
  );
  return out;
}

export type DominanceStep = {
  /** 0 = bên hàng, 1 = bên cột */
  player: 0 | 1;
  removed: number;
  dominatedBy: number;
};

export type DominanceResult = {
  steps: DominanceStep[];
  remainingRows: number[];
  remainingCols: number[];
};

/** Loại bỏ lặp các chiến lược bị trội chặt (so với một chiến lược thuần khác). */
export function iteratedStrictDominance({ A, B }: Bimatrix): DominanceResult {
  let rows = A.map((_, i) => i);
  let cols = A[0].map((_, j) => j);
  const steps: DominanceStep[] = [];

  const findDominatedRow = (): DominanceStep | null => {
    for (const r of rows)
      for (const r2 of rows)
        if (r2 !== r && cols.every((c) => A[r2][c] > A[r][c] + EPS))
          return { player: 0, removed: r, dominatedBy: r2 };
    return null;
  };
  const findDominatedCol = (): DominanceStep | null => {
    for (const c of cols)
      for (const c2 of cols)
        if (c2 !== c && rows.every((r) => B[r][c2] > B[r][c] + EPS))
          return { player: 1, removed: c, dominatedBy: c2 };
    return null;
  };

  for (;;) {
    const step = findDominatedRow() ?? findDominatedCol();
    if (!step) break;
    steps.push(step);
    if (step.player === 0) rows = rows.filter((r) => r !== step.removed);
    else cols = cols.filter((c) => c !== step.removed);
  }
  return { steps, remainingRows: rows, remainingCols: cols };
}

/** Chiến lược trội chặt của mỗi bên trong trò chơi gốc (tốt hơn mọi lựa chọn khác dù đối phương làm gì). */
export function dominantStrategies({ A, B }: Bimatrix): [number | null, number | null] {
  const m = A.length;
  const n = A[0].length;
  let rowDom: number | null = null;
  for (let r = 0; r < m && rowDom === null; r++) {
    let ok = true;
    for (let r2 = 0; r2 < m && ok; r2++)
      if (r2 !== r) for (let c = 0; c < n && ok; c++) if (!(A[r][c] > A[r2][c] + EPS)) ok = false;
    if (ok && m > 1) rowDom = r;
  }
  let colDom: number | null = null;
  for (let c = 0; c < n && colDom === null; c++) {
    let ok = true;
    for (let c2 = 0; c2 < n && ok; c2++)
      if (c2 !== c) for (let r = 0; r < m && ok; r++) if (!(B[r][c] > B[r][c2] + EPS)) ok = false;
    if (ok && n > 1) colDom = c;
  }
  return [rowDom, colDom];
}

export type Equilibrium = {
  /** Xác suất bên hàng chọn mỗi hàng */
  x: number[];
  /** Xác suất bên cột chọn mỗi cột */
  y: number[];
  /** Lợi ích kỳ vọng [bên hàng, bên cột] */
  payoffs: [number, number];
  pure: boolean;
};

/**
 * Tìm mọi cân bằng Nash (thuần và hỗn hợp) bằng liệt kê tập hỗ trợ.
 * Đầy đủ với trò chơi không suy biến; với trò chơi suy biến có thể bỏ sót một phần
 * (vô số cân bằng), nhưng mọi kết quả trả về đều là cân bằng thật.
 */
export function supportEnumeration({ A, B }: Bimatrix): Equilibrium[] {
  const m = A.length;
  const n = A[0].length;
  const out: Equilibrium[] = [];

  for (let k = 1; k <= Math.min(m, n); k++) {
    for (const I of combinations(m, k)) {
      for (const J of combinations(n, k)) {
        // y trên J khiến bên hàng bàng quan giữa các hàng trong I: Σ_j A[i][j]·y_j = v
        const My = I.map((i) => [...J.map((j) => A[i][j]), -1]);
        My.push([...J.map(() => 1), 0]);
        const solY = solveLinear(My, [...I.map(() => 0), 1]);
        if (!solY) continue;
        // x trên I khiến bên cột bàng quan giữa các cột trong J: Σ_i B[i][j]·x_i = w
        const Mx = J.map((j) => [...I.map((i) => B[i][j]), -1]);
        Mx.push([...I.map(() => 1), 0]);
        const solX = solveLinear(Mx, [...J.map(() => 0), 1]);
        if (!solX) continue;

        const yJ = solY.slice(0, k);
        const xI = solX.slice(0, k);
        if (yJ.some((p) => p <= EPS) || xI.some((p) => p <= EPS)) continue;

        const x = Array<number>(m).fill(0);
        const y = Array<number>(n).fill(0);
        I.forEach((i, t) => (x[i] = xI[t]));
        J.forEach((j, t) => (y[j] = yJ[t]));

        const v = solY[k];
        const w = solX[k];
        // Không lựa chọn nào ngoài tập hỗ trợ tốt hơn
        const rowVals = A.map((row) => row.reduce((s, a, j) => s + a * y[j], 0));
        const colVals = Array.from({ length: n }, (_, j) => x.reduce((s, p, i) => s + p * B[i][j], 0));
        if (rowVals.some((u) => u > v + 1e-7) || colVals.some((u) => u > w + 1e-7)) continue;

        const dup = out.some(
          (e) => e.x.every((p, i) => Math.abs(p - x[i]) < 1e-7) && e.y.every((p, j) => Math.abs(p - y[j]) < 1e-7),
        );
        if (!dup) out.push({ x, y, payoffs: [v, w], pure: k === 1 });
      }
    }
  }
  return out;
}

export type NormalFormSolution = {
  bestResponses: BestResponses;
  pureNash: [number, number][];
  equilibria: Equilibrium[];
  dominance: DominanceResult;
  dominant: [number | null, number | null];
};

export function solveNormalForm(game: NormalFormGame): NormalFormSolution {
  const bm = toBimatrix(game);
  return {
    bestResponses: bestResponses(bm),
    pureNash: pureNash(bm),
    equilibria: supportEnumeration(bm),
    dominance: iteratedStrictDominance(bm),
    dominant: dominantStrategies(bm),
  };
}

/** Kiểm tra một cặp chiến lược có phải cân bằng Nash không (không bên nào lệch có lợi). */
export function isNash({ A, B }: Bimatrix, x: number[], y: number[], tol = 1e-6): boolean {
  const rowVals = A.map((row) => row.reduce((s, a, j) => s + a * y[j], 0));
  const colVals = A[0].map((_, j) => x.reduce((s, p, i) => s + p * B[i][j], 0));
  const v = rowVals.reduce((s, u, i) => s + u * x[i], 0);
  const w = colVals.reduce((s, u, j) => s + u * y[j], 0);
  return rowVals.every((u) => u <= v + tol) && colVals.every((u) => u <= w + tol);
}
