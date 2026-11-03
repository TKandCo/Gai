"use client";

import { useState } from "react";
import { STRATEGIES, tournament, type TournamentRow } from "@gai/gt-core";
import { RepeatedGame } from "./RepeatedGame";

const pickRandom = () => STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)].id;

/** Phòng lab chơi lặp lại: tự chơi với máy, và tổ chức giải đấu giữa các chiến lược. */
export function RepeatedLab() {
  const [opponent, setOpponent] = useState<string>(() => STRATEGIES[2].id);
  const [mystery, setMystery] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const [chosen, setChosen] = useState<string[]>(STRATEGIES.map((s) => s.id));
  const [rounds, setRounds] = useState(20);
  const [noise, setNoise] = useState(0);
  const [rows, setRows] = useState<TournamentRow[] | null>(null);

  const run = () => {
    const list = STRATEGIES.filter((s) => chosen.includes(s.id));
    if (list.length >= 2) setRows(tournament(list, rounds, Math.random, noise / 100));
  };
  const max = rows ? Math.max(...rows.map((r) => r.total), 1) : 1;

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-bold">🎮 Chơi với máy</h2>
        <p className="text-sm text-muted">Chơi Chia kẹo 10 vòng với cùng một đối thủ. Bạn sẽ hợp tác hay giành?</p>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <button
            onClick={() => {
              setMystery(true);
              setOpponent(pickRandom());
              setGameKey((k) => k + 1);
            }}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${mystery ? "border-accent bg-accent-soft font-semibold text-accent" : "border-line bg-surface"}`}
          >
            🤖 Máy bí ẩn
          </button>
          {STRATEGIES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setMystery(false);
                setOpponent(s.id);
                setGameKey((k) => k + 1);
              }}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
                !mystery && opponent === s.id ? "border-accent bg-accent-soft font-semibold text-accent" : "border-line bg-surface"
              }`}
            >
              {s.emoji} {s.name}
            </button>
          ))}
        </div>
        <RepeatedGame key={`${gameKey}-${opponent}`} opponentId={opponent} hidden={mystery} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">🏆 Giải đấu chiến lược</h2>
        <p className="text-sm text-muted">
          Mỗi chiến lược đấu với tất cả các chiến lược khác (và với bản sao của chính nó). Ai được tổng điểm cao nhất?
        </p>
        <div className="flex flex-wrap gap-2">
          {STRATEGIES.map((s) => {
            const on = chosen.includes(s.id);
            return (
              <button
                key={s.id}
                aria-pressed={on}
                onClick={() => setChosen((c) => (on ? c.filter((x) => x !== s.id) : [...c, s.id]))}
                className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-accent bg-accent-soft font-semibold" : "border-line bg-surface text-muted"}`}
              >
                {s.emoji} {s.name}
              </button>
            );
          })}
        </div>
        <label className="block text-sm">
          Số vòng mỗi trận: <b>{rounds}</b>
          <input type="range" min={5} max={100} step={5} value={rounds} onChange={(e) => setRounds(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
        </label>
        <label className="block text-sm">
          Khả năng hiểu lầm (lỡ tay): <b>{noise}%</b>
          <input type="range" min={0} max={20} step={1} value={noise} onChange={(e) => setNoise(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
        </label>
        <button
          onClick={run}
          disabled={chosen.length < 2}
          className="h-12 w-full rounded-2xl bg-accent font-bold text-accent-ink disabled:opacity-40"
        >
          Chạy giải đấu
        </button>

        {rows && (
          <ol className="animate-pop space-y-2">
            {rows.map((r, i) => {
              const s = STRATEGIES.find((x) => x.id === r.id)!;
              return (
                <li key={r.id} className="rounded-xl bg-surface p-2">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`} {s.emoji} <b>{s.name}</b>
                    </span>
                    <span className="tabular-nums">{r.total} điểm</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${(r.total / max) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {rows && (
          <p className="rounded-xl bg-surface-2 p-3 text-sm">
            💡 Thử tăng &quot;hiểu lầm&quot; lên 5–10% và chạy lại: chiến lược nào bị ảnh hưởng nhiều nhất? Thử bỏ bớt các chiến lược
            tử tế: Luôn giành có thắng không?
          </p>
        )}
      </section>
    </div>
  );
}
