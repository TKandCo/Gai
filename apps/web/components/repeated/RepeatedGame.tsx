"use client";

import { useRef, useState } from "react";
import { findStrategy, pdPayoff, type Move } from "@gai/gt-core";

const LABEL: Record<Move, string> = { C: "🤝 Chia", D: "😼 Giành" };

/**
 * Chơi Chia kẹo nhiều vòng với máy. Máy dùng một chiến lược cố định;
 * cuối trận mới tiết lộ, để người chơi tự đoán.
 */
export function RepeatedGame({
  opponentId,
  rounds = 10,
  hidden = true,
  onFinish,
}: {
  opponentId: string;
  rounds?: number;
  hidden?: boolean;
  onFinish?: (me: number, bot: number) => void;
}) {
  const bot = findStrategy(opponentId)!;
  const [mine, setMine] = useState<Move[]>([]);
  const [theirs, setTheirs] = useState<Move[]>([]);
  const rand = useRef(Math.random);
  const done = mine.length >= rounds;

  const scores = mine.reduce(
    (acc, m, i) => {
      const [a, b] = pdPayoff(m, theirs[i]);
      return [acc[0] + a, acc[1] + b];
    },
    [0, 0],
  );

  const play = (m: Move) => {
    if (done) return;
    const b = bot.next(theirs, mine, rand.current);
    const nextMine = [...mine, m];
    const nextTheirs = [...theirs, b];
    setMine(nextMine);
    setTheirs(nextTheirs);
    if (nextMine.length >= rounds) {
      const total = nextMine.reduce(
        (acc, mm, i) => {
          const [x, y] = pdPayoff(mm, nextTheirs[i]);
          return [acc[0] + x, acc[1] + y];
        },
        [0, 0],
      );
      onFinish?.(total[0], total[1]);
    }
  };

  const reset = () => {
    setMine([]);
    setTheirs([]);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">
          Vòng {Math.min(mine.length + 1, rounds)}/{rounds}
        </span>
        <span className="tabular-nums">
          <span className="font-bold text-p1">Bạn {scores[0]}</span>
          <span className="text-muted"> · </span>
          <span className="font-bold text-p2">
            {hidden && !done ? "Máy 🤖" : `${bot.emoji} Máy`} {scores[1]}
          </span>
        </span>
      </div>

      <p className="rounded-xl bg-surface-2 p-2 text-xs text-muted">
        Cùng chia: mỗi bên 3 · Bạn chia, máy giành: 0 và 5 · Cùng giành: mỗi bên 1
      </p>

      {mine.length > 0 && (
        <ol className="max-h-48 space-y-1 overflow-y-auto text-sm">
          {mine.map((m, i) => {
            const [a, b] = pdPayoff(m, theirs[i]);
            return (
              <li key={i} className="flex items-center gap-2 rounded-lg bg-surface-2 px-2 py-1">
                <span className="w-6 text-xs text-muted">{i + 1}</span>
                <span className="flex-1 text-p1">{LABEL[m]}</span>
                <span className="flex-1 text-p2">{LABEL[theirs[i]]}</span>
                <span className="w-12 text-right text-xs tabular-nums">
                  +{a} / +{b}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {!done ? (
        <div className="grid grid-cols-2 gap-3">
          {(["C", "D"] as Move[]).map((m) => (
            <button
              key={m}
              onClick={() => play(m)}
              className={`h-16 rounded-2xl text-lg font-bold transition active:scale-95 ${m === "C" ? "bg-good-soft text-good" : "bg-bad-soft text-bad"}`}
            >
              {LABEL[m]}
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-pop space-y-3">
          <div className="rounded-xl bg-accent-soft p-3 text-sm">
            <p className="font-bold">
              Máy dùng chiến lược: {bot.emoji} {bot.name}
            </p>
            <p className="mt-1">{bot.description}</p>
            <p className="mt-2">
              Bạn được <b className="text-p1">{scores[0]}</b>, máy được <b className="text-p2">{scores[1]}</b>.{" "}
              {scores[0] >= 25 ? "Hai bên hợp tác rất tốt!" : scores[0] > scores[1] ? "Bạn thắng máy!" : "Thử cách khác xem sao?"}
            </p>
          </div>
          <button onClick={reset} className="h-12 w-full rounded-2xl border-2 border-line font-semibold">
            Chơi lại
          </button>
        </div>
      )}
    </div>
  );
}
