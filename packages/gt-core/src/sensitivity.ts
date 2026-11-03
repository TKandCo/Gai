import { pureNash, type Bimatrix } from "./normalForm";
import { backwardInduction, tDecide, tLeaf, type TreeNode } from "./tree";

export type FragileCell = {
  i: number;
  j: number;
  /** 0 = bên hàng, 1 = bên cột */
  player: 0 | 1;
  /** Thay đổi nhỏ nhất (theo trị tuyệt đối) làm kết luận đổi */
  delta: number;
};

const key = (cells: [number, number][]) =>
  cells
    .map(([i, j]) => `${i}-${j}`)
    .sort()
    .join("|");

/**
 * Độ bền kết luận: thử tăng/giảm từng con số một chút, xem tập cân bằng Nash thuần có đổi không.
 * Trả các con số \"nhạy cảm\", sắp theo mức thay đổi cần thiết từ nhỏ đến lớn.
 */
export function fragility(bm: Bimatrix, deltas = [1, 2, 3]): FragileCell[] {
  const base = key(pureNash(bm));
  const out: FragileCell[] = [];
  bm.A.forEach((row, i) =>
    row.forEach((_, j) => {
      for (const player of [0, 1] as const) {
        for (const d of deltas) {
          const hit = [d, -d].find((s) => {
            const A = bm.A.map((r) => [...r]);
            const B = bm.B.map((r) => [...r]);
            (player === 0 ? A : B)[i][j] += s;
            return key(pureNash({ A, B })) !== base;
          });
          if (hit !== undefined) {
            out.push({ i, j, player, delta: hit });
            break;
          }
        }
      }
    }),
  );
  return out.sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));
}

/**
 * Biến bảng 2 người thành trò chơi lần lượt: first đi trước (chọn hàng nếu first = 0, chọn cột nếu first = 1),
 * người kia nhìn thấy rồi đáp lại.
 */
export function sequentialFromMatrix(bm: Bimatrix, rows: string[], cols: string[], first: 0 | 1): TreeNode {
  if (first === 0) {
    return tDecide("r", 0, rows.map((r, i) => [r, tDecide(`c${i}`, 1, cols.map((c, j) => [c, tLeaf(`l${i}-${j}`, bm.A[i][j], bm.B[i][j])]))]));
  }
  return tDecide("c", 1, cols.map((c, j) => [c, tDecide(`r${j}`, 0, rows.map((r, i) => [r, tLeaf(`l${i}-${j}`, bm.A[i][j], bm.B[i][j])]))]));
}

/** Kết quả khi đi lần lượt: ô (hàng, cột) sẽ xảy ra. */
export function sequentialOutcome(bm: Bimatrix, first: 0 | 1): { cell: [number, number]; hasTie: boolean } {
  const rows = bm.A.map((_, i) => String(i));
  const cols = bm.A[0].map((_, j) => String(j));
  const r = backwardInduction(sequentialFromMatrix(bm, rows, cols, first));
  const [i, j] = r.leafId.slice(1).split("-").map(Number);
  return { cell: [i, j], hasTie: r.hasTie };
}
