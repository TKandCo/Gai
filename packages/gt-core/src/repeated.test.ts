import { describe, expect, it } from "vitest";
import { cooperationThreshold, findStrategy, playMatch, seededRandom, STRATEGIES, tournament } from "./repeated";

const S = (id: string) => findStrategy(id)!;

describe("Trận đấu lặp lại", () => {
  it("Ăn miếng trả miếng gặp Luôn giành: thua vòng đầu rồi giành lại", () => {
    const r = playMatch(S("an-mieng-tra-mieng"), S("luon-gianh"), 10);
    expect(r.movesA.join("")).toBe("CDDDDDDDDD");
    expect(r.scoreA).toBe(9);
    expect(r.scoreB).toBe(14);
  });

  it("Luôn chia bị Luôn giành khai thác hoàn toàn", () => {
    const r = playMatch(S("luon-chia"), S("luon-gianh"), 10);
    expect([r.scoreA, r.scoreB]).toEqual([0, 50]);
  });

  it("hai chiến lược tử tế hợp tác suốt", () => {
    const r = playMatch(S("thu-dai"), S("an-mieng-tra-mieng"), 10);
    expect([r.scoreA, r.scoreB]).toEqual([30, 30]);
  });

  it("Bao dung bỏ qua một lần bị giành", () => {
    // Đối thủ giành đúng vòng 1 rồi hợp tác
    const once = { ...S("luon-chia"), id: "x", next: (m: string[]) => (m.length === 0 ? "D" : "C") } as never;
    const r = playMatch(S("bao-dung"), once, 5);
    expect(r.movesA.join("")).toBe("CCCCC");
  });

  it("Thắng giữ, thua đổi", () => {
    const r = playMatch(S("thang-giu-thua-doi"), S("luon-gianh"), 4);
    // C (bị giành, 0 điểm → đổi) D (1 điểm → đổi) C ...
    expect(r.movesA.join("")).toBe("CDCD");
  });

  it("nhiễu làm đổi nước đi, với hạt giống thì lặp lại được", () => {
    const a = playMatch(S("luon-chia"), S("luon-chia"), 50, seededRandom(7), 0.2);
    const b = playMatch(S("luon-chia"), S("luon-chia"), 50, seededRandom(7), 0.2);
    expect(a).toEqual(b);
    expect(a.movesA.includes("D")).toBe(true);
  });
});

describe("Giải đấu", () => {
  it("giải nhỏ kinh điển: Ăn miếng trả miếng và Thù dai đứng đầu, Luôn giành không thắng", () => {
    const rows = tournament([S("luon-chia"), S("luon-gianh"), S("an-mieng-tra-mieng"), S("thu-dai")], 10);
    const by = Object.fromEntries(rows.map((r) => [r.id, r.total]));
    expect(by).toEqual({ "luon-chia": 90, "luon-gianh": 88, "an-mieng-tra-mieng": 99, "thu-dai": 99 });
    expect(rows[0].total).toBe(99);
  });

  it("chạy được với đủ 7 chiến lược", () => {
    const rows = tournament(STRATEGIES, 20, seededRandom(1));
    expect(rows).toHaveLength(STRATEGIES.length);
    expect(rows[0].total).toBeGreaterThanOrEqual(rows[rows.length - 1].total);
  });

  it("ngưỡng hợp tác với điểm Chia kẹo là 0,5", () => {
    expect(cooperationThreshold()).toBe(0.5);
  });
});
