"use client";

import { formatNumber, type NormalFormSolution } from "@gai/gt-core";
import { MAX_ACTIONS, type LabGame } from "@/lib/lab";

export type EditTarget =
  | { kind: "cell"; i: number; j: number }
  | { kind: "row"; i: number }
  | { kind: "col"; j: number }
  | { kind: "player"; p: 0 | 1 };

type Props = {
  game: LabGame;
  solution: NormalFormSolution;
  showBestResponses: boolean;
  onEdit: (t: EditTarget) => void;
  onAddRow: () => void;
  onAddCol: () => void;
};

/**
 * Ma trận payoff chạm được. Số bên trái (xanh) là lợi ích bên hàng, số bên phải (cam) là lợi ích bên cột.
 * Gạch chân = phản ứng tốt nhất. Ô viền vàng = cân bằng Nash thuần.
 */
export function MatrixEditor({ game, solution, showBestResponses, onEdit, onAddRow, onAddCol }: Props) {
  const { rowBest, colBest } = solution.bestResponses;
  const nash = new Set(solution.pureNash.map(([i, j]) => `${i}-${j}`));
  const removedRows = new Set(solution.dominance.steps.filter((s) => s.player === 0).map((s) => s.removed));
  const removedCols = new Set(solution.dominance.steps.filter((s) => s.player === 1).map((s) => s.removed));
  const n = game.cols.length;

  return (
    <div className="rounded-2xl border border-line bg-surface p-3">
      <div className="mb-2 flex items-center justify-end gap-2 pl-14">
        <button
          onClick={() => onEdit({ kind: "player", p: 1 })}
          className="truncate rounded-full bg-p2-soft px-3 py-1 text-xs font-semibold text-p2"
        >
          {game.players[1]} ✎
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit({ kind: "player", p: 0 })}
          className="flex w-6 shrink-0 items-center justify-center rounded-full bg-p1-soft py-3 text-xs font-semibold text-p1"
          aria-label={`Đổi tên ${game.players[0]}`}
        >
          <span className="[writing-mode:vertical-rl] rotate-180 truncate">{game.players[0]} ✎</span>
        </button>

        <div className="min-w-0 flex-1">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `minmax(56px, 0.8fr) repeat(${n}, minmax(0, 1fr))` }}
          >
            <div />
            {game.cols.map((c, j) => (
              <button
                key={j}
                onClick={() => onEdit({ kind: "col", j })}
                className={`truncate rounded-lg px-1 py-1.5 text-center text-xs font-medium text-p2 ${
                  removedCols.has(j) ? "opacity-40 line-through" : ""
                }`}
              >
                {c}
              </button>
            ))}

            {game.rows.map((r, i) => (
              <Row key={i}>
                <button
                  onClick={() => onEdit({ kind: "row", i })}
                  className={`truncate rounded-lg px-1 text-left text-xs font-medium text-p1 ${
                    removedRows.has(i) ? "opacity-40 line-through" : ""
                  }`}
                >
                  {r}
                </button>
                {game.cols.map((_, j) => {
                  const [a, b] = game.payoffs[i][j];
                  const isNash = nash.has(`${i}-${j}`);
                  const dimmed = removedRows.has(i) || removedCols.has(j);
                  return (
                    <button
                      key={j}
                      onClick={() => onEdit({ kind: "cell", i, j })}
                      className={`relative flex aspect-[4/3] min-h-14 items-center justify-center gap-1.5 rounded-xl border text-base font-semibold tabular-nums transition active:scale-95 ${
                        isNash ? "border-nash bg-nash-soft ring-2 ring-nash" : "border-line bg-surface-2"
                      } ${dimmed && !isNash ? "opacity-50" : ""}`}
                      aria-label={`${game.rows[i]} và ${game.cols[j]}: ${game.players[0]} được ${a}, ${game.players[1]} được ${b}${isNash ? ", cân bằng Nash" : ""}`}
                    >
                      <span
                        className={`text-p1 ${showBestResponses && rowBest[i][j] ? "underline decoration-2 underline-offset-4" : ""}`}
                      >
                        {formatNumber(a)}
                      </span>
                      <span className="text-muted">,</span>
                      <span
                        className={`text-p2 ${showBestResponses && colBest[i][j] ? "underline decoration-2 underline-offset-4" : ""}`}
                      >
                        {formatNumber(b)}
                      </span>
                      {isNash && (
                        <span className="absolute -right-1 -top-1.5 rounded-full bg-nash px-1.5 text-[10px] font-bold text-black">
                          ★
                        </span>
                      )}
                    </button>
                  );
                })}
              </Row>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={onAddRow}
              disabled={game.rows.length >= MAX_ACTIONS}
              className="flex-1 rounded-lg border border-dashed border-line py-2 text-xs text-p1 disabled:opacity-40"
            >
              + Lựa chọn cho {game.players[0]}
            </button>
            <button
              onClick={onAddCol}
              disabled={game.cols.length >= MAX_ACTIONS}
              className="flex-1 rounded-lg border border-dashed border-line py-2 text-xs text-p2 disabled:opacity-40"
            >
              + Lựa chọn cho {game.players[1]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
