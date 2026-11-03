/** Một dự đoán đã có kết quả: p = xác suất bạn đưa ra (0..1), outcome = điều đó có xảy ra không. */
export type Resolved = { p: number; outcome: boolean };

/**
 * Brier score: trung bình (xác suất − kết quả)². 0 là hoàn hảo, 0,25 là luôn đoán 50%, 1 là sai hoàn toàn.
 * Trả null khi chưa có dự đoán nào.
 */
export function brier(list: Resolved[]): number | null {
  if (list.length === 0) return null;
  return list.reduce((s, r) => s + (r.p - (r.outcome ? 1 : 0)) ** 2, 0) / list.length;
}

export type Bucket = {
  /** Khoảng xác suất [từ, đến) */
  from: number;
  to: number;
  count: number;
  /** Xác suất trung bình bạn đưa ra trong khoảng */
  avgP: number;
  /** Tỷ lệ thực sự xảy ra */
  hitRate: number;
};

/** Gom dự đoán theo khoảng xác suất để so "mình nói bao nhiêu %" với "thực tế đúng bao nhiêu %". */
export function calibrationBuckets(list: Resolved[], edges = [0, 0.2, 0.4, 0.6, 0.8, 1.0000001]): Bucket[] {
  const out: Bucket[] = [];
  for (let k = 0; k < edges.length - 1; k++) {
    const inB = list.filter((r) => r.p >= edges[k] && r.p < edges[k + 1]);
    if (inB.length === 0) continue;
    out.push({
      from: edges[k],
      to: Math.min(edges[k + 1], 1),
      count: inB.length,
      avgP: inB.reduce((s, r) => s + r.p, 0) / inB.length,
      hitRate: inB.filter((r) => r.outcome).length / inB.length,
    });
  }
  return out;
}

export type BrierLevel = "excellent" | "good" | "coinflip" | "poor";

/** Xếp loại Brier score để giải thích bằng lời. */
export function brierLevel(score: number): BrierLevel {
  if (score <= 0.1) return "excellent";
  if (score <= 0.2) return "good";
  if (score <= 0.26) return "coinflip";
  return "poor";
}

/** Thiên hướng: dương = quá tự tin (nói cao hơn thực tế), âm = quá dè dặt. */
export function overconfidence(list: Resolved[]): number | null {
  if (list.length === 0) return null;
  // Đo trên phía "mình tin sẽ xảy ra": độ chắc chắn trung bình − tỷ lệ đúng trung bình
  const conf = list.map((r) => Math.max(r.p, 1 - r.p));
  const right = list.map((r) => (r.p >= 0.5 ? r.outcome : !r.outcome) ? 1 : 0);
  const n = list.length;
  return conf.reduce((s, c) => s + c, 0) / n - right.reduce((s: number, c) => s + c, 0) / n;
}
