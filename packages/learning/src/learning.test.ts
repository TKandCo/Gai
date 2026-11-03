import { describe, expect, it } from "vitest";
import { allNodes, backwardInduction } from "@gai/gt-core";
import {
  ALL_LESSONS,
  LEVELS,
  addDays,
  checkAnswer,
  emptyProgress,
  isLessonUnlocked,
  isPass,
  nashAnswer,
  treeAnswer,
  nextLesson,
  parseAnswer,
  pickPractice,
  recordAnswer,
  recordLessonResult,
  recordLevelSkip,
} from "./index";

describe("Nội dung bài học hợp lệ", () => {
  it("mã bài và mã câu hỏi không trùng nhau", () => {
    const lessonIds = ALL_LESSONS.map((l) => l.id);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
    const exIds = ALL_LESSONS.flatMap((l) => l.quiz.map((q) => q.id));
    expect(new Set(exIds).size).toBe(exIds.length);
  });

  for (const lesson of ALL_LESSONS) {
    describe(lesson.title, () => {
      it("có nội dung và đủ 5 câu hỏi", () => {
        expect(lesson.cards.length).toBeGreaterThanOrEqual(3);
        expect(lesson.quiz).toHaveLength(5);
      });

      it("có ít nhất một thẻ dành cho mọi người (không chỉ cho người lớn)", () => {
        expect(lesson.cards.some((c) => c.kind !== "real")).toBe(true);
      });

      for (const q of lesson.quiz) {
        it(`câu ${q.id} có đáp án hợp lệ`, () => {
          if (q.kind === "choice") {
            expect(q.answer).toBeGreaterThanOrEqual(0);
            expect(q.answer).toBeLessThan(q.options.length);
            expect(new Set(q.options).size).toBe(q.options.length);
          }
          if (q.kind === "nash") expect(nashAnswer(q.game).length).toBeGreaterThan(0);
          if (q.kind === "tree") {
            // Đáp án phải duy nhất: không có nhánh nào bằng điểm nhau
            expect(backwardInduction(q.tree.root).hasTie).toBe(false);
            expect(treeAnswer(q.tree)).toBeTruthy();
          }
          const tree = q.tree;
          if (tree) {
            const ids = allNodes(tree.root).map((n) => n.id);
            expect(new Set(ids).size).toBe(ids.length);
          }
          if (q.game) {
            expect(q.game.payoffs).toHaveLength(q.game.rows.length);
            q.game.payoffs.forEach((r) => expect(r).toHaveLength(q.game!.cols.length));
          }
        });
      }
    });
  }
});

describe("Thẻ cây trò chơi", () => {
  it("cây được giải sẵn trong bài không có nhánh bằng điểm, mã nút không trùng", () => {
    for (const l of ALL_LESSONS)
      for (const c of l.cards)
        if (c.kind === "tree") {
          const ids = allNodes(c.tree.root).map((n) => n.id);
          expect(new Set(ids).size, l.id).toBe(ids.length);
          if (c.solve) expect(backwardInduction(c.tree.root).hasTie, l.id).toBe(false);
        }
  });
});

describe("Chấm câu trả lời", () => {
  it("câu cây trò chơi: chạm đúng lá", () => {
    const q = ALL_LESSONS.flatMap((l) => l.quiz).find((x) => x.id === "2-nn-2")!;
    expect(checkAnswer(q, { kind: "tree", leafId: "l1" })).toBe(true);
    expect(checkAnswer(q, { kind: "tree", leafId: "l4" })).toBe(false);
  });

  it("đọc nhiều cách viết số", () => {
    expect(parseAnswer("1/3")).toBeCloseTo(1 / 3);
    expect(parseAnswer("0,25")).toBe(0.25);
    expect(parseAnswer("25%")).toBe(0.25);
    expect(parseAnswer(" 70 ")).toBe(70);
    expect(parseAnswer("abc")).toBeNull();
    expect(parseAnswer("1/0")).toBeNull();
  });

  it("chấp nhận xác suất viết dạng phân số, thập phân hoặc phần trăm", () => {
    const q = ALL_LESSONS.flatMap((l) => l.quiz).find((x) => x.id === "0a-vh-1")!;
    for (const raw of ["1/4", "0,25", "0.25", "25%", "25"]) expect(checkAnswer(q, { kind: "number", raw })).toBe(true);
    expect(checkAnswer(q, { kind: "number", raw: "1/2" })).toBe(false);
  });

  it("câu cân bằng Nash phải chọn đủ và đúng các ô", () => {
    const q = ALL_LESSONS.flatMap((l) => l.quiz).find((x) => x.id === "1-nash-2")!;
    expect(checkAnswer(q, { kind: "nash", cells: [[0, 0], [1, 1]] })).toBe(true);
    expect(checkAnswer(q, { kind: "nash", cells: [[0, 0]] })).toBe(false);
    expect(checkAnswer(q, { kind: "nash", cells: [[0, 0], [1, 1], [0, 1]] })).toBe(false);
  });
});

describe("Mở khóa và tiến độ", () => {
  const first = LEVELS[0].lessons[0];
  const second = LEVELS[0].lessons[1];
  const level1First = LEVELS[1].lessons[0];

  it("cần ≥ 80% để đạt", () => {
    expect(isPass(4, 5)).toBe(true);
    expect(isPass(3, 5)).toBe(false);
    expect(isPass(0, 0)).toBe(false);
  });

  it("chỉ bài đầu tiên mở lúc mới bắt đầu", () => {
    const p = emptyProgress();
    expect(isLessonUnlocked(LEVELS, first.id, p)).toBe(true);
    expect(isLessonUnlocked(LEVELS, second.id, p)).toBe(false);
    expect(isLessonUnlocked(LEVELS, level1First.id, p)).toBe(false);
    expect(nextLesson(LEVELS, p)?.id).toBe(first.id);
  });

  it("đạt bài trước thì mở bài sau; trượt thì chưa mở", () => {
    let p = recordLessonResult(emptyProgress(), first.id, 3, 5, "2026-11-03");
    expect(isLessonUnlocked(LEVELS, second.id, p)).toBe(false);
    p = recordLessonResult(p, first.id, 5, 5, "2026-11-03");
    expect(isLessonUnlocked(LEVELS, second.id, p)).toBe(true);
    expect(p.lessons[first.id]).toMatchObject({ best: 5, attempts: 2, passed: true });
  });

  it("đã đạt rồi thì làm lại điểm thấp vẫn giữ trạng thái đạt", () => {
    let p = recordLessonResult(emptyProgress(), first.id, 5, 5);
    p = recordLessonResult(p, first.id, 1, 5);
    expect(p.lessons[first.id].passed).toBe(true);
    expect(p.lessons[first.id].best).toBe(5);
  });

  it("cấp đã từng học vẫn mở dù có cấp mới chèn vào trước", () => {
    const later = LEVELS[2];
    const p = recordLessonResult(emptyProgress(), later.lessons[0].id, 5, 5);
    expect(isLessonUnlocked(LEVELS, later.lessons[0].id, p)).toBe(true);
    expect(isLessonUnlocked(LEVELS, later.lessons[1].id, p)).toBe(true);
    expect(isLessonUnlocked(LEVELS, later.lessons[2].id, p)).toBe(false);
  });

  it("vượt cấp mở toàn bộ cấp đó và cấp tiếp theo", () => {
    const p = recordLevelSkip(emptyProgress(), LEVELS[0].id);
    expect(isLessonUnlocked(LEVELS, LEVELS[0].lessons[4].id, p)).toBe(true);
    expect(isLessonUnlocked(LEVELS, level1First.id, p)).toBe(true);
    expect(nextLesson(LEVELS, p)?.id).toBe(level1First.id);
  });

  it("chuỗi ngày học liên tiếp", () => {
    let p = recordLessonResult(emptyProgress(), first.id, 5, 5, "2026-11-01");
    p = recordLessonResult(p, first.id, 5, 5, "2026-11-02");
    p = recordLessonResult(p, first.id, 5, 5, "2026-11-02");
    expect(p.streak.count).toBe(2);
    p = recordLessonResult(p, first.id, 5, 5, "2026-11-05");
    expect(p.streak.count).toBe(1);
  });
});

describe("Ôn tập", () => {
  it("đúng thì giãn lịch ôn, sai thì ôn lại ngày mai", () => {
    let p = recordAnswer(emptyProgress(), "x", true, "2026-11-03");
    expect(p.review.x).toEqual({ box: 1, due: "2026-11-04" });
    p = recordAnswer(p, "x", true, "2026-11-04");
    expect(p.review.x).toEqual({ box: 2, due: "2026-11-06" });
    p = recordAnswer(p, "x", false, "2026-11-06");
    expect(p.review.x).toEqual({ box: 1, due: "2026-11-07" });
  });

  it("cộng ngày qua cuối tháng", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
  });

  it("chỉ lấy câu từ bài đã học, câu đến hạn đứng trước", () => {
    const first = LEVELS[0].lessons[0];
    let p = recordLessonResult(emptyProgress(), first.id, 5, 5, "2026-11-01");
    p = recordAnswer(p, first.quiz[3].id, false, "2026-11-01");
    const qs = pickPractice(LEVELS, p, 8, "2026-11-03");
    expect(qs.length).toBe(5);
    expect(qs[0].id).toBe(first.quiz[3].id);
    expect(qs.every((q) => first.quiz.includes(q))).toBe(true);
    expect(pickPractice(LEVELS, emptyProgress())).toEqual([]);
  });
});
