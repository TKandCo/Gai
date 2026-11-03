"use client";

import { useEffect, useRef, useState } from "react";
import { checkAnswer, type Exercise, type Response } from "@gai/learning";
import { MiniMatrix } from "./MiniMatrix";
import { TreeView } from "./TreeView";

const CHEERS = ["Giỏi quá! 🎉", "Chính xác! ⭐", "Tuyệt vời! 🙌", "Đúng rồi! 💪"];
const COMFORT = ["Chưa đúng, không sao cả!", "Chưa đúng rồi!", "Sai là cách học nhanh nhất!"];

/** Một câu đã trả lời, dùng cho phần Giải đáp cuối bài. */
export type AnswerRecord = { q: Exercise; r: Response; ok: boolean };

type Props = {
  questions: Exercise[];
  /** Gọi mỗi khi trả lời một câu */
  onAnswer?: (ex: Exercise, correct: boolean) => void;
  /** Gọi khi làm xong câu cuối, kèm toàn bộ câu trả lời */
  onFinish: (score: number, total: number, answers: AnswerRecord[]) => void;
};

/**
 * Chạy một loạt câu hỏi. Mỗi câu chỉ báo đúng/chưa đúng, KHÔNG lộ đáp án.
 * Lời giải chi tiết chỉ mở khi làm xong toàn bộ (phần Giải đáp).
 */
export function QuizRunner({ questions, onAnswer, onFinish }: Props) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const q = questions[idx];
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Trả lời xong thì tự cuộn tới nút đi tiếp (trên điện thoại hay bị khuất)
  useEffect(() => {
    if (result !== null) feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [result]);

  const submit = (r: Response) => {
    const ok = checkAnswer(q, r);
    setResult(ok);
    setAnswers((a) => [...a, { q, r, ok }]);
    onAnswer?.(q, ok);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      onFinish(answers.filter((a) => a.ok).length, questions.length, answers);
      return;
    }
    setIdx(idx + 1);
    setResult(null);
  };

  const locked = result !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${((idx + (locked ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted tabular-nums">
          {idx + 1}/{questions.length}
        </span>
      </div>

      <div key={q.id} className="animate-pop space-y-4">
        <h2 className="text-lg font-semibold leading-snug">{q.prompt}</h2>
        {q.kind === "choice" && <ChoiceQ q={q} locked={locked} onSubmit={submit} />}
        {q.kind === "number" && <NumberQ q={q} locked={locked} onSubmit={submit} />}
        {q.kind === "nash" && <NashQ q={q} locked={locked} onSubmit={submit} />}
        {q.kind === "tree" && <TreeQ q={q} locked={locked} onSubmit={submit} />}
      </div>

      {locked && (
        <div
          ref={feedbackRef}
          className={`animate-pop mb-4 scroll-mb-24 rounded-2xl p-4 ${result ? "bg-good-soft" : "bg-bad-soft"}`}
          role="status"
        >
          <p className={`text-lg font-bold ${result ? "text-good" : "text-bad"}`}>
            {result ? CHEERS[idx % CHEERS.length] : COMFORT[idx % COMFORT.length]}
          </p>
          <p className="mt-1 text-sm text-muted">📖 Lời giải chi tiết sẽ mở ở phần Giải đáp khi bạn làm xong tất cả các câu.</p>
          <button onClick={next} className="mt-4 h-12 w-full rounded-2xl bg-accent font-bold text-accent-ink">
            {idx + 1 >= questions.length ? "Xem kết quả và giải đáp" : "Câu tiếp theo →"}
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
      {q.tree && <TreeView tree={q.tree} />}
      <div className="space-y-2">
        {q.options.map((o, i) => {
          let cls = "border-line bg-surface";
          // Chỉ tô màu lựa chọn của bạn; đáp án đúng để dành cho phần Giải đáp
          if (locked && i === picked) cls = i === q.answer ? "border-good bg-good-soft" : "border-bad bg-bad-soft";
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
      {q.tree && <TreeView tree={q.tree} />}
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
      <MiniMatrix game={q.game} selected={cells} onCellClick={locked ? undefined : toggle} />
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

function TreeQ({
  q,
  locked,
  onSubmit,
}: {
  q: Extract<Exercise, { kind: "tree" }>;
  locked: boolean;
  onSubmit: (r: Response) => void;
}) {
  const [leaf, setLeaf] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <TreeView tree={q.tree} selectedLeaf={leaf} onLeafClick={locked ? undefined : setLeaf} />
      <p className="text-center text-xs text-muted">Gợi ý: bắt đầu từ người chọn cuối cùng, nghĩ ngược lên trên.</p>
      {!locked && (
        <button
          disabled={!leaf}
          onClick={() => leaf && onSubmit({ kind: "tree", leafId: leaf })}
          className="h-12 w-full rounded-2xl bg-accent font-bold text-accent-ink disabled:opacity-40"
        >
          Kiểm tra
        </button>
      )}
    </div>
  );
}
