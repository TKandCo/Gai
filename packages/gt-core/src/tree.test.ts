import { describe, expect, it } from "vitest";
import { allNodes, backwardInduction, tDecide, tLeaf } from "./tree";

// Người chơi 0 = quán mới, 1 = quán cũ
const entry = tDecide("moi", 0, [
  ["Mở quán", tDecide("cu", 1, [["Giảm giá mạnh", tLeaf("danh", -2, 2)], ["Chung sống", tLeaf("song", 3, 5)]])],
  ["Không mở", tLeaf("khong", 0, 10)],
]);

describe("Suy luận ngược", () => {
  it("gia nhập thị trường: lời dọa giảm giá không đáng tin", () => {
    const r = backwardInduction(entry);
    expect(r.payoffs).toEqual([3, 5]);
    expect(r.leafId).toBe("song");
    expect(r.path).toEqual(["moi", "cu", "song"]);
    expect(r.choice).toEqual({ cu: 1, moi: 0 });
    // Bước đầu tiên là nút cuối cây
    expect(r.steps.map((s) => s.nodeId)).toEqual(["cu", "moi"]);
    expect(r.hasTie).toBe(false);
  });

  it("chia bánh: người chia lấy phần lớn, người nhận vẫn nhận", () => {
    const t = tDecide("an", 0, [
      ["Chia đều", tDecide("b1", 1, [["Nhận", tLeaf("a", 5, 5)], ["Từ chối", tLeaf("b", 0, 0)]])],
      ["Lấy phần lớn", tDecide("b2", 1, [["Nhận", tLeaf("c", 8, 2)], ["Từ chối", tLeaf("d", 0, 0)]])],
    ]);
    expect(backwardInduction(t).leafId).toBe("c");
  });

  it("cam kết trước làm lời dọa thành đáng tin", () => {
    const t = tDecide("cu0", 1, [
      [
        "Cam kết",
        tDecide("m1", 0, [
          ["Mở", tDecide("c1", 1, [["Giảm giá", tLeaf("x1", -2, 4)], ["Chung sống", tLeaf("x2", 3, 3)]])],
          ["Không mở", tLeaf("x3", 0, 8)],
        ]),
      ],
      [
        "Không cam kết",
        tDecide("m2", 0, [
          ["Mở", tDecide("c2", 1, [["Giảm giá", tLeaf("y1", -2, 2)], ["Chung sống", tLeaf("y2", 3, 5)]])],
          ["Không mở", tLeaf("y3", 0, 10)],
        ]),
      ],
    ]);
    const r = backwardInduction(t);
    expect(r.leafId).toBe("x3");
    expect(r.payoffs).toEqual([0, 8]);
    // Nút ngoài đường đi vẫn có lựa chọn (chiến lược đầy đủ)
    expect(r.choice.c2).toBe(1);
  });

  it("phát hiện trường hợp bằng nhau", () => {
    const t = tDecide("r", 0, [
      ["Trái", tLeaf("l", 1, 0)],
      ["Phải", tLeaf("p", 1, 5)],
    ]);
    const r = backwardInduction(t);
    expect(r.hasTie).toBe(true);
    expect(r.leafId).toBe("l");
  });

  it("cây chỉ có một lá", () => {
    const r = backwardInduction(tLeaf("x", 2, 3));
    expect(r.payoffs).toEqual([2, 3]);
    expect(r.path).toEqual(["x"]);
    expect(r.steps).toEqual([]);
  });

  it("liệt kê mọi nút", () => {
    expect(allNodes(entry).map((n) => n.id)).toEqual(["moi", "cu", "danh", "song", "khong"]);
  });
});
