import { describe, expect, it } from "vitest";
import { runCoachTool, runSelfTest, walkAllSituations, isInvestmentAdviceRequest, coachSystemPrompt } from "./index";

describe("Gai Coach selftest", () => {
  for (const r of runSelfTest()) {
    it(r.title, () => {
      expect(r.detail).toBe(r.id === "library" ? r.detail : "Đạt");
      expect(r.ok).toBe(true);
    });
  }
  for (const r of walkAllSituations()) {
    it(r.title, () => expect(r.ok, r.detail).toBe(true));
  }
});

describe("Chặn tư vấn đầu tư", () => {
  const yes = ["Có nên mua vàng không?", "nên bán hay giữ cổ phiếu", "all in bitcoin được không", "mua HPG được không", "nên đầu tư vào bất động sản không"];
  const no = ["Cân bằng Nash là gì", "em với anh tranh đồ chơi", "đối thủ giảm giá mạnh", "mua xe cũ cần lưu ý gì", "đàm phán tăng lương"];
  for (const s of yes) it(`chặn: ${s}`, () => expect(isInvestmentAdviceRequest(s)).toBe(true));
  for (const s of no) it(`không chặn nhầm: ${s}`, () => expect(isInvestmentAdviceRequest(s)).toBe(false));
});

describe("Công cụ cho Claude", () => {
  it("solve_matrix giải song đề tù nhân", () => {
    const r = runCoachTool(
      "solve_matrix",
      { players: ["A", "B"], rows: ["Giữ", "Giảm"], cols: ["Giữ", "Giảm"], payoffs: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]], first_mover: "none" },
      false,
    );
    expect(r.isError).toBe(false);
    const j = JSON.parse(r.content);
    expect(j.pure_nash).toEqual(["Giảm + Giảm"]);
    expect(j.dominant).toEqual({ A: "Giảm", B: "Giảm" });
  });

  it("solve_matrix từ chối bảng sai kích thước", () => {
    const r = runCoachTool("solve_matrix", { players: ["A", "B"], rows: ["x", "y"], cols: ["x", "y"], payoffs: [[[1, 1]]], first_mover: "none" }, false);
    expect(r.isError).toBe(true);
  });

  it("find_situation tìm đúng và tôn trọng hồ sơ trẻ em", () => {
    expect(JSON.parse(runCoachTool("find_situation", { query: "đàm phán tăng lương" }, false).content).id).toBe("dam-phan-luong");
    expect(JSON.parse(runCoachTool("find_situation", { query: "đàm phán tăng lương" }, true).content).found).toBe(false);
  });

  it("explain_concept", () => {
    expect(JSON.parse(runCoachTool("explain_concept", { term: "Cân bằng Nash" }, true).content).lesson).toBe("1-can-bang-nash");
  });

  it("lời dặn hệ thống khác nhau cho trẻ em và người lớn, có quy tắc không tư vấn đầu tư", () => {
    expect(coachSystemPrompt(true)).toContain("trẻ em");
    expect(coachSystemPrompt(false)).toContain("Không đưa lời khuyên mua");
  });
});
