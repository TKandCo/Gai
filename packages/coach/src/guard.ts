import { hasPhrase, normalize } from "./text";

const ASSETS = [
  "co phieu",
  "chung khoan",
  "coin",
  "bitcoin",
  "btc",
  "crypto",
  "tien ao",
  "tien dien tu",
  "vang",
  "bat dong san",
  "mua dat",
  "chung chi quy",
  "trai phieu",
  "ngoai te",
  "forex",
  "phai sinh",
];

const ACTIONS = ["co nen mua", "nen mua", "co nen ban", "nen ban", "mua hay ban", "ban hay giu", "co nen giu", "nen dau tu", "dau tu vao", "all in", "xuong tien", "chot loi", "cat lo", "vao lenh", "mua ma nao", "ma nao", "nen vay"];

/**
 * Nhận ra yêu cầu tư vấn đầu tư cá nhân cụ thể (mua/bán/giữ tài sản nào).
 * Gai không đưa lời khuyên mua bán; thay vào đó giúp phân tích.
 */
export function isInvestmentAdviceRequest(text: string): boolean {
  const n = normalize(text);
  const action = ACTIONS.some((a) => hasPhrase(n, a));
  const asset = ASSETS.some((a) => hasPhrase(n, a));
  // "mã" + ký hiệu viết hoa ba chữ (VD: mua HPG) cũng tính là hỏi mã cụ thể
  const ticker = /\b(mua|ban|giu)\s+[A-Z]{3}\b/.test(text.normalize("NFD").replace(/[̀-ͯ]/g, ""));
  return (action && asset) || ticker || (hasPhrase(n, "nen mua") && hasPhrase(n, "ma"));
}

export const ADVICE_REFUSAL =
  "Gai không đưa lời khuyên mua, bán hay giữ một tài sản cụ thể. Quyết định và trách nhiệm tài chính là của bạn.\nNhưng Gai có thể giúp bạn **suy nghĩ cho chắc**: ai đang mua bán với bạn, họ biết gì mà bạn không biết, kết quả xấu nhất có chịu được không.";
