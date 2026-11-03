import type { Exercise, Level } from "./types";

/** Đạt ≥ 80% số câu mới mở bài tiếp theo. */
export const PASS_RATIO = 0.8;
/** Khoảng cách ôn lại (ngày) theo hộp ghi nhớ 1..5 */
export const REVIEW_INTERVALS = [1, 2, 4, 8, 16];

export type LessonProgress = { best: number; total: number; passed: boolean; attempts: number; lastAt: string };
export type ReviewCard = { box: number; due: string };
export type Progress = {
  lessons: Record<string, LessonProgress>;
  /** Các cấp đã vượt qua bằng bài kiểm tra vượt cấp */
  levelsSkipped: string[];
  review: Record<string, ReviewCard>;
  streak: { last: string | null; count: number };
};

export const emptyProgress = (): Progress => ({
  lessons: {},
  levelsSkipped: [],
  review: {},
  streak: { last: null, count: 0 },
});

export const isPass = (score: number, total: number) => total > 0 && score / total >= PASS_RATIO - 1e-9;

/** Ngày dạng YYYY-MM-DD theo giờ máy */
export function today(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return today(new Date(y, m - 1, d + days));
}

export function isLevelComplete(level: Level, p: Progress): boolean {
  return p.levelsSkipped.includes(level.id) || level.lessons.every((l) => p.lessons[l.id]?.passed);
}

/** Bài mở khi: là bài đầu tiên; hoặc bài trước trong cấp đã đạt; hoặc cấp trước đã xong (với bài đầu cấp); hoặc cấp đã được vượt. */
export function isLessonUnlocked(levels: Level[], lessonId: string, p: Progress): boolean {
  for (let li = 0; li < levels.length; li++) {
    const level = levels[li];
    const idx = level.lessons.findIndex((l) => l.id === lessonId);
    if (idx === -1) continue;
    if (p.levelsSkipped.includes(level.id)) return true;
    if (idx > 0) return Boolean(p.lessons[level.lessons[idx - 1].id]?.passed);
    return li === 0 || isLevelUnlocked(levels, level.id, p);
  }
  return false;
}

export function isLevelUnlocked(levels: Level[], levelId: string, p: Progress): boolean {
  const li = levels.findIndex((l) => l.id === levelId);
  if (li <= 0) return li === 0;
  return levels.slice(0, li).every((l) => isLevelComplete(l, p));
}

/** Bài nên học tiếp: bài mở đầu tiên chưa đạt. */
export function nextLesson(levels: Level[], p: Progress) {
  for (const level of levels)
    for (const lesson of level.lessons)
      if (!p.lessons[lesson.id]?.passed && !p.levelsSkipped.includes(level.id) && isLessonUnlocked(levels, lesson.id, p))
        return lesson;
  return null;
}

function bumpStreak(p: Progress, day: string): Progress["streak"] {
  if (p.streak.last === day) return p.streak;
  const continues = p.streak.last === addDays(day, -1);
  return { last: day, count: continues ? p.streak.count + 1 : 1 };
}

export function recordLessonResult(p: Progress, lessonId: string, score: number, total: number, day = today()): Progress {
  const prev = p.lessons[lessonId];
  const passed = isPass(score, total) || Boolean(prev?.passed);
  return {
    ...p,
    lessons: {
      ...p.lessons,
      [lessonId]: {
        best: Math.max(score, prev?.best ?? 0),
        total,
        passed,
        attempts: (prev?.attempts ?? 0) + 1,
        lastAt: day,
      },
    },
    streak: bumpStreak(p, day),
  };
}

export function recordLevelSkip(p: Progress, levelId: string, day = today()): Progress {
  if (p.levelsSkipped.includes(levelId)) return p;
  return { ...p, levelsSkipped: [...p.levelsSkipped, levelId], streak: bumpStreak(p, day) };
}

/** Ghi một câu trả lời vào lịch ôn tập (hộp ghi nhớ): đúng thì lên hộp, sai thì về hộp 1 và ôn ngay hôm sau. */
export function recordAnswer(p: Progress, exerciseId: string, correct: boolean, day = today()): Progress {
  const prev = p.review[exerciseId];
  const box = correct ? Math.min((prev?.box ?? 0) + 1, REVIEW_INTERVALS.length) : 1;
  const due = addDays(day, correct ? REVIEW_INTERVALS[box - 1] : 1);
  return { ...p, review: { ...p.review, [exerciseId]: { box, due } } };
}

export function markPracticed(p: Progress, day = today()): Progress {
  return { ...p, streak: bumpStreak(p, day) };
}

/** Chọn câu cho phiên luyện tập: ưu tiên câu đến hạn ôn, rồi câu ngẫu nhiên từ các bài đã học. */
export function pickPractice(levels: Level[], p: Progress, n = 8, day = today(), rand = Math.random): Exercise[] {
  const learned = levels.flatMap((lv) =>
    lv.lessons.filter((l) => p.lessons[l.id]?.passed || p.levelsSkipped.includes(lv.id)).flatMap((l) => l.quiz),
  );
  const due = learned
    .filter((e) => p.review[e.id] && p.review[e.id].due <= day)
    .sort((a, b) => p.review[a.id].box - p.review[b.id].box);
  const rest = shuffle(
    learned.filter((e) => !due.includes(e)),
    rand,
  );
  return [...due, ...rest].slice(0, n);
}

/** Câu hỏi cho bài kiểm tra vượt cấp: lấy ngẫu nhiên từ toàn bộ bài trong cấp. */
export function pickLevelTest(level: Level, n = 10, rand = Math.random): Exercise[] {
  return shuffle(
    level.lessons.flatMap((l) => l.quiz),
    rand,
  ).slice(0, n);
}

export function shuffle<T>(arr: T[], rand = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
