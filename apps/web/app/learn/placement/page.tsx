"use client";

import Link from "next/link";
import { useState } from "react";
import { LEVELS, nextLesson, placementQuestions, placementResult, recordLevelSkip, type Exercise } from "@gai/learning";
import { useProfiles } from "@/lib/profiles";
import { QuizRunner, type AnswerRecord } from "@/components/learn/QuizRunner";
import { Review } from "@/components/learn/Review";
import { Mascot } from "@/components/Mascot";

/** Bài xếp lớp: 12 câu từ dễ đến khó, tự mở các cấp bạn đã biết. */
export default function PlacementPage() {
  const { updateProgress, progress } = useProfiles();
  const [questions, setQuestions] = useState<Exercise[] | null>(null);
  const [done, setDone] = useState<{ skipped: string[]; answers: AnswerRecord[] } | null>(null);

  const finish = (answers: AnswerRecord[]) => {
    const skipped = placementResult(
      LEVELS,
      answers.map((a) => ({ id: a.q.id, ok: a.ok })),
    );
    updateProgress((p) => skipped.reduce((acc, id) => recordLevelSkip(acc, id), p));
    setDone({ skipped, answers });
  };

  const start = skippedStart(done?.skipped ?? [], progress);

  return (
    <main className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/learn" className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-muted" aria-label="Thoát">
          ✕
        </Link>
        <span className="font-semibold">🧭 Bài xếp lớp</span>
      </div>

      {!questions && (
        <div className="space-y-5 pt-4">
          <Mascot>
            Làm 12 câu ngắn, từ dễ đến khó. Gai sẽ tìm chỗ bắt đầu phù hợp nhất cho bạn: phần nào bạn đã biết thì được mở sẵn. Không biết
            câu nào cứ đoán, không sao cả!
          </Mascot>
          <button
            onClick={() => setQuestions(placementQuestions(LEVELS))}
            className="h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-ink"
          >
            Bắt đầu
          </button>
          <Link href="/learn" className="flex h-12 items-center justify-center rounded-2xl border-2 border-line font-semibold">
            Thôi, mình học từ đầu
          </Link>
        </div>
      )}

      {questions && !done && <QuizRunner questions={questions} onFinish={(_s, _t, answers) => finish(answers)} />}

      {done && (
        <div className="animate-pop space-y-6 pt-4 text-center">
          <div className="text-7xl">🧭</div>
          <Mascot>
            {done.skipped.length === 0
              ? "Mình sẽ bắt đầu từ những bài đầu tiên nhé. Đi chắc từng bước là cách nhanh nhất!"
              : `Giỏi quá! Bạn đã vượt qua: ${done.skipped
                  .map((id) => LEVELS.find((l) => l.id === id)!.title)
                  .join(", ")}. Các bài đó đã được mở sẵn.`}{" "}
            Xem Giải đáp bên dưới nhé 👇
          </Mascot>
          <Review answers={done.answers} />
          <Link
            href={start ? `/learn/${start.id}` : "/learn"}
            className="flex h-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-ink"
          >
            {start ? `Bắt đầu: ${start.emoji} ${start.title}` : "Về lộ trình học"}
          </Link>
        </div>
      )}
    </main>
  );
}

function skippedStart(skipped: string[], p: Parameters<typeof nextLesson>[1]) {
  const next = skipped.reduce((acc, id) => recordLevelSkip(acc, id), p);
  return nextLesson(LEVELS, next);
}
