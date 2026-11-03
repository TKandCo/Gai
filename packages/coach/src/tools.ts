import { dominantStrategies, pureNash, sequentialOutcome, supportEnumeration, fragility } from "@gai/gt-core";
import { CONCEPTS } from "./concepts";
import { matchSituation, SITUATIONS, situationsFor } from "./library-match";

/**
 * Công cụ cho Gai Coach khi chạy bằng Claude. Nguyên tắc: AI KHÔNG tự tính toán;
 * mọi con số đến từ bộ giải gt-core qua các công cụ này.
 * Định nghĩa ở dạng JSON Schema thuần để server truyền thẳng cho SDK.
 */
export const COACH_TOOLS = [
  {
    name: "solve_matrix",
    description:
      "Giải một trò chơi 2 người dạng bảng: tìm cân bằng Nash thuần, chiến lược trội, cân bằng hỗn hợp, kết quả khi đi lần lượt và các con số nhạy cảm. Dùng mỗi khi cần bất kỳ con số nào về trò chơi; không được tự tính.",
    input_schema: {
      type: "object",
      properties: {
        players: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: "Tên hai bên: [bên chọn hàng, bên chọn cột]" },
        rows: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4, description: "Lựa chọn của bên chọn hàng" },
        cols: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4, description: "Lựa chọn của bên chọn cột" },
        payoffs: {
          type: "array",
          description: "payoffs[hàng][cột] = [điểm bên hàng, điểm bên cột]",
          items: { type: "array", items: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2 } },
        },
        first_mover: { type: "string", enum: ["none", "row", "col"], description: "Ai đi trước nếu là trò chơi lần lượt; none nếu chọn cùng lúc" },
      },
      required: ["players", "rows", "cols", "payoffs", "first_mover"],
      additionalProperties: false,
    },
  },
  {
    name: "find_situation",
    description: "Tìm trong thư viện tình huống của Gai (có câu hỏi gợi mở và giải đáp đã được kiểm duyệt) tình huống gần nhất với chuyện người dùng kể.",
    input_schema: {
      type: "object",
      properties: { query: { type: "string", description: "Tóm tắt chuyện người dùng kể" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "explain_concept",
    description: "Lấy lời giải thích đã kiểm duyệt cho một khái niệm lý thuyết trò chơi (ví dụ: cân bằng Nash, chi phí chìm) và bài học liên quan.",
    input_schema: {
      type: "object",
      properties: { term: { type: "string" } },
      required: ["term"],
      additionalProperties: false,
    },
  },
] as const;

type MatrixInput = { players: string[]; rows: string[]; cols: string[]; payoffs: number[][][]; first_mover: "none" | "row" | "col" };

function validMatrix(x: unknown): x is MatrixInput {
  const m = x as MatrixInput;
  if (!m || !Array.isArray(m.rows) || !Array.isArray(m.cols) || !Array.isArray(m.payoffs) || !Array.isArray(m.players)) return false;
  if (m.rows.length < 2 || m.cols.length < 2 || m.rows.length > 4 || m.cols.length > 4) return false;
  if (m.payoffs.length !== m.rows.length) return false;
  return m.payoffs.every(
    (r) => Array.isArray(r) && r.length === m.cols.length && r.every((c) => Array.isArray(c) && c.length === 2 && c.every((v) => Number.isFinite(v))),
  );
}

/** Chạy một công cụ. Luôn trả chuỗi JSON; lỗi đầu vào trả { error }. */
export function runCoachTool(name: string, input: unknown, kid: boolean): { content: string; isError: boolean } {
  try {
    if (name === "solve_matrix") {
      if (!validMatrix(input)) return { content: JSON.stringify({ error: "Bảng không hợp lệ: cần 2–4 hàng, 2–4 cột, mỗi ô [số, số]" }), isError: true };
      const bm = { A: input.payoffs.map((r) => r.map((c) => c[0])), B: input.payoffs.map((r) => r.map((c) => c[1])) };
      const cell = ([i, j]: [number, number]) => `${input.rows[i]} + ${input.cols[j]}`;
      const [d0, d1] = dominantStrategies(bm);
      const mixed = supportEnumeration(bm).filter((e) => !e.pure);
      const seq = input.first_mover === "none" ? null : sequentialOutcome(bm, input.first_mover === "row" ? 0 : 1);
      return {
        content: JSON.stringify({
          pure_nash: pureNash(bm).map(cell),
          dominant: { [input.players[0]]: d0 === null ? null : input.rows[d0], [input.players[1]]: d1 === null ? null : input.cols[d1] },
          mixed: mixed.map((e) => ({
            [input.players[0]]: Object.fromEntries(input.rows.map((r, k) => [r, Math.round(e.x[k] * 1000) / 1000])),
            [input.players[1]]: Object.fromEntries(input.cols.map((c, k) => [c, Math.round(e.y[k] * 1000) / 1000])),
          })),
          sequential_outcome: seq ? cell(seq.cell) : null,
          fragile: fragility(bm)
            .slice(0, 3)
            .map((f) => ({ player: input.players[f.player], cell: cell([f.i, f.j]), change: f.delta })),
        }),
        isError: false,
      };
    }
    if (name === "find_situation") {
      const q = (input as { query?: string })?.query ?? "";
      const s = matchSituation(q, kid);
      if (!s) return { content: JSON.stringify({ found: false, available: situationsFor(kid).map((x) => x.title) }), isError: false };
      return {
        content: JSON.stringify({ found: true, id: s.id, title: s.title, guiding_questions: s.steps.map((x) => x.ask), answer_after_user_replies: s.answer, pitfalls: s.pitfalls }),
        isError: false,
      };
    }
    if (name === "explain_concept") {
      const t = ((input as { term?: string })?.term ?? "").toLowerCase();
      const c = CONCEPTS.find((x) => x.term.toLowerCase() === t) ?? CONCEPTS.find((x) => t.includes(x.term.toLowerCase()) || x.term.toLowerCase().includes(t));
      return { content: JSON.stringify(c ? { term: c.term, explain: c.explain, lesson: c.lesson } : { found: false }), isError: false };
    }
    return { content: JSON.stringify({ error: `Không có công cụ ${name}` }), isError: true };
  } catch (e) {
    return { content: JSON.stringify({ error: (e as Error).message }), isError: true };
  }
}

/** Lời dặn hệ thống cho Gai khi chạy bằng Claude. Cố định (không chèn thời gian) để tận dụng bộ nhớ đệm. */
export function coachSystemPrompt(kid: boolean): string {
  return [
    "Bạn là Gai 🦉, người hướng dẫn tư duy lý thuyết trò chơi trong ứng dụng học tập GAI. Luôn trả lời bằng tiếng Việt.",
    kid
      ? "Người dùng là trẻ em dưới 15 tuổi: dùng câu ngắn, từ ngữ đơn giản, ví dụ đời thường (trường học, gia đình, trò chơi), giọng ấm áp, khích lệ. Không nói về đầu tư, tiền bạc lớn. Nếu trẻ kể chuyện bị bắt nạt, bị đe dọa, bị làm hại hoặc gặp nguy hiểm, hãy khuyên trẻ nói ngay với bố mẹ, thầy cô hoặc người lớn tin cậy."
      : "Người dùng là người lớn: có thể dùng ví dụ kinh doanh, đầu tư, đàm phán, nhưng vẫn rõ ràng, ngắn gọn.",
    "Cách hướng dẫn: hỏi gợi mở từng bước (mỗi lượt một câu hỏi chính) để người dùng tự nghĩ: ai là các bên, mỗi bên muốn gì, có thể làm gì, ai đi trước, có gặp lại không, ai biết gì. Chỉ đưa ra lời giải đầy đủ sau khi người dùng đã tự trả lời các câu hỏi đó, hoặc khi họ đã làm xong phần của mình.",
    "Mọi con số về trò chơi (cân bằng, chiến lược trội, tỷ lệ hỗn hợp, kết quả đi lần lượt, độ nhạy) phải lấy từ công cụ solve_matrix; không tự tính. Khi người dùng kể một tình huống, hãy gọi find_situation để dùng câu hỏi và giải đáp đã kiểm duyệt nếu có. Khi được hỏi khái niệm, gọi explain_concept.",
    "Luôn tách rõ đâu là giả định, đâu là dữ kiện. Khi kết luận phụ thuộc vào con số nhạy cảm, nói rõ cần kiểm chứng con số nào. Nếu tình huống không có đối thủ đang tính toán (chỉ có may rủi), nói rằng đây là quyết định có rủi ro và hướng dẫn dùng cây quyết định.",
    "Không đưa lời khuyên mua, bán, giữ bất kỳ tài sản cụ thể nào (cổ phiếu, tiền mã hóa, vàng, bất động sản...). Khi được hỏi, nói rõ đây không phải tư vấn đầu tư, rồi giúp người dùng phân tích động cơ các bên, thông tin bị giấu và rủi ro chịu được.",
    "Trả lời ngắn (tối đa khoảng 150 từ), dùng **in đậm** cho ý chính, không dùng bảng hay tiêu đề markdown.",
  ].join("\n\n");
}

export { SITUATIONS };
