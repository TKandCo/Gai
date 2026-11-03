import Link from "next/link";
import { PASS_RATIO, isPass } from "@gai/learning";
import { Mascot } from "../Mascot";

export function ResultScreen({
  score,
  total,
  passText,
  failText,
  primary,
  onRetry,
}: {
  score: number;
  total: number;
  passText: string;
  failText: string;
  primary: { href: string; label: string };
  onRetry: () => void;
}) {
  const passed = isPass(score, total);
  const need = Math.ceil(PASS_RATIO * total);
  return (
    <div className="animate-pop space-y-6 pt-4 text-center">
      <div className="text-7xl" aria-hidden>
        {passed ? "🏆" : "🌱"}
      </div>
      <div>
        <p className="text-4xl font-bold tabular-nums">
          {score}/{total}
        </p>
        <p className="mt-1 text-muted">câu đúng</p>
      </div>
      <Mascot>{passed ? passText : `${failText} Cần đúng ${need}/${total} câu để qua.`}</Mascot>
      <div className="space-y-3">
        {passed ? (
          <Link href={primary.href} className="flex h-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-ink">
            {primary.label}
          </Link>
        ) : (
          <button onClick={onRetry} className="h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-ink">
            Thử lại
          </button>
        )}
        {passed ? (
          <button onClick={onRetry} className="h-12 w-full rounded-2xl border-2 border-line font-semibold">
            Làm lại cho chắc
          </button>
        ) : (
          <Link href="/learn" className="flex h-12 items-center justify-center rounded-2xl border-2 border-line font-semibold">
            Về lộ trình học
          </Link>
        )}
      </div>
    </div>
  );
}
