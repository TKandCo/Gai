"use client";

import { useState } from "react";
import { useProfiles } from "@/lib/profiles";
import { PageHeader } from "@/components/PageHeader";
import { ProfileForm } from "@/components/ProfileForm";
import { AccountChip } from "@/components/AccountChip";
import { Badges } from "@/components/Badges";

export default function ProfilePage() {
  const { profiles, active, switchProfile, addProfile, removeProfile, updateProfile, theme, setTheme } = useProfiles();
  const [adding, setAdding] = useState(false);

  return (
    <main className="px-4">
      <PageHeader title="Hồ sơ" subtitle="Mỗi người trong nhà một hồ sơ, tiến độ học tách riêng." back={{ href: "/", label: "Trang chủ" }} />

      <section className="mb-6">
        <h2 className="mb-2 font-bold">Ai đang học?</h2>
        <ul className="space-y-2">
          {profiles.map((p) => {
            const isActive = p.id === active?.id;
            return (
              <li key={p.id}>
                <div
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${isActive ? "border-accent bg-accent-soft" : "border-line bg-surface"}`}
                >
                  <button onClick={() => switchProfile(p.id)} className="flex flex-1 items-center gap-3 text-left">
                    <span className="text-4xl">{p.avatar}</span>
                    <span>
                      <span className="block font-semibold">{p.name}</span>
                      <span className="text-sm text-muted">{p.group === "kid" ? "Dưới 15 tuổi" : "Từ 15 tuổi"}</span>
                    </span>
                  </button>
                  {isActive ? (
                    <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-ink">Đang dùng</span>
                  ) : (
                    <button onClick={() => switchProfile(p.id)} className="h-10 rounded-xl border border-line px-3 text-sm font-medium">
                      Chuyển
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {adding ? (
          <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
            <ProfileForm
              submitLabel="Thêm hồ sơ"
              onSubmit={(p) => {
                addProfile(p);
                setAdding(false);
              }}
            />
            <button onClick={() => setAdding(false)} className="mt-3 w-full text-sm text-muted">
              Hủy
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="mt-3 h-12 w-full rounded-2xl border-2 border-dashed border-line font-semibold text-muted"
          >
            + Thêm người trong nhà
          </button>
        )}
      </section>

      {active && (
        <section className="mb-6 rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-1 font-bold">🏅 Huy hiệu của {active.name}</h2>
          <Badges />
        </section>
      )}

      {active && (
        <section className="mb-6 rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-3 font-bold">Cài đặt cho {active.name}</h2>
          <p className="mb-2 text-sm font-medium">Nhóm tuổi</p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {(
              [
                ["kid", "🧒 Dưới 15 tuổi"],
                ["adult", "🧑 Từ 15 tuổi"],
              ] as const
            ).map(([g, label]) => (
              <button
                key={g}
                onClick={() => updateProfile(active.id, { group: g })}
                className={`h-11 rounded-xl text-sm ${active.group === g ? "bg-accent font-semibold text-accent-ink" : "bg-surface-2"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mb-4 text-xs text-muted">
            Hồ sơ dưới 15 tuổi ẩn các ví dụ về đầu tư và kinh doanh, chỉ giữ ví dụ đời thường.
          </p>
          <button
            onClick={() => {
              if (confirm(`Xóa hồ sơ ${active.name} và toàn bộ tiến độ học, nhật ký?`)) removeProfile(active.id);
            }}
            className="text-sm text-bad underline"
          >
            Xóa hồ sơ này
          </button>
        </section>
      )}

      <section className="mb-6 rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-bold">Giao diện</h2>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["light", "☀️ Sáng"],
              ["dark", "🌙 Tối"],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`h-12 rounded-xl ${theme === t ? "bg-accent font-semibold text-accent-ink" : "bg-surface-2"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-line bg-surface p-4 text-sm">
        <h2 className="mb-2 font-bold">Đồng bộ nhiều thiết bị</h2>
        <p className="mb-3 text-muted">Hiện tiến độ lưu trên máy này. Đồng bộ qua tài khoản sẽ có ở bản sau.</p>
        <AccountChip />
      </section>
    </main>
  );
}
