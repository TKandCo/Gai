import type { MiniGame } from "@gai/learning";

type Props = {
  game: MiniGame;
  highlight?: [number, number][];
  selected?: [number, number][];
  onCellClick?: (i: number, j: number) => void;
  /** Sau khi chấm: tô xanh ô đúng, đỏ ô chọn sai */
  reveal?: { correct: [number, number][] };
};

const has = (list: [number, number][] | undefined, i: number, j: number) => Boolean(list?.some(([a, b]) => a === i && b === j));

/** Bảng lợi ích nhỏ, dùng trong bài học và câu hỏi. */
export function MiniMatrix({ game, highlight, selected, onCellClick, reveal }: Props) {
  const n = game.cols.length;
  return (
    <div className="rounded-2xl border border-line bg-surface p-3">
      <div className="mb-1 flex justify-end">
        <span className="rounded-full bg-p2-soft px-2.5 py-0.5 text-xs font-semibold text-p2">{game.players[1]} chọn cột</span>
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `minmax(64px, 0.9fr) repeat(${n}, minmax(0, 1fr))` }}>
        <span className="self-end text-xs font-semibold text-p1">{game.players[0]} chọn hàng</span>
        {game.cols.map((c, j) => (
          <span key={j} className="truncate pb-1 text-center text-xs font-medium text-p2">
            {c}
          </span>
        ))}
        {game.rows.map((r, i) => (
          <Row key={i}>
            <span className="flex items-center truncate text-xs font-medium text-p1">{r}</span>
            {game.cols.map((_, j) => {
              const [a, b] = game.payoffs[i][j];
              const isHi = has(highlight, i, j);
              const isSel = has(selected, i, j);
              const isRight = reveal && has(reveal.correct, i, j);
              const isWrong = reveal && isSel && !isRight;
              let cls = "border-line bg-surface-2";
              if (isHi) cls = "border-nash bg-nash-soft ring-2 ring-nash";
              if (isSel) cls = "border-accent bg-accent-soft ring-2 ring-accent";
              if (isRight) cls = "border-good bg-good-soft ring-2 ring-good";
              if (isWrong) cls = "border-bad bg-bad-soft ring-2 ring-bad";
              const Tag = onCellClick ? "button" : "div";
              return (
                <Tag
                  key={j}
                  {...(onCellClick ? { onClick: () => onCellClick(i, j), type: "button" as const, "aria-pressed": isSel } : {})}
                  aria-label={`${r} và ${game.cols[j]}: ${game.players[0]} ${a}, ${game.players[1]} ${b}`}
                  className={`relative flex min-h-14 items-center justify-center gap-1 rounded-xl border text-lg font-semibold tabular-nums transition ${cls} ${
                    onCellClick ? "active:scale-95" : ""
                  }`}
                >
                  <span className="text-p1">{a}</span>
                  <span className="text-muted">,</span>
                  <span className="text-p2">{b}</span>
                  {(isHi || isRight) && (
                    <span className="absolute -right-1 -top-1.5 rounded-full bg-nash px-1 text-[10px] font-bold text-black">★</span>
                  )}
                </Tag>
              );
            })}
          </Row>
        ))}
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
