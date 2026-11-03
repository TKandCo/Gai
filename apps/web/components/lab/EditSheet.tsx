"use client";

import { useEffect, useState } from "react";
import { MIN_ACTIONS, type LabGame } from "@/lib/lab";
import type { EditTarget } from "./MatrixEditor";

type Props = {
  game: LabGame;
  target: EditTarget | null;
  onClose: () => void;
  onPayoff: (i: number, j: number, who: 0 | 1, value: number) => void;
  onRename: (target: "row" | "col" | "player", index: number, name: string) => void;
  onRemove: (target: "row" | "col", index: number) => void;
};

/** Bảng trượt từ dưới lên để sửa một ô payoff hoặc đổi tên. */
export function EditSheet({ game, target, onClose, onPayoff, onRename, onRemove }: Props) {
  if (!target) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Đóng" />
      <div className="pb-safe relative w-full max-w-md rounded-t-3xl border-t border-line bg-surface p-5 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
        {target.kind === "cell" ? (
          <CellEditor game={game} i={target.i} j={target.j} onPayoff={onPayoff} />
        ) : (
          <NameEditor key={JSON.stringify(target)} game={game} target={target} onRename={onRename} onRemove={onRemove} onClose={onClose} />
        )}
        <button onClick={onClose} className="mt-5 w-full rounded-xl bg-accent py-3 font-semibold text-accent-ink">
          Xong
        </button>
      </div>
    </div>
  );
}

function CellEditor({
  game,
  i,
  j,
  onPayoff,
}: {
  game: LabGame;
  i: number;
  j: number;
  onPayoff: Props["onPayoff"];
}) {
  const [a, b] = game.payoffs[i][j];
  return (
    <div>
      <p className="text-sm text-muted">Nếu</p>
      <p className="mb-4 text-base">
        <span className="font-semibold text-p1">{game.players[0]}</span> chọn{" "}
        <span className="font-semibold text-p1">{game.rows[i]}</span> và{" "}
        <span className="font-semibold text-p2">{game.players[1]}</span> chọn{" "}
        <span className="font-semibold text-p2">{game.cols[j]}</span>
      </p>
      <div className="space-y-3">
        <Stepper label={`${game.players[0]} được`} tone="p1" value={a} onChange={(v) => onPayoff(i, j, 0, v)} />
        <Stepper label={`${game.players[1]} được`} tone="p2" value={b} onChange={(v) => onPayoff(i, j, 1, v)} />
      </div>
      <p className="mt-3 text-xs text-muted">
        Số càng lớn càng tốt với bên đó. Chỉ cần đúng thứ tự hơn kém, không cần chính xác tuyệt đối.
      </p>
    </div>
  );
}

function Stepper({
  label,
  tone,
  value,
  onChange,
}: {
  label: string;
  tone: "p1" | "p2";
  value: number;
  onChange: (v: number) => void;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  const color = tone === "p1" ? "text-p1 bg-p1-soft" : "text-p2 bg-p2-soft";

  const commit = (raw: string) => {
    setText(raw);
    const v = Number(raw.replace(",", "."));
    if (raw.trim() !== "" && Number.isFinite(v)) onChange(v);
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`w-28 shrink-0 truncate text-sm font-medium ${tone === "p1" ? "text-p1" : "text-p2"}`}>{label}</span>
      <button
        onClick={() => onChange(value - 1)}
        className={`h-11 w-11 shrink-0 rounded-xl text-xl font-bold ${color}`}
        aria-label="Giảm 1"
      >
        −
      </button>
      <input
        value={text}
        onChange={(e) => commit(e.target.value)}
        inputMode="decimal"
        className="h-11 w-full min-w-0 rounded-xl border border-line bg-surface-2 text-center text-lg font-semibold tabular-nums outline-none focus:border-accent"
        aria-label={label}
      />
      <button
        onClick={() => onChange(value + 1)}
        className={`h-11 w-11 shrink-0 rounded-xl text-xl font-bold ${color}`}
        aria-label="Tăng 1"
      >
        +
      </button>
    </div>
  );
}

function NameEditor({
  game,
  target,
  onRename,
  onRemove,
  onClose,
}: {
  game: LabGame;
  target: Exclude<EditTarget, { kind: "cell" }>;
  onRename: Props["onRename"];
  onRemove: Props["onRemove"];
  onClose: () => void;
}) {
  const kind = target.kind;
  const index = kind === "row" ? target.i : kind === "col" ? target.j : target.p;
  const current = kind === "row" ? game.rows[index] : kind === "col" ? game.cols[index] : game.players[index];
  const owner = kind === "row" ? game.players[0] : kind === "col" ? game.players[1] : null;
  const count = kind === "row" ? game.rows.length : game.cols.length;
  const [name, setName] = useState(current);

  return (
    <div>
      <label className="mb-2 block text-sm text-muted">
        {kind === "player" ? "Tên bên chơi" : `Tên lựa chọn của ${owner}`}
      </label>
      <input
        autoFocus
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          onRename(kind, index, e.target.value);
        }}
        maxLength={24}
        className="h-12 w-full rounded-xl border border-line bg-surface-2 px-4 text-base outline-none focus:border-accent"
      />
      {kind !== "player" && (
        <button
          disabled={count <= MIN_ACTIONS}
          onClick={() => {
            onRemove(kind, index);
            onClose();
          }}
          className="mt-3 w-full rounded-xl border border-line py-2.5 text-sm text-bad disabled:opacity-40"
        >
          Xóa lựa chọn này {count <= MIN_ACTIONS ? "(cần tối thiểu 2)" : ""}
        </button>
      )}
    </div>
  );
}
