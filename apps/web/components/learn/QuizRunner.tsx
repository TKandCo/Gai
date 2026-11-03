"use client";

import { useState } from "react";
import { checkAnswer, nashAnswer, type Exercise, type Response } from "@gai/learning";
import { MiniMatrix } from "./MiniMatrix";
import { RichText } from "../RichText";

const CHEERS = ["Giỏi quá! 🎉", "Chính xác! ⭐", "Tuyệt vời! 🙌", "Đúng rồi! 💪"];
const COMFORT = ["Chưa đúng, không sao cả!", "Chưa đúng rồi, xem giải thích nhé.", "Sai là cách học nhanh nhất!"];

type Props = {
  questions: Exercise[];
  /** Gọi mỗi khi trả lời một câu */
  onAnswer?: (ex: Exercise, correct: boolean) => void;
  /** Gọi khi làm xong câu cuối */
  onFinish: (score: number, total: number) => void;
};

/** Chạy một loạt câu hỏi: trả lời → chấm ngay → giải thích → câu tiếp. */
export function QuizRunner({ questions, onAnswer, onFinish }: Props) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const q = questions[idx];

  const submit = (r: Response) => {
    const ok = checkAnswer(q, r);
    setResult(ok);
    if (ok) setScore((s) => s + 1);
    onAnswer?.(q, ok);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      onFinish(score, questions.length);
      return;
    }
    setIdx(idx + 1);
    setResult(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${((idx + (result !== null ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted tabular-nums">
          {idx + 1}/{questions.length}
        </span>
      </div>

      <div key={q.id} className="animate-pop space-y-4">
        <h2 className="text-lg font-semibold leading-snug">{q.prompt}</h2>
        {q.kind === "choice" && <ChoiceQ q={q} locked={result !== null} onSubmit={submit} />}
        {q.kind === "number" && <NumberQ q={q} locked={result !== null} onSubmit={submit} />}
        {q.kind === "nash" && <NashQ q={q} locked={result !== null} onSubmit={submit} />}
      </div>

      {result !== null && (
        <div className={`animate-pop rounded-2xl p-4 ${result ? "bg-good-soft" : "bg-bad-soft"}`} role="status">
          <p className={`mb-1 text-lg font-bold ${result ? "text-good" : "text-bad"}`}>
            {result ? CHEERS[idx % CHEERS.length] : COMFORT[idx % COMFORT.length]}
          </p>
          <RichText text={q.explain} className="text-[0.95rem]" />
          <button onClick={next} className="mt-4 h-12 w-full rounded-2xl bg-accent font-bold text-accent-ink">
            {idx + 1 >= questions.length ? "Xem kết quả" : "Câu tiếp theo →"}
          </button>
        </div>
      )}
    </div>
  );
}

function ChoiceQ({
  q,
  locked,
  onSubmit,
}: {
  q: Extract<Exercise, { kind: "choice" }>;
  locked: boolean;
  onSubmit: (r: Response) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {q.game && <MiniMatrix game={q.game} />}
      <div className="space-y-2">
        {q.options.map((o, i) => {
          let cls = "border-line bg-surface";
          if (locked && i === q.answer) cls = "border-good bg-good-soft";
          else if (locked && i === picked) cls = "border-bad bg-bad-soft";
          return (
            <button
              key={i}
              disabled={locked}
              onClick={() => {
                setPicked(i);
                onSubmit({ kind: "choice", index: i });
              }}
              className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition active:scale-[0.99] ${cls}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NumberQ({
  q,
  locked,
  onSubmit,
}: {
  q: Extract<Exercise, { kind: "number" }>;
  locked: boolean;
  onSubmit: (r: Response) => void;
}) {
  const [raw, setRaw] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (raw.trim()) onSubmit({ kind: "number", raw });
      }}
      className="space-y-3"
    >
      {q.game && <MiniMatrix game={q.game} />}
      <input
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        disabled={locked}
        inputMode="text"
        autoComplete="off"
        placeholder={q.hint ?? "Nhập số"}
        className="h-14 w-full rounded-2xl border-2 border-line bg-surface px-4 text-center text-2xl font-semibold tabular-nums outline-none focus:border-accent disabled:opacity-70"
        aria-label="Câu trả lời"
      />
      {q.answer > 0 && q.answer < 1 && <p className="text-center text-xs text-muted">Có thể viết 1/4, 0,25 hoặc 25%</p>}
      {!locked && (
        <button disabled={!raw.trim()} className="h-12 w-full rounded-2xl bg-accent font-bold text-accent-ink disabled:opacity-40">
          Kiểm tra
        </button>
      )}
    </form>
  );
}

function NashQ({
  q,
  locked,
  onSubmit,
}: {
  q: Extract<Exercise, { kind: "nash" }>;
  locked: boolean;
  onSubmit: (r: Response) => void;
}) {
  const [cells, setCells] = useState<[number, number][]>([]);
  const toggle = (i: number, j: number) => {
    if (locked) return;
    setCells((c) => (c.some(([a, b]) => a === i && b === j) ? c.filter(([a, b]) => !(a === i && b === j)) : [...c, [i, j]]));
  };
  return (
    <div className="space-y-3">
      <MiniMatrix
        game={q.game}
        selected={cells}
        onCellClick={toggle}
        reveal={locked ? { correct: nashAnswer(q.game) } : undefined}
      />
      <p className="text-center text-xs text-muted">Chạm để chọn, chạm lần nữa để bỏ chọn. Có thể có nhiều ô.</p>
      {!locked && (
        <button
          disabled={cells.length === 0}
          onClick={() => onSubmit({ kind: "nash", cells })}
          className="h-12 w-full rounded-2xl bg-accent font-bold text-accent-ink disabled:opacity-40"
        >
          Kiểm tra
        </button>
      )}
    </div>
  );
}
