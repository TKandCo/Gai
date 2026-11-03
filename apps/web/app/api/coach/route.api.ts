import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { ADVICE_REFUSAL, COACH_TOOLS, coachSystemPrompt, isInvestmentAdviceRequest, runCoachTool } from "@gai/coach";

/**
 * Gai Coach bằng Claude. Chỉ bật khi server có ANTHROPIC_API_KEY (đặt trong Vercel → Environment Variables).
 * Khóa API không bao giờ gửi xuống trình duyệt.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.COACH_MODEL ?? "claude-opus-5-5";
const MAX_TURNS = 20;
const MAX_CHARS = 1500;
const MAX_TOOL_ROUNDS = 5;
const LIMIT_PER_HOUR = Number(process.env.COACH_LIMIT_PER_HOUR ?? 30);

const enabled = () => Boolean(process.env.ANTHROPIC_API_KEY);

// Giới hạn lượt gọi theo IP (đơn giản, theo từng máy chủ). Đủ để chặn lạm dụng cơ bản.
const hits = new Map<string, { count: number; reset: number }>();
function allow(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { count: 1, reset: now + 3600_000 });
    return true;
  }
  h.count += 1;
  return h.count <= LIMIT_PER_HOUR;
}

const TOOLS: Anthropic.Beta.BetaTool[] = COACH_TOOLS.map((t) => ({
  name: t.name,
  description: t.description,
  input_schema: t.input_schema as unknown as Anthropic.Beta.BetaTool.InputSchema,
}));

export async function GET() {
  return NextResponse.json({ enabled: enabled(), model: enabled() ? MODEL : null });
}

type ChatTurn = { role: "user" | "assistant"; content: string };

function parseBody(body: unknown): { turns: ChatTurn[]; kid: boolean } | null {
  const b = body as { messages?: unknown; kid?: unknown };
  if (!b || !Array.isArray(b.messages) || b.messages.length === 0 || b.messages.length > MAX_TURNS) return null;
  const turns: ChatTurn[] = [];
  for (const m of b.messages) {
    const t = m as ChatTurn;
    if ((t.role !== "user" && t.role !== "assistant") || typeof t.content !== "string" || !t.content.trim()) return null;
    turns.push({ role: t.role, content: t.content.slice(0, MAX_CHARS) });
  }
  if (turns[0].role !== "user" || turns[turns.length - 1].role !== "user") return null;
  return { turns, kid: b.kid === true };
}

export async function POST(req: Request) {
  if (!enabled()) return NextResponse.json({ error: "Gai AI chưa được bật trên máy chủ." }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allow(ip)) return NextResponse.json({ error: "Bạn đã hỏi nhiều quá trong một giờ. Nghỉ một chút rồi quay lại nhé!" }, { status: 429 });

  let parsed: ReturnType<typeof parseBody>;
  try {
    parsed = parseBody(await req.json());
  } catch {
    parsed = null;
  }
  if (!parsed) return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  const { turns, kid } = parsed;

  // Chặn tư vấn đầu tư cụ thể ngay tại máy chủ, không cần gọi AI
  if (isInvestmentAdviceRequest(turns[turns.length - 1].content)) {
    return NextResponse.json({ reply: ADVICE_REFUSAL, toolsUsed: [], guarded: true });
  }

  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = turns.map((t) => ({ role: t.role, content: t.content }));
  const toolsUsed: string[] = [];

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 16000,
        betas: ["server-side-fallback-2026-06-01"],
        fallbacks: [{ model: "claude-opus-4-8" }],
        output_config: { effort: "medium" },
        system: [{ type: "text", text: coachSystemPrompt(kid), cache_control: { type: "ephemeral" } }],
        tools: TOOLS,
        messages,
      });

      if (response.stop_reason === "refusal") {
        return NextResponse.json({ reply: "Gai không thể giúp với câu hỏi này. Bạn thử hỏi theo cách khác nhé.", toolsUsed });
      }

      const toolUses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
        const text = response.content
          .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim();
        return NextResponse.json({ reply: text || "Gai chưa nghĩ ra câu trả lời. Bạn hỏi lại nhé.", toolsUsed });
      }

      messages.push({ role: "assistant", content: response.content });
      const results: Anthropic.Beta.BetaToolResultBlockParam[] = toolUses.map((tu) => {
        toolsUsed.push(tu.name);
        const r = runCoachTool(tu.name, tu.input, kid);
        return { type: "tool_result", tool_use_id: tu.id, content: r.content, is_error: r.isError };
      });
      messages.push({ role: "user", content: results });
    }
    return NextResponse.json({ reply: "Câu hỏi này cần tính nhiều quá. Bạn thử chia nhỏ câu hỏi nhé.", toolsUsed });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "Khóa API trên máy chủ không hợp lệ." }, { status: 500 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Gai AI đang bận. Thử lại sau ít phút nhé." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `Gai AI gặp lỗi (${error.status}). Dùng chế độ cơ bản tạm thời nhé.` }, { status: 502 });
    }
    return NextResponse.json({ error: "Không kết nối được Gai AI." }, { status: 502 });
  }
}
