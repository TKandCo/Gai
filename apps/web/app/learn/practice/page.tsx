"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LEVELS, markPracticed, pickPractice, recordAnswer, type Exercise } from "@gai/learning";
import { useProfiles } from "@/lib/profiles";
import { QuizRunner, type AnswerRecord } from "@/components/learn/QuizRunner";
import { Review } from "@/components/learn/Review";
import { Mascot } from "@/components/Mascot";

export default function PracticePage() {
  const { progress, updateProgress, ready } = useProfiles();
  const [questions, setQuestions] = useState<Exercise[] | null>(null);
  const [done, setDone] = useState<{ score: number; total: number; answers: AnswerRecord[] } | null>(null);

  // Chọn câu một lần khi vào trang, không đổi giữa chừng
  useEffect(() => {
    if (ready && questions === null) setQuestions(pickPractice(LEVELS, progress));
  }, [ready, progress, questions]);

  return (
    <main className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/learn" className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-muted" aria-label="Thoát">
          ✕
        </Link>
        <span className="font-semibold">🔁 Luyện tập hôm nay</span>
      </div>

      {questions && questions.length === 0 && (
        <div className="space-y-4 pt-6">
          <Mascot>Bạn cần học xong ít nhất 1 bài thì mới có câu để ôn nhé!</Mascot>
          <Link href="/learn" className="flex h-12 items-center justify-center rounded-2xl bg-accent font-bold text-accent-ink">
            Đi học bài đầu tiên
          </Link>
        </div>
      )}

      {questions && questions.length > 0 && !done && (
        <QuizRunner
          questions={questions}
          onAnswer={(q, ok) => updateProgress((p) => recordAnswer(p, q.id, ok))}
          onFinish={(score, total, answers) => {
            updateProgress((p) => markPracticed(p));
            setDone({ score, total, answers });
          }}
        />
      )}

      {done && (
        <div className="animate-pop space-y-6 pt-6 text-center">
          <div className="text-7xl">🔥</div>
          <p className="text-3xl font-bold tabular-nums">
            {done.score}/{done.total}
          </p>
          <Mascot>
            {progress.streak.count > 1
              ? `Bạn đã học ${progress.streak.count} ngày liên tiếp! Giữ chuỗi này nhé.`
              : "Hoàn thành luyện tập hôm nay! Ngày mai quay lại để giữ chuỗi nhé."}{" "}
            Câu làm sai sẽ được ôn lại sớm hơn.
          </Mascot>
          <Review answers={done.answers} />
          <Link href="/learn" className="flex h-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-ink">
            Về lộ trình học
          </Link>
        </div>
      )}
    </main>
  );
}
