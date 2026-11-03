"use client";

import { LEVELS, badges } from "@gai/learning";
import { useProfiles } from "@/lib/profiles";
import { useJournal } from "@/lib/journal";

/** Huy hiệu của hồ sơ đang dùng. compact = chỉ hiện các huy hiệu đã có (cho trang chủ). */
export function Badges({ compact = false }: { compact?: boolean }) {
  const { progress } = useProfiles();
  const { items } = useJournal();
  const list = badges(LEVELS, progress, {
    predictions: items.length,
    resolved: items.filter((x) => x.outcome !== null).length,
  });
  const earned = list.filter((b) => b.earned);

  if (compact) {
    if (earned.length === 0) return null;
    return (
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {earned.map((b) => (
          <span key={b.id} className="flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 text-sm" title={b.how}>
            <span aria-hidden>{b.emoji}</span> {b.title}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Đã có {earned.length}/{list.length} huy hiệu
      </p>
      <ul className="grid grid-cols-3 gap-2">
        {list.map((b) => (
          <li
            key={b.id}
            className={`flex flex-col items-center rounded-2xl border p-2 text-center ${
              b.earned ? "border-nash bg-nash-soft" : "border-line bg-surface-2 opacity-50 grayscale"
            }`}
          >
            <span className="text-3xl" aria-hidden>
              {b.emoji}
            </span>
            <span className="mt-1 text-xs font-semibold leading-tight">{b.title}</span>
            <span className="mt-0.5 text-[10px] leading-tight text-muted">{b.how}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
