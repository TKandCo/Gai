import { ALL_LESSONS } from "@gai/learning";
import { coachReply, initialState, startSituation, type CoachMessage, type CoachOptions, type CoachState } from "./engine";
import { SITUATIONS } from "./library";
import { CONCEPTS } from "./concepts";

/**
 * Bộ tự kiểm tra Gai Coach: giả lập các cuộc hội thoại và kiểm tra hành vi.
 * Chạy được trong app (trang Tự kiểm tra) và trong test tự động.
 */
export type Turn = { user: string; gai: CoachMessage[] };
export type SelfTestResult = { id: string; title: string; ok: boolean; detail: string; transcript: Turn[] };

type Scenario = {
  id: string;
  title: string;
  opts: CoachOptions;
  /** Bắt đầu bằng thẻ tình huống (nếu có) */
  start?: string;
  inputs: string[];
  check: (t: Turn[]) => string | null; // null = đạt, chuỗi = lý do trượt
};

/** Chạy một kịch bản hội thoại qua bộ máy. */
export function simulate(inputs: string[], opts: CoachOptions, start?: string): Turn[] {
  let state: CoachState = initialState;
  const turns: Turn[] = [];
  if (start) {
    const r = startSituation(start, opts);
    state = r.state;
    turns.push({ user: `[chọn thẻ ${start}]`, gai: r.messages });
  }
  for (const u of inputs) {
    const r = coachReply(state, u, opts);
    state = r.state;
    turns.push({ user: u, gai: r.messages });
  }
  return turns;
}

const kinds = (t: Turn) => t.gai.map((m) => m.kind);
const has = (t: Turn, k: CoachMessage["kind"]) => kinds(t).includes(k);
const anyAnswer = (ts: Turn[]) => ts.some((t) => has(t, "answer"));

const SCENARIOS: Scenario[] = [
  {
    id: "no-early-answer",
    title: "Không lộ giải đáp trước khi trả lời hết",
    opts: { kid: true },
    start: "chia-do-choi",
    inputs: ["Em muốn chơi trước", "Thay phiên"],
    check: (t) => (anyAnswer(t) ? "Giải đáp hiện ra khi mới trả lời 2/3 câu" : null),
  },
  {
    id: "answer-after-all",
    title: "Mở giải đáp sau khi trả lời đủ các câu",
    opts: { kid: true },
    start: "chia-do-choi",
    inputs: ["Mỗi người muốn chơi trước", "Thay phiên hoặc chia đôi", "Bị mẹ cất đồ chơi"],
    check: (t) => {
      const last = t[t.length - 1];
      const ans = last.gai.find((m) => m.kind === "answer");
      if (!ans || ans.kind !== "answer") return "Không thấy Giải đáp ở câu cuối";
      if (ans.yourAnswers.length !== 3) return "Giải đáp không kèm đủ 3 câu trả lời của người dùng";
      return null;
    },
  },
  {
    id: "reveal-blocked",
    title: "Đòi xem đáp án sớm thì Gai nhắc trả lời tiếp",
    opts: { kid: false },
    start: "doi-thu-giam-gia",
    inputs: ["xem giải đáp"],
    check: (t) => {
      const last = t[t.length - 1];
      if (has(last, "answer")) return "Gai đã mở giải đáp khi chưa trả lời";
      if (!has(last, "ask")) return "Gai không hỏi lại câu đang dở";
      return null;
    },
  },
  {
    id: "hint-no-advance",
    title: "Gợi ý không tính là một câu trả lời",
    opts: { kid: true },
    start: "ban-doa",
    inputs: ["gợi ý", "Bạn ấy cũng mất bạn", "Lại dọa tiếp", "Nói rõ và chia sẻ công bằng"],
    check: (t) => {
      if (!has(t[1], "hint")) return "Không trả về gợi ý";
      if (anyAnswer(t.slice(0, 4))) return "Giải đáp hiện quá sớm (gợi ý bị tính là trả lời)";
      if (!has(t[4], "answer")) return "Sau 3 câu trả lời thật vẫn chưa có giải đáp";
      return null;
    },
  },
  {
    id: "long-answer-with-keyword",
    title: "Câu trả lời dài có chữ \"đáp án\" vẫn được ghi nhận",
    opts: { kid: true },
    start: "chia-do-choi",
    inputs: ["Theo em đáp án là hai anh em đều muốn chơi trước"],
    check: (t) => {
      const ask = t[1].gai.find((m) => m.kind === "ask");
      return ask && ask.kind === "ask" && ask.step === 2 ? null : "Câu trả lời bị hiểu nhầm là lệnh xem đáp án";
    },
  },
  {
    id: "refuse-advice",
    title: "Từ chối tư vấn mua bán tài sản cụ thể",
    opts: { kid: false },
    inputs: ["Có nên mua cổ phiếu ngân hàng lúc này không?"],
    check: (t) => (has(t[0], "refuse") ? null : "Không từ chối yêu cầu tư vấn đầu tư"),
  },
  {
    id: "refuse-advice-ticker",
    title: "Từ chối khi hỏi mã cổ phiếu cụ thể",
    opts: { kid: false },
    inputs: ["mua HPG được không"],
    check: (t) => (has(t[0], "refuse") ? null : "Không nhận ra câu hỏi về mã cổ phiếu"),
  },
  {
    id: "refuse-mid-situation",
    title: "Vẫn từ chối tư vấn khi đang giữa một tình huống, không mất tiến độ",
    opts: { kid: false },
    start: "tin-don-thi-truong",
    inputs: ["Nhóm chat tung tin", "nên mua bitcoin không", "Hiếm khi đúng", "Mất 10 triệu, chịu được"],
    check: (t) => {
      if (!has(t[2], "refuse")) return "Không từ chối giữa chừng";
      if (!has(t[4], "answer")) return "Mất tiến độ sau khi từ chối";
      return null;
    },
  },
  {
    id: "no-false-refusal",
    title: "Không từ chối nhầm câu hỏi bình thường",
    opts: { kid: true },
    inputs: ["Em với anh tranh đồ chơi thì làm sao?"],
    check: (t) => (has(t[0], "refuse") ? "Từ chối nhầm" : has(t[0], "ask") ? null : "Không nhận ra tình huống tranh đồ chơi"),
  },
  {
    id: "concept",
    title: "Giải thích khái niệm khi được hỏi",
    opts: { kid: true },
    inputs: ["Cân bằng Nash là gì?"],
    check: (t) => {
      const c = t[0].gai.find((m) => m.kind === "concept");
      return c && c.kind === "concept" && c.term === "Cân bằng Nash" ? null : "Không giải thích cân bằng Nash";
    },
  },
  {
    id: "kid-filter",
    title: "Hồ sơ trẻ em không được mở tình huống dành cho người lớn",
    opts: { kid: true },
    start: "dam-phan-luong",
    inputs: [],
    check: (t) => (t[0].gai.some((m) => m.kind === "ask") ? "Trẻ em mở được tình huống đàm phán lương" : null),
  },
  {
    id: "adult-match",
    title: "Nhận ra tình huống người lớn từ câu kể tự nhiên",
    opts: { kid: false },
    inputs: ["Đối thủ bên cạnh vừa giảm giá mạnh, tôi có nên giảm theo?"],
    check: (t) => {
      const a = t[0].gai.find((m) => m.kind === "ask");
      return a && a.kind === "ask" && a.situationId === "doi-thu-giam-gia" ? null : "Không khớp tình huống đối thủ giảm giá";
    },
  },
  {
    id: "fallback",
    title: "Câu lạ thì đưa 4 câu hỏi chung và gợi ý",
    opts: { kid: false },
    inputs: ["Hàng xóm định xây tường cao hơn nhà tôi"],
    check: (t) => (has(t[0], "suggest") && has(t[0], "text") ? null : "Không có hướng dẫn chung khi không khớp"),
  },
  {
    id: "reset",
    title: "Gõ \"bắt đầu lại\" thì thoát tình huống",
    opts: { kid: true },
    start: "doi-the",
    inputs: ["bắt đầu lại", "Cân bằng Nash là gì"],
    check: (t) => (has(t[2], "concept") ? null : "Sau khi bắt đầu lại vẫn bị kẹt trong tình huống cũ"),
  },
];

/** Kiểm tra thư viện: đủ câu hỏi, có giải đáp, bài học liên kết tồn tại. */
function libraryChecks(): SelfTestResult[] {
  const lessonIds = new Set(ALL_LESSONS.map((l) => l.id));
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const s of SITUATIONS) {
    if (ids.has(s.id)) problems.push(`Trùng mã ${s.id}`);
    ids.add(s.id);
    if (s.steps.length < 2) problems.push(`${s.id}: cần ít nhất 2 câu hỏi`);
    if (s.answer.length < 50) problems.push(`${s.id}: giải đáp quá ngắn`);
    if (s.keywords.length === 0) problems.push(`${s.id}: thiếu từ khóa`);
    for (const l of s.lessons) if (!lessonIds.has(l)) problems.push(`${s.id}: bài học ${l} không tồn tại`);
  }
  for (const c of CONCEPTS) if (!lessonIds.has(c.lesson)) problems.push(`Khái niệm ${c.id}: bài học ${c.lesson} không tồn tại`);
  if (!SITUATIONS.some((s) => s.audience === "all")) problems.push("Không có tình huống cho trẻ em");
  return [
    {
      id: "library",
      title: `Thư viện: ${SITUATIONS.length} tình huống, ${CONCEPTS.length} khái niệm`,
      ok: problems.length === 0,
      detail: problems.join("; ") || "Đủ câu hỏi, có giải đáp, bài học liên kết đều tồn tại",
      transcript: [],
    },
  ];
}

/** Chạy toàn bộ selftest. */
export function runSelfTest(): SelfTestResult[] {
  const results = SCENARIOS.map((sc) => {
    const transcript = simulate(sc.inputs, sc.opts, sc.start);
    let reason: string | null;
    try {
      reason = sc.check(transcript);
    } catch (e) {
      reason = `Lỗi khi kiểm tra: ${(e as Error).message}`;
    }
    return { id: sc.id, title: sc.title, ok: reason === null, detail: reason ?? "Đạt", transcript };
  });
  return [...libraryChecks(), ...results];
}

/** Tự động đi hết mọi tình huống trong thư viện: mỗi tình huống phải ra giải đáp đúng lúc. */
export function walkAllSituations(): SelfTestResult[] {
  return SITUATIONS.map((s) => {
    const opts = { kid: s.audience === "all" };
    const inputs = s.steps.map((_, i) => `Câu trả lời thử ${i + 1}`);
    const t = simulate(inputs, opts, s.id);
    const early = t.slice(0, -1).some((x) => x.gai.some((m) => m.kind === "answer"));
    const final = t[t.length - 1].gai.some((m) => m.kind === "answer");
    const ok = !early && final;
    return {
      id: `walk-${s.id}`,
      title: `Đi hết tình huống: ${s.title}`,
      ok,
      detail: ok ? "Đạt" : early ? "Giải đáp hiện quá sớm" : "Không ra giải đáp sau câu cuối",
      transcript: t,
    };
  });
}
