import { CONCEPTS, type Concept } from "./concepts";
import { ADVICE_REFUSAL, isInvestmentAdviceRequest } from "./guard";
import { findSituation, situationsFor, type Situation } from "./library";
import { hasPhrase, normalize } from "./text";

/**
 * Bộ máy Gai Coach chạy hoàn toàn trên máy (không cần mạng, không cần AI).
 * Quy tắc cốt lõi: với một tình huống, Gai hỏi lần lượt từng câu gợi mở;
 * GIẢI ĐÁP chỉ mở khi người dùng đã trả lời hết.
 */
export type CoachMessage =
  | { kind: "text"; text: string }
  | { kind: "ask"; text: string; step: number; total: number; situationId: string }
  | { kind: "hint"; text: string }
  | { kind: "answer"; situationId: string; text: string; pitfalls: string[]; lessons: string[]; yourAnswers: string[] }
  | { kind: "refuse"; text: string }
  | { kind: "concept"; term: string; text: string; lesson: string }
  | { kind: "suggest"; text: string; situationIds: string[] };

export type CoachState =
  | { mode: "idle" }
  | { mode: "situation"; situationId: string; step: number; answers: string[] };

export type CoachOptions = { kid: boolean };

export const initialState: CoachState = { mode: "idle" };

export const COMMANDS = {
  hint: ["goi y", "hint", "khong biet bat dau"],
  reveal: ["xem giai dap", "dap an", "giai dap", "cho xem dap an", "loi giai"],
  reset: ["bat dau lai", "lam lai", "huy", "thoat", "chuyen chu de"],
};

/** Lệnh chỉ tính khi câu ngắn (≤ 5 từ), để câu trả lời dài có chứa chữ \"đáp án\" không bị hiểu nhầm là lệnh. */
const isCommand = (n: string, list: string[]) => n.split(" ").length <= 5 && list.some((c) => hasPhrase(n, c));

export function greeting(kid: boolean): CoachMessage[] {
  return [
    {
      kind: "text",
      text: kid
        ? "Chào bạn! Mình là **Gai** 🦉. Bạn đang gặp chuyện gì khó chọn? Kể cho Gai nghe, hoặc chọn một tình huống bên dưới nhé."
        : "Chào bạn, mình là **Gai** 🦉. Hãy kể một tình huống bạn cần ra quyết định, hoặc hỏi một khái niệm (ví dụ: \"cân bằng Nash là gì?\"). Gai sẽ hỏi lại từng bước để bạn tự tìm ra câu trả lời.",
    },
  ];
}

/** Bắt đầu một tình huống trong thư viện (khi người dùng chạm vào thẻ). */
export function startSituation(id: string, opts: CoachOptions): { state: CoachState; messages: CoachMessage[] } {
  const s = findSituation(id);
  if (!s || (opts.kid && s.audience !== "all")) {
    return { state: initialState, messages: [{ kind: "text", text: "Gai chưa có tình huống này. Bạn kể thử bằng lời của mình nhé!" }] };
  }
  return {
    state: { mode: "situation", situationId: s.id, step: 0, answers: [] },
    messages: [
      { kind: "text", text: `${s.emoji} **${s.title}**\n${s.summary}\nGai sẽ hỏi ${s.steps.length} câu. Trả lời bằng suy nghĩ của bạn, không có đúng sai. Trả lời xong hết thì Gai mở **Giải đáp**.` },
      ask(s, 0),
    ],
  };
}

function ask(s: Situation, step: number): CoachMessage {
  return { kind: "ask", text: s.steps[step].ask, step: step + 1, total: s.steps.length, situationId: s.id };
}

/** Tìm khái niệm người dùng đang hỏi. */
export function matchConcept(text: string): Concept | null {
  const n = normalize(text);
  let best: Concept | null = null;
  let bestLen = 0;
  for (const c of CONCEPTS)
    for (const k of c.keywords)
      if (hasPhrase(n, k) && k.length > bestLen) {
        best = c;
        bestLen = k.length;
      }
  return best;
}

/** Tìm tình huống khớp nhất với câu người dùng kể (theo cụm từ khóa). */
export function matchSituation(text: string, kid: boolean): Situation | null {
  const n = normalize(text);
  let best: Situation | null = null;
  let bestScore = 0;
  for (const s of situationsFor(kid)) {
    const score = s.keywords.reduce((acc, k) => (hasPhrase(n, k) ? acc + normalize(k).split(" ").length : acc), 0);
    if (score > bestScore) {
      best = s;
      bestScore = score;
    }
  }
  return best;
}

const asksDefinition = (n: string) =>
  ["la gi", "nghia la", "giai thich", "the nao la", "hieu the nao", "co nghia"].some((p) => hasPhrase(n, p));

/** Xử lý một câu của người dùng, trả về trạng thái mới và các tin nhắn của Gai. */
export function coachReply(state: CoachState, userText: string, opts: CoachOptions): { state: CoachState; messages: CoachMessage[] } {
  const raw = userText.trim();
  const n = normalize(raw);

  if (!raw) return { state, messages: [{ kind: "text", text: "Bạn gõ vài chữ cho Gai nhé 🙂" }] };

  if (isCommand(n, COMMANDS.reset)) {
    return { state: initialState, messages: [{ kind: "text", text: "Được rồi, mình bắt đầu chuyện mới nhé. Bạn đang băn khoăn điều gì?" }] };
  }

  // Luôn chặn yêu cầu tư vấn đầu tư cụ thể, kể cả giữa chừng một tình huống
  if (isInvestmentAdviceRequest(raw)) {
    return {
      state,
      messages: [
        { kind: "refuse", text: ADVICE_REFUSAL },
        ...(opts.kid
          ? []
          : [{ kind: "suggest" as const, text: "Thử phân tích cùng Gai:", situationIds: ["tin-don-thi-truong"] }]),
      ],
    };
  }

  if (state.mode === "situation") {
    const s = findSituation(state.situationId)!;
    if (isCommand(n, COMMANDS.hint)) {
      return { state, messages: [{ kind: "hint", text: `💡 Gợi ý: ${s.steps[state.step].hint}` }] };
    }
    if (isCommand(n, COMMANDS.reveal)) {
      const left = s.steps.length - state.step;
      return {
        state,
        messages: [
          { kind: "text", text: `Gai sẽ mở Giải đáp ngay khi bạn trả lời xong. Còn **${left}** câu nữa thôi! Không chắc thì cứ đoán, hoặc gõ \"gợi ý\".` },
          ask(s, state.step),
        ],
      };
    }
    const answers = [...state.answers, raw];
    const next = state.step + 1;
    if (next < s.steps.length) {
      return {
        state: { ...state, step: next, answers },
        messages: [ask(s, next)],
      };
    }
    return {
      state: initialState,
      messages: [
        { kind: "text", text: "Cảm ơn bạn đã trả lời hết! Đây là phần **Giải đáp** 👇" },
        { kind: "answer", situationId: s.id, text: s.answer, pitfalls: s.pitfalls, lessons: s.lessons, yourAnswers: answers },
      ],
    };
  }

  // Ở trạng thái tự do: khái niệm, tình huống, hoặc hướng dẫn chung
  const concept = matchConcept(raw);
  const situation = matchSituation(raw, opts.kid);

  if (concept && (asksDefinition(n) || !situation)) {
    return { state, messages: [{ kind: "concept", term: concept.term, text: concept.explain, lesson: concept.lesson }] };
  }

  if (situation) {
    const started = startSituation(situation.id, opts);
    return {
      state: started.state,
      messages: [{ kind: "text", text: "Gai thấy chuyện này giống một tình huống quen thuộc." }, ...started.messages],
    };
  }

  // Không khớp gì: dùng 4 câu hỏi chung (Socratic), gợi ý tình huống
  const pool = situationsFor(opts.kid);
  return {
    state,
    messages: [
      {
        kind: "text",
        text: "Gai chưa có sẵn tình huống giống hệt, nhưng mình cùng nghĩ theo **4 câu hỏi** nhé:\n1. **Ai** là các bên, và mỗi bên **muốn gì**?\n2. Mỗi bên có thể **làm gì**?\n3. Ai **chọn trước**, hay chọn cùng lúc? Có **gặp lại nhau** không?\n4. Ai **biết điều gì** mà bên kia không biết?\nMuốn phân tích kỹ từng bước, hãy dùng **Phân tích sự kiện**.",
      },
      { kind: "suggest", text: "Hoặc thử một tình huống mẫu:", situationIds: pool.slice(0, 3).map((s) => s.id) },
    ],
  };
}
