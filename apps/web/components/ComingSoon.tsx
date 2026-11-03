import Link from "next/link";
import { PageHeader } from "./PageHeader";

export function ComingSoon({ title, body, phase }: { title: string; body: string; phase: string }) {
  return (
    <main className="px-4">
      <PageHeader title={title} />
      <div className="rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed">
        <p>{body}</p>
        <p className="mt-3 text-muted">Dự kiến có ở giai đoạn {phase}.</p>
        <Link href="/lab" className="mt-4 inline-block font-semibold text-accent">
          Thử Phòng lab ma trận →
        </Link>
      </div>
    </main>
  );
}
