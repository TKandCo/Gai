import type { TreeNode } from "@gai/gt-core";

/** Trò chơi lần lượt hiển thị dạng cây. */
export type MiniTree = { players: [string, string]; root: TreeNode };

/** Trò chơi nhỏ hiển thị trong bài học: payoffs[hàng][cột] = [lợi ích A, lợi ích B]. */
export type MiniGame = {
  players: [string, string];
  rows: string[];
  cols: string[];
  payoffs: [number, number][][];
};

/**
 * Thẻ nội dung trong bài học. Văn bản hỗ trợ **in đậm** và xuống dòng.
 * - example: ví dụ đời thường, ai cũng hiểu (kể cả trẻ em)
 * - real: ứng dụng cho người lớn (đầu tư, kinh doanh) – ẩn với hồ sơ trẻ em
 */
export type Card =
  | { kind: "text"; title?: string; body: string }
  | { kind: "example"; title: string; body: string }
  | { kind: "real"; title: string; body: string }
  | { kind: "tip"; body: string }
  | { kind: "matrix"; title?: string; game: MiniGame; highlight?: [number, number][]; caption?: string }
  /** solve = tô đường đi khi mọi người chơi tốt nhất */
  | { kind: "tree"; title?: string; tree: MiniTree; solve?: boolean; caption?: string };

type ExerciseBase = {
  /** Mã duy nhất, dùng để theo dõi ôn tập */
  id: string;
  prompt: string;
  /** Giải thích hiện sau khi trả lời */
  explain: string;
  /** Bảng hiển thị kèm câu hỏi (nếu có) */
  game?: MiniGame;
  /** Cây hiển thị kèm câu hỏi (nếu có) */
  tree?: MiniTree;
};

export type Exercise =
  | (ExerciseBase & { kind: "choice"; options: string[]; answer: number })
  | (ExerciseBase & { kind: "number"; answer: number; tolerance?: number; hint?: string })
  /** Chạm chọn các ô cân bằng Nash thuần. Đáp án do bộ giải tính, không ghi tay. */
  | (ExerciseBase & { kind: "nash"; game: MiniGame })
  /** Chạm vào kết quả cuối cùng khi mọi người chơi tốt nhất. Đáp án do bộ giải tính. */
  | (ExerciseBase & { kind: "tree"; tree: MiniTree });

export type Lesson = {
  id: string;
  levelId: string;
  title: string;
  emoji: string;
  minutes: number;
  summary: string;
  cards: Card[];
  quiz: Exercise[];
};

export type Level = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  lessons: Lesson[];
};
