import { notFound } from "next/navigation";
import { LEVELS, findLevel } from "@gai/learning";
import { LevelTest } from "./LevelTest";

export function generateStaticParams() {
  return LEVELS.map((l) => ({ levelId: l.id }));
}

export const metadata = { title: "Kiểm tra vượt cấp" };

export default async function LevelTestPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;
  if (!findLevel(levelId)) notFound();
  return <LevelTest levelId={levelId} />;
}
