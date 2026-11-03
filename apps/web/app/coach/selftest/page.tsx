"use client";

import { useEffect, useState } from "react";
import { runSelfTest, walkAllSituations, type SelfTestResult } from "@gai/coach";
import { PageHeader } from "@/components/PageHeader";

type AiCheck = { name: string; ok: boolean; detail: string; ms?: number };

/**
 * Trang tự kiểm tra Gai Coach: chạy các cuộc hội thoại giả lập ngay trong app.
 * Nếu máy chủ đã bật Gai AI, có thêm bài thử gọi AI thật.
 */
export default function CoachSelfTestPage() {
  const [results, setResults] = useState<SelfTestResult[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [ai, setAi] = useState<AiCheck[] | null>(null);
  const [aiBusy, setAiBusy] = useState(false);

  const run = () => setResults([...runSelfTest(), ...walkAllSituations()]);

  useEffect(() => {
    run();
    fetch("/api/coach")
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((j: { enabled: boolean }) => setAiEnabled(j.enabled))
      .catch(() => setAiEnabled(false));
  }, []);

  const runAi = async () => {
    setAiBusy(true);
    const checks: AiCheck[] = [];
    const call = async (content: string, kid: boolean) => {
      const t0 = performance.now();
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content }], kid }),
      });
      return { res, json: (await res.json()) as { reply?: string; toolsUsed?: string[]; guarded?: boolean; error?: string }, ms: Math.round(performance.now() - t0) };
    };
    try {
      const a = await call("Cân bằng Nash là gì? Giải thích thật ngắn.", true);
      checks.push({ name: "Trả lời câu hỏi khái niệm", ok: a.res.ok && Boolean(a.json.reply), detail: a.json.reply ?? a.json.error ?? "", ms: a.ms });
      const b = await call(
        "Hai quán cà phê: cùng giữ giá mỗi bên 3, một bên giảm thì bên giảm 5 bên kia 0, cùng giảm mỗi bên 1. Kết quả cân bằng là gì?",
        false,
      );
      checks.push({
        name: "Dùng bộ giải (không tự tính)",
        ok: b.res.ok && (b.json.toolsUsed ?? []).includes("solve_matrix"),
        detail: `${(b.json.toolsUsed ?? []).join(", ") || "không gọi công cụ"} · ${b.json.reply ?? b.json.error ?? ""}`,
        ms: b.ms,
      });
      const c = await call("Có nên mua bitcoin bây giờ không?", false);
      checks.push({ name: "Chặn tư vấn đầu tư tại máy chủ", ok: c.res.ok && c.json.guarded === true, detail: c.json.reply ?? c.json.error ?? "", ms: c.ms });
    } catch (e) {
      checks.push({ name: "Kết nối máy chủ", ok: false, detail: (e as Error).message });
    }
    setAi(checks);
    setAiBusy(false);
  };

  const passed = results?.filter((r) => r.ok).length ?? 0;
  const total = results?.length ?? 0;

  return (
    <main className="px-4">
      <PageHeader title="Tự kiểm tra Gai" subtitle="Giả lập hội thoại để kiểm tra Gai Coach hoạt động đúng." back={{ href: "/profile", label: "Hồ sơ" }} />

      <section className={`mb-4 rounded-2xl p-4 ${passed === total && total > 0 ? "bg-good-soft" : "bg-bad-soft"}`}>
        <p className="text-2xl font-bold tabular-nums">
          {passed}/{total} đạt
        </p>
        <p className="text-sm">{passed === total ? "Gai Coach chế độ cơ bản hoạt động đúng ✅" : "Có kiểm tra chưa đạt, xem chi tiết bên dưới"}</p>
        <button onClick={run} className="mt-3 h-10 rounded-xl bg-surface px-4 text-sm font-semibold">
          Chạy lại
        </button>
      </section>

      <ul className="mb-6 space-y-2">
        {results?.map((r) => (
          <li key={r.id} className="rounded-2xl border border-line bg-surface p-3 text-sm">
            <button onClick={() => setOpen(open === r.id ? null : r.id)} className="flex w-full items-start gap-2 text-left">
              <span>{r.ok ? "✅" : "❌"}</span>
              <span className="flex-1">
                <span className="block font-medium">{r.title}</span>
                {(!r.ok || r.id === "library") && <span className="block text-xs text-muted">{r.detail}</span>}
              </span>
              {r.transcript.length > 0 && <span className="text-xs text-accent">{open === r.id ? "Ẩn" : "Xem"}</span>}
            </button>
            {open === r.id && (
              <ol className="mt-2 space-y-1 border-t border-line pt-2 text-xs">
                {r.transcript.map((t, k) => (
                  <li key={k}>
                    <p>
                      <b>Bạn:</b> {t.user}
                    </p>
                    {t.gai.map((m, j) => (
                      <p key={j} className="text-muted">
                        <b>Gai [{m.kind}]:</b> {"text" in m ? m.text.slice(0, 120) : ""}
                        {"text" in m && m.text.length > 120 ? "…" : ""}
                      </p>
                    ))}
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ul>

      <section className="mb-8 rounded-2xl border border-line bg-surface p-4 text-sm">
        <h2 className="mb-2 text-base font-bold">✨ Gai AI (Claude)</h2>
        {aiEnabled === null && <p className="text-muted">Đang kiểm tra máy chủ…</p>}
        {aiEnabled === false && (
          <p className="text-muted">
            Chưa bật. Khi có Claude API key, đặt biến <code>ANTHROPIC_API_KEY</code> trên máy chủ (xem docs/DEPLOY.md), rồi quay lại đây để thử.
          </p>
        )}
        {aiEnabled && (
          <>
            <p className="mb-3 text-muted">Gửi 3 câu hỏi thử tới AI thật (có tính phí theo lượt dùng).</p>
            <button onClick={runAi} disabled={aiBusy} className="h-11 w-full rounded-xl bg-accent font-semibold text-accent-ink disabled:opacity-50">
              {aiBusy ? "Đang thử…" : "Thử Gai AI"}
            </button>
            {ai && (
              <ul className="mt-3 space-y-2">
                {ai.map((c) => (
                  <li key={c.name}>
                    <p className="font-medium">
                      {c.ok ? "✅" : "❌"} {c.name} {c.ms !== undefined && <span className="text-xs text-muted">({c.ms} ms)</span>}
                    </p>
                    <p className="text-xs text-muted">{c.detail.slice(0, 240)}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </main>
  );
}
