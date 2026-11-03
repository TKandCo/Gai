/** Chuẩn hóa tiếng Việt để so khớp: chữ thường, bỏ dấu, đ → d, gộp khoảng trắng. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9%\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Câu có chứa cụm từ (đã chuẩn hóa) như một cụm nguyên vẹn, không khớp giữa chừng một từ. */
export function hasPhrase(normText: string, phrase: string): boolean {
  const p = normalize(phrase);
  if (!p) return false;
  return ` ${normText} `.includes(` ${p} `);
}
