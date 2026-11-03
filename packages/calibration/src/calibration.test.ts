import { describe, expect, it } from "vitest";
import { brier, brierLevel, calibrationBuckets, overconfidence } from "./index";

describe("Brier score", () => {
  it("chưa có dự đoán thì chưa có điểm", () => {
    expect(brier([])).toBeNull();
  });

  it("đoán đúng hoàn toàn được 0, sai hoàn toàn được 1", () => {
    expect(brier([{ p: 1, outcome: true }, { p: 0, outcome: false }])).toBe(0);
    expect(brier([{ p: 1, outcome: false }])).toBe(1);
  });

  it("luôn đoán 50% được 0,25", () => {
    expect(brier([{ p: 0.5, outcome: true }, { p: 0.5, outcome: false }])).toBe(0.25);
  });

  it("ví dụ tính tay: 0,7 xảy ra và 0,8 không xảy ra", () => {
    // (0,3² + 0,8²) / 2 = (0,09 + 0,64) / 2 = 0,365
    expect(brier([{ p: 0.7, outcome: true }, { p: 0.8, outcome: false }])).toBeCloseTo(0.365);
  });

  it("xếp loại", () => {
    expect(brierLevel(0.05)).toBe("excellent");
    expect(brierLevel(0.15)).toBe("good");
    expect(brierLevel(0.25)).toBe("coinflip");
    expect(brierLevel(0.4)).toBe("poor");
  });
});

describe("Hiệu chỉnh", () => {
  it("gom đúng khoảng và tính tỷ lệ xảy ra", () => {
    const b = calibrationBuckets([
      { p: 0.7, outcome: true },
      { p: 0.75, outcome: false },
      { p: 0.1, outcome: false },
      { p: 1, outcome: true },
    ]);
    expect(b.map((x) => x.count)).toEqual([1, 2, 1]);
    expect(b[1].hitRate).toBe(0.5);
    expect(b[2].from).toBe(0.8);
  });

  it("phát hiện quá tự tin", () => {
    const sure = Array.from({ length: 10 }, (_, i) => ({ p: 0.9, outcome: i < 5 }));
    expect(overconfidence(sure)).toBeCloseTo(0.4);
    const honest = Array.from({ length: 10 }, (_, i) => ({ p: 0.7, outcome: i < 7 }));
    expect(overconfidence(honest)).toBeCloseTo(0);
  });
});
