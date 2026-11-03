import { LEVEL_0A } from "./content/level0a";
import { LEVEL_1 } from "./content/level1";
import type { Lesson, Level } from "./types";

export * from "./types";
export * from "./progress";
export * from "./answers";

/** Lộ trình học theo thứ tự. Cấp 0 và Cấp 2 sẽ được thêm sau. */
export const LEVELS: Level[] = [LEVEL_0A, LEVEL_1];

export const ALL_LESSONS: Lesson[] = LEVELS.flatMap((l) => l.lessons);

export function findLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function findLevel(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}
