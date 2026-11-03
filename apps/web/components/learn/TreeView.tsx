"use client";

import { backwardInduction, type TreeNode } from "@gai/gt-core";
import type { MiniTree } from "@gai/learning";

type Props = {
  tree: MiniTree;
  /** Tô đường đi khi mọi người chơi tốt nhất */
  solve?: boolean;
  /** Cho phép chạm chọn một kết quả cuối */
  onLeafClick?: (leafId: string) => void;
  selectedLeaf?: string | null;
  /** Sau khi chấm: lá đúng */
  correctLeaf?: string;
};

const toneOf = (p: 0 | 1) => (p === 0 ? "bg-p1-soft text-p1" : "bg-p2-soft text-p2");

/**
 * Cây trò chơi dạng danh sách lồng nhau, đọc từ trên xuống, vừa màn hình điện thoại.
 * Màu xanh = người chơi thứ nhất, cam = người chơi thứ hai (giống bảng lợi ích).
 */
export function TreeView({ tree, solve, onLeafClick, selectedLeaf, correctLeaf }: Props) {
  const bi = solve || correctLeaf ? backwardInduction(tree.root) : null;
  const onPath = new Set(solve && bi ? bi.path : []);

  const render = (node: TreeNode, dimmed: boolean): React.ReactNode => {
    if (node.kind === "terminal") {
      const [a, b] = node.payoffs;
      const isSel = selectedLeaf === node.id;
      const isRight = correctLeaf === node.id;
      const isWrong = correctLeaf !== undefined && isSel && !isRight;
      const isPathEnd = onPath.has(node.id);
      let cls = "border-line bg-surface-2";
      if (isPathEnd) cls = "border-nash bg-nash-soft ring-2 ring-nash";
      if (isSel) cls = "border-accent bg-accent-soft ring-2 ring-accent";
      if (isRight) cls = "border-good bg-good-soft ring-2 ring-good";
      if (isWrong) cls = "border-bad bg-bad-soft ring-2 ring-bad";
      const content = (
        <>
          <span className="text-lg font-semibold tabular-nums">
            <span className="text-p1">{a}</span>
            <span className="text-muted">, </span>
            <span className="text-p2">{b}</span>
          </span>
          {node.label && <span className="text-xs text-muted">{node.label}</span>}
          {(isPathEnd || isRight) && <span className="ml-auto text-sm">⭐</span>}
        </>
      );
      const base = `flex min-h-10 w-full items-center gap-2 rounded-xl border px-3 py-1 text-left transition ${cls} ${
        dimmed && !isSel && !isRight ? "opacity-45" : ""
      }`;
      return onLeafClick ? (
        <button
          type="button"
          onClick={() => onLeafClick(node.id)}
          aria-pressed={isSel}
          aria-label={`Kết quả: ${tree.players[0]} ${a}, ${tree.players[1]} ${b}`}
          className={`${base} active:scale-[0.98]`}
        >
          {content}
        </button>
      ) : (
        <div className={base}>{content}</div>
      );
    }

    const chosen = bi?.choice[node.id];
    return (
      <div className={dimmed ? "opacity-60" : ""}>
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${toneOf(node.player)}`}>
          {tree.players[node.player]} chọn
        </span>
        <ul className="mt-1 space-y-1.5 border-l-2 border-line pl-3">
          {node.branches.map((br, k) => {
            const picked = solve && chosen === k;
            const off = solve && chosen !== k;
            return (
              <li key={k}>
                <p
                  className={`mb-0.5 flex items-center gap-1 text-sm ${
                    picked ? (node.player === 0 ? "font-bold text-p1" : "font-bold text-p2") : off ? "text-muted line-through decoration-1" : "font-medium"
                  }`}
                >
                  <span aria-hidden>→</span> {br.action} {picked && <span aria-label="được chọn">✓</span>}
                </p>
                {render(br.next, dimmed || Boolean(off))}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-3">
      <div className="mb-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-p1-soft px-2 py-0.5 font-semibold text-p1">{tree.players[0]}: số xanh</span>
        <span className="rounded-full bg-p2-soft px-2 py-0.5 font-semibold text-p2">{tree.players[1]}: số cam</span>
      </div>
      {render(tree.root, false)}
    </div>
  );
}
