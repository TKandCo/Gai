"use client";

import { useState } from "react";
import { allNodes, type TreeNode } from "@gai/gt-core";
import { nashAnswer, treeAnswer, type Exercise, type Response } from "@gai/learning";
import { MiniMatrix } from "./MiniMatrix";
import { TreeView } from "./TreeView";
import { RichText } from "../RichText";
import type { AnswerRecord } from "./QuizRunner";

/** Diễn đạt câu trả lời bằng chữ. */
function describe(q: Exercise, r: Response): string {
  if (q.kind === "choice" && r.kind === "choice") return q.options[r.index] ?? "?";
  if (q.kind === "number" && r.kind === "number") return r.raw;
  if (q.kind === "nash" && r.kind === "nash")
    return r.cells.map(([i, j]) => `${q.game.rows[i]} – ${q.game.cols[j]}`).join("; ") || "(không chọn)";
  if (q.kind === "tree" && r.kind === "tree") return leafText(q.tree.root, q.tree.players, r.leafId);
  return "?";
}

function leafText(root: TreeNode, players: [string, string], id: string): string {
  const n = allNodes(root).find((x) => x.id === id);
  return n && n.kind === "terminal" ? `${players[0]} ${n.payoffs[0]}, ${players[1]} ${n.payoffs[1]}` : "?";
}

function correctText(q: Exercise): string {
  switch (q.kind) {
    case "choice":
      return q.options[q.answer];
    case "number": {
      const a = q.answer;
      const frac = [2, 3, 4, 5, 6, 8].find((d) => Math.abs(a * d - Math.round(a * d)) < 1e-9 && !Number.isInteger(a));
      return frac ? `${Math.round(a * frac)}/${frac}` : String(a).replace(".", ",");
    }
    case "nash":
      return nashAnswer(q.game)
        .map(([i, j]) => `${q.game.rows[i]} – ${q.game.cols[j]}`)
        .join("; ");
    case "tree":
      return leafText(q.tree.root, q.tree.players, treeAnswer(q.tree));
  }
}

/**
 * Phần Giải đáp: chỉ hiện SAU KHI làm xong tất cả câu hỏi.
 * Mỗi câu: câu trả lời của bạn, đáp án đúng, lời giải. Cuối cùng là các điều cần ghi nhớ để quyết định tốt hơn.
 */
export function Review({ answers, takeaways }: { answers: AnswerRecord[]; takeaways?: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const wrong = answers.filter((a) => !a.ok);
  const list = showAll || wrong.length === 0 ? answers : wrong;

  return (
    <section className="space-y-3 text-left">
      <div className="flex items-end justify-between gap-2">
        <h2 className="text-xl font-bold">📖 Giải đáp</h2>
        {wrong.length > 0 && wrong.length < answers.length && (
          <button onClick={() => setShowAll((s) => !s)} className="text-sm font-medium text-accent">
            {showAll ? "Chỉ câu sai" : "Xem tất cả câu"}
          </button>
        )}
      </div>
      {wrong.length > 0 && !showAll && <p className="text-sm text-muted">Xem lại {wrong.length} câu chưa đúng trước nhé.</p>}

      <ol className="space-y-3">
        {list.map(({ q, r, ok }) => (
          <li key={q.id} className="rounded-2xl border border-line bg-surface p-4">
            <p className="mb-2 font-semibold leading-snug">
              {ok ? "✅" : "❌"} {q.prompt}
            </p>
            {q.kind === "nash" && (
              <div className="mb-2">
                <MiniMatrix game={q.game} selected={r.kind === "nash" ? r.cells : []} reveal={{ correct: nashAnswer(q.game) }} />
              </div>
            )}
            {q.kind === "tree" && (
              <div className="mb-2">
                <TreeView
                  tree={q.tree}
                  solve
                  selectedLeaf={r.kind === "tree" ? r.leafId : null}
                  correctLeaf={treeAnswer(q.tree)}
                />
              </div>
            )}
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted">Bạn trả lời</dt>
                <dd className={ok ? "font-medium text-good" : "font-medium text-bad"}>{describe(q, r)}</dd>
              </div>
              {!ok && (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-muted">Đáp án</dt>
                  <dd className="font-semibold text-good">{correctText(q)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-2 rounded-xl bg-surface-2 p-3 text-[0.95rem]">
              <RichText text={q.explain} />
            </div>
          </li>
        ))}
      </ol>

      {takeaways && takeaways.length > 0 && (
        <div className="rounded-2xl border-2 border-accent/40 bg-accent-soft p-4">
          <p className="mb-2 font-bold">🧭 Ghi nhớ để quyết định tốt hơn</p>
          <ul className="space-y-2">
            {takeaways.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden>•</span>
                <RichText text={t} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
