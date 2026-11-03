import { LEVEL_0A } from "./content/level0a";
import { LEVEL_0 } from "./content/level0";
import { LEVEL_1 } from "./content/level1";
import { LEVEL_2 } from "./content/level2";
import { LEVEL_3 } from "./content/level3";
import { LEVEL_4 } from "./content/level4";
import { LEVEL_5 } from "./content/level5";
import { LEVEL_6 } from "./content/level6";
import type { Lesson, Level } from "./types";

export * from "./types";
export * from "./progress";
export * from "./answers";
export * from "./placement";

/** Lộ trình học theo thứ tự. */
export const LEVELS: Level[] = [LEVEL_0A, LEVEL_0, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_6];

export const ALL_LESSONS: Lesson[] = LEVELS.flatMap((l) => l.lessons);

export function findLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function findLevel(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}
