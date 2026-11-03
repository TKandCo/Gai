"use client";

import { useState } from "react";
import { blankAnalysis, exampleAnalysis, useAnalyses, type Analysis } from "@/lib/analyses";
import { useProfiles } from "@/lib/profiles";
import { PageHeader } from "@/components/PageHeader";
import { HelpButton } from "@/components/Help";
import { Mascot } from "@/components/Mascot";
import { Wizard } from "./Wizard";

const HELP = [
  { icon: "📰", text: "Chọn một chuyện đang xảy ra: tin tức, chuyện ở trường, ở công ty… Viết nó thành một câu hỏi." },
  { icon: "🪜", text: "Gai sẽ hỏi từng bước: ai là người chơi, họ có thể làm gì, mỗi bên muốn gì." },
  { icon: "🔢", text: "Chấm điểm từ 0 đến 10 cho từng kết quả, theo cách nhìn của mỗi bên. Không cần chính xác tuyệt đối." },
  { icon: "🧱", text: "App sẽ tìm kết quả có khả năng xảy ra, và chỉ ra con số nào cần kiểm chứng kỹ nhất." },
  { icon: "🔮", text: "Cuối cùng, lưu một dự đoán vào Nhật ký để sau này xem mình đoán đúng đến đâu." },
];

const fmt = (iso: string) => new Date(iso).toLocaleDateString("vi-VN");

export function AnalyzeClient() {
  const { isKid } = useProfiles();
  const { items, save, remove } = useAnalyses();
  const [editing, setEditing] = useState<Analysis | null>(null);

  if (editing) {
    return (
      <main className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Wizard
          value={editing}
          onChange={(a) => {
            setEditing(a);
            save(a);
          }}
          onClose={() => setEditing(null)}
        />
      </main>
    );
  }

  return (
    <main className="px-4">
      <PageHeader
        title="Phân tích sự kiện"
        subtitle="Dùng mọi điều đã học để phân tích một chuyện thật, từng bước."
        right={<HelpButton id="analyze" title="Cách phân tích một sự kiện" steps={HELP} />}
      />

      <div className="mb-5 grid grid-cols-2 gap-3">
        <button onClick={() => setEditing(blankAnalysis())} className="rounded-2xl bg-accent p-4 text-left text-accent-ink">
          <div className="text-2xl">✍️</div>
          <div className="mt-2 font-semibold">Phân tích mới</div>
        </button>
        <button onClick={() => setEditing(exampleAnalysis(isKid))} className="rounded-2xl border-2 border-line bg-surface p-4 text-left">
          <div className="text-2xl">👀</div>
          <div className="mt-2 font-semibold">Xem ví dụ mẫu</div>
        </button>
      </div>

      {items.length === 0 ? (
        <Mascot>
          Chưa có phân tích nào. Thử bấm <b>Xem ví dụ mẫu</b> để thấy cách điền, rồi tự phân tích một chuyện bạn đang quan tâm nhé!
        </Mascot>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li key={a.id} className="rounded-2xl border border-line bg-surface p-4">
              <button onClick={() => setEditing(a)} className="block w-full text-left">
                <p className="font-semibold leading-snug">{a.title || "(Chưa đặt tên)"}</p>
                <p className="mt-1 text-xs text-muted">
                  {a.isGame === false ? "Quyết định một mình" : `${a.players.filter(Boolean).join(" và ") || "Chưa có người chơi"}`} · cập nhật {fmt(a.updatedAt)}
                  {a.predictionSaved && " · 🔮 đã dự đoán"}
                </p>
              </button>
              <button
                onClick={() => {
                  if (confirm("Xóa bản phân tích này?")) remove(a.id);
                }}
                className="mt-2 text-xs text-bad underline"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isKid && <p className="mt-8 text-center text-xs text-muted">Phân tích giúp rèn tư duy, không phải lời khuyên đầu tư.</p>}
    </main>
  );
}
