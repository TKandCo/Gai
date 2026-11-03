"use client";

import Link from "next/link";
import { LEVELS, isLessonUnlocked, isLevelComplete, isLevelUnlocked, nextLesson, pickPractice } from "@gai/learning";
import { useProfiles } from "@/lib/profiles";
import { PageHeader } from "@/components/PageHeader";
import { HelpButton } from "@/components/Help";

const HELP = [
  { icon: "🗺️", text: "Đây là lộ trình học. Học từ trên xuống dưới, mỗi bài chỉ 4–6 phút." },
  { icon: "🔒", text: "Bài có ổ khóa sẽ mở khi bạn làm đúng ít nhất 4/5 câu đố của bài trước." },
  { icon: "🔁", text: "\"Luyện tập hôm nay\" giúp ôn lại câu cũ, nhất là những câu từng làm sai." },
  { icon: "🚀", text: "Đã biết phần nào rồi? Bấm \"Kiểm tra vượt cấp\" để nhảy qua cả cấp đó." },
];

export function LearnHome() {
  const { progress, ready } = useProfiles();
  const next = ready ? nextLesson(LEVELS, progress) : null;
  const practiceCount = ready ? pickPractice(LEVELS, progress).length : 0;

  return (
    <main className="px-4">
      <PageHeader
        title="Lộ trình học"
        subtitle="Từng bước nhỏ, mỗi ngày một chút."
        right={<HelpButton id="learn" title="Cách học" steps={HELP} />}
      />

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Link
          href={next ? `/learn/${next.id}` : "/learn"}
          className="rounded-2xl bg-accent p-4 text-accent-ink transition active:scale-[0.98]"
        >
          <div className="text-2xl">{next?.emoji ?? "🎓"}</div>
          <div className="mt-2 text-sm opacity-90">{next ? "Học tiếp" : "Đã học hết"}</div>
          <div className="font-semibold leading-snug">{next?.title ?? "Bài mới sắp có!"}</div>
        </Link>
        <Link
          href="/learn/practice"
          aria-disabled={practiceCount === 0}
          className={`rounded-2xl border-2 border-line bg-surface p-4 transition active:scale-[0.98] ${
            practiceCount === 0 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div className="text-2xl">🔁</div>
          <div className="mt-2 text-sm text-muted">Luyện tập hôm nay</div>
          <div className="font-semibold leading-snug">{practiceCount > 0 ? `${practiceCount} câu ôn` : "Học 1 bài để mở"}</div>
        </Link>
      </div>

      <div className="space-y-8">
        {LEVELS.map((level) => {
          const unlocked = ready && isLevelUnlocked(LEVELS, level.id, progress);
          const complete = ready && isLevelComplete(level, progress);
          const done = level.lessons.filter((l) => progress.lessons[l.id]?.passed).length;
          return (
            <section key={level.id}>
              <div className="mb-3 flex items-start gap-3">
                <span className="text-3xl" aria-hidden>
                  {level.emoji}
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">
                    {level.title} {complete && <span className="text-good">✓</span>}
                  </h2>
                  <p className="text-sm text-muted">{level.description}</p>
                  <p className="mt-1 text-xs font-medium text-muted">
                    {complete && progress.levelsSkipped.includes(level.id) ? "Đã vượt cấp" : `${done}/${level.lessons.length} bài`}
                  </p>
                </div>
              </div>

              <ol className="space-y-2">
                {level.lessons.map((lesson, k) => {
                  const open = ready && isLessonUnlocked(LEVELS, lesson.id, progress);
                  const lp = progress.lessons[lesson.id];
                  const inner = (
                    <>
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${
                          lp?.passed ? "bg-good-soft" : open ? "bg-accent-soft" : "bg-surface-2"
                        }`}
                        aria-hidden
                      >
                        {open ? lesson.emoji : "🔒"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-muted">
                          Bài {k + 1} · {lesson.minutes} phút
                        </span>
                        <span className="block font-semibold leading-snug">{lesson.title}</span>
                      </span>
                      {lp?.passed && (
                        <span className="text-sm font-semibold text-good tabular-nums">
                          {lp.best}/{lp.total}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={lesson.id}>
                      {open ? (
                        <Link
                          href={`/learn/${lesson.id}`}
                          className={`flex items-center gap-3 rounded-2xl border p-3 transition active:scale-[0.99] ${
                            next?.id === lesson.id ? "border-accent bg-surface ring-2 ring-accent/30" : "border-line bg-surface"
                          }`}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 opacity-60" aria-disabled>
                          {inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>

              {!complete && (
                <Link
                  href={`/learn/test/${level.id}`}
                  className={`mt-3 flex h-11 items-center justify-center rounded-2xl border-2 border-dashed border-line text-sm font-medium text-muted ${
                    unlocked ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  🚀 Đã biết rồi? Kiểm tra vượt cấp
                </Link>
              )}
            </section>
          );
        })}

        <section className="rounded-2xl bg-surface-2 p-4 text-sm text-muted">
          <p className="font-semibold text-ink">Sắp có</p>
          <p className="mt-1">Cấp 4: Thông tin bị giấu (tín hiệu, đoán ý đối phương).</p>
        </section>
      </div>
    </main>
  );
}
