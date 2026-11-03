"use client";

import { useEffect, useState } from "react";
import { useSeen } from "@/lib/profiles";

export type HelpStep = { icon: string; text: string };

/**
 * Nút ❓ mở hướng dẫn từng bước. Lần đầu vào màn hình sẽ tự mở một lần.
 * Lời hướng dẫn viết ngắn, dễ hiểu để trẻ em cũng tự dùng được.
 */
export function HelpButton({ id, title, steps }: { id: string; title: string; steps: HelpStep[] }) {
  const [seen, markSeen] = useSeen(`help:${id}`);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!seen) setOpen(true);
  }, [seen]);

  const close = () => {
    setOpen(false);
    markSeen();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-lg"
        aria-label="Hướng dẫn"
      >
        ❓
      </button>
      {open && <HelpSheet title={title} steps={steps} onClose={close} />}
    </>
  );
}

export function HelpSheet({ title, steps, onClose }: { title: string; steps: HelpStep[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="Đóng hướng dẫn" />
      <div className="pb-safe animate-pop relative max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-surface p-5 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
        <div className="mb-4 flex items-center gap-3">
          <span className="text-4xl" aria-hidden>
            🦉
          </span>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 rounded-2xl bg-surface-2 p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink">
                {i + 1}
              </span>
              <span className="text-[0.95rem] leading-relaxed">
                <span className="mr-1" aria-hidden>
                  {s.icon}
                </span>
                {s.text}
              </span>
            </li>
          ))}
        </ol>
        <button onClick={onClose} className="mt-5 h-12 w-full rounded-2xl bg-accent font-semibold text-accent-ink">
          Mình hiểu rồi!
        </button>
      </div>
    </div>
  );
}
