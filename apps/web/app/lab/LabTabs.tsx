"use client";

import { useState } from "react";
import { LabClient } from "./LabClient";
import { RepeatedLab } from "@/components/repeated/RepeatedLab";

const TABS = [
  { id: "matrix", label: "🔢 Bảng lợi ích" },
  { id: "repeated", label: "🔁 Chơi lặp lại" },
] as const;

export function LabTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("matrix");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-surface-2 p-1" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`h-11 rounded-xl text-sm font-semibold transition ${tab === t.id ? "bg-surface shadow-sm" : "text-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "matrix" ? <LabClient /> : <RepeatedLab />}
    </div>
  );
}
