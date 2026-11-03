"use client";

import { useState } from "react";
import { AVATARS, type AgeGroup } from "@/lib/profiles";

/** Tạo hồ sơ: tên, hình đại diện, nhóm tuổi. Nút to, ít chữ để trẻ em tự làm được. */
export function ProfileForm({
  onSubmit,
  submitLabel = "Bắt đầu thôi!",
}: {
  onSubmit: (p: { name: string; avatar: string; group: AgeGroup }) => void;
  submitLabel?: string;
}) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [group, setGroup] = useState<AgeGroup | null>(null);
  const ok = name.trim().length > 0 && group !== null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) onSubmit({ name: name.trim(), avatar, group: group! });
      }}
      className="space-y-5"
    >
      <div>
        <label htmlFor="pf-name" className="mb-2 block font-semibold">
          Bạn tên là gì?
        </label>
        <input
          id="pf-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="Ví dụ: Khôi"
          className="h-14 w-full rounded-2xl border-2 border-line bg-surface px-4 text-lg outline-none focus:border-accent"
        />
      </div>

      <div>
        <p className="mb-2 font-semibold">Chọn hình đại diện</p>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => setAvatar(a)}
              className={`flex aspect-square items-center justify-center rounded-2xl text-3xl transition ${
                avatar === a ? "bg-accent-soft ring-2 ring-accent" : "bg-surface-2"
              }`}
              aria-label={`Hình ${a}`}
              aria-pressed={avatar === a}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-semibold">Bạn bao nhiêu tuổi?</p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { g: "kid", icon: "🧒", label: "Dưới 15 tuổi", note: "Ví dụ vui, dễ hiểu" },
              { g: "adult", icon: "🧑", label: "Từ 15 tuổi", note: "Thêm ví dụ đầu tư, kinh doanh" },
            ] as const
          ).map((o) => (
            <button
              type="button"
              key={o.g}
              onClick={() => setGroup(o.g)}
              aria-pressed={group === o.g}
              className={`rounded-2xl border-2 p-3 text-left transition ${
                group === o.g ? "border-accent bg-accent-soft" : "border-line bg-surface"
              }`}
            >
              <div className="text-3xl">{o.icon}</div>
              <div className="mt-1 font-semibold">{o.label}</div>
              <div className="text-xs text-muted">{o.note}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={!ok}
        className="h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-ink transition disabled:opacity-40"
      >
        {submitLabel}
      </button>
    </form>
  );
}
