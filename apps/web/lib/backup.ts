/**
 * Sao lưu / khôi phục toàn bộ dữ liệu của app (mọi hồ sơ, tiến độ, nhật ký, phân tích)
 * thành một file JSON. Dùng để chuyển sang máy khác mà không cần tài khoản máy chủ.
 */
const PREFIX = "gai.";

export type BackupFile = { app: "gai"; version: 1; exportedAt: string; data: Record<string, string> };

export function buildBackup(): BackupFile {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) data[k] = localStorage.getItem(k) ?? "";
  }
  return { app: "gai", version: 1, exportedAt: new Date().toISOString(), data };
}

export function downloadBackup() {
  const file = buildBackup();
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gai-sao-luu-${file.exportedAt.slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Kiểm tra và ghi dữ liệu từ file sao lưu. Trả số mục đã khôi phục. */
export function restoreBackup(json: string): number {
  const parsed = JSON.parse(json) as Partial<BackupFile>;
  if (parsed.app !== "gai" || parsed.version !== 1 || !parsed.data || typeof parsed.data !== "object") {
    throw new Error("File không phải bản sao lưu của GAI");
  }
  const entries = Object.entries(parsed.data).filter(([k, v]) => k.startsWith(PREFIX) && typeof v === "string");
  // Kiểm tra từng giá trị là JSON hợp lệ trước khi ghi đè
  for (const [, v] of entries) JSON.parse(v);
  for (const [k, v] of entries) localStorage.setItem(k, v);
  return entries.length;
}
