"use client";

import { useState } from "react";
import { brier, brierLevel, calibrationBuckets, overconfidence } from "@gai/calibration";
import { addDays, today } from "@gai/learning";
import { useProfiles } from "@/lib/profiles";
import { probabilityWords, useJournal, type Prediction } from "@/lib/journal";
import { PageHeader } from "@/components/PageHeader";
import { HelpButton } from "@/components/Help";
import { Mascot } from "@/components/Mascot";

const HELP = [
  { icon: "✍️", text: "Viết một câu hỏi về tương lai, trả lời được bằng CÓ hoặc KHÔNG. Ví dụ: \"Ngày mai trời có mưa không?\"" },
  { icon: "🎚️", text: "Kéo thanh trượt để nói bạn tin bao nhiêu phần trăm điều đó sẽ xảy ra." },
  { icon: "📅", text: "Chọn ngày sẽ biết kết quả. Đến ngày đó, quay lại bấm CÓ hoặc KHÔNG." },
  { icon: "🎯", text: "App chấm điểm độ chính xác. Điểm càng gần 0 càng giỏi. Đoán bừa 50% mãi thì được 0,25." },
];

const IDEAS = {
  kid: [
    "Ngày mai trời có mưa không?",
    "Bài kiểm tra Toán tuần này mình được từ 8 điểm trở lên?",
    "Đội tuyển Việt Nam thắng trận đấu tới?",
    "Cuối tuần này cả nhà có đi chơi không?",
  ],
  adult: [
    "Đối thủ chính có giảm giá trong tháng này không?",
    "Giá xăng kỳ điều chỉnh tới có tăng không?",
    "Lãi suất tiết kiệm 12 tháng ở ngân hàng của tôi có giảm trong quý này?",
    "Dự án đang làm có xong đúng hạn không?",
  ],
};

const fmtDate = (d: string) => d.split("-").reverse().join("/");

export function JournalClient() {
  const { isKid } = useProfiles();
  const { items, add, resolve, reopen, remove } = useJournal();
  const [adding, setAdding] = useState(false);
  const day = today();

  const resolved = items.filter((x) => x.outcome !== null);
  const due = items.filter((x) => x.outcome === null && x.due <= day);
  const waiting = items.filter((x) => x.outcome === null && x.due > day).sort((a, b) => a.due.localeCompare(b.due));

  return (
    <main className="px-4">
      <PageHeader
        title="Nhật ký dự đoán"
        subtitle="Đoán trước, đối chiếu sau, xem mình giỏi lên thế nào."
        right={<HelpButton id="journal" title="Cách dùng nhật ký" steps={HELP} />}
      />

      <ScoreCard resolved={resolved} />

      <button
        onClick={() => setAdding(true)}
        className="my-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-lg font-bold text-accent-ink"
      >
        ✍️ Ghi dự đoán mới
      </button>

      {items.length === 0 && (
        <Mascot>
          Chưa có dự đoán nào. Thử đoán một chuyện nhỏ, ví dụ: <b>&quot;{(isKid ? IDEAS.kid : IDEAS.adult)[0]}&quot;</b>
        </Mascot>
      )}

      {due.length > 0 && (
        <Section title={`⏰ Đến lúc đối chiếu (${due.length})`}>
          {due.map((x) => (
            <Item key={x.id} x={x}>
              <p className="mb-2 text-sm font-medium">Chuyện này đã xảy ra chưa?</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => resolve(x.id, true)} className="h-12 rounded-xl bg-good-soft font-bold text-good">
                  ✅ CÓ
                </button>
                <button onClick={() => resolve(x.id, false)} className="h-12 rounded-xl bg-bad-soft font-bold text-bad">
                  ❌ KHÔNG
                </button>
              </div>
            </Item>
          ))}
        </Section>
      )}

      {waiting.length > 0 && (
        <Section title={`⏳ Đang chờ (${waiting.length})`}>
          {waiting.map((x) => (
            <Item key={x.id} x={x}>
              <div className="flex gap-2">
                <button onClick={() => resolve(x.id, true)} className="h-10 flex-1 rounded-xl border border-line text-sm">
                  Đã biết: CÓ
                </button>
                <button onClick={() => resolve(x.id, false)} className="h-10 flex-1 rounded-xl border border-line text-sm">
                  Đã biết: KHÔNG
                </button>
              </div>
            </Item>
          ))}
        </Section>
      )}

      {resolved.length > 0 && (
        <Section title={`📚 Đã có kết quả (${resolved.length})`}>
          {resolved.map((x) => {
            const err = (x.p / 100 - (x.outcome ? 1 : 0)) ** 2;
            return (
              <Item key={x.id} x={x}>
                <div className="flex items-center justify-between text-sm">
                  <span className={x.outcome ? "font-semibold text-good" : "font-semibold text-bad"}>
                    {x.outcome ? "✅ Đã xảy ra" : "❌ Không xảy ra"}
                  </span>
                  <span className="text-muted">Điểm câu này: {err.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="mt-2 flex gap-3 text-xs">
                  <button onClick={() => reopen(x.id)} className="text-muted underline">
                    Sửa kết quả
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Xóa dự đoán này?")) remove(x.id);
                    }}
                    className="text-bad underline"
                  >
                    Xóa
                  </button>
                </div>
              </Item>
            );
          })}
        </Section>
      )}

      {adding && (
        <AddSheet
          ideas={isKid ? IDEAS.kid : IDEAS.adult}
          onClose={() => setAdding(false)}
          onSave={(p) => {
            add(p);
            setAdding(false);
          }}
        />
      )}

      {!isKid && (
        <p className="mt-8 text-center text-xs text-muted">Nhật ký giúp rèn tư duy, không phải lời khuyên đầu tư.</p>
      )}
    </main>
  );
}

function ScoreCard({ resolved }: { resolved: Prediction[] }) {
  const list = resolved.map((x) => ({ p: x.p / 100, outcome: x.outcome! }));
  const score = brier(list);
  if (score === null)
    return (
      <div className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
        🎯 Điểm chính xác sẽ hiện ở đây sau khi bạn đối chiếu dự đoán đầu tiên.
      </div>
    );

  const level = brierLevel(score);
  const words = {
    excellent: { label: "Xuất sắc", note: "Bạn đoán rất chuẩn!", cls: "text-good" },
    good: { label: "Tốt", note: "Tốt hơn hẳn đoán bừa.", cls: "text-good" },
    coinflip: { label: "Như tung đồng xu", note: "Gần bằng đoán 50/50. Thử nghĩ kỹ hơn về các bên liên quan.", cls: "text-nash" },
    poor: { label: "Cần cải thiện", note: "Bạn hay tự tin vào điều sai. Thử dùng xác suất vừa phải hơn.", cls: "text-bad" },
  }[level];
  const over = overconfidence(list);
  const buckets = calibrationBuckets(list);

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted">Điểm chính xác (càng gần 0 càng tốt)</p>
          <p className="text-3xl font-bold tabular-nums">{score.toFixed(2).replace(".", ",")}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold ${words.cls}`}>{words.label}</p>
          <p className="text-xs text-muted">{list.length} dự đoán</p>
        </div>
      </div>
      <p className="mt-2 text-sm">{words.note}</p>
      {over !== null && list.length >= 5 && Math.abs(over) > 0.1 && (
        <p className="mt-2 rounded-xl bg-surface-2 p-2 text-sm">
          {over > 0 ? "🤔 Bạn hơi quá tự tin: những gì bạn \"chắc chắn\" thường không chắc như bạn nghĩ." : "🙂 Bạn hơi dè dặt: bạn đúng nhiều hơn mình nghĩ, có thể tự tin hơn."}
        </p>
      )}
      {list.length >= 3 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-muted">Khi bạn nói… thì thực tế xảy ra…</p>
          {buckets.map((b) => (
            <div key={b.from} className="flex items-center gap-2 text-xs">
              <span className="w-16 shrink-0 tabular-nums">
                ~{Math.round(b.avgP * 100)}%
              </span>
              <div className="relative h-3 flex-1 rounded-full bg-surface-2">
                <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${b.hitRate * 100}%` }} />
                <div className="absolute inset-y-[-3px] w-0.5 bg-ink" style={{ left: `${b.avgP * 100}%` }} title="Mức bạn đã nói" />
              </div>
              <span className="w-20 shrink-0 text-right tabular-nums">
                {Math.round(b.hitRate * 100)}% ({b.count})
              </span>
            </div>
          ))}
          <p className="text-xs text-muted">Vạch đen là mức bạn nói, thanh xanh là thực tế. Càng khớp càng tốt.</p>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 font-bold">{title}</h2>
      <ul className="space-y-2">{children}</ul>
    </section>
  );
}

function Item({ x, children }: { x: Prediction; children: React.ReactNode }) {
  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <p className="font-semibold leading-snug">{x.question}</p>
      <p className="mt-1 text-sm text-muted">
        Bạn tin <b className="text-ink">{x.p}%</b> ({probabilityWords(x.p).toLowerCase()}) · hạn {fmtDate(x.due)}
      </p>
      {x.why && <p className="mt-1 text-sm italic text-muted">“{x.why}”</p>}
      <div className="mt-3">{children}</div>
    </li>
  );
}

function AddSheet({
  ideas,
  onClose,
  onSave,
}: {
  ideas: string[];
  onClose: () => void;
  onSave: (p: { question: string; p: number; due: string; why?: string }) => void;
}) {
  const day = today();
  const [question, setQuestion] = useState("");
  const [p, setP] = useState(50);
  const [due, setDue] = useState(addDays(day, 7));
  const [why, setWhy] = useState("");
  const ok = question.trim().length >= 5 && due >= day;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true" aria-label="Ghi dự đoán mới">
      <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="Đóng" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ok) onSave({ question: question.trim(), p, due, why: why.trim() || undefined });
        }}
        className="pb-safe animate-pop relative max-h-[92dvh] w-full max-w-md space-y-5 overflow-y-auto rounded-t-3xl bg-surface p-5 shadow-2xl"
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-line" />

        <div>
          <label htmlFor="q" className="mb-2 block font-semibold">
            1. Bạn muốn đoán điều gì?
          </label>
          <textarea
            id="q"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
            maxLength={200}
            placeholder="Câu hỏi trả lời được bằng CÓ hoặc KHÔNG"
            className="w-full rounded-2xl border-2 border-line bg-surface-2 p-3 outline-none focus:border-accent"
          />
          <div className="no-scrollbar -mx-5 mt-2 flex gap-2 overflow-x-auto px-5">
            {ideas.map((i) => (
              <button type="button" key={i} onClick={() => setQuestion(i)} className="shrink-0 rounded-full bg-surface-2 px-3 py-1.5 text-xs">
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="p" className="mb-2 block font-semibold">
            2. Bạn tin điều đó xảy ra bao nhiêu?
          </label>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold tabular-nums text-accent">{p}%</span>
            <span className="font-medium">{probabilityWords(p)}</span>
          </div>
          <input
            id="p"
            type="range"
            min={0}
            max={100}
            step={5}
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            className="h-8 w-full accent-[var(--accent)]"
          />
          <div className="flex justify-between text-xs text-muted">
            <span>Chắc chắn không</span>
            <span>Chắc chắn có</span>
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold">3. Khi nào biết kết quả?</p>
          <div className="mb-2 flex gap-2">
            {[
              { l: "Ngày mai", d: 1 },
              { l: "1 tuần", d: 7 },
              { l: "1 tháng", d: 30 },
              { l: "3 tháng", d: 90 },
            ].map((o) => (
              <button
                type="button"
                key={o.d}
                onClick={() => setDue(addDays(day, o.d))}
                className={`h-10 flex-1 rounded-xl text-sm ${due === addDays(day, o.d) ? "bg-accent font-semibold text-accent-ink" : "bg-surface-2"}`}
              >
                {o.l}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={due}
            min={day}
            onChange={(e) => setDue(e.target.value)}
            className="h-12 w-full rounded-xl border-2 border-line bg-surface-2 px-3"
            aria-label="Ngày biết kết quả"
          />
        </div>

        <div>
          <label htmlFor="why" className="mb-2 block font-semibold">
            4. Vì sao bạn nghĩ vậy? <span className="font-normal text-muted">(không bắt buộc)</span>
          </label>
          <textarea
            id="why"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            rows={2}
            maxLength={300}
            placeholder="Ai liên quan? Họ muốn gì?"
            className="w-full rounded-2xl border-2 border-line bg-surface-2 p-3 outline-none focus:border-accent"
          />
        </div>

        <button disabled={!ok} className="h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-ink disabled:opacity-40">
          Lưu dự đoán
        </button>
      </form>
    </div>
  );
}
