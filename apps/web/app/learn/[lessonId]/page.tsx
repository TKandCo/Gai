import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_LESSONS, findLesson } from "@gai/learning";
import { LessonPlayer } from "./LessonPlayer";

export function generateStaticParams() {
  return ALL_LESSONS.map((l) => ({ lessonId: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }): Promise<Metadata> {
  const { lessonId } = await params;
  return { title: findLesson(lessonId)?.title ?? "Bài học" };
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  if (!findLesson(lessonId)) notFound();
  return <LessonPlayer lessonId={lessonId} />;
}
