/** Đổi số thực sang phân số gọn (mẫu ≤ maxDen) nếu đủ gần, ví dụ 0.6667 → "2/3". */
export function toFraction(x: number, maxDen = 24): string {
  if (Number.isInteger(x)) return String(x);
  for (let d = 2; d <= maxDen; d++) {
    const n = Math.round(x * d);
    if (Math.abs(n / d - x) < 1e-6) return `${n}/${d}`;
  }
  return formatNumber(x);
}

export function formatNumber(x: number, digits = 2): string {
  const r = Number(x.toFixed(digits));
  return r.toLocaleString("vi-VN", { maximumFractionDigits: digits });
}

export function formatPercent(p: number): string {
  return `${(p * 100).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`;
}
