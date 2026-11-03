"use client";

import { useCallback, useEffect, useState } from "react";
import { useProfiles } from "./profiles";
import { newId, readJSON, writeJSON } from "./storage";

export type Prediction = {
  id: string;
  question: string;
  /** Xác suất bạn tin điều đó sẽ xảy ra, 0–100 */
  p: number;
  /** Ngày đối chiếu kết quả, YYYY-MM-DD */
  due: string;
  why?: string;
  createdAt: string;
  outcome: boolean | null;
  resolvedAt?: string;
  lesson?: string;
};

/** Nhật ký dự đoán của hồ sơ đang dùng (lưu trên máy). */
export function useJournal() {
  const { active, ready } = useProfiles();
  const key = active ? `gai.journal.${active.id}` : null;
  const [items, setItems] = useState<Prediction[]>([]);

  useEffect(() => {
    if (ready && key) setItems(readJSON<Prediction[]>(key, []));
  }, [ready, key]);

  const save = useCallback(
    (next: Prediction[]) => {
      setItems(next);
      if (key) writeJSON(key, next);
    },
    [key],
  );

  return {
    items,
    add: (p: Omit<Prediction, "id" | "createdAt" | "outcome">) =>
      save([{ ...p, id: newId(), createdAt: new Date().toISOString(), outcome: null }, ...items]),
    resolve: (id: string, outcome: boolean, lesson?: string) =>
      save(items.map((x) => (x.id === id ? { ...x, outcome, lesson, resolvedAt: new Date().toISOString() } : x))),
    reopen: (id: string) => save(items.map((x) => (x.id === id ? { ...x, outcome: null, resolvedAt: undefined } : x))),
    remove: (id: string) => save(items.filter((x) => x.id !== id)),
  };
}

/** Diễn đạt xác suất bằng lời, để trẻ em cũng chọn được. */
export function probabilityWords(p: number): string {
  if (p <= 5) return "Gần như chắc chắn KHÔNG";
  if (p <= 25) return "Khó xảy ra";
  if (p <= 40) return "Hơi khó xảy ra";
  if (p < 60) return "Năm ăn năm thua";
  if (p < 75) return "Khá có thể";
  if (p < 95) return "Rất có thể";
  return "Gần như chắc chắn CÓ";
}
