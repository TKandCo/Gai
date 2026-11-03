"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CONCEPTS,
  GROUPS,
  coachReply,
  findSituation,
  greeting,
  initialState,
  situationsFor,
  startSituation,
  type CoachMessage,
  type CoachState,
} from "@gai/coach";
import { findLesson } from "@gai/learning";
import { useProfiles } from "@/lib/profiles";
import { RichText } from "@/components/RichText";
import { HelpButton } from "@/components/Help";

type Item = { from: "user"; text: string } | { from: "gai"; msg: CoachMessage } | { from: "ai"; text: string; tools: string[] };

const HELP = [
  { icon: "📚", text: "Chọn một tình huống trong thư viện, hoặc tự kể chuyện của bạn bằng lời." },
  { icon: "🤔", text: "Gai sẽ hỏi lại từng câu. Hãy trả lời bằng suy nghĩ của bạn, không có đúng sai." },
  { icon: "💡", text: "Bí quá thì bấm \"Gợi ý\". Trả lời xong hết các câu, Gai mới mở phần Giải đáp." },
  { icon: "🔁", text: "Gõ \"bắt đầu lại\" để đổi sang chuyện khác." },
];

export function CoachClient() {
  const { isKid } = useProfiles();
  const [items, setItems] = useState<Item[]>([]);
  const [state, setState] = useState<CoachState>(initialState);
  const [text, setText] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/coach")
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((j: { enabled: boolean }) => {
        setAiEnabled(j.enabled);
        setUseAi(j.enabled);
      })
      .catch(() => setAiEnabled(false));
  }, []);

  useEffect(() => {
    // Chỉ cuộn khi đã có hội thoại, để lúc mới mở người dùng thấy lời chào và thư viện từ đầu
    if (items.length > 0) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items]);

  const pushGai = (msgs: CoachMessage[]) => setItems((it) => [...it, ...msgs.map((msg) => ({ from: "gai" as const, msg }))]);

  const openSituation = (id: string) => {
    const r = startSituation(id, { kid: isKid });
    setState(r.state);
    setItems((it) => [...it, { from: "user", text: `${findSituation(id)?.emoji ?? ""} ${findSituation(id)?.title ?? id}` }]);
    pushGai(r.messages);
  };

  const send = async (raw: string) => {
    const msg = raw.trim();
    if (!msg || busy) return;
    setText("");
    setItems((it) => [...it, { from: "user", text: msg }]);

    // Đang trong một tình huống của thư viện: luôn dùng bộ máy cơ bản, để giải đáp chỉ mở khi trả lời xong
    if (!useAi || state.mode === "situation") {
      const r = coachReply(state, msg, { kid: isKid });
      setState(r.state);
      pushGai(r.messages);
      return;
    }

    setBusy(true);
    try {
      const history = [...items, { from: "user" as const, text: msg }]
        .filter((i): i is Extract<Item, { from: "user" | "ai" }> => i.from === "user" || i.from === "ai")
        .slice(-12)
        .map((i) => ({ role: i.from === "user" ? "user" : "assistant", content: i.text }));
      while (history.length && history[0].role !== "user") history.shift();
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, kid: isKid }),
      });
      const j = (await res.json()) as { reply?: string; toolsUsed?: string[]; error?: string };
      if (!res.ok || !j.reply) throw new Error(j.error ?? "Lỗi");
      setItems((it) => [...it, { from: "ai", text: j.reply!, tools: j.toolsUsed ?? [] }]);
    } catch (e) {
      // Mất mạng hoặc AI lỗi: chuyển sang bộ máy cơ bản để không bỏ dở người dùng
      const r = coachReply(state, msg, { kid: isKid });
      setState(r.state);
      pushGai([{ kind: "text", text: `⚠️ ${(e as Error).message}. Gai trả lời bằng chế độ cơ bản nhé.` }, ...r.messages]);
    } finally {
      setBusy(false);
    }
  };

  const inSituation = state.mode === "situation";
  const library = situationsFor(isKid);
  const groups = Object.entries(GROUPS).filter(([g]) => library.some((s) => s.group === g));

  return (
    <main className="flex min-h-[calc(100dvh-6rem)] flex-col px-4">
      <header className="flex items-center justify-between gap-2 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <span className="text-4xl">🦉</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">Hỏi Gai</h1>
            <p className="text-xs text-muted">{aiEnabled && useAi ? "Gai AI đang bật" : "Chế độ cơ bản, chạy ngay trên máy"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {aiEnabled && (
            <button
              onClick={() => setUseAi((v) => !v)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${useAi ? "bg-accent text-accent-ink" : "bg-surface-2"}`}
              aria-pressed={useAi}
            >
              {useAi ? "✨ AI" : "Cơ bản"}
            </button>
          )}
          <HelpButton id="coach" title="Cách hỏi Gai" steps={HELP} />
        </div>
      </header>

      <div className="flex-1 space-y-3 pb-4">
        {greeting(isKid).map((m, k) => (
          <Bubble key={`g${k}`} msg={m} onPick={openSituation} />
        ))}

        {items.length === 0 && (
          <div className="space-y-4 pt-2">
            {groups.map(([g, label]) => (
              <section key={g}>
                <h2 className="mb-2 text-sm font-semibold text-muted">{label}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {library
                    .filter((s) => s.group === g)
                    .map((s) => (
                      <button
                        key={s.id}
                        onClick={() => openSituation(s.id)}
                        className="rounded-2xl border border-line bg-surface p-3 text-left transition active:scale-[0.98]"
                      >
                        <div className="text-2xl">{s.emoji}</div>
                        <div className="mt-1 text-sm font-semibold leading-snug">{s.title}</div>
                      </button>
                    ))}
                </div>
              </section>
            ))}
            <section>
              <h2 className="mb-2 text-sm font-semibold text-muted">Hỏi nhanh khái niệm</h2>
              <div className="flex flex-wrap gap-2">
                {CONCEPTS.slice(0, 8).map((c) => (
                  <button key={c.id} onClick={() => send(`${c.term} là gì?`)} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
                    {c.term}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {items.map((it, k) =>
          it.from === "user" ? (
            <div key={k} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-4 py-2 text-accent-ink">{it.text}</p>
            </div>
          ) : it.from === "ai" ? (
            <div key={k} className="max-w-[92%] rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3">
              <RichText text={it.text} />
              {it.tools.includes("solve_matrix") && <p className="mt-2 text-xs text-muted">🧮 Con số được tính bằng bộ giải của app</p>}
            </div>
          ) : (
            <Bubble key={k} msg={it.msg} onPick={openSituation} />
          ),
        )}
        {busy && <p className="text-sm text-muted">Gai đang suy nghĩ… 🦉</p>}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-24 space-y-2 bg-bg/95 py-2 backdrop-blur">
        {inSituation && (
          <div className="flex gap-2">
            <button onClick={() => send("gợi ý")} className="rounded-full bg-nash-soft px-3 py-1.5 text-sm font-medium">
              💡 Gợi ý
            </button>
            <button onClick={() => send("bắt đầu lại")} className="rounded-full bg-surface-2 px-3 py-1.5 text-sm">
              ↺ Đổi chuyện khác
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
          className="flex gap-2"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            placeholder={inSituation ? "Trả lời câu hỏi của Gai…" : isKid ? "Kể cho Gai nghe…" : "Kể tình huống hoặc hỏi một khái niệm…"}
            className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-line bg-surface px-4 outline-none focus:border-accent"
            aria-label="Tin nhắn cho Gai"
          />
          <button disabled={!text.trim() || busy} className="h-12 rounded-2xl bg-accent px-4 font-bold text-accent-ink disabled:opacity-40">
            Gửi
          </button>
        </form>
      </div>
    </main>
  );
}

function Bubble({ msg, onPick }: { msg: CoachMessage; onPick: (id: string) => void }) {
  switch (msg.kind) {
    case "text":
      return (
        <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3">
          <RichText text={msg.text} />
        </div>
      );
    case "ask":
      return (
        <div className="max-w-[92%] rounded-2xl rounded-bl-sm border-2 border-accent/40 bg-accent-soft px-4 py-3">
          <p className="mb-1 text-xs font-bold text-accent">
            Câu {msg.step}/{msg.total}
          </p>
          <p className="font-semibold">{msg.text}</p>
        </div>
      );
    case "hint":
      return <div className="max-w-[92%] rounded-2xl bg-nash-soft px-4 py-3 text-sm">{msg.text}</div>;
    case "refuse":
      return (
        <div className="max-w-[92%] rounded-2xl border-2 border-nash bg-nash-soft px-4 py-3">
          <RichText text={msg.text} />
        </div>
      );
    case "concept":
      return (
        <div className="max-w-[92%] rounded-2xl border border-line bg-surface px-4 py-3">
          <p className="mb-1 font-bold">📘 {msg.term}</p>
          <RichText text={msg.text} />
          <LessonLink id={msg.lesson} />
        </div>
      );
    case "suggest":
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted">{msg.text}</p>
          <div className="flex flex-wrap gap-2">
            {msg.situationIds.map((id) => {
              const s = findSituation(id);
              return s ? (
                <button key={id} onClick={() => onPick(id)} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
                  {s.emoji} {s.title}
                </button>
              ) : null;
            })}
          </div>
        </div>
      );
    case "answer":
      return (
        <div className="animate-pop space-y-3 rounded-2xl border-2 border-good/50 bg-surface p-4">
          <p className="text-lg font-bold">📖 Giải đáp</p>
          <div className="rounded-xl bg-surface-2 p-3 text-sm">
            <p className="mb-1 font-semibold">Bạn đã trả lời:</p>
            <ol className="list-decimal space-y-0.5 pl-5">
              {msg.yourAnswers.map((a, k) => (
                <li key={k}>{a}</li>
              ))}
            </ol>
          </div>
          <RichText text={msg.text} />
          {msg.pitfalls.length > 0 && (
            <div className="rounded-xl bg-bad-soft p-3 text-sm">
              <p className="mb-1 font-semibold">⚠️ Bẫy thường gặp</p>
              <ul className="list-disc space-y-0.5 pl-5">
                {msg.pitfalls.map((p, k) => (
                  <li key={k}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm font-semibold">Học kỹ hơn:</p>
            {msg.lessons.map((id) => (
              <LessonLink key={id} id={id} />
            ))}
          </div>
          <Link href="/analyze" className="block text-sm font-semibold text-accent">
            🔍 Phân tích kỹ tình huống của bạn →
          </Link>
        </div>
      );
  }
}

function LessonLink({ id }: { id: string }) {
  const l = findLesson(id);
  if (!l) return null;
  return (
    <Link href={`/learn/${l.id}`} className="mt-1 block text-sm font-medium text-accent">
      {l.emoji} {l.title} →
    </Link>
  );
}
