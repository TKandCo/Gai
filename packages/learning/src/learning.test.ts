import { describe, expect, it } from "vitest";
import { allNodes, backwardInduction, findStrategy } from "@gai/gt-core";
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
  placementQuestions,
  placementResult,
  PLACEMENT_LEVELS,
  PLACEMENT_PER_LEVEL,
  badges,
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

describe("Thẻ chơi lặp lại", () => {
  it("đối thủ được nhắc tới trong bài đều tồn tại", () => {
    for (const l of ALL_LESSONS)
      for (const c of l.cards) if (c.kind === "repeated") expect(findStrategy(c.opponent), l.id).toBeDefined();
  });
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

describe("Bài xếp lớp", () => {
  it("lấy 3 câu mỗi cấp cho 4 cấp đầu, theo thứ tự cấp", () => {
    const qs = placementQuestions(LEVELS);
    expect(qs).toHaveLength(PLACEMENT_LEVELS * PLACEMENT_PER_LEVEL);
    const levelOf = (id: string) => ALL_LESSONS.find((l) => l.quiz.some((q) => q.id === id))!.levelId;
    expect(qs.slice(0, 3).every((q) => levelOf(q.id) === LEVELS[0].id)).toBe(true);
    expect(qs.slice(9).every((q) => levelOf(q.id) === LEVELS[3].id)).toBe(true);
  });

  it("vượt lần lượt các cấp đạt ≥ 2/3, dừng ở cấp đầu tiên chưa đạt", () => {
    const qs = placementQuestions(LEVELS);
    const answers = qs.map((q, i) => ({ id: q.id, ok: i < 3 || (i >= 3 && i < 5) }));
    // Cấp 1: 3/3, cấp 2: 2/3, cấp 3: 0/3 → vượt 2 cấp đầu
    expect(placementResult(LEVELS, answers)).toEqual([LEVELS[0].id, LEVELS[1].id]);
    expect(placementResult(LEVELS, qs.map((q) => ({ id: q.id, ok: false })))).toEqual([]);
    // Cấp sau đạt nhưng cấp trước chưa đạt thì vẫn dừng
    const gap = qs.map((q, i) => ({ id: q.id, ok: i >= 3 }));
    expect(placementResult(LEVELS, gap)).toEqual([]);
  });
});

describe("Huy hiệu", () => {
  it("chưa học gì thì chưa có huy hiệu", () => {
    expect(badges(LEVELS, emptyProgress(), { predictions: 0, resolved: 0 }).filter((b) => b.earned)).toEqual([]);
  });

  it("qua bài đầu với 5/5 và ghi dự đoán thì có 3 huy hiệu", () => {
    const p = recordLessonResult(emptyProgress(), LEVELS[0].lessons[0].id, 5, 5);
    const got = badges(LEVELS, p, { predictions: 1, resolved: 0 }).filter((b) => b.earned).map((b) => b.id);
    expect(got).toEqual(["first-lesson", "perfect", "predict"]);
  });

  it("vượt cấp thì có huy hiệu cấp đó", () => {
    const p = recordLevelSkip(emptyProgress(), LEVELS[0].id);
    expect(badges(LEVELS, p, { predictions: 0, resolved: 0 }).find((b) => b.id === `level-${LEVELS[0].id}`)!.earned).toBe(true);
  });
});
