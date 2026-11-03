import { isLevelComplete, shuffle, type Progress } from "./progress";
import type { Exercise, Level } from "./types";

/** Số cấp đầu tiên được kiểm tra trong bài xếp lớp, và số câu mỗi cấp. */
export const PLACEMENT_LEVELS = 4;
export const PLACEMENT_PER_LEVEL = 3;

/** Câu hỏi bài xếp lớp: lấy ngẫu nhiên vài câu từ mỗi cấp đầu, theo thứ tự cấp từ dễ đến khó. */
export function placementQuestions(levels: Level[], rand = Math.random): Exercise[] {
  return levels
    .slice(0, PLACEMENT_LEVELS)
    .flatMap((lv) => shuffle(lv.lessons.flatMap((l) => l.quiz), rand).slice(0, PLACEMENT_PER_LEVEL));
}

/**
 * Các cấp được vượt qua: đi lần lượt từ cấp đầu, cấp nào đúng ≥ 2/3 số câu thì vượt,
 * gặp cấp chưa đạt thì dừng (bắt đầu học từ cấp đó).
 */
export function placementResult(levels: Level[], answers: { id: string; ok: boolean }[]): string[] {
  const skipped: string[] = [];
  for (const lv of levels.slice(0, PLACEMENT_LEVELS)) {
    const ids = new Set(lv.lessons.flatMap((l) => l.quiz.map((q) => q.id)));
    const mine = answers.filter((a) => ids.has(a.id));
    if (mine.length === 0) break;
    const right = mine.filter((a) => a.ok).length;
    if (right / mine.length < 2 / 3 - 1e-9) break;
    skipped.push(lv.id);
  }
  return skipped;
}

export type Badge = { id: string; emoji: string; title: string; how: string; earned: boolean };

/** Huy hiệu: tạo động lực, nhất là cho trẻ em. Tính hoàn toàn từ tiến độ, không cần lưu riêng. */
export function badges(levels: Level[], p: Progress, extra: { predictions: number; resolved: number }): Badge[] {
  const passedLessons = Object.values(p.lessons).filter((l) => l.passed).length;
  const perfect = Object.values(p.lessons).some((l) => l.best === l.total && l.total > 0);
  const longest = Math.max(p.streak.best ?? 0, p.streak.count);
  const list: Badge[] = [
    { id: "first-lesson", emoji: "🌱", title: "Bước đầu tiên", how: "Qua bài học đầu tiên", earned: passedLessons >= 1 },
    { id: "perfect", emoji: "💯", title: "Điểm tuyệt đối", how: "Đúng hết 5/5 câu một bài", earned: perfect },
    { id: "streak-3", emoji: "🔥", title: "3 ngày liền", how: "Học 3 ngày liên tiếp", earned: longest >= 3 },
    { id: "streak-7", emoji: "🌟", title: "Một tuần chăm chỉ", how: "Học 7 ngày liên tiếp", earned: longest >= 7 },
    { id: "predict", emoji: "🔮", title: "Nhà tiên tri nhỏ", how: "Ghi dự đoán đầu tiên", earned: extra.predictions >= 1 },
    { id: "resolve-5", emoji: "🎯", title: "Biết mình đúng sai", how: "Đối chiếu 5 dự đoán", earned: extra.resolved >= 5 },
    ...levels.map((lv) => ({
      id: `level-${lv.id}`,
      emoji: lv.emoji,
      title: lv.title,
      how: `Hoàn thành cấp ${lv.title}`,
      earned: isLevelComplete(lv, p),
    })),
    {
      id: "master",
      emoji: "🏆",
      title: "Bậc thầy chiến lược",
      how: "Hoàn thành toàn bộ lộ trình",
      earned: levels.every((lv) => isLevelComplete(lv, p)),
    },
  ];
  return list;
}
