"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  LEVELS,
  findLesson,
  isLessonUnlocked,
  isPass,
  nextLesson,
  recordAnswer,
  recordLessonResult,
  type Card,
} from "@gai/learning";
import { useProfiles } from "@/lib/profiles";
import { RichText } from "@/components/RichText";
import { MiniMatrix } from "@/components/learn/MiniMatrix";
import { TreeView } from "@/components/learn/TreeView";
import { RepeatedGame } from "@/components/repeated/RepeatedGame";
import { QuizRunner, type AnswerRecord } from "@/components/learn/QuizRunner";
import { Review } from "@/components/learn/Review";
import { ResultScreen } from "@/components/learn/ResultScreen";
import { Mascot } from "@/components/Mascot";

type Stage = { kind: "cards"; index: number } | { kind: "quiz"; round: number } | { kind: "done"; score: number; total: number; answers: AnswerRecord[] };

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const lesson = findLesson(lessonId)!;
  const { progress, updateProgress, isKid, ready } = useProfiles();
  const [stage, setStage] = useState<Stage>({ kind: "cards", index: 0 });

  // Hồ sơ trẻ em: ẩn thẻ ứng dụng đầu tư/kinh doanh
  const cards = useMemo(() => lesson.cards.filter((c) => !(isKid && c.kind === "real")), [lesson, isKid]);
  const unlocked = !ready || isLessonUnlocked(LEVELS, lesson.id, progress);

  if (!unlocked) {
    return (
      <main className="space-y-6 px-4 pt-10">
        <Mascot>Bài này còn khóa 🔒. Hãy làm xong bài trước đã nhé!</Mascot>
        <Link href="/learn" className="flex h-12 items-center justify-center rounded-2xl bg-accent font-bold text-accent-ink">
          Về lộ trình học
        </Link>
      </main>
    );
  }

  const exit = (
    <Link href="/learn" className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-muted" aria-label="Thoát bài học">
      ✕
    </Link>
  );

  if (stage.kind === "cards") {
    const card = cards[stage.index];
    const last = stage.index === cards.length - 1;
    return (
      <main className="flex min-h-[calc(100dvh-6rem)] flex-col px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mb-4 flex items-center gap-2">
          {exit}
          <div className="flex flex-1 gap-1" aria-label={`Thẻ ${stage.index + 1} trên ${cards.length}`}>
            {cards.map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= stage.index ? "bg-accent" : "bg-surface-2"}`} />
            ))}
          </div>
        </div>

        {stage.index === 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted">
              {lesson.emoji} {lesson.minutes} phút
            </p>
            <h1 className="text-2xl font-bold leading-tight">{lesson.title}</h1>
          </div>
        )}

        <div key={stage.index} className="animate-pop flex-1">
          <CardView card={card} />
        </div>

        <div className="sticky bottom-24 mt-6 flex gap-3 bg-bg/90 py-2 backdrop-blur">
          {stage.index > 0 && (
            <button
              onClick={() => setStage({ kind: "cards", index: stage.index - 1 })}
              className="h-14 flex-1 rounded-2xl border-2 border-line font-semibold"
            >
              ← Lùi
            </button>
          )}
          <button
            onClick={() => setStage(last ? { kind: "quiz", round: 0 } : { kind: "cards", index: stage.index + 1 })}
            className="h-14 flex-[2] rounded-2xl bg-accent text-lg font-bold text-accent-ink"
          >
            {last ? "Làm câu đố 🧩" : "Tiếp →"}
          </button>
        </div>
      </main>
    );
  }

  if (stage.kind === "quiz") {
    return (
      <main className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mb-4 flex items-center gap-2">
          {exit}
          <span className="font-semibold">Câu đố: {lesson.title}</span>
        </div>
        <QuizRunner
          key={stage.round}
          questions={lesson.quiz}
          onAnswer={(q, ok) => updateProgress((p) => recordAnswer(p, q.id, ok))}
          onFinish={(score, total, answers) => {
            updateProgress((p) => recordLessonResult(p, lesson.id, score, total));
            setStage({ kind: "done", score, total, answers });
          }}
        />
      </main>
    );
  }

  const after = isPass(stage.score, stage.total) ? nextLesson(LEVELS, recordLessonResult(progress, lesson.id, stage.score, stage.total)) : null;
  return (
    <main className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <ResultScreen
        score={stage.score}
        total={stage.total}
        passText={after ? `Xuất sắc! Bài mới đã mở: ${after.title}.` : "Xuất sắc! Bạn đã học hết các bài hiện có."}
        failText="Gần được rồi! Đọc lại phần giải thích rồi thử lần nữa nhé."
        primary={after ? { href: `/learn/${after.id}`, label: `Học tiếp: ${after.emoji} ${after.title}` } : { href: "/learn", label: "Về lộ trình học" }}
        onRetry={() => setStage({ kind: "quiz", round: Date.now() })}
        review={<Review answers={stage.answers} takeaways={lesson.cards.flatMap((c) => (c.kind === "tip" ? [c.body] : []))} />}
      />
    </main>
  );
}

function CardView({ card }: { card: Card }) {
  switch (card.kind) {
    case "text":
      return (
        <div className="rounded-3xl border border-line bg-surface p-5">
          {card.title && <h2 className="mb-2 text-lg font-bold">{card.title}</h2>}
          <RichText text={card.body} className="text-[1.05rem]" />
        </div>
      );
    case "example":
      return (
        <div className="rounded-3xl border border-p1/30 bg-p1-soft p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-p1">Ví dụ</p>
          <h2 className="mb-2 text-lg font-bold">{card.title}</h2>
          <RichText text={card.body} className="text-[1.05rem]" />
        </div>
      );
    case "real":
      return (
        <div className="rounded-3xl border border-p2/30 bg-p2-soft p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-p2">Áp dụng thực tế</p>
          <h2 className="mb-2 text-lg font-bold">{card.title}</h2>
          <RichText text={card.body} className="text-[1.05rem]" />
        </div>
      );
    case "tip":
      return <Mascot size="lg">{<RichText text={card.body} />}</Mascot>;
    case "repeated":
      return (
        <div className="space-y-3">
          {card.title && <h2 className="text-lg font-bold">{card.title}</h2>}
          {card.caption && <p className="text-sm text-muted">{card.caption}</p>}
          <RepeatedGame opponentId={card.opponent} rounds={card.rounds} hidden={card.hidden} />
        </div>
      );
    case "tree":
      return (
        <div className="space-y-3">
          {card.title && <h2 className="text-lg font-bold">{card.title}</h2>}
          <TreeView tree={card.tree} solve={card.solve} />
          {card.caption && (
            <div className="rounded-2xl bg-surface-2 p-4">
              <RichText text={card.caption} />
            </div>
          )}
        </div>
      );
    case "matrix":
      return (
        <div className="space-y-3">
          {card.title && <h2 className="text-lg font-bold">{card.title}</h2>}
          <MiniMatrix game={card.game} highlight={card.highlight} />
          {card.caption && (
            <div className="rounded-2xl bg-surface-2 p-4">
              <RichText text={card.caption} />
            </div>
          )}
        </div>
      );
  }
}
