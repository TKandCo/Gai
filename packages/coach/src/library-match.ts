// Tách riêng để tools.ts không phụ thuộc vòng vào engine.ts
export { SITUATIONS, situationsFor } from "./library";
export { matchSituation } from "./engine";
