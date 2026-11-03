"use client";

import { useCallback, useEffect, useState } from "react";
import { useProfiles } from "./profiles";
import { newId, readJSON, writeJSON } from "./storage";

export type Confidence = "low" | "mid" | "high";

/** Một bản phân tích sự kiện (lưu trên máy, theo từng hồ sơ). */
export type Analysis = {
  id: string;
  title: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  step: number;
  isGame: boolean | null;
  players: [string, string];
  others: string;
  actions: [string[], string[]];
  goals: [string, string];
  payoffs: [number, number][][];
  payoffConfidence: Confidence;
  timing: "simultaneous" | "sequential";
  first: 0 | 1;
  repeated: "once" | "repeated";
  hiddenInfo: string;
  assumptions: { text: string; confidence: Confidence }[];
  /** Dùng khi không phải trò chơi: phân tích quyết định đơn giản */
  decision: { options: string; chances: string; worst: string };
  alternative: string;
  conclusion: string;
  predictionSaved: boolean;
};

export function blankAnalysis(): Analysis {
  const now = new Date().toISOString();
  return {
    id: newId(),
    title: "",
    source: "",
    createdAt: now,
    updatedAt: now,
    step: 0,
    isGame: null,
    players: ["", ""],
    others: "",
    actions: [
      ["", ""],
      ["", ""],
    ],
    goals: ["", ""],
    payoffs: [
      [[5, 5], [5, 5]],
      [[5, 5], [5, 5]],
    ],
    payoffConfidence: "mid",
    timing: "simultaneous",
    first: 0,
    repeated: "once",
    hiddenInfo: "",
    assumptions: [],
    decision: { options: "", chances: "", worst: "" },
    alternative: "",
    conclusion: "",
    predictionSaved: false,
  };
}

/** Ví dụ mẫu để người mới (và trẻ em) xem cách điền. */
export function exampleAnalysis(kid: boolean): Analysis {
  const a = blankAnalysis();
  if (kid) {
    return {
      ...a,
      title: "Giờ ra chơi: đá bóng hay nhảy dây?",
      source: "Chuyện ở lớp",
      isGame: true,
      players: ["Minh", "Lan"],
      others: "Các bạn khác trong lớp",
      actions: [
        ["Đá bóng", "Nhảy dây"],
        ["Đá bóng", "Nhảy dây"],
      ],
      goals: ["Minh thích đá bóng, nhưng quan trọng nhất là chơi cùng Lan", "Lan thích nhảy dây, nhưng cũng muốn chơi cùng Minh"],
      payoffs: [
        [[8, 5], [2, 2]],
        [[1, 1], [5, 8]],
      ],
      assumptions: [{ text: "Cả hai đều thích chơi cùng nhau hơn chơi một mình", confidence: "high" }],
    };
  }
  return {
    ...a,
    title: "Hai hãng gọi xe có giảm giá cước tháng tới?",
    source: "Tin tức kinh doanh",
    isGame: true,
    players: ["Hãng A", "Hãng B"],
    others: "Tài xế, khách hàng, cơ quan quản lý",
    actions: [
      ["Giữ giá", "Giảm giá"],
      ["Giữ giá", "Giảm giá"],
    ],
    goals: ["Giữ thị phần và lợi nhuận", "Giành thêm khách để tăng thị phần"],
    payoffs: [
      [[6, 6], [2, 8]],
      [[8, 2], [3, 3]],
    ],
    payoffConfidence: "low",
    repeated: "repeated",
    assumptions: [
      { text: "Khách hàng chuyển hãng ngay khi chênh giá", confidence: "mid" },
      { text: "Hai hãng có vốn tương đương để chịu lỗ", confidence: "low" },
    ],
  };
}

/** Danh sách phân tích của hồ sơ đang dùng. */
export function useAnalyses() {
  const { active, ready } = useProfiles();
  const key = active ? `gai.analyses.${active.id}` : null;
  const [items, setItems] = useState<Analysis[]>([]);

  useEffect(() => {
    if (ready && key) setItems(readJSON<Analysis[]>(key, []));
  }, [ready, key]);

  const save = useCallback(
    (a: Analysis) => {
      setItems((prev) => {
        const updated = { ...a, updatedAt: new Date().toISOString() };
        const next = prev.some((x) => x.id === a.id) ? prev.map((x) => (x.id === a.id ? updated : x)) : [updated, ...prev];
        if (key) writeJSON(key, next);
        return next;
      });
    },
    [key],
  );

  const remove = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((x) => x.id !== id);
        if (key) writeJSON(key, next);
        return next;
      });
    },
    [key],
  );

  return { items, save, remove };
}

/** Đổi số lựa chọn của một bên, giữ payoff cũ khi có thể. */
export function resizeActions(a: Analysis, who: 0 | 1, count: number): Analysis {
  const actions = [...a.actions] as [string[], string[]];
  const cur = actions[who];
  actions[who] = count > cur.length ? [...cur, ...Array(count - cur.length).fill("")] : cur.slice(0, count);
  const rows = actions[0].length;
  const cols = actions[1].length;
  const payoffs = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (a.payoffs[i]?.[j] ? ([...a.payoffs[i][j]] as [number, number]) : ([5, 5] as [number, number]))),
  );
  return { ...a, actions, payoffs };
}
