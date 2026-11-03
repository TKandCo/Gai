"use client";

import Link from "next/link";
import { useState } from "react";
import { LEVELS, findLevel, isLevelUnlocked, isPass, nextLesson, pickLevelTest, recordLevelSkip, type Exercise } from "@gai/learning";
import { useProfiles } from "@/lib/profiles";
import { QuizRunner, type AnswerRecord } from "@/components/learn/QuizRunner";
import { Review } from "@/components/learn/Review";
import { ResultScreen } from "@/components/learn/ResultScreen";
import { Mascot } from "@/components/Mascot";

export function LevelTest({ levelId }: { levelId: string }) {
  const level = findLevel(levelId)!;
  const { progress, updateProgress, ready } = useProfiles();
  const [questions, setQuestions] = useState<Exercise[] | null>(null);
  const [done, setDone] = useState<{ score: number; total: number; answers: AnswerRecord[] } | null>(null);
  const unlocked = !ready || isLevelUnlocked(LEVELS, level.id, progress);

  const start = () => {
    setDone(null);
    setQuestions(pickLevelTest(level));
  };

  return (
    <main className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/learn" className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-muted" aria-label="Thoát">
          ✕
        </Link>
        <span className="font-semibold">
          🚀 Vượt cấp: {level.emoji} {level.title}
        </span>
      </div>

      {!unlocked && <Mascot>Cấp này chưa mở. Hãy hoàn thành cấp trước đã nhé!</Mascot>}

      {unlocked && !questions && (
        <div className="space-y-5 pt-4">
          <Mascot>
            Bạn đã biết phần &quot;{level.title}&quot; rồi? Làm 10 câu, đúng từ 8 câu trở lên là mở hết các bài trong cấp này và qua cấp
            tiếp theo.
          </Mascot>
          <button onClick={start} className="h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-ink">
            Bắt đầu kiểm tra
          </button>
          <Link href="/learn" className="flex h-12 items-center justify-center rounded-2xl border-2 border-line font-semibold">
            Thôi, mình học từ đầu
          </Link>
        </div>
      )}

      {unlocked && questions && !done && (
        <QuizRunner
          key={questions.map((q) => q.id).join()}
          questions={questions}
          onFinish={(score, total, answers) => {
            if (isPass(score, total)) updateProgress((p) => recordLevelSkip(p, level.id));
            setDone({ score, total, answers });
          }}
        />
      )}

      {done && (
        <ResultScreen
          score={done.score}
          total={done.total}
          passText={`Tuyệt! Bạn đã vượt qua cấp "${level.title}".`}
          failText="Chưa đủ để vượt cấp. Học từng bài sẽ chắc hơn đấy!"
          primary={(() => {
            const n = nextLesson(LEVELS, recordLevelSkip(progress, level.id));
            return n ? { href: `/learn/${n.id}`, label: `Học tiếp: ${n.emoji} ${n.title}` } : { href: "/learn", label: "Về lộ trình học" };
          })()}
          onRetry={start}
          review={<Review answers={done.answers} />}
        />
      )}
    </main>
  );
}
