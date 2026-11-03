"use client";

import { useState } from "react";
import { dominantStrategies, fragility, formatPercent, pureNash, sequentialOutcome, supportEnumeration } from "@gai/gt-core";
import { addDays, today } from "@gai/learning";
import { resizeActions, type Analysis, type Confidence } from "@/lib/analyses";
import { probabilityWords, useJournal } from "@/lib/journal";
import { MiniMatrix } from "@/components/learn/MiniMatrix";
import { Mascot } from "@/components/Mascot";

const STEPS = ["Sự kiện", "Trò chơi?", "Người chơi", "Lựa chọn", "Ai muốn gì", "Luật chơi", "Giả định", "Kết quả", "Dự đoán"];

const CONF: { v: Confidence; label: string }[] = [
  { v: "low", label: "Đoán thôi" },
  { v: "mid", label: "Khá chắc" },
  { v: "high", label: "Rất chắc" },
];

type Props = {
  value: Analysis;
  onChange: (a: Analysis) => void;
  onClose: () => void;
};

/** Trình hướng dẫn phân tích một sự kiện, từng bước. Mỗi bước có Gai gợi ý cách nghĩ. */
export function Wizard({ value: a, onChange, onClose }: Props) {
  const set = (patch: Partial<Analysis>) => onChange({ ...a, ...patch });
  const step = a.step;
  const go = (s: number) => {
    set({ step: s });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const notGame = a.isGame === false;
  const lastStep = notGame ? 1 : STEPS.length - 1;
  const canNext = validate(a, step);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-2">
        <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-muted" aria-label="Đóng">
          ✕
        </button>
        <div className="flex flex-1 gap-1">
          {STEPS.slice(0, notGame ? 2 : STEPS.length).map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-surface-2"}`} />
          ))}
        </div>
      </div>
      <p className="text-sm font-semibold text-accent">
        Bước {step + 1}: {STEPS[step]}
      </p>

      <div key={step} className="animate-pop space-y-4">
        {step === 0 && <StepEvent a={a} set={set} />}
        {step === 1 && <StepGate a={a} set={set} />}
        {step === 2 && <StepPlayers a={a} set={set} />}
        {step === 3 && <StepActions a={a} onChange={onChange} />}
        {step === 4 && <StepPayoffs a={a} set={set} />}
        {step === 5 && <StepRules a={a} set={set} />}
        {step === 6 && <StepAssumptions a={a} set={set} />}
        {step === 7 && <StepResult a={a} set={set} />}
        {step === 8 && <StepPredict a={a} set={set} />}
      </div>

      <div className="sticky bottom-24 flex gap-3 bg-bg/90 py-2 backdrop-blur">
        {step > 0 && (
          <button onClick={() => go(step - 1)} className="h-14 flex-1 rounded-2xl border-2 border-line font-semibold">
            ← Lùi
          </button>
        )}
        {step < lastStep ? (
          <button
            disabled={!canNext}
            onClick={() => go(step + 1)}
            className="h-14 flex-[2] rounded-2xl bg-accent text-lg font-bold text-accent-ink disabled:opacity-40"
          >
            Tiếp →
          </button>
        ) : (
          <button onClick={onClose} className="h-14 flex-[2] rounded-2xl bg-accent text-lg font-bold text-accent-ink">
            Xong ✓
          </button>
        )}
      </div>
    </div>
  );
}

function validate(a: Analysis, step: number): boolean {
  switch (step) {
    case 0:
      return a.title.trim().length >= 3;
    case 1:
      return a.isGame !== null;
    case 2:
      return a.players.every((p) => p.trim());
    case 3:
      return a.actions.every((list) => list.every((x) => x.trim()));
    default:
      return true;
  }
}

type StepProps = { a: Analysis; set: (p: Partial<Analysis>) => void };

const inputCls = "w-full rounded-2xl border-2 border-line bg-surface p-3 outline-none focus:border-accent";

function StepEvent({ a, set }: StepProps) {
  return (
    <>
      <Mascot>Chuyện gì đang xảy ra? Viết ngắn gọn như một câu hỏi, ví dụ &quot;Hai cửa hàng có giảm giá không?&quot;</Mascot>
      <label className="block">
        <span className="mb-1 block font-semibold">Tên sự kiện</span>
        <input value={a.title} onChange={(e) => set({ title: e.target.value })} maxLength={120} className={`h-14 ${inputCls}`} placeholder="Ví dụ: Hai bạn chọn trò chơi giờ ra chơi" />
      </label>
      <label className="block">
        <span className="mb-1 block font-semibold">
          Nguồn / ghi chú <span className="font-normal text-muted">(không bắt buộc)</span>
        </span>
        <textarea value={a.source} onChange={(e) => set({ source: e.target.value })} rows={3} maxLength={500} className={inputCls} placeholder="Đường link bài báo, hoặc tóm tắt điều bạn biết" />
      </label>
    </>
  );
}

function StepGate({ a, set }: StepProps) {
  return (
    <>
      <Mascot>
        Câu hỏi quan trọng nhất: <b>có ít nhất 2 bên cùng ra quyết định, và kết quả của bên này phụ thuộc vào lựa chọn của bên kia</b> không?
      </Mascot>
      <div className="grid grid-cols-2 gap-3">
        {[
          { v: true, icon: "♟️", label: "Có", note: "Đây là một trò chơi" },
          { v: false, icon: "🎲", label: "Không", note: "Chỉ có mình và may rủi" },
        ].map((o) => (
          <button
            key={o.label}
            onClick={() => set({ isGame: o.v })}
            aria-pressed={a.isGame === o.v}
            className={`rounded-2xl border-2 p-4 text-left ${a.isGame === o.v ? "border-accent bg-accent-soft" : "border-line bg-surface"}`}
          >
            <div className="text-3xl">{o.icon}</div>
            <div className="mt-1 text-lg font-bold">{o.label}</div>
            <div className="text-xs text-muted">{o.note}</div>
          </button>
        ))}
      </div>
      {a.isGame === false && (
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <p className="text-sm">
            Không có đối thủ đang tính toán về bạn, nên hãy dùng <b>cây quyết định</b> (Cấp 0) thay vì lý thuyết trò chơi:
          </p>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold">1. Mình có những lựa chọn nào?</span>
            <textarea value={a.decision.options} onChange={(e) => set({ decision: { ...a.decision, options: e.target.value } })} rows={2} className={inputCls} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold">2. Mỗi lựa chọn dẫn tới đâu, khả năng bao nhiêu?</span>
            <textarea value={a.decision.chances} onChange={(e) => set({ decision: { ...a.decision, chances: e.target.value } })} rows={2} className={inputCls} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold">3. Kết quả xấu nhất có chịu được không?</span>
            <textarea value={a.decision.worst} onChange={(e) => set({ decision: { ...a.decision, worst: e.target.value } })} rows={2} className={inputCls} />
          </label>
        </div>
      )}
    </>
  );
}

function StepPlayers({ a, set }: StepProps) {
  const setP = (i: 0 | 1, v: string) => {
    const players = [...a.players] as [string, string];
    players[i] = v;
    set({ players });
  };
  return (
    <>
      <Mascot>Ai là hai bên chính? Nếu có nhiều bên, hãy gộp những bên có cùng mục tiêu lại, hoặc chọn hai bên quan trọng nhất.</Mascot>
      {([0, 1] as const).map((i) => (
        <label key={i} className="block">
          <span className={`mb-1 block font-semibold ${i === 0 ? "text-p1" : "text-p2"}`}>Bên thứ {i + 1}</span>
          <input value={a.players[i]} onChange={(e) => setP(i, e.target.value)} maxLength={30} className={`h-14 ${inputCls}`} placeholder={i === 0 ? "Ví dụ: Hãng A" : "Ví dụ: Hãng B"} />
        </label>
      ))}
      <label className="block">
        <span className="mb-1 block font-semibold">
          Bên khác có ảnh hưởng <span className="font-normal text-muted">(không bắt buộc)</span>
        </span>
        <input value={a.others} onChange={(e) => set({ others: e.target.value })} maxLength={120} className={`h-12 ${inputCls}`} placeholder="Ví dụ: khách hàng, chính phủ" />
      </label>
    </>
  );
}

function StepActions({ a, onChange }: { a: Analysis; onChange: (a: Analysis) => void }) {
  const setAction = (who: 0 | 1, k: number, v: string) => {
    const actions = a.actions.map((l) => [...l]) as [string[], string[]];
    actions[who][k] = v;
    onChange({ ...a, actions });
  };
  return (
    <>
      <Mascot>Mỗi bên có thể làm gì? Ghi 2 hoặc 3 lựa chọn quan trọng nhất. Đừng quên lựa chọn &quot;không làm gì&quot; nếu có.</Mascot>
      {([0, 1] as const).map((who) => (
        <div key={who} className="space-y-2 rounded-2xl border border-line bg-surface p-3">
          <p className={`font-semibold ${who === 0 ? "text-p1" : "text-p2"}`}>{a.players[who]} có thể…</p>
          {a.actions[who].map((x, k) => (
            <input key={k} value={x} onChange={(e) => setAction(who, k, e.target.value)} maxLength={24} className={`h-12 ${inputCls}`} placeholder={`Lựa chọn ${k + 1}`} />
          ))}
          <div className="flex gap-2">
            {a.actions[who].length < 3 && (
              <button onClick={() => onChange(resizeActions(a, who, a.actions[who].length + 1))} className="h-10 flex-1 rounded-xl border border-dashed border-line text-sm">
                + Thêm lựa chọn
              </button>
            )}
            {a.actions[who].length > 2 && (
              <button onClick={() => onChange(resizeActions(a, who, a.actions[who].length - 1))} className="h-10 flex-1 rounded-xl border border-line text-sm text-muted">
                − Bớt một
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

function StepPayoffs({ a, set }: StepProps) {
  const setGoal = (i: 0 | 1, v: string) => {
    const goals = [...a.goals] as [string, string];
    goals[i] = v;
    set({ goals });
  };
  const setPay = (i: number, j: number, who: 0 | 1, v: number) => {
    const payoffs = a.payoffs.map((r) => r.map((c) => [...c] as [number, number]));
    payoffs[i][j][who] = Math.max(0, Math.min(10, v));
    set({ payoffs });
  };
  return (
    <>
      <Mascot>Mỗi bên thật sự muốn gì? Rồi chấm điểm từng kết quả từ 0 (tệ nhất) đến 10 (tốt nhất) theo cách nhìn của từng bên.</Mascot>
      {([0, 1] as const).map((i) => (
        <label key={i} className="block">
          <span className={`mb-1 block text-sm font-semibold ${i === 0 ? "text-p1" : "text-p2"}`}>{a.players[i]} muốn gì?</span>
          <input value={a.goals[i]} onChange={(e) => setGoal(i, e.target.value)} maxLength={140} className={`h-12 ${inputCls}`} />
        </label>
      ))}
      <ul className="space-y-2">
        {a.actions[0].map((r, i) =>
          a.actions[1].map((c, j) => (
            <li key={`${i}-${j}`} className="rounded-2xl border border-line bg-surface p-3">
              <p className="mb-2 text-sm">
                Nếu <b className="text-p1">{r}</b> và <b className="text-p2">{c}</b>:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {([0, 1] as const).map((who) => (
                  <label key={who} className={`flex items-center gap-2 rounded-xl px-2 py-1 ${who === 0 ? "bg-p1-soft" : "bg-p2-soft"}`}>
                    <span className={`min-w-0 flex-1 truncate text-xs font-semibold ${who === 0 ? "text-p1" : "text-p2"}`}>{a.players[who]}</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={10}
                      value={a.payoffs[i][j][who]}
                      onChange={(e) => setPay(i, j, who, Number(e.target.value))}
                      className="h-10 w-14 rounded-lg border border-line bg-surface text-center font-semibold"
                      aria-label={`Điểm của ${a.players[who]}`}
                    />
                  </label>
                ))}
              </div>
            </li>
          )),
        )}
      </ul>
      <div>
        <p className="mb-2 text-sm font-semibold">Bạn chắc chắn về các con số này đến đâu?</p>
        <ConfPicker value={a.payoffConfidence} onChange={(v) => set({ payoffConfidence: v })} />
      </div>
    </>
  );
}

function ConfPicker({ value, onChange }: { value: Confidence; onChange: (v: Confidence) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {CONF.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} className={`h-10 rounded-xl text-sm ${value === o.v ? "bg-accent font-semibold text-accent-ink" : "bg-surface-2"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function StepRules({ a, set }: StepProps) {
  return (
    <>
      <Mascot>Luật chơi thế nào? Ai đi trước, chơi một lần hay nhiều lần, và có ai đang giấu thông tin không?</Mascot>
      <Choice
        label="Hai bên chọn thế nào?"
        value={a.timing}
        options={[
          { v: "simultaneous", label: "Cùng lúc / không biết bên kia chọn gì" },
          { v: "sequential", label: "Lần lượt / bên sau nhìn thấy bên trước" },
        ]}
        onChange={(v) => set({ timing: v as Analysis["timing"] })}
      />
      {a.timing === "sequential" && (
        <Choice
          label="Ai đi trước?"
          value={String(a.first)}
          options={[
            { v: "0", label: a.players[0] },
            { v: "1", label: a.players[1] },
          ]}
          onChange={(v) => set({ first: Number(v) as 0 | 1 })}
        />
      )}
      <Choice
        label="Chơi một lần hay gặp lại nhiều lần?"
        value={a.repeated}
        options={[
          { v: "once", label: "Một lần" },
          { v: "repeated", label: "Nhiều lần, còn gặp lại" },
        ]}
        onChange={(v) => set({ repeated: v as Analysis["repeated"] })}
      />
      <label className="block">
        <span className="mb-1 block font-semibold">
          Có ai biết điều bên kia không biết? <span className="font-normal text-muted">(không bắt buộc)</span>
        </span>
        <textarea value={a.hiddenInfo} onChange={(e) => set({ hiddenInfo: e.target.value })} rows={2} maxLength={300} className={inputCls} placeholder="Ví dụ: hãng A biết chi phí của mình thấp hơn" />
      </label>
    </>
  );
}

function Choice({ label, value, options, onChange }: { label: string; value: string; options: { v: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-2 font-semibold">{label}</p>
      <div className="space-y-2">
        {options.map((o) => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            aria-pressed={value === o.v}
            className={`flex min-h-12 w-full items-center rounded-2xl border-2 px-4 text-left ${value === o.v ? "border-accent bg-accent-soft font-semibold" : "border-line bg-surface"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepAssumptions({ a, set }: StepProps) {
  const [text, setText] = useState("");
  const [conf, setConf] = useState<Confidence>("mid");
  return (
    <>
      <Mascot>
        Mọi phân tích đều dựa trên <b>giả định</b>. Ghi rõ ra để biết mình có thể sai ở đâu. Gợi ý: &quot;Mình đang tin điều gì mà chưa kiểm chứng?&quot;
      </Mascot>
      <ul className="space-y-2">
        {a.assumptions.map((x, k) => (
          <li key={k} className="flex items-start gap-2 rounded-2xl border border-line bg-surface p-3 text-sm">
            <span className="flex-1">{x.text}</span>
            <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-xs">{CONF.find((c) => c.v === x.confidence)!.label}</span>
            <button onClick={() => set({ assumptions: a.assumptions.filter((_, i) => i !== k) })} className="shrink-0 text-bad" aria-label="Xóa giả định">
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="space-y-2 rounded-2xl border-2 border-dashed border-line p-3">
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={160} className={`h-12 ${inputCls}`} placeholder="Ví dụ: Khách hàng rất nhạy với giá" />
        <ConfPicker value={conf} onChange={setConf} />
        <button
          disabled={!text.trim()}
          onClick={() => {
            set({ assumptions: [...a.assumptions, { text: text.trim(), confidence: conf }] });
            setText("");
          }}
          className="h-11 w-full rounded-xl bg-accent font-semibold text-accent-ink disabled:opacity-40"
        >
          + Thêm giả định
        </button>
      </div>
    </>
  );
}

function StepResult({ a, set }: StepProps) {
  const bm = { A: a.payoffs.map((r) => r.map((c) => c[0])), B: a.payoffs.map((r) => r.map((c) => c[1])) };
  const game = { players: a.players, rows: a.actions[0], cols: a.actions[1], payoffs: a.payoffs };
  const nash = pureNash(bm);
  const [d0, d1] = dominantStrategies(bm);
  const mixed = nash.length === 0 ? supportEnumeration(bm).filter((e) => !e.pure) : [];
  const seq = a.timing === "sequential" ? sequentialOutcome(bm, a.first) : null;
  const fragile = fragility(bm).slice(0, 3);
  const cellName = (i: number, j: number) => `${a.actions[0][i]} + ${a.actions[1][j]}`;

  return (
    <>
      <MiniMatrix game={game} highlight={seq ? [seq.cell] : nash} />

      <section className="space-y-2 rounded-2xl border border-line bg-surface p-4 text-sm">
        <h3 className="text-base font-bold">🎯 Điều có khả năng xảy ra</h3>
        {seq ? (
          <p>
            Vì <b>{a.players[a.first]}</b> đi trước, nghĩ ngược từ cuối thì kết quả là <b>{cellName(...seq.cell)}</b>.
            {seq.hasTie && " (Có lựa chọn ngang điểm nhau, nên kết quả có thể khác.)"}
          </p>
        ) : nash.length > 0 ? (
          <p>
            Cân bằng Nash: {nash.map(([i, j]) => <b key={`${i}-${j}`} className="mr-1">⭐ {cellName(i, j)}</b>)}
            {nash.length > 1 && <span> Có nhiều cân bằng: kết quả phụ thuộc vào việc hai bên phối hợp, ai lên tiếng trước, thói quen chung.</span>}
          </p>
        ) : (
          <p>
            Không có ô cân bằng. Hai bên nên khó đoán:{" "}
            {mixed[0] &&
              a.actions[0].map((x, k) => (mixed[0].x[k] > 0 ? `${a.players[0]} chọn ${x} ${formatPercent(mixed[0].x[k])}; ` : ""))}
          </p>
        )}
        {(d0 !== null || d1 !== null) && (
          <p>
            💪 Chiến lược trội:{" "}
            {d0 !== null && (
              <>
                {a.players[0]} luôn nên <b>{a.actions[0][d0]}</b>.{" "}
              </>
            )}
            {d1 !== null && (
              <>
                {a.players[1]} luôn nên <b>{a.actions[1][d1]}</b>.
              </>
            )}
          </p>
        )}
        {a.repeated === "repeated" && (
          <p>🔁 Hai bên còn gặp lại nhiều lần, nên hợp tác có thể bền hơn kết quả chơi một lần (xem Cấp 3).</p>
        )}
        {a.hiddenInfo.trim() && <p>🕵️ Có thông tin bị giấu: hãy tìm các tín hiệu tốn kém và để ý hành động của bên biết nhiều hơn (xem Cấp 4).</p>}
      </section>

      <section className="space-y-2 rounded-2xl border border-line bg-surface p-4 text-sm">
        <h3 className="text-base font-bold">🧱 Kết luận có vững không?</h3>
        {fragile.length === 0 ? (
          <p>Kết luận khá vững: đổi bất kỳ con số nào 1–3 điểm vẫn không thay đổi cân bằng.</p>
        ) : (
          <>
            <p>Những con số sau chỉ cần lệch một chút là kết luận đổi. Hãy kiểm chứng chúng kỹ nhất:</p>
            <ul className="list-disc space-y-1 pl-5">
              {fragile.map((f, k) => (
                <li key={k}>
                  Điểm của <b className={f.player === 0 ? "text-p1" : "text-p2"}>{a.players[f.player]}</b> ở ô <b>{cellName(f.i, f.j)}</b> (hiện là{" "}
                  {a.payoffs[f.i][f.j][f.player]}) {f.delta > 0 ? "tăng" : "giảm"} {Math.abs(f.delta)}
                </li>
              ))}
            </ul>
          </>
        )}
        {a.payoffConfidence === "low" && <p className="rounded-xl bg-nash-soft p-2">⚠️ Bạn ghi là chỉ &quot;đoán thôi&quot; về các con số. Hãy xem kết luận như một giả thuyết, chưa phải dự báo.</p>}
      </section>

      <label className="block">
        <span className="mb-1 block font-semibold">Kết luận của bạn</span>
        <textarea value={a.conclusion} onChange={(e) => set({ conclusion: e.target.value })} rows={3} maxLength={500} className={inputCls} placeholder="Điều mình nghĩ sẽ xảy ra, và vì sao" />
      </label>
    </>
  );
}

function StepPredict({ a, set }: StepProps) {
  const { add } = useJournal();
  const day = today();
  const [question, setQuestion] = useState(a.title.endsWith("?") ? a.title : `${a.title}?`);
  const [p, setP] = useState(60);
  const [due, setDue] = useState(addDays(day, 30));

  return (
    <>
      <Mascot>
        Bước cuối: nghĩ về <b>một câu chuyện khác</b> (nếu mình sai thì vì sao?), rồi ghi một dự đoán để sau này kiểm tra xem mình đúng đến đâu.
      </Mascot>
      <label className="block">
        <span className="mb-1 block font-semibold">Mô hình thay thế: nếu mình sai, câu chuyện sẽ là gì?</span>
        <textarea value={a.alternative} onChange={(e) => set({ alternative: e.target.value })} rows={3} maxLength={500} className={inputCls} placeholder="Ví dụ: Có thể hai bên đã ngầm thỏa thuận giữ giá vì còn gặp nhau lâu dài" />
      </label>

      {a.predictionSaved ? (
        <div className="rounded-2xl bg-good-soft p-4 font-semibold text-good">✅ Đã lưu dự đoán vào Nhật ký. Đến hạn hãy quay lại đối chiếu nhé!</div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <label className="block">
            <span className="mb-1 block font-semibold">Câu hỏi dự đoán (trả lời CÓ/KHÔNG)</span>
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={2} maxLength={200} className={inputCls} />
          </label>
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-accent tabular-nums">{p}%</span>
              <span className="text-sm">{probabilityWords(p)}</span>
            </div>
            <input type="range" min={0} max={100} step={5} value={p} onChange={(e) => setP(Number(e.target.value))} className="h-8 w-full accent-[var(--accent)]" aria-label="Mức tin tưởng" />
          </div>
          <label className="block text-sm">
            Ngày biết kết quả
            <input type="date" value={due} min={day} onChange={(e) => setDue(e.target.value)} className="mt-1 h-12 w-full rounded-xl border-2 border-line bg-surface-2 px-3" />
          </label>
          <button
            disabled={question.trim().length < 5}
            onClick={() => {
              add({ question: question.trim(), p, due, why: a.conclusion.trim() || undefined });
              set({ predictionSaved: true });
            }}
            className="h-12 w-full rounded-2xl bg-accent font-bold text-accent-ink disabled:opacity-40"
          >
            🔮 Lưu vào Nhật ký dự đoán
          </button>
        </div>
      )}
    </>
  );
}
