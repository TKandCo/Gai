/**
 * Định dạng dữ liệu dùng chung cho toàn bộ hệ thống (bài học, bộ giải, AI).
 * Xem docs/ARCHITECTURE.md mục 4.
 */
import { z } from "zod";

export const Confidence = z.enum(["low", "mid", "high"]);
export type Confidence = z.infer<typeof Confidence>;

/** Một payoff không bao giờ chỉ là một con số trơn: có thể kèm khoảng, mức tự tin và lý do. */
export const PayoffValue = z.object({
  value: z.number().finite(),
  low: z.number().finite().optional(),
  high: z.number().finite().optional(),
  confidence: Confidence.optional(),
  rationale: z.string().optional(),
});
export type PayoffValue = z.infer<typeof PayoffValue>;

export const Player = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});
export type Player = z.infer<typeof Player>;

export const Assumption = z.object({
  text: z.string().min(1),
  confidence: Confidence,
  source: z.string().optional(),
});
export type Assumption = z.infer<typeof Assumption>;

const ActionList = z.array(z.string().min(1)).min(1).max(8);

/** Trò chơi đồng thời 2 người dạng ma trận. payoffs[hàng][cột] = [lợi ích bên hàng, lợi ích bên cột]. */
export const NormalFormGame = z
  .object({
    id: z.string().min(1),
    version: z.number().int().positive(),
    title: z.string(),
    description: z.string().optional(),
    kind: z.literal("normal_form"),
    players: z.tuple([Player, Player]),
    actions: z.tuple([ActionList, ActionList]),
    payoffs: z.array(z.array(z.tuple([PayoffValue, PayoffValue]))),
    assumptions: z.array(Assumption),
  })
  .superRefine((g, ctx) => {
    const [rows, cols] = g.actions;
    if (g.payoffs.length !== rows.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Số hàng payoff không khớp số hành động của bên hàng" });
    }
    g.payoffs.forEach((row, i) => {
      if (row.length !== cols.length) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Hàng ${i + 1} không khớp số hành động của bên cột` });
      }
    });
  });
export type NormalFormGame = z.infer<typeof NormalFormGame>;

/** Tạo nhanh trò chơi ma trận từ các con số. */
export function normalFormFromNumbers(input: {
  id?: string;
  title: string;
  description?: string;
  players: [string, string];
  rows: string[];
  cols: string[];
  payoffs: [number, number][][];
}): NormalFormGame {
  return NormalFormGame.parse({
    id: input.id ?? "game",
    version: 1,
    title: input.title,
    description: input.description,
    kind: "normal_form",
    players: [
      { id: "p1", name: input.players[0] },
      { id: "p2", name: input.players[1] },
    ],
    actions: [input.rows, input.cols],
    payoffs: input.payoffs.map((row) => row.map(([a, b]) => [{ value: a }, { value: b }])),
    assumptions: [],
  });
}
