/**
 * Trò chơi lần lượt (dạng cây, thông tin hoàn hảo) cho 2 người.
 * Giải bằng suy luận ngược: bắt đầu từ các nút cuối, mỗi người chọn nhánh tốt nhất cho mình.
 */
export type TreeNode =
  | { id: string; kind: "decision"; player: 0 | 1; branches: { action: string; next: TreeNode }[] }
  | { id: string; kind: "terminal"; payoffs: [number, number]; label?: string };

export type BIStep = {
  nodeId: string;
  player: 0 | 1;
  /** Kết quả cuối cùng nếu chọn từng nhánh (đã giả định mọi người sau đó chơi tốt nhất) */
  options: { action: string; payoffs: [number, number] }[];
  chosen: number;
  /** Có nhánh khác tốt ngang nhánh được chọn */
  tie: boolean;
};

export type BIResult = {
  payoffs: [number, number];
  /** Nhánh được chọn tại mỗi nút quyết định (kể cả nút không nằm trên đường đi) */
  choice: Record<string, number>;
  /** Các nút trên đường đi thực tế, từ gốc đến lá */
  path: string[];
  leafId: string;
  /** Các bước giải, từ cuối cây ngược lên gốc */
  steps: BIStep[];
  hasTie: boolean;
};

export function tLeaf(id: string, a: number, b: number, label?: string): TreeNode {
  return { id, kind: "terminal", payoffs: [a, b], label };
}

export function tDecide(id: string, player: 0 | 1, branches: [string, TreeNode][]): TreeNode {
  return { id, kind: "decision", player, branches: branches.map(([action, next]) => ({ action, next })) };
}

export function backwardInduction(root: TreeNode): BIResult {
  const choice: Record<string, number> = {};
  const steps: BIStep[] = [];
  const leafOf: Record<string, string> = {};

  const solve = (node: TreeNode): [number, number] => {
    if (node.kind === "terminal") {
      leafOf[node.id] = node.id;
      return node.payoffs;
    }
    const results = node.branches.map((b) => solve(b.next));
    let best = 0;
    results.forEach((r, k) => {
      if (r[node.player] > results[best][node.player] + 1e-9) best = k;
    });
    const tie = results.some((r, k) => k !== best && Math.abs(r[node.player] - results[best][node.player]) < 1e-9);
    choice[node.id] = best;
    leafOf[node.id] = leafOf[node.branches[best].next.id];
    steps.push({
      nodeId: node.id,
      player: node.player,
      options: node.branches.map((b, k) => ({ action: b.action, payoffs: results[k] })),
      chosen: best,
      tie,
    });
    return results[best];
  };

  const payoffs = solve(root);
  const path: string[] = [];
  let cur: TreeNode = root;
  for (;;) {
    path.push(cur.id);
    if (cur.kind === "terminal") break;
    cur = cur.branches[choice[cur.id]].next;
  }
  return { payoffs, choice, path, leafId: path[path.length - 1], steps, hasTie: steps.some((s) => s.tie) };
}

/** Danh sách mọi nút (kiểm tra mã nút không trùng). */
export function allNodes(root: TreeNode): TreeNode[] {
  if (root.kind === "terminal") return [root];
  return [root, ...root.branches.flatMap((b) => allNodes(b.next))];
}
