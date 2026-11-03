import { describe, expect, it } from "vitest";
import { fragility, sequentialOutcome } from "./sensitivity";

// Tù nhân: (Giữ, Giảm) giá
const PD = { A: [[3, 0], [5, 1]], B: [[3, 5], [0, 1]] };
// Gà: Né / Đi thẳng
const CHICKEN = { A: [[0, -1], [1, -10]], B: [[0, 1], [-1, -10]] };

describe("Độ bền kết luận", () => {
  it("song đề tù nhân: chỉ cần đổi điểm cùng giảm giá một chút là kết luận đổi", () => {
    const f = fragility(PD);
    // (Giảm, Giảm) = 1 so với (Giữ, Giảm) = 0: lệch nhau đúng 1 điểm, nên đổi 1 điểm ở một trong hai ô là đủ đổi kết luận
    expect(Math.abs(f[0].delta)).toBe(1);
    expect(f).toContainEqual({ i: 1, j: 1, player: 0, delta: -1 });
    expect(f).toContainEqual({ i: 0, j: 1, player: 0, delta: 1 });
  });

  it("thay đổi lớn hơn mức thử thì không tính là nhạy cảm", () => {
    const strong = { A: [[10, 0], [20, 15]], B: [[10, 20], [0, 15]] };
    expect(fragility(strong, [1, 2, 3])).toEqual([]);
  });
});

describe("Đi lần lượt từ bảng", () => {
  it("con gà: ai đi trước người đó chiếm thế", () => {
    expect(sequentialOutcome(CHICKEN, 0).cell).toEqual([1, 0]);
    expect(sequentialOutcome(CHICKEN, 1).cell).toEqual([0, 1]);
  });

  it("tù nhân: đi lần lượt vẫn cùng giảm giá", () => {
    expect(sequentialOutcome(PD, 0).cell).toEqual([1, 1]);
  });
});
